import React, { useEffect, useState } from 'react'
import PageTitle from '../components/Typography/PageTitle'
import { Link, useParams } from 'react-router-dom'
import {
  Card,
  CardBody,
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Button,
  Pagination,
} from '@windmill/react-ui'
import { EditIcon, TrashIcon, SearchIcon, HeartIcon } from '../icons'
import { useDispatch, useSelector } from 'react-redux'
import {
  clearShipmentListStatus,
  deleteShipment,
  fetchShipment,
} from '../app/shipmentsSlice'
import SectionTitle from '../components/Typography/SectionTitle'
import { fetchShipmentById } from '../app/shipmentsSlice'
import './pages.css'

function TraceTrack() {
  const dispatch = useDispatch()
  let { id } = useParams()
  const response = useSelector(
    (state) => state.detailShipments.detail_shipmentById,
  )
  const detail_shipmentByIdStatus = useSelector(
    (state) => state.detailShipments.detail_shipmentByIdStatus,
  )
  const shipmentById = useSelector((state) => state.shipments.shipmentById)
  const shipmentByIdStatus = useSelector(
    (state) => state.shipments.shipmentByIdStatus,
  )

  useEffect(() => {
    if (shipmentByIdStatus === 'idle') {
      dispatch(fetchShipmentById(id))
    }
  }, [shipmentByIdStatus, dispatch])

  useEffect(() => {
    if (detail_shipmentByIdStatus === 'idle') {
    }
  }, [detail_shipmentByIdStatus, dispatch])

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
    setDataTable(
      response.slice(
        (pageTable - 1) * resultsPerPage,
        pageTable * resultsPerPage,
      ),
    )
  }, [response, pageTable])
  return (
    <>
      <PageTitle>
        <div className="flex justify-between">
          <div>Track & Trace</div>
        </div>
      </PageTitle>
      <SectionTitle>ID #{shipmentById.id}</SectionTitle>
      <hr className="mb-4" />

      <Card className="my-5 text-gray-300">
        <CardBody>
          <div className="track">
            {dataTable.map((data) => (
              <div className={`step ${data.logic}`}>
                <span className="icon">
                  <i>
                    <HeartIcon />
                  </i>
                </span>
                <span className="text">{data.status}</span>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <TableContainer className="mb-8 ">
        <Table className=" w-full">
          <TableHeader>
            <tr>
              <TableCell>Local time</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Description</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {dataTable.map((data, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center text-sm">
                    <div>
                      {data.created_at != data.updated_at
                        ? data.updated_at
                        : ''}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{data.address}</span>
                </TableCell>
                <TableCell className=" w-1/4">
                  <span className="text-sm truncate ">
                    {data.shipment_date}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{data.status}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{data.returned_date}</span>
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

export default TraceTrack
