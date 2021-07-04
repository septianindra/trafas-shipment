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
import {
  clearShipmentByIdStatus,
  deleteShipment,
  fetchShipment,
} from '../app/shipmentsSlice'
import Fuse from 'fuse.js'
import toast, { Toaster } from 'react-hot-toast'
import { clearShipmentStatusAuditByIdStatus } from '../app/shipmentStatusAuditsSlice'
import { data } from 'autoprefixer'

function Shipment() {
  const dispatch = useDispatch()
  const [filterKey, setFilterKey] = useState('done')

  let response = useSelector((state) => state.shipments.shipmentList)
  const shipmentListStatus = useSelector(
    (state) => state.shipments.shipmentListStatus,
  )
  const shipmentByIdStatus = useSelector(
    (state) => state.shipments.shipmentByIdStatus,
  )
  const shipmentDeleteStatus = useSelector(
    (state) => state.shipments.shipmentDeleteStatus,
  )
  const shipmentStatusAuditByIdStatus = useSelector(
    (state) => state.shipmentStatusAudits.shipmentStatusAuditByIdStatus,
  )

  const [query, setQuery] = useState('')
  const fuse = new Fuse(response, {
    keys: ['transfer_no', 'customer_name', 'status'],
  })
  const results = fuse.search(query)

  useEffect(() => {
    if (shipmentByIdStatus === 'succeeded') {
      dispatch(clearShipmentByIdStatus())
    }
  }, [shipmentByIdStatus, dispatch])

  useEffect(() => {
    if (shipmentStatusAuditByIdStatus === 'succeeded') {
      dispatch(clearShipmentStatusAuditByIdStatus())
    }
  }, [shipmentStatusAuditByIdStatus, dispatch])

  useEffect(() => {
    if (shipmentListStatus === 'idle') {
      dispatch(fetchShipment())
    }
  }, [shipmentListStatus, dispatch])

  const [pageTable, setPageTable] = useState(1)
  const [dataTable, setDataTable] = useState([])

  const resultsPerPage = 7
  const totalResults = response.length

  function onPageChangeTable(p) {
    setPageTable(p)
  }

  function removeOrganization(id) {
    dispatch(deleteShipment(id))
  }

  useEffect(() => {
    if (shipmentDeleteStatus === 'succeeded') {
      toast.success('Berhasil menghapus data!')
    }
  }, [shipmentDeleteStatus])

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
      console.log(searchResult)
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
          <div>Shipment list</div>
          <div className="float-right">
            <Button size="small" tag={Link} to="/app/shipment/new">
              + new shipment
            </Button>
          </div>
        </div>
      </PageTitle>
      <hr className="mb-4" />
      <div className="ml-1  flex py-3 justify-start flex-1 lg:mr-32">
        <div className="relative w-full  max-w-xl mr-6 focus-within:text-purple-500">
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
      <TableContainer className="mb-8 ">
        <Table className=" w-full">
          <TableHeader>
            <tr>
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
                  <div className="flex items-center text-sm">
                    <div>
                      <p className="font-semibold">{data.customer_name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {data.transfer_no}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{data.shipment_address}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {new Date(data.shipment_date).toLocaleString()}
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
                        to={`/app/shipment/track-trace/${data.id}`}
                        layout="link"
                        size="icon"
                        aria-label="Search"
                      >
                        <SearchIcon className="w-5 h-5" aria-hidden="true" />
                      </Button>
                      <Button
                        tag={Link}
                        to={`/app/shipment/edit/${data.id}`}
                        layout="link"
                        size="icon"
                        aria-label="Edit"
                      >
                        <EditIcon className="w-5 h-5" aria-hidden="true" />
                      </Button>
                      <Button
                        onClick={() => removeOrganization(data.id)}
                        layout="link"
                        size="icon"
                        aria-label="Delete"
                      >
                        <TrashIcon className="w-5 h-5" aria-hidden="true" />
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
    </>
  )
}

export default Shipment
