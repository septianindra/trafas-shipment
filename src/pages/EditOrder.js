import React, { useState, useEffect } from 'react'
import PageTitle from '../components/Typography/PageTitle'
import { Input, Textarea, Label, Button } from '@windmill/react-ui'
import { Link, useHistory, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import toast, { Toaster } from 'react-hot-toast'
import { FulfillingBouncingCircleSpinner } from 'react-epic-spinners'
import { Editor } from '@tinymce/tinymce-react'
import {
  clearOrderUpdateStatus,
  updateOrder,
  clearOrderListStatus,
  fetchOrderById,
} from '../app/ordersSlice'
import { clearPackageListStatus } from '../app/packagesSlice'
import { clearDeliveryListStatus } from '../app/deliverysSlice'
import ReactHtmlParser from 'react-html-parser'
import { useAuth } from '../contexts/Auth'

function EditOrder() {
  let history = useHistory()
  let { id } = useParams()
  const { user } = useAuth()
  const dispatch = useDispatch()
  const [product_list, setProduct_list] = useState('')

  const orderUpdateStatus = useSelector(
    (state) => state.orders.orderUpdateStatus,
  )
  const orderById = useSelector((state) => state.orders.orderById)
  const orderByIdStatus = useSelector((state) => state.orders.orderByIdStatus)
  const orderListStatus = useSelector((state) => state.orders.orderListStatus)

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      customer_name: orderById.customer_name,
      customer_address: orderById.customer_update,
      note: orderById.note,
    },
  })

  useEffect(() => {
    if (orderListStatus === 'succeeded') {
      dispatch(clearOrderListStatus())
      dispatch(clearPackageListStatus())
      dispatch(clearDeliveryListStatus())
    }
  }, [orderListStatus, dispatch])

  useEffect(() => {
    if (orderByIdStatus === 'idle') {
      dispatch(fetchOrderById(id))
    }
    reset({
      customer_name: orderById.customer_name,
      customer_address: orderById.customer_address,
      note: orderById.note,
    })
  }, [orderByIdStatus, dispatch])

  const canSave = orderUpdateStatus === 'idle'

  const onSubmit = async (data) => {
    if (canSave)
      try {
        data.id = id
        const resultAction = await dispatch(updateOrder(data))
        unwrapResult(resultAction)
        if (resultAction.payload[0]) {
          toast.success('Berhasil menambahkan data!')
        }
      } catch (error) {
        if (error) throw toast.error('Gagal menambahkan data!')
      } finally {
        dispatch(clearOrderUpdateStatus())
        history.push('/app')
      }
  }

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
      <PageTitle>Edit Order :{user.id}</PageTitle>

      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 ">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6 mt-4 mb-4 md:grid-cols-2 xl:grid-cols-2">
            <Label>
              <span>Customer name</span>
              <Input
                className="mt-1"
                {...register('customer_name', { required: true })}
              />
            </Label>
            <Label>
              <span>Address</span>
              <Input
                className="mt-1"
                {...register('customer_address', { required: true })}
              />
            </Label>
            <Label>
              <span>Delivery Date</span>
              <div className="my-2 p-2 bg-gray-700 text-gray-600">
                {orderById.delivery_date}
              </div>
            </Label>
            <Label>
              <span>Pick up Date</span>
              <div className="my-2 p-2 bg-gray-700 text-gray-600">
                {orderById.pickup_date}
              </div>
            </Label>
          </div>
          <Label>
            <span>Product List</span>
            <div className="my-2 p-2 bg-gray-700 text-gray-600">
              {ReactHtmlParser(orderById.product_list)}
            </div>
          </Label>
          <Label>
            <span>Note</span>
            <Textarea
              className="mt-1"
              {...register('note', { required: true })}
            />
          </Label>
          <div className="flex justify-between mt-5">
            <div>
              <Button tag={Link} to="/app/shipment" size="small">
                Cancel
              </Button>
            </div>
            <div>
              {clearOrderUpdateStatus === 'loading' ? (
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

export default EditOrder
