import React, { useEffect, useState } from 'react'
import PageTitle from '../components/Typography/PageTitle'
import { Input, HelperText, Label, Button, Select } from '@windmill/react-ui'
import { Link, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import toast, { Toaster, useToaster } from 'react-hot-toast'
import { FulfillingBouncingCircleSpinner } from 'react-epic-spinners'
import { Editor } from '@tinymce/tinymce-react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Fuse from 'fuse.js'
import { clearShipmentListStatus, fetchShipment } from '../app/shipmentsSlice'
import { fetchEmployee } from '../app/employeesSlice'
import { data } from 'autoprefixer'
import {
  clearCreateDeliverieStatus,
  createNewDeliverie,
} from '../app/deliveriesSlice'
import { clearCreatePickupStatus, createNewPickup } from '../app/pickupsSlice'

function EditSchedule() {
  let { type } = useParams()
  const dispatch = useDispatch()
  const [shipmentStatus, setShipmentStatus] = useState('idle')
  const formType = type
  const shipmentListByStatusCollected = useSelector(
    (state) => state.shipments.shipmentListByStatusCollected,
  )
  const shipmentListByStatusDelivering = useSelector(
    (state) => state.shipments.shipmentListByStatusDelivering,
  )
  const employeeList = useSelector((state) => state.employees.employeeList)
  const employeeListStatus = useSelector(
    (state) => state.employees.employeeListStatus,
  )

  useEffect(() => {
    if (employeeListStatus === 'idle') {
      dispatch(fetchEmployee())
      dispatch(fetchShipment())
    }
  }, [employeeListStatus, dispatch])

  useEffect(() => {
    if (shipmentStatus === 'idle') {
      dispatch(clearShipmentListStatus())
      dispatch(fetchShipment())
      setShipmentStatus('succeeded')
    }
  }, [shipmentStatus, dispatch])

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
      {formType === 'delivery' ? (
        <DeliveryForm
          responses={shipmentListByStatusCollected}
          employees={employeeList}
        />
      ) : (
        <PickupForm
          responses={shipmentListByStatusDelivering}
          employees={employeeList}
        />
      )}
    </>
  )
}

function DeliveryForm({ responses, employees }) {
  const dispatch = useDispatch()
  const [dateRangeDelivery, setDateRangeDelivery] = useState([null, null])
  const [startDateDelivery, endDateDelivery] = dateRangeDelivery

  const [startTimeDelivery, setStartTimeDelivery] = useState(new Date())
  const [endTimeDelivery, setEndTimeDelivery] = useState(new Date())

  const createDeliverieStatus = useSelector(
    (state) => state.deliveries.createDeliverieStatus,
  )

  const canSave = createDeliverieStatus === 'idle'

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState,
    formState: { errors },
    formState: { isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      shipment_id: '',
      employee_id: '',
    },
  })

  const onSubmit = async (data) => {
    data.start_date = startDateDelivery
    data.end_date = endDateDelivery
    data.start_time = startTimeDelivery
    data.end_time = endTimeDelivery
    console.log(data)
    if (canSave)
      try {
        const resultAction = await dispatch(createNewDeliverie(data))
        unwrapResult(resultAction)
        if (resultAction.payload.error === null) {
          toast.success('Berhasil menambahkan data!')
        }
      } catch (error) {
        if (error) throw toast.error('Gagal menambahkan data!')
      } finally {
        dispatch(clearCreateDeliverieStatus())
      }
  }

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        shipment_id: '',
        employee_id: '',
      })
    }
  }, [formState, reset])
  return (
    <>
      <PageTitle>Edit Delivery Schedule</PageTitle>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 ">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6 mt-4 mb-4 sm:grid-cols-2 xl:grid-cols-2">
            <Label>
              <span>Shipment ID :</span>
              <Select
                className="mt-1"
                {...register('shipment_id', { required: true })}
              >
                <option disabled selected>
                  choose shipment
                </option>
                {responses.map((data, index) => (
                  <option key={index} value={data.id}>
                    {data.customer_name}
                  </option>
                ))}
              </Select>
            </Label>
            <Label>
              <span>Nama Kurir</span>
              <Select
                className="mt-1"
                {...register('employee_id', { required: true })}
              >
                <option disabled selected>
                  choose courier
                </option>
                {employees.map((data, index) => (
                  <option key={index} value={data.id}>
                    {data.name}
                  </option>
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
          </div>
          <div className="flex justify-between mt-5">
            <div>
              <Button tag={Link} to="/app/shipment" size="small">
                Cancel
              </Button>
            </div>
            <div>
              {createDeliverieStatus === 'loading' ? (
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

function PickupForm({ responses, employees }) {
  const dispatch = useDispatch()
  const [dateRangePickup, setDateRangePickup] = useState([null, null])
  const [startDatePickup, endDatePickup] = dateRangePickup

  const [startTimePickup, setStartTimePickup] = useState(new Date())
  const [endTimePickup, setEndTimePickup] = useState(new Date())

  const createPickupStatus = useSelector(
    (state) => state.pickups.createPickupStatus,
  )

  const canSave = createPickupStatus === 'idle'

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState,
    formState: { errors },
    formState: { isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      shipment_id: '',
      employee_id: '',
    },
  })

  const onSubmit = async (data) => {
    data.start_date = startDatePickup
    data.end_date = endDatePickup
    data.start_time = startTimePickup
    data.end_time = endTimePickup
    console.log(data)
    if (canSave)
      try {
        const resultAction = await dispatch(createNewPickup(data))
        unwrapResult(resultAction)
        if (resultAction.payload.error === null) {
          toast.success('Berhasil menambahkan data!')
        }
      } catch (error) {
        if (error) throw toast.error('Gagal menambahkan data!')
      } finally {
        dispatch(clearCreatePickupStatus())
      }
  }

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        shipment_id: '',
        employee_id: '',
      })
    }
  }, [formState, reset])
  return (
    <>
      <PageTitle>Edit Pickup Schedule </PageTitle>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 ">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6 mt-4 mb-4 sm:grid-cols-2 xl:grid-cols-2">
            <Label>
              <span>Shipment ID :</span>
              <Select
                className="mt-1"
                {...register('shipment_id', { required: true })}
              >
                <option disabled selected>
                  choose shipment
                </option>
                {responses.map((data, index) => (
                  <option key={index} value={data.id}>
                    {data.customer_name}
                  </option>
                ))}
              </Select>
            </Label>
            <Label>
              <span>Nama Kurir</span>
              <Select
                className="mt-1"
                {...register('employee_id', { required: true })}
              >
                <option disabled selected>
                  choose courier
                </option>
                {employees.map((data, index) => (
                  <option key={index} value={data.id}>
                    {data.name}
                  </option>
                ))}
              </Select>
            </Label>
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
                selected={startTimePickup}
                onChange={(date) => setStartTimePickup(date)}
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
              {createPickupStatus === 'loading' ? (
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

export default EditSchedule
