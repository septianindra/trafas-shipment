import React, { useEffect, useMemo, useState, forwardRef, useRef } from 'react'
import PageTitle from '../components/Typography/PageTitle'
import { Link } from 'react-router-dom'
import {
  Card,
  CardBody,
  Label,
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
import {
  useTable,
  useSortBy,
  usePagination,
  useAsyncDebounce,
  useGlobalFilter,
} from 'react-table'

function Marketing() {
  const { user } = useAuth()
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

  const orderList = useSelector((state) => state.orders.orderList)
  const orderListByEmployeeId = useSelector(
    (state) => state.orders.orderListByEmployeeId,
  )
  const orderListStatus = useSelector((state) => state.orders.orderListStatus)
  const orderDeleteStatus = useSelector(
    (state) => state.orders.orderDeleteStatus,
  )

  useEffect(() => {
    if (orderListStatus === 'idle' && temp === 'admin') {
      dispatch(fetchOrder())
    } else {
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
          <div>Marketing</div>
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
      {<TableOrder response={orderList} />}

      {/* {temp === 'admin' || temp === 'admin-marketing' ? (
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
      )} */}
    </>
  )
}

function TableOrder({ response }) {
  const data = useMemo(() => response, [response])
  const columns = useMemo(
    () => [
      { Header: 'Created At', accessor: 'created_at' },
      { Header: 'Customer', accessor: 'customer_name' },
      { Header: 'Address', accessor: 'customer_address' },
    ],
    [],
  )

  const {
    state,
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    allColumns,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
  )

  function GlobalFilter({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
  }) {
    const count = preGlobalFilteredRows.length
    const [value, setValue] = React.useState(globalFilter)
    const onChange = useAsyncDebounce((value) => {
      setGlobalFilter(value || undefined)
    }, 1500)

    return (
      <Label>
        <span>Search :</span>
        <Input
          className="rounded-md mt-2"
          value={value || ''}
          onChange={(e) => {
            setValue(e.target.value)
            onChange(e.target.value)
          }}
          placeholder={`${count} records...`}
          style={{
            fontSize: '1.1rem',
            border: '0',
          }}
        />
      </Label>
    )
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-1">
        <Card>
          <CardBody>
            <p className="mb-2 font-semibold text-gray-600 dark:text-gray-400">
              Filter
            </p>
            <hr className="mb-2" />
            <span className="text-gray-400 text-sm ">Select :</span>
            <div className="flex gap-4 mt-2 text-gray-600 dark:text-gray-400">
              {allColumns.map((column) => (
                <div key={column.id}>
                  <Label check>
                    <Input type="checkbox" {...column.getToggleHiddenProps()} />
                    <span className="ml-2">{column.id}</span>
                  </Label>
                </div>
              ))}
            </div>
          </CardBody>
          <div className="mx-4 mb-4">
            <GlobalFilter
              preGlobalFilteredRows={preGlobalFilteredRows}
              globalFilter={state.globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
          </div>
        </Card>
      </div>

      <TableContainer className="my-4">
        <Table className=" w-full" {...getTableProps()}>
          <TableHeader>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <TableCell
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                  >
                    {column.render('Header')}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                    </span>
                  </TableCell>
                ))}
              </tr>
            ))}
          </TableHeader>
          <TableBody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <TableCell {...cell.getCellProps()}>
                        {cell.render('Cell')}
                      </TableCell>
                    )
                  })}
                </tr>
              )
            })}
          </TableBody>
        </Table>
        <TableFooter>
          <div className="pagination">
            <Button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
              {'<<'}
            </Button>
            <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
              {'<'}
            </Button>
            <Button onClick={() => nextPage()} disabled={!canNextPage}>
              {'>'}
            </Button>
            <Button
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            >
              {'>>'}
            </Button>
            <span>
              Page
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>
            </span>
            <span>
              | Go to page:
              <input
                type="number"
                defaultValue={pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0
                  gotoPage(page)
                }}
                style={{ width: '100px' }}
              />
            </span>
            {/* <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
              }}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select> */}
          </div>
        </TableFooter>
      </TableContainer>
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
