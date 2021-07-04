import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardBody, Pagination, Input } from '@windmill/react-ui'
import { useDispatch, useSelector } from 'react-redux'
import {
  clearShipmentByIdStatus,
  fetchAllShipment,
  fetchShipment,
} from '../app/shipmentsSlice'
import ReactHtmlParser from 'react-html-parser'
import InfoCard from '../components/Cards/InfoCard'
import RoundIcon from '../components/RoundIcon'
import { PeopleIcon, MoneyIcon, SearchIcon } from '../icons'

function Dashboard() {
  const dispatch = useDispatch()
  const [query, setQuery] = useState('')
  const response = useSelector((state) => state.shipments.allShipmentList)

  // const response = useSelector(
  //   (state) => state.shipments.allShipmentList,
  // ).filter(
  //   (data) =>
  //     new Date(String(data.shipment_date)).toDateString() ===
  //     new Date().toDateString(),
  // )

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
        <div className="container flex items-center justify-between px-6 mx-auto text-dark-600 dark:text-white-300">
          <span className="text-lg mr-5">TRAFAS</span>
          <div className="relative w-3/5 focus-within:text-purple-500">
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
          <div className="ml-5">
            <span className="text-sm">Shipment</span>
          </div>
        </div>
      </header>
      <div className="grid px-8 py-4 gap-6 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4">
        <div></div>
        <div className="cursor-pointer" onClick={() => console.log('clicked')}>
          <InfoCard title="Today Shipment" value="6389">
            <RoundIcon
              icon={PeopleIcon}
              iconColorClass="text-orange-500 dark:text-orange-100"
              bgColorClass="bg-orange-100 dark:bg-orange-500"
              className="mr-4"
            />
          </InfoCard>
        </div>

        <div className="cursor-pointer" onClick={() => console.log('clicked')}>
          <InfoCard title="Active Shipment" value="$ 46,760.89">
            <RoundIcon
              icon={MoneyIcon}
              iconColorClass="text-green-500 dark:text-green-100"
              bgColorClass="bg-green-100 dark:bg-green-500"
              className="mr-4"
            />
          </InfoCard>
        </div>
        <div></div>
      </div>

      <div className="px-8 mb-4">
        <span className="text-lg">Shipment list</span>
      </div>

      <div className="overflow-auto h-2/3">
        <div className="grid gap-3 px-8 md:grid-cols-2 xl:grid-cols-4">
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

      <div className="fixed w-full px-20 bottom-2 ">
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
