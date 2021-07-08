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
import { EditIcon, TrashIcon, SearchIcon, PeopleIcon } from '../icons'
import { useDispatch, useSelector } from 'react-redux'
import Fuse from 'fuse.js'
import InfoCard from '../components/Cards/InfoCard'
import RoundIcon from '../components/RoundIcon'
import SectionTitle from '../components/Typography/SectionTitle'
import {
  clearDeliverieByIdStatus,
  deleteDeliverie,
  fetchDeliverie,
} from '../app/deliveriesSlice'
import { clearPickupByIdStatus, fetchPickup } from '../app/pickupsSlice'
import { fetchShipment } from '../app/shipmentsSlice'
import { useAuth } from '../contexts/Auth'

function Schedule() {
  const { user } = useAuth()
  const dispatch = useDispatch()
  const [link, setLink] = useState('delivery')
  const [query, setQuery] = useState('')

  const shipmentListByStatusCollected = useSelector(
    (state) => state.shipments.shipmentListByStatusCollected,
  )
  const shipmentListByStatusDelivering = useSelector(
    (state) => state.shipments.shipmentListByStatusDelivering,
  )

  const shipmentListStatus = useSelector(
    (state) => state.shipments.shipmentListStatus,
  )
  useEffect(() => {
    if (shipmentListStatus === 'idle') {
      dispatch(fetchShipment())
    }
  }, [shipmentListStatus, dispatch])

  const deliverieList = useSelector((state) => state.deliveries.deliverieList)
  const deliverieListStatus = useSelector(
    (state) => state.deliveries.deliverieListStatus,
  )

  const deliverieByIdStatus = useSelector(
    (state) => state.deliveries.deliverieByIdStatus,
  )

  useEffect(() => {
    if (deliverieByIdStatus === 'succeeded') {
      dispatch(clearDeliverieByIdStatus())
    }
  }, [deliverieByIdStatus, dispatch])

  useEffect(() => {
    if (deliverieListStatus === 'idle') {
      dispatch(fetchDeliverie())
    }
  }, [deliverieListStatus, dispatch])

  const pickupList = useSelector((state) => state.pickups.pickupList)
  const pickupListStatus = useSelector(
    (state) => state.pickups.pickupListStatus,
  )
  const pickupByIdStatus = useSelector(
    (state) => state.pickups.pickupByIdStatus,
  )

  useEffect(() => {
    if (pickupByIdStatus === 'succeeded') {
      dispatch(clearPickupByIdStatus())
    }
  }, [pickupByIdStatus, dispatch])

  useEffect(() => {
    if (pickupListStatus === 'idle') {
      dispatch(fetchPickup())
    }
  }, [pickupListStatus, dispatch])

  const newDeliveryBtn = (
    <Button size="small" tag={Link} to="/app/schedule/new/delivery">
      + new delivery
    </Button>
  )
  const newPickupBtn = (
    <Button size="small" tag={Link} to="/app/schedule/new/pickup">
      + new pickup
    </Button>
  )

  return (
    <>
      <PageTitle>
        <div className="flex justify-between">
          <div>Courier schedule list</div>
          <div>{user.user_metadata.role}</div>
          {user.user_metadata.role === 'staff-courier' ? (
            ''
          ) : (
            <div className="float-right">
              {link === 'delivery' ? newDeliveryBtn : newPickupBtn}
            </div>
          )}
        </div>
      </PageTitle>
      <SectionTitle>
        {link === 'delivery' ? 'Delivery ' : 'Pickup '}
      </SectionTitle>
      <hr className="mb-4" />
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-2">
        <div className="cursor-pointer" onClick={() => setLink('delivery')}>
          <InfoCard
            title="Delivery"
            value={`${shipmentListByStatusCollected.length} to delivery`}
          >
            <RoundIcon
              icon={PeopleIcon}
              iconColorClass="text-orange-500 dark:text-orange-100"
              bgColorClass="bg-orange-100 dark:bg-orange-500"
              className="mr-4"
            />
          </InfoCard>
        </div>

        <div className="cursor-pointer" onClick={() => setLink('pickup')}>
          <InfoCard
            title="Pickup"
            value={`${shipmentListByStatusDelivering.length} to pickup`}
          >
            <RoundIcon
              icon={PeopleIcon}
              iconColorClass="text-green-500 dark:text-green-100"
              bgColorClass="bg-green-100 dark:bg-green-500"
              className="mr-4"
            />
          </InfoCard>
        </div>
      </div>

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
      {link === 'delivery' ? (
        <Delivery query={query} response={deliverieList} />
      ) : (
        <Pickup query={query} response={pickupList} />
      )}
    </>
  )
}

