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
import { fetchShipmentStatusAuditById } from '../app/shipmentStatusAuditsSlice'

function TraceTrack() {
  const dispatch = useDispatch()
  let { id } = useParams()
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
                  <i>
                    <HeartIcon />
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
    </>
  )
}

export default TraceTrack
