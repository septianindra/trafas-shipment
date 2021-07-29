import React, { useEffect, useState } from 'react'
import PageTitle from '../components/Typography/PageTitle'
import { Link } from 'react-router-dom'
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Button,
  Pagination,
  Input,
} from '@windmill/react-ui'
import { UserIcon, TrashIcon, SearchIcon, LogisticIcon } from '../icons'
import InfoCard from '../components/Cards/InfoCard'
import RoundIcon from '../components/RoundIcon'
import { useDispatch, useSelector } from 'react-redux'
import Fuse from 'fuse.js'
import toast, { Toaster } from 'react-hot-toast'
import { useAuth } from '../contexts/Auth'
import {
  fetchPackage,
  fetchPackageByEmployeeId,
  deletePackage,
  clearPackageDeleteStatus,
} from '../app/packagesSlice'
import { fetchReturn, fetchReturnByEmployeeId } from '../app/returnsSlice'
import { clearOrderStatusAuditByIdStatus } from '../app/orderStatusAuditsSLice'
import { clearOrderByIdStatus } from '../app/ordersSlice'

function Logistic() {
  const { user } = useAuth()
  const [link, setLink] = useState('prepare')
  const temp = user?.user_metadata?.role ?? ''
  const dispatch = useDispatch()

  const orderStatusAuditByIdStatus = useSelector(
    (state) => state.orderStatusAudits.orderStatusAuditByIdStatus,
  )
  useEffect(() => {
    if (orderStatusAuditByIdStatus === 'succeeded') {
      dispatch(clearOrderByIdStatus())
      dispatch(clearOrderStatusAuditByIdStatus())
    }
  }, [orderStatusAuditByIdStatus, dispatch])

  const packageList = useSelector((state) => state.packages.packageList)
  const packageListByEmployeeId = useSelector(
    (state) => state.packages.packageListByEmployeeId,
  )
  const packageListStatus = useSelector(
    (state) => state.packages.packageListStatus,
  )
  const packageDeleteStatus = useSelector(
    (state) => state.packages.packageDeleteStatus,
  )

  const returnList = useSelector((state) => state.returns.returnList)
  const returnListByEmployeeId = useSelector(
    (state) => state.returns.returnListByEmployeeId,
  )
  const returnDeleteStatus = useSelector(
    (state) => state.returns.returnDeleteStatus,
  )

  const [query, setQuery] = useState('')

  useEffect(() => {
    if (packageListStatus === 'idle') {
      dispatch(fetchPackage())
      dispatch(fetchPackageByEmployeeId(user.id))
      dispatch(fetchReturn())
      dispatch(fetchReturnByEmployeeId(user.id))
    }
  }, [packageListStatus, dispatch])

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          className: '',
          style: {
            marginTop: '90px',
            marginRight: '40px',
            background: '#363636',
            color: '#fff',
            zIndex: 1,
          },
          duration: 5000,
          success: {
            duration: 2000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
          error: {
            duration: 2000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
        }}
      />
      <PageTitle>
        <div className="flex justify-between">
          <div>Logistic </div>
        </div>
      </PageTitle>
      <hr className="mb-4" />
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-2">
        <div
          className={
            link === 'prepare'
              ? 'cursor-pointer p-1  bg-gray-600 rounded-lg'
              : 'cursor-pointer'
          }
          onClick={() => setLink('prepare')}
        >
          <InfoCard title="to Prepare" value="">
            <RoundIcon
              icon={LogisticIcon}
              iconColorClass="text-red-500 dark:text-red-100"
              bgColorClass="bg-red-100 dark:bg-red-500"
              className="mr-4"
            />
          </InfoCard>
        </div>

        <div
          className={
            link === 'return'
              ? 'cursor-pointer p-1  bg-gray-600 rounded-lg'
              : 'cursor-pointer'
          }
          onClick={() => setLink('return')}
        >
          <InfoCard title="Return" value="">
            <RoundIcon
              icon={LogisticIcon}
              iconColorClass="text-blue-500 dark:text-blue-100"
              bgColorClass="bg-blue-100 dark:bg-blue-500"
              className="mr-4"
            />
          </InfoCard>
        </div>
      </div>
      <div className="flex justify-between">
        <h1 className="text-white mt-4">Order List</h1>
        <div className="ml-1  flex pl-4 py-3 justify-end flex-1 ">
          <div className="relative w-full  max-w-xl focus-within:text-purple-500">
            <div className="absolute inset-y-0 flex items-center pl-2">
              <SearchIcon className="w-4 h-4" aria-hidden="true" />
            </div>
            <Input
              className="pl-8 rounded-md text-gray-700"
              placeholder="Search. . ."
              aria-label="Search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </div>
      </div>

      {link === 'prepare' ? (
        temp === 'admin' || temp === 'admin-logistic' ? (
          <TablePackage
            response={packageList}
            packageDeleteStatus={packageDeleteStatus}
            query={query}
            user={user}
          />
        ) : (
          <TablePackage
            response={packageListByEmployeeId}
            packageDeleteStatus={packageDeleteStatus}
            query={query}
            user={user}
          />
        )
      ) : temp === 'admin' || temp === 'admin-logistic' ? (
        <TableReturn
          response={returnList}
          returnDeleteStatus={returnDeleteStatus}
          query={query}
          user={user}
        />
      ) : (
        <TableReturn
          response={returnListByEmployeeId}
          returnDeleteStatus={returnDeleteStatus}
          query={query}
          user={user}
        />
      )}
    </>
  )
}

