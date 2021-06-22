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
import { EditIcon, TrashIcon, SearchIcon } from '../icons'
import { useDispatch, useSelector } from 'react-redux'
import {
  clearShipmentByIdStatus,
  deleteShipment,
  fetchShipment,
} from '../app/shipmentsSlice'
import Fuse from 'fuse.js'
import {
  clearEmployeeByIdStatus,
  deleteEmployee,
  fetchEmployee,
} from '../app/employeesSlice'

function Employee() {
  const dispatch = useDispatch()
  const [query, setQuery] = useState('')
  const response = useSelector((state) => state.employees.employeeList)
  const fuse = new Fuse(response, { keys: ['name', 'role'] })
  const results = fuse.search(query)
  const employeeListStatus = useSelector(
    (state) => state.employees.employeeListStatus,
  )
  const employeeByIdStatus = useSelector(
    (state) => state.employees.employeeByIdStatus,
  )

  useEffect(() => {
    if (employeeByIdStatus === 'succeeded') {
      dispatch(clearEmployeeByIdStatus())
    }
  }, [employeeByIdStatus, dispatch])

  useEffect(() => {
    if (employeeListStatus === 'idle') {
      dispatch(fetchEmployee())
    }
  }, [employeeListStatus, dispatch])

  const [pageTable, setPageTable] = useState(1)

  const [dataTable, setDataTable] = useState([])

  const resultsPerPage = 7
  const totalResults = response.length

  function onPageChangeTable(p) {
    setPageTable(p)
  }

  function removeOrganization(id) {
    dispatch(deleteEmployee(id))
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
    <>
      <PageTitle>
        <div className="flex justify-between">
          <div>Employee list</div>
          <div className="float-right">
            <Button size="small" tag={Link} to="/app/employee/new">
              + new employee
            </Button>
          </div>
        </div>
      </PageTitle>
      <hr className="mb-4" />
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
      <TableContainer className="mb-8 ">
        <Table className=" w-full">
          <TableHeader>
            <tr>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell className="text-center">Action</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {dataTable.map((data, i) => (
              <TableRow key={i}>
                <TableCell>
                  <span className="text-sm">{data.name}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{data.role}</span>
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
    </>
  )
}

export default Employee
