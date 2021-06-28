import React, { useEffect, useState } from 'react'
import PageTitle from '../components/Typography/PageTitle'
import { Input, HelperText, Label, Button, Select } from '@windmill/react-ui'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import toast, { Toaster, useToaster } from 'react-hot-toast'
import { FulfillingBouncingCircleSpinner } from 'react-epic-spinners'
import { Editor } from '@tinymce/tinymce-react'
import {
  clearCreateScheduleStatus,
  createNewSchedule,
} from '../app/schedulesSlice'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Fuse from 'fuse.js'
import { fetchShipment } from '../app/shipmentsSlice'
import { fetchEmployee } from '../app/employeesSlice'

function CreateSchedule() {
  const dispatch = useDispatch()
  const [dateRangeDelivery, setDateRangeDelivery] = useState([null, null])
  const [startDateDelivery, endDateDelivery] = dateRangeDelivery
  const [dateRangePickup, setDateRangePickup] = useState([null, null])
  const [startDatePickup, endDatePickup] = dateRangePickup

  const [startTimeDelivery, setStartTimeDelivery] = useState(new Date())
  const [endTimeDelivery, setEndTimeDelivery] = useState(new Date())
  const [startTimePickup, setStartTimePickup] = useState(new Date())
  const [endTimePickup, setEndTimePickup] = useState(new Date())

  const shipmentList = useSelector((state) => state.shipments.shipmentList)
  const shipmentListStatus = useSelector(
    (state) => state.shipments.shipmentListStatus,
  )

  useEffect(() => {
    if (shipmentListStatus === 'idle') {
      dispatch(fetchShipment())
    }
  }, [shipmentListStatus, dispatch])

  const employeeList = useSelector((state) => state.employees.employeeList)
  const employeeListStatus = useSelector(
    (state) => state.employees.employeeListStatus,
  )

  useEffect(() => {
    if (employeeListStatus === 'idle') {
      dispatch(fetchEmployee())
    }
  }, [employeeListStatus, dispatch])

  const [queryShipment, setQueryShipment] = useState('')
  const fuse = new Fuse(shipmentList, {
    keys: ['transfer_no', 'customer_name'],
  })
  const resultShipment = fuse.search(queryShipment)

  const createScheduleStatus = useSelector(
    (state) => state.schedules.createScheduleStatus,
  )

  const canSave = createScheduleStatus === 'idle'

  const {
    register,
    handleSubmit,
    reset,
    formState,
    formState: { errors },
    formState: { isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      name: '',
      role: '',
    },
  })

  const onSubmit = async (data) => {
    console.log(data)
    // if (canSave)
    //   try {
    //     const resultAction = await dispatch(createNewSchedule(data))
    //     unwrapResult(resultAction)
    //     if (resultAction.payload.error === null) {
    //       toast.success('Berhasil menambahkan data!')
    //     }
    //   } catch (error) {
    //     if (error) throw toast.error('Gagal menambahkan data!')
    //   } finally {
    //     dispatch(clearCreateScheduleStatus())
    //   }
  }

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        name: '',
        role: '',
      })
    }
  }, [formState, reset])

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          className: '',
          style: {
            marginTop: '90px',
            marginRight: '40px',
            background: '#363636',
            color: '#fff',
            zIndex: 1,
          },
          duration: 5000,
          success: {
            duration: 1000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
          error: {
            duration: 1000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
        }}
      />
      <PageTitle>Jadwal Pengiriman Baru</PageTitle>

      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 ">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6 mt-4 mb-4 sm:grid-cols-2 xl:grid-cols-2">
            <Label>
              <span>Shipment ID :</span>
              <Select className="mt-1">
                {shipmentList.map((data) => (
                  <option value={data.id}>{data.customer_name}</option>
                ))}
              </Select>
            </Label>
            <Label>
              <span>Nama Kurir</span>
              <Select className="mt-1">
                {employeeList.map((data) => (
                  <option value={data.id}>{data.name}</option>
                ))}
              </Select>
            </Label>
            <div>
              <span className="block text-sm text-gray-400 tracking-wide mb-2">
                Tanggal pengiriman barang
              </span>
              <DatePicker
                className="appearance-none text-sm text-gray-400 block w-full bg-gray-700 border border-gray-700 rounded p-2 leading-tight focus:outline-none focus:bg-gray-700 focus:bg-gray-700"
                selectsRange={true}
                startDate={startDateDelivery}
                endDate={endDateDelivery}
                onChange={(update) => {
                  setDateRangeDelivery(update)
                }}
                isClearable={true}
              />
              <span className="block text-sm text-gray-400 tracking-wide mt-2">
                Jam berangkat
              </span>
              <DatePicker
                className="appearance-none text-sm text-gray-400 block w-full bg-gray-700 border border-gray-700 rounded p-2 leading-tight focus:outline-none focus:bg-gray-700 focus:bg-gray-700"
                selected={startTimeDelivery}
                onChange={(date) => setStartTimeDelivery(date)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
              />
              <span className="block text-sm text-gray-400 tracking-wide mt-2">
                Jam kembali
              </span>
              <DatePicker
                className="appearance-none text-sm text-gray-400 block w-full bg-gray-700  border border-gray-700 rounded p-2 leading-tight focus:outline-none focus:bg-gray-700 focus:bg-gray-700"
                selected={endTimeDelivery}
                onChange={(date) => setEndTimeDelivery(date)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
              />
            </div>
            <div className="sm:mt-4 lg:mt-0">
              <span className="block text-sm text-gray-400 tracking-wide mb-2">
                Tanggal ambil barang
              </span>
              <DatePicker
                className="appearance-none block w-full bg-gray-700 text-sm text-gray-400 border border-gray-700 rounded p-2 leading-tight focus:outline-none focus:bg-gray-700 focus:bg-gray-700"
                selectsRange={true}
                startDate={startDatePickup}
                endDate={endDatePickup}
                onChange={(update) => {
                  setDateRangePickup(update)
                }}
                isClearable={true}
              />
              <span className="block text-sm text-gray-400 tracking-wide mt-2">
                Jam berangkat
              </span>
              <DatePicker
                className="appearance-none block w-full bg-gray-700 text-sm text-gray-400 border border-gray-700 rounded p-2 leading-tight focus:outline-none focus:bg-gray-700 focus:bg-gray-700"
                selected={startTimeDelivery}
                onChange={(date) => setStartTimeDelivery(date)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
              />
              <span className="block text-sm text-gray-400 tracking-wide mt-2">
                Jam kembali
              </span>
              <DatePicker
                className="appearance-none block w-full bg-gray-700 text-sm text-gray-400 border border-gray-700 rounded p-2 leading-tight focus:outline-none focus:bg-gray-700 focus:bg-gray-700"
                selected={endTimePickup}
                onChange={(date) => setEndTimePickup(date)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
              />
            </div>
          </div>
          <div className="flex justify-between mt-5">
            <div>
              <Button tag={Link} to="/app/shipment" size="small">
                Cancel
              </Button>
            </div>
            <div>
              {createScheduleStatus === 'loading' ? (
                <>
                  <FulfillingBouncingCircleSpinner size="20" />
                </>
              ) : (
                <Button type="submit" size="small">
                  Submit
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

export default CreateSchedule
