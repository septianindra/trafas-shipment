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
import { deleteSchedule, fetchSchedule } from '../app/schedulesSlice'
import InfoCard from '../components/Cards/InfoCard'
import RoundIcon from '../components/RoundIcon'
import SectionTitle from '../components/Typography/SectionTitle'

function Schedule() {
  const dispatch = useDispatch()
  const [link, setLink] = useState('delivery')
  const scheduleList = useSelector((state) => state.schedules.scheduleList)
  const scheduleListStatus = useSelector(
    (state) => state.schedules.scheduleListStatus,
  )
  const scheduleByIdStatus = useSelector(
    (state) => state.schedules.scheduleByIdStatus,
  )

  useEffect(() => {
    if (scheduleListStatus === 'idle') {
      dispatch(fetchSchedule())
    }
  }, [scheduleListStatus, dispatch])
  const newDeliveryBtn = (
    <Button size="small" tag={Link} to="/app/schedule/new">
      + new delivery
    </Button>
  )
  const newPickupBtn = (
    <Button size="small" tag={Link} to="/app/schedule/new">
      + new pickup
    </Button>
  )
  const [query, setQuery] = useState('')
  return (
    <>
      <PageTitle>
        <div className="flex justify-between">
          <div>Courier schedule list</div>
          <div className="float-right">
            {link === 'delivery' ? newDeliveryBtn : newPickupBtn}
          </div>
        </div>
      </PageTitle>
      <SectionTitle>
        {link === 'delivery' ? 'Delivery ' : 'Pickup '}
      </SectionTitle>
      <hr className="mb-4" />
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-2">
        <div className="cursor-pointer" onClick={() => setLink('delivery')}>
          <InfoCard title="Delivery" value="3">
            <RoundIcon
              icon={PeopleIcon}
              iconColorClass="text-orange-500 dark:text-orange-100"
              bgColorClass="bg-orange-100 dark:bg-orange-500"
              className="mr-4"
            />
          </InfoCard>
        </div>

        <div className="cursor-pointer" onClick={() => setLink('pickup')}>
          <InfoCard title="Pickup" value="2">
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
      <Delivery query={query} response={scheduleList} />
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
    dispatch(deleteSchedule(id))
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
            <TableCell>Shipment ID</TableCell>
            <TableCell>Employee ID</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Status</TableCell>
            <TableCell className="text-center">Action</TableCell>
          </tr>
        </TableHeader>
        <TableBody>
          {dataTable.map((data, i) => (
            <TableRow key={i}>
              <TableCell>
                <span className="text-sm">{data.shipment_id}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm">{data.employee_id}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm">{`${new Date(
                  data.delivery_start_date,
                ).toLocaleDateString()} - ${new Date(
                  data.delivery_end_date,
                ).toLocaleDateString()}`}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm">{`${new Date(
                  data.pickup_start_date,
                ).toLocaleDateString()} ${new Date(
                  data.pickup_start_time,
                ).toLocaleTimeString()}`}</span>
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
                      to={`/app/employee/edit/${data.id}`}
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
  )
}

function Pickup() {}

export default Schedule
