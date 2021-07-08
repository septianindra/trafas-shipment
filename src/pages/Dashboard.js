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
import { useAuth } from '../contexts/Auth'

function Dashboard() {
  // variable -----------------------------------------------------------
  const dispatch = useDispatch()
  const [filter, SetFilter] = useState('today')
  const { user } = useAuth()
  const [query, setQuery] = useState('')
  const shipmentList = useSelector((state) => state.shipments.shipmentList)
  const shipmentListByStatusNotDone = useSelector(
    (state) => state.shipments.shipmentListByStatusNotDone,
  )
  const shipmentListByTodayDate = useSelector(
    (state) => state.shipments.shipmentListByTodayDate,
  )
  const shipmentListByStatusCollected = useSelector(
    (state) => state.shipments.shipmentListByStatusCollected,
  )
  const shipmentListByStatusDelivering = useSelector(
    (state) => state.shipments.shipmentListByStatusDelivering,
  )
  //---------------------------------------------------------------------

  // fetch all shipment---------------------------
  const shipmentListStatus = useSelector(
    (state) => state.shipments.shipmentListStatus,
  )
  useEffect(() => {
    if (shipmentListStatus === 'idle') {
      dispatch(fetchShipment())
    }
  }, [shipmentListStatus, dispatch])
  //----------------------------------------------

  // clear shipment by id filter -----------------
  const shipmentByIdStatus = useSelector(
    (state) => state.shipments.shipmentByIdStatus,
  )
  useEffect(() => {
    if (shipmentByIdStatus === 'succeeded') {
      dispatch(clearShipmentByIdStatus())
    }
  }, [shipmentByIdStatus, dispatch])
  //----------------------------------------------

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchShipment())
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 dark:text-white">
      <header className="z-40  py-4 bg-white shadow-bottom dark:bg-gray-800">
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
        <div
          className={
            filter === 'today'
              ? 'cursor-pointer p-1  bg-gray-600 rounded-lg'
              : 'cursor-pointer'
          }
          onClick={() => SetFilter('today')}
        >
          <InfoCard
            title="Today Shipment"
            value={shipmentListByTodayDate.length}
          >
            <RoundIcon
              icon={PeopleIcon}
              iconColorClass="text-red-500 dark:text-red-100"
              bgColorClass="bg-red-100 dark:bg-red-500"
              className="mr-4"
            />
          </InfoCard>
        </div>

        <div
          className={
            filter === 'active'
              ? 'cursor-pointer p-1  bg-gray-600 rounded-lg'
              : 'cursor-pointer'
          }
          onClick={() => SetFilter('active')}
        >
          <InfoCard
            title="Active Shipment"
            value={shipmentListByStatusNotDone.length}
          >
            <RoundIcon
              icon={MoneyIcon}
              iconColorClass="text-blue-500 dark:text-blue-100"
              bgColorClass="bg-blue-100 dark:bg-blue-500"
              className="mr-4"
            />
          </InfoCard>
        </div>

        <div
          className={
            filter === 'delivery'
              ? 'cursor-pointer p-1  bg-gray-600 rounded-lg'
              : 'cursor-pointer'
          }
          onClick={() => SetFilter('delivery')}
        >
          <InfoCard
            title="Delivery"
            value={shipmentListByStatusCollected.length}
          >
            <RoundIcon
              icon={MoneyIcon}
              iconColorClass="text-yellow-500 dark:text-yellow-100"
              bgColorClass="bg-yellow-100 dark:bg-yellow-500"
              className="mr-4"
            />
          </InfoCard>
        </div>

        <div
          className={
            filter === 'pickup'
              ? 'cursor-pointer p-1  bg-gray-600 rounded-lg'
              : 'cursor-pointer'
          }
          onClick={() => SetFilter('pickup')}
        >
          <InfoCard
            title="Pickup"
            value={shipmentListByStatusDelivering.length}
          >
            <RoundIcon
              icon={MoneyIcon}
              iconColorClass="text-green-500 dark:text-green-100"
              bgColorClass="bg-green-100 dark:bg-green-500"
              className="mr-4"
            />
          </InfoCard>
        </div>
      </div>

      <div className="px-8 mb-4">
        <span className="text-lg">Shipment list</span>
      </div>

      {filter === 'today' ? (
        <TodayShipment response={shipmentListByTodayDate} />
      ) : filter === 'active' ? (
        <ActiveShipment response={shipmentListByStatusNotDone} />
      ) : filter === 'delivery' ? (
        <Delivery response={shipmentListByStatusCollected} />
      ) : (
        <Pickup response={shipmentListByStatusDelivering} />
      )}
    </div>
  )
}

function TodayShipment({ response }) {
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
    <>
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

      <div className="px-20 py-2">
        <Pagination
          totalResults={totalResults}
          resultsPerPage={resultsPerPage}
          onChange={onPageChangeTable}
          label="Table navigation"
        />
      </div>
    </>
  )
}

function ActiveShipment({ response }) {
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
    <>
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

      <div className="px-20 py-2">
        <Pagination
          totalResults={totalResults}
          resultsPerPage={resultsPerPage}
          onChange={onPageChangeTable}
          label="Table navigation"
        />
      </div>
    </>
  )
}

function Delivery({ response }) {
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
    <>
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

      <div className="px-20 py-2">
        <Pagination
          totalResults={totalResults}
          resultsPerPage={resultsPerPage}
          onChange={onPageChangeTable}
          label="Table navigation"
        />
      </div>
    </>
  )
}

function Pickup({ response }) {
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
    <>
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

      <div className="px-20 py-2">
        <Pagination
          totalResults={totalResults}
          resultsPerPage={resultsPerPage}
          onChange={onPageChangeTable}
          label="Table navigation"
        />
      </div>
    </>
  )
}

export default Dashboard
