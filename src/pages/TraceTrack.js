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
  clearOrderListStatus,
  deleteOrder,
  fetchOrder,
} from '../app/ordersSlice'
import SectionTitle from '../components/Typography/SectionTitle'
import { fetchOrderById } from '../app/ordersSlice'
import './pages.css'
import { fetchOrderStatusAuditById } from '../app/orderStatusAuditsSLice'
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2,
} from 'react-html-parser'
import { fetchPackage, fetchPackageById } from '../app/packagesSlice'
import { fetchDelivery, fetchDeliveryById } from '../app/deliverysSlice'
import { fetchPickup, fetchPickupById } from '../app/pickupsSlice'
import { fetchReturn, fetchReturnById } from '../app/returnsSlice'
import { fetchEmployee } from '../app/employeesSlice'

function TraceTrack() {
  const dispatch = useDispatch()
  let { id } = useParams()

  const orderById = useSelector((state) => state.orders.orderById)
  const orderByIdStatus = useSelector((state) => state.orders.orderByIdStatus)
  const packageById = useSelector((state) => state.packages.packageById)
  const deliveryById = useSelector((state) => state.deliverys.deliveryById)
  const pickupById = useSelector((state) => state.pickups.pickupById)
  const returnById = useSelector((state) => state.returns.returnById)
  const employees = useSelector((state) => state.employees.employeeList)

  const orderStatusAuditById = useSelector(
    (state) => state.orderStatusAudits.orderStatusAuditById,
  )
  const orderStatusAuditByIdStatus = useSelector(
    (state) => state.orderStatusAudits.orderStatusAuditByIdStatus,
  )

  const status = ['collected', 'delivered', 'returned', 'done']

  useEffect(() => {
    if (orderStatusAuditByIdStatus === 'idle') {
      dispatch(fetchOrderStatusAuditById(id))
      dispatch(fetchOrderById(id))
      dispatch(fetchEmployee())
    }
  }, [orderStatusAuditByIdStatus, dispatch])

  useEffect(() => {
    if (orderStatusAuditByIdStatus === 'succeeded') {
      dispatch(fetchPackageById(orderById.id))
      dispatch(fetchDeliveryById(orderById.id))
      dispatch(fetchPickupById(orderById.id))
      dispatch(fetchReturnById(orderById.id))
    }
  }, [orderStatusAuditByIdStatus, dispatch])

  const [pageTable, setPageTable] = useState(1)

  const [dataTable, setDataTable] = useState([])

  const resultsPerPage = 7
  const totalResults = orderStatusAuditById.length

  function onPageChangeTable(p) {
    setPageTable(p)
  }

  useEffect(() => {
    setDataTable(
      orderStatusAuditById.slice(
        (pageTable - 1) * resultsPerPage,
        pageTable * resultsPerPage,
      ),
    )
  }, [orderStatusAuditById, pageTable])
  return (
    <>
      <PageTitle>
        <div className="flex justify-between">
          <div>Track & Trace</div>
        </div>
      </PageTitle>
      <SectionTitle>
        ID #{orderStatusAuditById[0] ? orderStatusAuditById[0].order_id : ''}
      </SectionTitle>
      <hr className="mb-4" />

      <Card className="my-5 text-gray-300">
        <CardBody>
          <div className="track">
            {status.map((data) => (
              <div
                className={
                  orderStatusAuditById.some((e) => e.status === data)
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
              <TableCell>Employee on duty</TableCell>
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
                  <span className="text-sm">
                    {data.status === 'confirmed'
                      ? orderById?.employees?.name ?? ''
                      : data.status === 'collected'
                      ? packageById?.employees?.name ?? ''
                      : data.status === 'delivered'
                      ? deliveryById?.employees?.name ?? ''
                      : data.status === 'returned'
                      ? pickupById?.employees?.name ?? ''
                      : data.status === 'done'
                      ? returnById?.employees?.name ?? ''
                      : ''}
                  </span>
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
            <span>SPB Number</span>
            <div className="my-2 p-2 bg-gray-700 text-gray-300">
              {orderById.number}
            </div>
          </Label>
          <Label>
            <span>Customer Name</span>
            <div className="my-2 p-2 bg-gray-700 text-gray-300">
              {orderById.customer_name}
            </div>
          </Label>

          <Label className="col-span-2">
            <span>Address</span>
            <div className="my-2 p-2 bg-gray-700 text-gray-300">
              {orderById.customer_address}
            </div>
          </Label>
          <Label>
            <span>Delivery Date</span>
            <div className="my-2 p-2 bg-gray-700 text-gray-300">
              {orderById.delivery_date}
            </div>
          </Label>

          <Label>
            <span>Pickup Date</span>
            <div className="my-2 p-2 bg-gray-700 text-gray-300">
              {orderById.pickup_date}
            </div>
          </Label>
        </div>

        <Label>
          <span>Product List</span>
          <div className="my-2 p-2 bg-gray-700 text-gray-300">
            {ReactHtmlParser(orderById.product_list)}
          </div>
        </Label>
        <Label>
          <span>Note</span>
          <div className="my-2 p-2 bg-gray-700 text-gray-300">
            {orderById.note}
          </div>
        </Label>
      </div>
    </>
  )
}

export default TraceTrack
