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
import { useForm } from 'react-hook-form'
import { FilterIcon } from '../icons'
import { fetchPackage } from '../app/packagesSlice'

function Report() {
  const { user } = useAuth()

  const [query, setQuery] = useState('')

  const dispatch = useDispatch()

  const [stateFilter, setStateFilter] = useState(false)

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {},
  })

  const onSubmit = async (data) => {}

  const orderList = useSelector((state) => state.orders.orderList)
  const packageList = useSelector((state) => state.packages.packageList)
  const deliveryList = useSelector((state) => state.deliverys.deliveryList)
  const returnList = useSelector((state) => state.returns.returnList)
  const orderListStatus = useSelector((state) => state.orders.orderListStatus)

  useEffect(() => {
    if (orderListStatus === 'idle') {
      dispatch(fetchOrder())
    }
  }, [orderListStatus, dispatch])

  return (
    <>
      <PageTitle>
        <div className="flex justify-between">
          <div>Report</div>
          <Button size="small">
            <FilterIcon />
          </Button>
        </div>
      </PageTitle>
      <hr />
      {/* <TableList response={orderList} query={query} user={user} /> */}
    </>
  )
}

function TableList({ response, query }) {
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

export default Report
