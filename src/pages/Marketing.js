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
import { EditIcon, TrashIcon, SearchIcon } from '../icons'
import { useDispatch, useSelector } from 'react-redux'
import Fuse from 'fuse.js'
import toast, { Toaster } from 'react-hot-toast'
import { useAuth } from '../contexts/Auth'
import {
  fetchOrder,
  deleteOrder,
  clearOrderDeleteStatus,
  fetchOrderByEmployeeId,
  clearOrderByIdStatus,
} from '../app/ordersSlice'
import { clearOrderStatusAuditByIdStatus } from '../app/orderStatusAuditsSLice'

function Marketing() {
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

  const { user } = useAuth()
  const temp = user?.user_metadata?.role ?? ''

  const orderList = useSelector((state) => state.orders.orderList)
  const orderListByEmployeeId = useSelector(
    (state) => state.orders.orderListByEmployeeId,
  )
  const orderListStatus = useSelector((state) => state.orders.orderListStatus)
  const orderDeleteStatus = useSelector(
    (state) => state.orders.orderDeleteStatus,
  )

  const [query, setQuery] = useState('')

  useEffect(() => {
    if (orderListStatus === 'idle') {
      dispatch(fetchOrder())
      dispatch(fetchOrderByEmployeeId(user.id))
    }
  }, [orderListStatus, dispatch])

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          className: '',
          style: {
            marginTop: '10px',
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
          <div>Marketing : {user.id}</div>
          <div className="float-right">
            {user.user_metadata.role === 'staff-logistic' ? (
              ''
            ) : (
              <Button size="small" tag={Link} to="/app/order/new">
                + new order
              </Button>
            )}
          </div>
        </div>
      </PageTitle>
      <hr className="mb-4" />
      <h1 className="text-white">Order List</h1>
      <div className="ml-1  flex py-3 justify-start flex-1 lg:mr-32">
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

      {temp === 'admin' || temp === 'admin-marketing' ? (
        <TableList
          response={orderList}
          orderDeleteStatus={orderDeleteStatus}
          query={query}
          user={user}
        />
      ) : (
        <TableList
          response={orderListByEmployeeId}
          orderDeleteStatus={orderDeleteStatus}
          query={query}
          user={user}
        />
      )}
    </>
  )
}

function TableList({ response, orderDeleteStatus, query, user }) {
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
    dispatch(deleteOrder(id))
    dispatch(clearOrderDeleteStatus())
  }

  useEffect(() => {
    if (orderDeleteStatus === 'succeeded') {
      toast.success('Berhasil menghapus data!')
    }
  }, [orderDeleteStatus])

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
            <TableCell>Created by</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Shipment Date</TableCell>
            <TableCell>Pickup Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell className="text-center">Action</TableCell>
          </tr>
        </TableHeader>
        <TableBody>
          {dataTable.map((data, i) => (
            <TableRow key={i}>
              <TableCell>
                <span className="text-sm">{data.employees?.name ?? ''}</span>
              </TableCell>
              <TableCell>
                <div className="flex items-center text-sm">
                  <div>
                    <p className="font-semibold">{data.customer_name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {data.number}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm">{data.customer_address}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm">
                  {new Date(data.delivery_date).toLocaleString()}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-sm">
                  {new Date(data.pickup_date).toLocaleString()}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-sm">{data.status}</span>
              </TableCell>
              <TableCell>
                <div className="flex   justify-center ">
                  <div className=" space-x-4">
                    <Button
                      tag={Link}
                      to={`/app/order/track-trace/${data.id}`}
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
                        to={`/app/order/edit/${data.id}`}
                        layout="link"
                        size="icon"
                        aria-label="Edit"
                      >
                        <EditIcon className="w-5 h-5" aria-hidden="true" />
                      </Button>
                    )}
                    {user.user_metadata.role === 'admin-marketing' ||
                    user.user_metadata.role === 'staff-marketing' ||
                    user.user_metadata.role === 'admin-logistic' ||
                    user.user_metadata.role === 'staff-marketing' ||
                    user.user_metadata.role === 'admin-courier' ||
                    user.user_metadata.role === 'staff-courier' ? (
                      ''
                    ) : (
                      <Button
                        onClick={() => removeOrganization(data.id)}
                        layout="link"
                        size="icon"
                        aria-label="Delete"
                      >
                        <TrashIcon className="w-5 h-5" aria-hidden="true" />
                      </Button>
                    )}
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ))}
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

export default Marketing
