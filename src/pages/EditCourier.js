import React, { useEffect } from 'react'
import { useAuth } from '../contexts/Auth'
import { unwrapResult } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast, { Toaster } from 'react-hot-toast'
import { Label, Button, Select, Input } from '@windmill/react-ui'
import { FulfillingBouncingCircleSpinner } from 'react-epic-spinners'
import {
  updateDelivery,
  fetchDeliveryById,
  clearDeliveryUpdateStatus,
} from '../app/deliverysSlice'
import {
  updatePickup,
  fetchPickupById,
  clearPickupUpdateStatus,
} from '../app/pickupsSlice'
import { fetchEmployee } from '../app/employeesSlice'
import PageTitle from '../components/Typography/PageTitle'
import HtmlParser from 'react-html-parser'

function EditCourier() {
  const { user } = useAuth()
  const dispatch = useDispatch()
  const { link, id } = useParams('delivery')
  const employeeListByRoleCourier = useSelector(
    (state) => state.employees.employeeListByRoleCourier,
  )
  const employeeListByRoleLogistic = useSelector(
    (state) => state.employees.employeeListByRoleLogistic,
  )
  const employeeListStatus = useSelector(
    (state) => state.employees.employeeListStatus,
  )

  useEffect(() => {
    if (employeeListStatus === 'idle') {
      dispatch(fetchEmployee())
    }
  }, [employeeListStatus, dispatch])

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
      <PageTitle>Choose Employee</PageTitle>

      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 ">
        {link === 'delivery' ? (
          <EditDeliveryFrom
            id={id}
            employeeListByRoleCourier={employeeListByRoleCourier}
          />
        ) : (
          <EditPickupFrom
            id={id}
            employeeListByRoleCourier={employeeListByRoleCourier}
          />
        )}
      </div>
    </>
  )
}

function EditDeliveryFrom({ id, employeeListByRoleCourier }) {
  const dispatch = useDispatch()
  const deliveryById = useSelector((state) => state.deliverys.deliveryById)
  const deliveryByIdStatus = useSelector(
    (state) => state.deliverys.deliveryByIdStatus,
  )
  const deliveryUpdateStatus = useSelector(
    (state) => state.deliverys.deliveryUpdateStatus,
  )

  useEffect(() => {
    if (deliveryByIdStatus === 'idle') {
      dispatch(fetchDeliveryById(id))
    }
  }, [deliveryByIdStatus, dispatch])

  const canSave = deliveryUpdateStatus === 'idle'

  const onSubmit = async (data) => {
    if (canSave)
      try {
        data.id = id
        console.log(data)
        const resultAction = await dispatch(updateDelivery(data))
        unwrapResult(resultAction)
        if (resultAction.payload[0]) {
          toast.success('Berhasil menambahkan data!')
        }
      } catch (error) {
        if (error) throw toast.error('Gagal menambahkan data!')
      } finally {
        dispatch(clearDeliveryUpdateStatus())
      }
  }

  const {
    register,
    handleSubmit,
    reset,
    formState,
    formState: { isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      employee_id: '',
      date: '',
    },
  })
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Label>
        <span>Order Id</span>
        <div className="my-2 p-2 bg-gray-700 text-gray-500">
          {deliveryById?.orders?.id ?? ''}
        </div>
      </Label>
      <Label>
        <span>Customer Name</span>
        <div className="my-2 p-2 bg-gray-700 text-gray-500">
          {deliveryById?.orders?.customer_name ?? ''}
        </div>
      </Label>
      <Label>
        <span>Address</span>
        <div className="my-2 p-2 bg-gray-700 text-gray-500">
          {deliveryById?.orders?.customer_address ?? ''}
        </div>
      </Label>
      <Label>
        <span>Product list</span>
        <div className="my-2 p-2 bg-gray-700 text-gray-500">
          {HtmlParser(deliveryById?.orders?.product_list ?? '')}
        </div>
      </Label>
      <Label>
        <span>Choose employee</span>
        <Select className="mt-1" {...register('employee_id')}>
          <option disabled>select option</option>
          {employeeListByRoleCourier.map((data) => {
            return <option value={data.id}>{data.name}</option>
          })}
        </Select>
      </Label>
      <Label>
        <span>Date</span>
        <Input
          type="datetime-local"
          className="mt-1"
          {...register('date', { required: true })}
        />
      </Label>
      <div className="mt-4 float-right">
        {clearDeliveryUpdateStatus === 'loading' ? (
          <>
            <FulfillingBouncingCircleSpinner size="20" />
          </>
        ) : (
          <Button type="submit" size="small">
            Submit
          </Button>
        )}
      </div>
    </form>
  )
}

function EditPickupFrom({ id, employeeListByRoleCourier }) {
  const dispatch = useDispatch()
  const pickupById = useSelector((state) => state.pickups.pickupById)
  const pickupByIdStatus = useSelector(
    (state) => state.pickups.pickupByIdStatus,
  )
  const pickupUpdateStatus = useSelector(
    (state) => state.pickups.pickupUpdateStatus,
  )

  useEffect(() => {
    if (pickupByIdStatus === 'idle') {
      dispatch(fetchPickupById(id))
    }
  }, [pickupByIdStatus, dispatch])

  const canSave = pickupUpdateStatus === 'idle'

  const onSubmit = async (data) => {
    if (canSave)
      try {
        data.id = id
        const resultAction = await dispatch(updatePickup(data))
        unwrapResult(resultAction)
        if (resultAction.payload[0]) {
          toast.success('Berhasil menambahkan data!')
        }
      } catch (error) {
        if (error) throw toast.error('Gagal menambahkan data!')
      } finally {
        dispatch(clearPickupUpdateStatus())
      }
  }

  const {
    register,
    handleSubmit,
    reset,
    formState,
    formState: { isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      employee_id: '',
      date: '',
    },
  })
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Label>
        <span>Order Id</span>
        <div className="my-2 p-2 bg-gray-700 text-gray-500">
          {pickupById?.orders?.id ?? ''}
        </div>
      </Label>
      <Label>
        <span>Customer Name</span>
        <div className="my-2 p-2 bg-gray-700 text-gray-500">
          {pickupById?.orders?.customer_name ?? ''}
        </div>
      </Label>
      <Label>
        <span>Address</span>
        <div className="my-2 p-2 bg-gray-700 text-gray-500">
          {pickupById?.orders?.customer_address ?? ''}
        </div>
      </Label>
      <Label>
        <span>Product list</span>
        <div className="my-2 p-2 bg-gray-700 text-gray-500">
          {HtmlParser(pickupById?.orders?.product_list ?? '')}
        </div>
      </Label>
      <Label>
        <span>Choose employee</span>
        <Select className="mt-1" {...register('employee_id')}>
          <option disabled>select option</option>
          {employeeListByRoleCourier.map((data) => {
            return <option value={data.id}>{data.name}</option>
          })}
        </Select>
      </Label>
      <Label>
        <span>Date</span>
        <Input
          type="datetime-local"
          className="mt-1"
          {...register('date', { required: true })}
        />
      </Label>
      <div className="mt-4 float-right">
        {clearPickupUpdateStatus === 'loading' ? (
          <>
            <FulfillingBouncingCircleSpinner size="20" />
          </>
        ) : (
          <Button type="submit" size="small">
            Submit
          </Button>
        )}
      </div>
    </form>
  )
}

export default EditCourier
