import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardBody, Pagination, Input } from '@windmill/react-ui'
import { useDispatch, useSelector } from 'react-redux'
import ReactHtmlParser from 'react-html-parser'
import InfoCard from '../components/Cards/InfoCard'
import RoundIcon from '../components/RoundIcon'
import { PeopleIcon, MoneyIcon, SearchIcon } from '../icons'
import { useAuth } from '../contexts/Auth'
import { fetchPackage } from '../app/packagesSlice'
import { fetchDelivery } from '../app/deliverysSlice'
import { fetchPickup } from '../app/pickupsSlice'

function Dashboard() {
  const dispatch = useDispatch()
  const [filter, setFilter] = useState('package')
  const [query, setQuery] = useState('')
  const packageList = useSelector((state) => state.packages.packageList)
  const deliveryList = useSelector((state) => state.deliverys.deliveryList)
  const pickupList = useSelector((state) => state.pickups.pickupList)
  const packageListStatus = useSelector(
    (state) => state.packages.packageListStatus,
  )
  const datenow = new Date().toDateString()
  // console.log(datenow)
  // console.log(
  //   new Date(packageList[4].orders.delivery_date).toDateString() === datenow,
  // )
  useEffect(() => {
    if (packageListStatus === 'idle') {
      dispatch(fetchPackage())
      dispatch(fetchDelivery())
      dispatch(fetchPickup())
    }
  }, [packageListStatus, dispatch])

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchPackage())
      dispatch(fetchDelivery())
      dispatch(fetchPickup())
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
            filter === 'package'
              ? 'cursor-pointer p-1  bg-gray-600 rounded-lg'
              : 'cursor-pointer'
          }
          onClick={() => setFilter('package')}
        >
          <InfoCard title="to Prepare" value="">
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
            filter === 'delivery'
              ? 'cursor-pointer p-1  bg-gray-600 rounded-lg'
              : 'cursor-pointer'
          }
          onClick={() => setFilter('delivery')}
        >
          <InfoCard title="to Deliver" value="">
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
            filter === 'pickup'
              ? 'cursor-pointer p-1  bg-gray-600 rounded-lg'
              : 'cursor-pointer'
          }
          onClick={() => setFilter('pickup')}
        >
          <InfoCard title="to Pickup" value="">
            <RoundIcon
              icon={MoneyIcon}
              iconColorClass="text-yellow-500 dark:text-yellow-100"
              bgColorClass="bg-yellow-100 dark:bg-yellow-500"
              className="mr-4"
            />
          </InfoCard>
        </div>
      </div>

      <div className="px-8">
        <span className="text-lg">Shipment list</span>
      </div>

      {filter === 'package' ? (
        <PackageCard response={packageList} datenow={datenow} />
      ) : filter === 'delivery' ? (
        <DeliveryCard response={deliveryList} />
      ) : filter === 'pickup' ? (
        <PickupCard response={pickupList} />
      ) : null}
    </div>
  )
}

function PackageCard({ response }) {
  return (
    <>
      <div className="overflow-auto">
        <div className="grid gap-8 p-8 md:grid-cols-1 xl:grid-cols-4">
          {response.map((data, i) => {
            return new Date(data.date).toDateString() ===
              new Date().toDateString() &&
              data.orders.status === 'confirmed' ? (
              <Link to={`app/shipment/detail/${data.id}`}>
                <Card className="border border-white shadow-md">
                  <div className=" flex justify-between pt-4 pb-2 px-3">
                    <span className="text-sm">{data.employees.name}</span>
                    <span className="text-sm">
                      {new Date(data.date).toLocaleString()}
                    </span>
                  </div>

                  <hr />
                  <CardBody>
                    <div className=" flex justify-between px-3 pb-4">
                      <span className="text-sm ">
                        <span className="text-sm">
                          {data.orders.customer_address}
                        </span>
                      </span>
                    </div>
                  </CardBody>
                </Card>
              </Link>
            ) : null
          })}
        </div>
      </div>
    </>
  )
}

function DeliveryCard({ response }) {
  return (
    <>
      <div className="overflow-auto">
        <div className="grid gap-8 p-8 md:grid-cols-1 xl:grid-cols-4">
          {response.map((data, i) => {
            return new Date(data.date).toDateString() ===
              new Date().toDateString() &&
              data.orders.status === 'collected' ? (
              <Link to={`app/shipment/detail/${data.id}`}>
                <Card className="border border-white shadow-md">
                  <div className=" flex justify-between pt-4 pb-2 px-3">
                    <span className="text-sm">{data.employees.name}</span>
                    <span className="text-sm">
                      {new Date(data.date).toLocaleString()}
                    </span>
                  </div>

                  <hr />
                  <CardBody>
                    <div className=" flex justify-between px-3 pb-4">
                      <span className="text-sm ">
                        <span className="text-sm">
                          {data.orders.customer_address}
                        </span>
                      </span>
                    </div>
                  </CardBody>
                </Card>
              </Link>
            ) : null
          })}
        </div>
      </div>
    </>
  )
}

function PickupCard({ response }) {
  return (
    <>
      <div className="overflow-auto">
        <div className="grid gap-8 p-8 md:grid-cols-1 xl:grid-cols-4">
          {response.map((data, i) => {
            return new Date(data.date).toDateString() ===
              new Date().toDateString() &&
              data.orders.status === 'delivered' ? (
              <Link to={`app/shipment/detail/${data.id}`}>
                <Card className="border border-white shadow-md">
                  <div className=" flex justify-between pt-4 pb-2 px-3">
                    <span className="text-sm">{data.employees.name}</span>
                    <span className="text-sm">
                      {new Date(data.date).toLocaleString()}
                    </span>
                  </div>

                  <hr />
                  <CardBody>
                    <div className=" flex justify-between px-3 pb-4">
                      <span className="text-sm ">
                        <span className="text-sm">
                          {data.orders.customer_address}
                        </span>
                      </span>
                    </div>
                  </CardBody>
                </Card>
              </Link>
            ) : null
          })}
        </div>
      </div>
    </>
  )
}

export default Dashboard
