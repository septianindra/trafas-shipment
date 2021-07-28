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
import { UserIcon, TrashIcon, SearchIcon, CourierIcon } from '../icons'
import InfoCard from '../components/Cards/InfoCard'
import RoundIcon from '../components/RoundIcon'
import { useDispatch, useSelector } from 'react-redux'
import Fuse from 'fuse.js'
import toast, { Toaster } from 'react-hot-toast'
import { useAuth } from '../contexts/Auth'
import {
  fetchDelivery,
  fetchDeliveryByEmployeeId,
  deleteDelivery,
  clearDeliveryDeleteStatus,
} from '../app/deliverysSlice'
import {
  fetchPickup,
  fetchPickupByEmployeeId,
  deletePickup,
  clearPickupDeleteStatus,
} from '../app/pickupsSlice'
import { clearOrderStatusAuditByIdStatus } from '../app/orderStatusAuditsSLice'
import { clearOrderByIdStatus } from '../app/ordersSlice'

function Courier() {
  const { user } = useAuth()
  const [link, setLink] = useState('delivery')
  const temp = user?.user_metadata?.role ?? ''
  const dispatch = useDispatch()

  const orderStatusAuditByIdStatus = useSelector(
    (state) => state.orderStatusAudits.orderStatusAuditByIdStatus,
  )
  useEffect(() => {
    if (orderStatusAuditByIdStatus === 'succeeded') {
      dispatch(clearOrderStatusAuditByIdStatus())
      dispatch(clearOrderByIdStatus())
    }
  }, [orderStatusAuditByIdStatus, dispatch])

  const deliveryList = useSelector((state) => state.deliverys.deliveryList)
  const deliveryListByEmployeeId = useSelector(
    (state) => state.deliverys.deliveryListByEmployeeId,
  )
  const deliveryListStatus = useSelector(
    (state) => state.deliverys.deliveryListStatus,
  )
  const deliveryDeleteStatus = useSelector(
    (state) => state.deliverys.deliveryDeleteStatus,
  )

  const pickupList = useSelector((state) => state.pickups.pickupList)
  const pickupListByEmployeeId = useSelector(
    (state) => state.pickups.pickupListByEmployeeId,
  )
  const pickupDeleteStatus = useSelector(
    (state) => state.pickups.pickupDeleteStatus,
  )

  const [query, setQuery] = useState('')

  useEffect(() => {
    if (deliveryListStatus === 'idle') {
      dispatch(fetchDelivery())
      dispatch(fetchDeliveryByEmployeeId(user.id))
      dispatch(fetchPickup())
      dispatch(fetchPickupByEmployeeId(user.id))
    }
  }, [deliveryListStatus, dispatch])

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
          <div>Courier</div>
          <div className="float-right">
            {user.user_metadata.role === 'staff-courier' ? (
              ''
            ) : (
              <Button size="small" tag={Link} to="/app/delivery/new">
                + new delivery
              </Button>
            )}
          </div>
        </div>
      </PageTitle>
      <hr className="mb-4" />
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-2">
        <div
          className={
            link === 'delivery'
              ? 'cursor-pointer p-1  bg-gray-600 rounded-lg'
              : 'cursor-pointer'
          }
          onClick={() => setLink('delivery')}
        >
          <InfoCard title="to Delivery" value="">
            <RoundIcon
              icon={CourierIcon}
              iconColorClass="text-red-500 dark:text-red-100"
              bgColorClass="bg-red-100 dark:bg-red-500"
              className="mr-4"
            />
          </InfoCard>
        </div>

        <div
          className={
            link === 'pickup'
              ? 'cursor-pointer p-1  bg-gray-600 rounded-lg'
              : 'cursor-pointer'
          }
          onClick={() => setLink('pickup')}
        >
          <InfoCard title="to Pickup" value="">
            <RoundIcon
              icon={CourierIcon}
              iconColorClass="text-blue-500 dark:text-blue-100"
              bgColorClass="bg-blue-100 dark:bg-blue-500"
              className="mr-4"
            />
          </InfoCard>
        </div>
      </div>
      <div className="flex justify-between">
        <h1 className="text-white mt-4">Order List</h1>
        <div className="ml-1  flex py-3 justify-end flex-1 ">
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

      {link === 'delivery' ? (
        temp === 'admin' || temp === 'admin-courier' ? (
          <TableDelivery
            response={deliveryList}
            deliveryDeleteStatus={deliveryDeleteStatus}
            query={query}
            user={user}
          />
        ) : (
          <TableDelivery
            response={deliveryListByEmployeeId}
            deliveryDeleteStatus={deliveryDeleteStatus}
            query={query}
            user={user}
          />
        )
      ) : temp === 'admin' || temp === 'admin-courier' ? (
        <TablePickup
          response={pickupList}
          pickupDeleteStatus={pickupDeleteStatus}
          query={query}
          user={user}
        />
      ) : (
        <TablePickup
          response={pickupListByEmployeeId}
          pickupDeleteStatus={pickupDeleteStatus}
          query={query}
          user={user}
        />
      )}
    </>
  )
}

