import React, { useEffect, useState } from 'react'
import PageTitle from '../components/Typography/PageTitle'
import { Link } from 'react-router-dom'
import { Card, CardBody, Button, Pagination } from '@windmill/react-ui'
import { EditIcon, TrashIcon, SearchIcon } from '../icons'
import { useDispatch, useSelector } from 'react-redux'
import {
  clearShipmentByIdStatus,
  fetchAllShipment,
  fetchShipment,
} from '../app/shipmentsSlice'
import ReactHtmlParser from 'react-html-parser'

function Dashboard() {
  const dispatch = useDispatch()
  let response = useSelector((state) => state.shipments.allShipmentList)
  const shipmentListStatus = useSelector(
    (state) => state.shipments.shipmentListStatus,
  )
  const shipmentByIdStatus = useSelector(
    (state) => state.shipments.shipmentByIdStatus,
  )

  useEffect(() => {
    if (shipmentByIdStatus === 'succeeded') {
      dispatch(clearShipmentByIdStatus())
    }
  }, [shipmentByIdStatus, dispatch])

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchAllShipment())
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (shipmentListStatus === 'idle') {
      dispatch(fetchShipment())
    }
  }, [shipmentListStatus, dispatch])

  const [pageTable, setPageTable] = useState(1)
  const [dataTable, setDataTable] = useState([])
  const resultsPerPage = 4
  const totalResults = response.length
  function onPageChangeTable(p) {
    setPageTable(p)
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
    <div className="h-screen dark:bg-gray-700 dark:text-white">
      <header className="z-40 py-4 bg-white shadow-bottom dark:bg-gray-800">
        <div className="container flex items-center justify-between h-full px-6 mx-auto text-dark-600 dark:text-white-300">
          <span className="text-lg">Mitra Fajar Selaras</span>
          <div>
            <span className="text-sm">Shipment</span>
            <Button size="small" className="ml-3" layout="outline">
              Today
            </Button>
          </div>
        </div>
      </header>
      <div class="overflow-auto  h-5/6 ">
        <div className="grid gap-6 px-8 mt-8  md:grid-cols-2 xl:grid-cols-4">
          {dataTable.map((data, i) => (
            <Link to={`app/shipment/detail/${data.id}`}>
              <Card className="border border-white shadow-md">
                <div className=" flex justify-between pt-4 pb-2 px-3">
                  <span className="text-sm">{data.customer_name}</span>
                  <span className="text-sm">
                    {new Date(data.shipment_date).toLocaleString()}
                  </span>
                </div>
                <div className=" flex justify-between px-3 pb-4">
                  <span className="text-sm ">
                    <span className="text-sm">{data.company_name}</span>
                  </span>
                </div>
                <hr />

                <CardBody>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {ReactHtmlParser(data.product_list)}
                  </p>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      </div>
      <div className="px-20 mt-5">
        <Pagination
          totalResults={totalResults}
          resultsPerPage={resultsPerPage}
          onChange={onPageChangeTable}
          label="Table navigation"
        />
      </div>
    </div>
  )
}

export default Dashboard
