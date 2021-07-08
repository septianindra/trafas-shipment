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
  Label,
  Pagination,
} from '@windmill/react-ui'
import { ChecklistIcon } from '../icons'
import { useDispatch, useSelector } from 'react-redux'
import {
  clearShipmentListStatus,
  deleteShipment,
  fetchShipment,
} from '../app/shipmentsSlice'
import SectionTitle from '../components/Typography/SectionTitle'
import { fetchShipmentById } from '../app/shipmentsSlice'
import './pages.css'
import { fetchShipmentStatusAuditById } from '../app/shipmentStatusAuditsSlice'
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2,
} from 'react-html-parser'

function TraceTrack() {
  const dispatch = useDispatch()
  let { id } = useParams()

  const shipmentById = useSelector((state) => state.shipments.shipmentById)
  const shipmentByIdStatus = useSelector(
    (state) => state.shipments.shipmentByIdStatus,
  )

  useEffect(() => {
    if (shipmentByIdStatus === 'idle') {
      dispatch(fetchShipmentById(id))
    }
  }, [shipmentByIdStatus, dispatch])

  const shipmentStatusAuditById = useSelector(
    (state) => state.shipmentStatusAudits.shipmentStatusAuditById,
  )
  const shipmentStatusAuditByIdStatus = useSelector(
    (state) => state.shipmentStatusAudits.shipmentStatusAuditByIdStatus,
  )

  const status = ['collected', 'delivering', 'delivered', 'pickup', 'done']

  useEffect(() => {
    if (shipmentStatusAuditByIdStatus === 'idle') {
      dispatch(fetchShipmentStatusAuditById(id))
    }
  }, [shipmentStatusAuditByIdStatus, dispatch])

  const [pageTable, setPageTable] = useState(1)

  const [dataTable, setDataTable] = useState([])

  const resultsPerPage = 7
  const totalResults = shipmentStatusAuditById.length

  function onPageChangeTable(p) {
    setPageTable(p)
  }

  useEffect(() => {
    setDataTable(
      shipmentStatusAuditById.slice(
        (pageTable - 1) * resultsPerPage,
        pageTable * resultsPerPage,
      ),
    )
  }, [shipmentStatusAuditById, pageTable])
  return (
    <>
      <PageTitle>
        <div className="flex justify-between">
          <div>Track & Trace</div>
        </div>
      </PageTitle>
      <SectionTitle>
        ID #
        {shipmentStatusAuditById[0]
          ? shipmentStatusAuditById[0].shipment_id
          : ''}
      </SectionTitle>
      <hr className="mb-4" />

      <Card className="my-5 text-gray-300">
        <CardBody>
          <div className="track">
            {status.map((data) => (
              <div
                className={
                  shipmentStatusAuditById.some((e) => e.status === data)
                    ? 'step active'
                    : 'step'
                }
              >
                <span className="icon">
                  <i className="flex justify-center p-1">
                    <ChecklistIcon className="self-center" />
                  </i>
                </span>
                <span className="text">{data}</span>
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

              <TableCell>Status</TableCell>
              <TableCell>Description</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {dataTable.map((data, i) => (
              <TableRow key={i}>
                <TableCell>
                  <span className="text-sm">
                    {new Date(data.changed_on).toLocaleString()}
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

      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 ">
        <div className="grid gap-6 mt-4 mb-4 md:grid-cols-2 xl:grid-cols-2"></div>

        <div className="grid gap-6 mt-4 mb-4 md:grid-cols-2 xl:grid-cols-2">
          <Label>
            <span>Transfer no.:</span>
            <div className="my-2 p-2 bg-gray-700 text-gray-300">
              {shipmentById.transfer_no}
            </div>
          </Label>
          <Label>
            <span>Customer Name</span>
            <div className="my-2 p-2 bg-gray-700 text-gray-300">
              {shipmentById.customer_name}
            </div>
          </Label>

          <Label className="col-span-2">
            <span>Address</span>
            <div className="my-2 p-2 bg-gray-700 text-gray-300">
              {shipmentById.shipment_address}
            </div>
          </Label>
          <Label>
            <span>Shipment Date</span>
            <div className="my-2 p-2 bg-gray-700 text-gray-300">
              {shipmentById.shipment_date}
            </div>
          </Label>

          <Label>
            <span>Pickup Date</span>
            <div className="my-2 p-2 bg-gray-700 text-gray-300">
              {shipmentById.pickup_date}
            </div>
          </Label>
        </div>

        <Label>
          <span>Product List</span>
          <div className="my-2 p-2 bg-gray-700 text-gray-300">
            {ReactHtmlParser(shipmentById.product_list)}
          </div>
        </Label>
        <Label>
          <span>Note</span>
          <div className="my-2 p-2 bg-gray-700 text-gray-300">
            {shipmentById.note}
          </div>
        </Label>
      </div>
    </>
  )
}

export default TraceTrack
