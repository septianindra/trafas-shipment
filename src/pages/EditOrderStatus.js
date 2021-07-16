import React, { useEffect, useState } from 'react'
import PageTitle from '../components/Typography/PageTitle'
import { useParams } from 'react-router-dom'
import { Card, CardBody, Input, Label, Button } from '@windmill/react-ui'
import { ChecklistIcon } from '../icons'
import { useDispatch, useSelector } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import { clearOrderUpdateStatus, updateStatusOrder } from '../app/ordersSlice'
import toast, { Toaster } from 'react-hot-toast'
import SectionTitle from '../components/Typography/SectionTitle'
import { fetchOrderById, clearOrderByIdStatus } from '../app/ordersSlice'
import './pages.css'
import {
  fetchOrderStatusAuditById,
  clearOrderStatusAuditByIdStatus,
} from '../app/orderStatusAuditsSLice'
import ReactHtmlParser from 'react-html-parser'
import { useForm } from 'react-hook-form'
import { FulfillingBouncingCircleSpinner } from 'react-epic-spinners'

function EditOrderStatus() {
  const dispatch = useDispatch()
  let { id } = useParams()
  const [statusValue, setStatusValue] = useState('')
  const orderById = useSelector((state) => state.orders.orderById)
  const orderByIdStatus = useSelector((state) => state.orders.orderByIdStatus)
  const orderUpdateStatus = useSelector(
    (state) => state.orders.orderUpdateStatus,
  )

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      number: orderById.number,
      status: statusValue,
      recipient_name: orderById.recipient_name,
      recipient_phone: orderById.recipient_phone,
    },
  })

  useEffect(() => {
    if (orderByIdStatus === 'idle') {
      dispatch(fetchOrderById(id))
    }
  }, [orderByIdStatus, dispatch])

  useEffect(() => {
    switch (orderById.status) {
      case 'confirmed':
        reset({
          status: 'collected',
        })
        break
      case 'collected':
        reset({
          status: 'delivered',
        })
        break
      case 'delivered':
        reset({
          status: 'returned',
        })
        break
      case 'returned':
        reset({
          status: 'done',
        })
        break
    }
  }, [orderById])

  const orderStatusAuditById = useSelector(
    (state) => state.orderStatusAudits.orderStatusAuditById,
  )
  const orderStatusAuditByIdStatus = useSelector(
    (state) => state.orderStatusAudits.orderStatusAuditByIdStatus,
  )

  const status = ['collected', 'delivered', 'returned', 'done']

  useEffect(() => {
    if (orderStatusAuditByIdStatus === 'idle') {
      dispatch(fetchOrderStatusAuditById(id))
    }
  }, [orderStatusAuditByIdStatus, dispatch])

  const canSave = orderUpdateStatus === 'idle'

  const onSubmit = async (data) => {
    if (canSave)
      try {
        data.id = id
        const resultAction = await dispatch(updateStatusOrder(data))
        unwrapResult(resultAction)
        if (resultAction.payload[0]) {
          toast.success('Berhasil menambahkan data!')
        }
      } catch (error) {
        if (error) throw toast.error('Gagal menambahkan data!')
      } finally {
        dispatch(clearOrderUpdateStatus())
        dispatch(clearOrderStatusAuditByIdStatus())
        dispatch(clearOrderByIdStatus())
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
      <PageTitle>
        <div className="flex justify-between">
          <div>Edit Order</div>
        </div>
      </PageTitle>
      <SectionTitle>
        ID #{orderStatusAuditById[0] ? orderStatusAuditById[0].order_id : ''}
      </SectionTitle>
      <hr className="mb-4" />

      <Card className="my-5 text-gray-300">
        <CardBody>
          <div>{statusValue}</div>
          <div className="track">
            {status.map((data) => (
              <div
                className={
                  orderStatusAuditById.some((e) => e.status === data)
                    ? 'step active'
                    : 'step'
                }
              >
                <span className="icon">
                  <i className="flex justify-center p-1">
                    <ChecklistIcon className="self-center" />
                  </i>
                </span>
                <span className="text">{data}</span>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {orderById.status === 'done' ? (
        ''
      ) : (
        <Card className="my-4 text-gray-300">
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-6 mt-4 mb-4 md:grid-cols-1 xl:grid-cols-2">
                {orderById.status === 'confirmed' ? (
                  <>
                    <Label>
                      <span>SPB number</span>
                      <Input
                        className="mt-1"
                        {...register('number', { required: true })}
                      />
                    </Label>
                    <Label>
                      <span>Update status</span>
                      <Input
                        readOnly
                        className="mt-1"
                        {...register('status', { required: true })}
                      />
                    </Label>
                  </>
                ) : orderById.status === 'collected' ? (
                  <>
                    <Label>
                      <span>Update status</span>
                      <Input
                        readOnly
                        className="mt-1"
                        {...register('status', { required: true })}
                      />
                    </Label>
                    <Label>
                      <span>Recipinet name</span>
                      <Input
                        className="mt-1"
                        {...register('recipient_name', { required: true })}
                      />
                    </Label>
                    <Label>
                      <span>Recipinet phone</span>
                      <Input
                        className="mt-1"
                        {...register('recipient_phone', { required: true })}
                      />
                    </Label>
                  </>
                ) : (
                  <Label>
                    <span>Update status</span>
                    <Input
                      readOnly
                      className="mt-1"
                      {...register('status', { required: true })}
                    />
                  </Label>
                )}
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
            </form>
          </CardBody>
        </Card>
      )}

      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 ">
        <div className="grid gap-6 mt-4 mb-4 md:grid-cols-2 xl:grid-cols-2">
          <Label>
            <span>Delivery Number</span>
            <div className="my-2 p-2 bg-gray-700 text-gray-300">
              {orderById.number ?? '‎‎‏‏‎ ‎'}
            </div>
          </Label>
          <Label>
            <span>Customer Name</span>
            <div className="my-2 p-2 bg-gray-700 text-gray-300">
              {orderById.customer_name}
            </div>
          </Label>
          <Label className="col-span-2">
            <span>Address</span>
            <div className="my-2 p-2 bg-gray-700 text-gray-300">
              {orderById.customer_address}
            </div>
          </Label>
          <Label>
            <span>Delivery Date</span>
            <div className="my-2 p-2 bg-gray-700 text-gray-300">
              {orderById.delivery_date}
            </div>
          </Label>

          <Label>
            <span>Pickup Date</span>
            <div className="my-2 p-2 bg-gray-700 text-gray-300">
              {orderById.pickup_date}
            </div>
          </Label>
        </div>

        <Label>
          <span>Product List</span>
          <div className="my-2 p-2 bg-gray-700 text-gray-300">
            {ReactHtmlParser(orderById.product_list)}
          </div>
        </Label>
        <Label>
          <span>Note</span>
          <div className="my-2 p-2 bg-gray-700 text-gray-300">
            {orderById.note}
          </div>
        </Label>
      </div>
    </>
  )
}

export default EditOrderStatus