function TablePackage({ response, packageDeleteStatus, query, user }) {
  const fuse = new Fuse(response, {
    keys: ['number', 'customer_name', 'delivery_address'],
  })
  const results = fuse.search(query)
  const dispatch = useDispatch()
  const [pageTable, setPageTable] = useState(1)
  const [dataTable, setDataTable] = useState([])
  const resultsPerPage = 10
  const totalResults = response.filter(
    (data) => data.orders.status === 'confirmed',
  ).length

  function onPageChangeTable(p) {
    setPageTable(p)
  }

  function removeOrganization(id) {
    dispatch(deletePackage(id))
    dispatch(clearPackageDeleteStatus())
  }

  useEffect(() => {
    if (packageDeleteStatus === 'succeeded') {
      toast.success('Berhasil menghapus data!')
    }
  }, [packageDeleteStatus])

  let searchResult = []
  useEffect(() => {
    if (query) {
      for (let index = 0; index < results.length; index++) {
        searchResult = searchResult.concat(results[index].item)
      }
      setDataTable(
        searchResult.slice(
          (pageTable - 1) * resultsPerPage,
          pageTable * resultsPerPage,
        ),
      )
    } else {
      setDataTable(
        response
          .filter((data) => data.orders.status === 'confirmed')
          .slice((pageTable - 1) * resultsPerPage, pageTable * resultsPerPage),
      )
    }
  }, [response, query, pageTable])
  return (
    <TableContainer className="mb-8 ">
      <Table className=" w-full">
        <TableHeader>
          <tr>
            <TableCell>Created At</TableCell>
            <TableCell>Customer </TableCell>
            <TableCell>Shipment Date</TableCell>
            <TableCell>Note</TableCell>
            <TableCell>Prepared By</TableCell>
            <TableCell>TO COLLECT At</TableCell>
            <TableCell>Status</TableCell>
            <TableCell className="text-center">Action</TableCell>
          </tr>
        </TableHeader>
        <TableBody>
          {dataTable.map((data, i) => {
            return data.orders.status === 'confirmed' ? (
              <TableRow key={i}>
                <TableCell>
                  <span className="text-sm">
                    {new Date(data.created_at).toLocaleString()}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <div>
                      {data.orders.status === 'confirmed' ? (
                        <Link
                          to={`order/edit/status/${data.orders.id}`}
                          className="font-normal text-yellow-200"
                        >
                          {data.orders.customer_name}
                        </Link>
                      ) : (
                        <p className="font-semibold">
                          {data.orders.customer_name}
                        </p>
                      )}
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {data.orders.customer_address}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {new Date(data.orders.delivery_date).toLocaleString()}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{data.orders.note}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{data.employees?.name ?? ''}</span>
                </TableCell>

                <TableCell>
                  <span className="text-sm">
                    {data.date === null
                      ? ''
                      : new Date(data.date).toLocaleString()}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{data.orders.status}</span>
                </TableCell>
                <TableCell>
                  <div className="flex   justify-center ">
                    <div className=" space-x-4">
                      <Button
                        tag={Link}
                        to={`/app/order/track-trace/${data.orders.id}`}
                        layout="link"
                        size="icon"
                        aria-label="Search"
                      >
                        <SearchIcon className="w-5 h-5" aria-hidden="true" />
                      </Button>
                      {user.user_metadata.role === 'staff-marketing' ||
                      user.user_metadata.role === 'staff-logistic' ? (
                        ''
                      ) : (
                        <Button
                          tag={Link}
                          to={`/app/logistic/edit/package/${data.id}`}
                          layout="link"
                          size="icon"
                          aria-label="Edit"
                        >
                          <UserIcon className="w-5 h-5" aria-hidden="true" />
                        </Button>
                      )}
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : null
          })}
        </TableBody>
      </Table>
      <TableFooter>
        <Pagination
          totalResults={totalResults}
          resultsPerPage={resultsPerPage}
          onChange={onPageChangeTable}
          label="Table navigation"
        />
      </TableFooter>
    </TableContainer>
  )
}

function TableReturn({ response, returnDeleteStatus, query, user }) {
  let searchResult = []
  const fuse = new Fuse(response, {
    keys: ['number', 'customer_name', 'delivery_address'],
  })
  const results = fuse.search(query)
  const dispatch = useDispatch()
  const [pageTable, setPageTable] = useState(1)
  const [dataTable, setDataTable] = useState([])
  const resultsPerPage = 10
  const totalResults = response.filter(
    (data) => data.orders.status === 'returned',
  ).length

  function onPageChangeTable(p) {
    setPageTable(p)
  }

  function removeOrganization(id) {
    dispatch(deletePackage(id))
    dispatch(clearPackageDeleteStatus())
  }

  useEffect(() => {
    if (returnDeleteStatus === 'succeeded') {
      toast.success('Berhasil menghapus data!')
    }
  }, [returnDeleteStatus])

  useEffect(() => {
    if (query) {
      for (let index = 0; index < results.length; index++) {
        searchResult = searchResult.concat(results[index].item)
      }
      setDataTable(
        searchResult.slice(
          (pageTable - 1) * resultsPerPage,
          pageTable * resultsPerPage,
        ),
      )
    } else {
      setDataTable(
        response
          .filter((data) => data.orders.status === 'returned')
          .slice((pageTable - 1) * resultsPerPage, pageTable * resultsPerPage),
      )
    }
  }, [response, query, pageTable])

  return (
    <TableContainer className="mb-8 ">
      <Table className=" w-full">
        <TableHeader>
          <tr>
            <TableCell>Customer </TableCell>
            <TableCell>Shipment Date</TableCell>
            <TableCell>Checked By</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>TO CHECK At</TableCell>
            <TableCell>Status</TableCell>
            <TableCell className="text-center">Action</TableCell>
          </tr>
        </TableHeader>
        <TableBody>
          {dataTable.map((data, i) => {
            return data.orders.status === 'returned' ? (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <div>
                      {data.orders.status === 'returned' ? (
                        <Link
                          to={`order/edit/status/${data.orders.id}`}
                          className="font-normal text-yellow-200"
                        >
                          {data.orders.customer_name}
                        </Link>
                      ) : (
                        <p className="font-semibold">
                          {data.orders.customer_name}
                        </p>
                      )}
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {data.orders.customer_address}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {new Date(data.orders.delivery_date).toLocaleString()}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{data.employees?.name ?? ''}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {new Date(data.created_at).toLocaleString()}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {data.date === null
                      ? ''
                      : new Date(data.date).toLocaleString()}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{data.orders.status}</span>
                </TableCell>
                <TableCell>
                  <div className="flex   justify-center ">
                    <div className=" space-x-4">
                      <Button
                        tag={Link}
                        to={`/app/order/track-trace/${data.orders.id}`}
                        layout="link"
                        size="icon"
                        aria-label="Search"
                      >
                        <SearchIcon className="w-5 h-5" aria-hidden="true" />
                      </Button>
                      {user.user_metadata.role === 'staff-marketing' ||
                      user.user_metadata.role === 'staff-logistic' ? (
                        ''
                      ) : (
                        <Button
                          tag={Link}
                          to={`/app/logistic/edit/return/${data.id}`}
                          layout="link"
                          size="icon"
                          aria-label="Edit"
                        >
                          <UserIcon className="w-5 h-5" aria-hidden="true" />
                        </Button>
                      )}
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : null
          })}
        </TableBody>
      </Table>
      <TableFooter>
        <Pagination
          totalResults={totalResults}
          resultsPerPage={resultsPerPage}
          onChange={onPageChangeTable}
          label="Table navigation"
        />
      </TableFooter>
    </TableContainer>
  )
}

export default Logistic