function Delivery({ query, response }) {
  const dispatch = useDispatch()
  const fuse = new Fuse(response, { keys: ['name', 'role'] })
  const results = fuse.search(query)

  const [pageTable, setPageTable] = useState(1)

  const [dataTable, setDataTable] = useState([])

  const resultsPerPage = 7
  const totalResults = response.length

  function onPageChangeTable(p) {
    setPageTable(p)
  }

  function removeOrganization(id) {
    dispatch(deleteDeliverie(id))
  }

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
    <TableContainer className="mb-8 ">
      <Table className=" w-full">
        <TableHeader>
          <tr>
            <TableCell>Shipment TO</TableCell>
            <TableCell>Employee IN CHARGE</TableCell>
            <TableCell>DEPART </TableCell>
            <TableCell>RETURNED </TableCell>
            <TableCell className="text-center">Action</TableCell>
          </tr>
        </TableHeader>
        <TableBody>
          {dataTable.map((data, i) => (
            <TableRow key={i}>
              <TableCell>
                {data.shipments.status === 'collected' ||
                data.shipments.status === 'delivering' ? (
                  <Link
                    className="py-1 px-4 bg-green-900 rounded-xl"
                    to={`shipment/detail/${data.shipment_id}`}
                  >
                    <span className="text-sm">
                      {data.shipments.customer_name}
                    </span>
                  </Link>
                ) : (
                  <span className="text-sm">
                    {data.shipments.customer_name}
                  </span>
                )}
              </TableCell>
              <TableCell>
                <span className="text-sm">{data.employees.name}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm">{`${new Date(
                  data.start_date,
                ).toLocaleDateString()} -  ${new Date(
                  data.start_time,
                ).toLocaleTimeString()}`}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm">{`${new Date(
                  data.end_date,
                ).toLocaleDateString()} -  ${new Date(
                  data.end_time,
                ).toLocaleTimeString()}`}</span>
              </TableCell>
              <TableCell>
                <div className="flex   justify-center ">
                  <div className=" space-x-4">
                    <Button
                      tag={Link}
                      to={`/app/shipment/track-trace/${data.shipment_id}`}
                      layout="link"
                      size="icon"
                      aria-label="Search"
                    >
                      <SearchIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    {/* <Button
                      tag={Link}
                      to={`/app/schedule/edit/delivery/${data.id}`}
                      layout="link"
                      size="icon"
                      aria-label="Edit"
                    >
                      <EditIcon className="w-5 h-5" aria-hidden="true" />
                    </Button> */}
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
  )
}

function Pickup({ response, query }) {
  const dispatch = useDispatch()
  const fuse = new Fuse(response, { keys: ['name'] })
  const results = fuse.search(query)

  const [pageTable, setPageTable] = useState(1)

  const [dataTable, setDataTable] = useState([])

  const resultsPerPage = 7
  const totalResults = response.length

  function onPageChangeTable(p) {
    setPageTable(p)
  }

  function removeOrganization(id) {
    dispatch(deleteDeliverie(id))
  }

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
    <TableContainer className="mb-8 ">
      <Table className=" w-full">
        <TableHeader>
          <tr>
            <TableCell>Shipment TO</TableCell>
            <TableCell>Employee IN CHARGE</TableCell>
            <TableCell>DEPART </TableCell>
            <TableCell>RETURNED </TableCell>
            <TableCell className="text-center">Action</TableCell>
          </tr>
        </TableHeader>
        <TableBody>
          {dataTable.map((data, i) => (
            <TableRow key={i}>
              <TableCell>
                {data.shipments.status === 'delivered' ? (
                  <Link
                    className="py-1 px-4 bg-green-900 rounded-xl"
                    to={`shipment/detail/${data.shipment_id}`}
                  >
                    <span className="text-sm">
                      {data.shipments.customer_name}
                    </span>
                  </Link>
                ) : (
                  <span className="text-sm">
                    {data.shipments.customer_name}
                  </span>
                )}
              </TableCell>
              <TableCell>
                <span className="text-sm">{data.employees.name}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm">{`${new Date(
                  data.start_date,
                ).toLocaleDateString()} -  ${new Date(
                  data.start_time,
                ).toLocaleTimeString()}`}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm">{`${new Date(
                  data.end_date,
                ).toLocaleDateString()} -  ${new Date(
                  data.end_time,
                ).toLocaleTimeString()}`}</span>
              </TableCell>
              <TableCell>
                <div className="flex   justify-center ">
                  <div className=" space-x-4">
                    <Button
                      tag={Link}
                      to={`/app/shipment/track-trace/${data.shipment_id}`}
                      layout="link"
                      size="icon"
                      aria-label="Search"
                    >
                      <SearchIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    {/* <Button
                      tag={Link}
                      to={`/app/schedule/edit/delivery/${data.id}`}
                      layout="link"
                      size="icon"
                      aria-label="Edit"
                    >
                      <EditIcon className="w-5 h-5" aria-hidden="true" />
                    </Button> */}
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
  )
}

export default Schedule