function TableDelivery({ response, packageDeleteStatus, query, user }) {
  const fuse = new Fuse(response, {
    keys: ['number', 'customer_name', 'delivery_address'],
  })
  const results = fuse.search(query)
  const dispatch = useDispatch()
  const [pageTable, setPageTable] = useState(1)
  const [dataTable, setDataTable] = useState([])
  const resultsPerPage = 10
  const totalResults = response.length

  function onPageChangeTable(p) {
    setPageTable(p)
  }

  function removeOrganization(id) {
    dispatch(deleteDelivery(id))
    dispatch(clearDeliveryDeleteStatus())
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
        response.slice(
          (pageTable - 1) * resultsPerPage,
          pageTable * resultsPerPage,
        ),
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
            <TableCell>Delivered By</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>To Deliver at</TableCell>
            <TableCell>Status</TableCell>
            <TableCell className="text-center">Action</TableCell>
          </tr>
        </TableHeader>
        <TableBody>
          {dataTable.map((data, i) => {
            return data.orders.status === 'collected' ? (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <div>
                      {data.orders.status === 'collected' ? (
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
                  <span className="text-sm">{data?.employees?.name ?? ''}</span>
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
                      user.user_metadata.role === 'staff-courier' ? (
                        ''
                      ) : (
                        <Button
                          tag={Link}
                          to={`/app/courier/edit/delivery/${data.id}`}
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
            ) : (
              ''
            )
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

function TablePickup({ response, packageDeleteStatus, query, user }) {
  const fuse = new Fuse(response, {
    keys: ['number', 'customer_name', 'delivery_address'],
  })
  const results = fuse.search(query)
  const dispatch = useDispatch()
  const [pageTable, setPageTable] = useState(1)
  const [dataTable, setDataTable] = useState([])
  const resultsPerPage = 10
  const totalResults = response.length

  function onPageChangeTable(p) {
    setPageTable(p)
  }

  function removeOrganization(id) {
    dispatch(deletePickup(id))
    dispatch(clearPickupDeleteStatus())
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
        response.slice(
          (pageTable - 1) * resultsPerPage,
          pageTable * resultsPerPage,
        ),
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
            <TableCell>Picked up By</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>TO PICK UP AT</TableCell>
            <TableCell>Status</TableCell>
            <TableCell className="text-center">Action</TableCell>
          </tr>
        </TableHeader>
        <TableBody>
          {dataTable.map((data, i) => {
            return data.orders.status === 'delivered' ? (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <div>
                      {data.orders.status === 'delivered' ? (
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
                  <span className="text-sm">{data?.employees?.name ?? ''}</span>
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
                      user.user_metadata.role === 'staff-courier' ? (
                        ''
                      ) : (
                        <Button
                          tag={Link}
                          to={`/app/courier/edit/pickup/${data.id}`}
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

export default Courier
