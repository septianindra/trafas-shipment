import React, { useEffect, useState } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import PageTitle from '../components/Typography/PageTitle'
import { useParams, useHistory } from 'react-router-dom'
import { Card, CardBody, Input, Label, Button } from '@windmill/react-ui'
import { ChecklistIcon } from '../icons'
import { useDispatch, useSelector } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import {
  clearOrderListStatus,
  clearOrderUpdateStatus,
  updateOrder,
  updateProductList,
  updateStatusOrder,
} from '../app/ordersSlice'
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
import { clearPackageListStatus, fetchPackageById } from '../app/packagesSlice'
import { clearDeliveryListStatus } from '../app/deliverysSlice'
import { clearReturnListStatus } from '../app/returnsSlice'
import { clearPickupListStatus } from '../app/pickupsSlice'

function EditOrderStatus() {
  let history = useHistory()
  const dispatch = useDispatch()
  let { id } = useParams()
  const [statusValue, setStatusValue] = useState('')
  const orderById = useSelector((state) => state.orders.orderById)
  const orderByIdStatus = useSelector((state) => state.orders.orderByIdStatus)
  const orderUpdateStatus = useSelector(
    (state) => state.orders.orderUpdateStatus,
  )

  const packageListStatus = useSelector(
    (state) => state.packages.packageListStatus,
  )

  useEffect(() => {
    if (packageListStatus === 'succeeded') {
      dispatch(clearOrderListStatus())
      dispatch(clearPackageListStatus())
      dispatch(clearReturnListStatus())
      dispatch(clearDeliveryListStatus())
      dispatch(clearPickupListStatus())
    }
  }, [packageListStatus, dispatch])

  const deliveryListStatus = useSelector(
    (state) => state.deliverys.deliveryListStatus,
  )

  useEffect(() => {
    if (deliveryListStatus === 'succeeded') {
      dispatch(clearOrderListStatus())
      dispatch(clearPackageListStatus())
      dispatch(clearReturnListStatus())
      dispatch(clearDeliveryListStatus())
      dispatch(clearPickupListStatus())
    }
  }, [deliveryListStatus, dispatch])

  const pickupListStatus = useSelector(
    (state) => state.pickups.pickupListStatus,
  )

  useEffect(() => {
    if (pickupListStatus === 'succeeded') {
      dispatch(clearOrderListStatus())
      dispatch(clearPackageListStatus())
      dispatch(clearReturnListStatus())
      dispatch(clearDeliveryListStatus())
      dispatch(clearPickupListStatus())
    }
  }, [pickupListStatus, dispatch])

  const returnListStatus = useSelector(
    (state) => state.returns.returnListStatus,
  )

  useEffect(() => {
    if (returnListStatus === 'succeeded') {
      dispatch(clearOrderListStatus())
      dispatch(clearPackageListStatus())
      dispatch(clearReturnListStatus())
      dispatch(clearDeliveryListStatus())
      dispatch(clearPickupListStatus())
    }
  }, [returnListStatus, dispatch])

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      number: orderById.number,
      status: '',
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
      <PageTitle>
        <div className="flex justify-between">
          <div>Update Status</div>
        </div>
      </PageTitle>
      <SectionTitle>ID #{orderById.id}</SectionTitle>
      <hr className="mb-4" />

      <Card className="my-5 text-gray-300">
        <CardBody>
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
      {orderById.status === 'confirmed' || orderById.status === 'returned' ? (
        <FormEditProductList orderById={orderById} id={id} />
      ) : (
        <DetailOrder orderById={orderById} />
      )}
    </>
  )
}

function FormEditProductList({ orderById, id }) {
  const dispatch = useDispatch()
  const history = useHistory()
  const [product_list, setProduct_list] = useState('')

  const orderUpdateStatus = useSelector(
    (state) => state.orders.orderUpdateStatus,
  )

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      product_list: orderById.product_list,
    },
  })

  const canSave = orderUpdateStatus === 'idle'

  const onSubmit = async (data) => {
    if (canSave)
      try {
        data.id = id
        data.product_list = product_list
        const resultAction = await dispatch(updateProductList(data))
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
    <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 ">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6 mt-4 mb-4 md:grid-cols-2 xl:grid-cols-2">
          <Label>
            <span>SPB Number</span>
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
          <div className="my-2">
            <Editor
              apiKey="53pih1o4nmih8lqfxw6b8v8xk1og6bgrjww43pwbdgsf5668"
              initialValue={orderById.product_list}
              onEditorChange={(data) => setProduct_list(data)}
              init={{
                height: 500,
                menubar: false,

                plugins:
                  'print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons',
                imagetools_cors_hosts: ['picsum.photos'],
                menubar: 'file edit view insert format tools table help',
                toolbar:
                  'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
                toolbar_sticky: true,
                skin: 'oxide-dark',
                paste_data_images: true,
                content_style:
                  'body { font-family:Helvetica,Arial,sans-serif; font-size:14px; resize:vertical ; ',
              }}
            />
          </div>
        </Label>
        <Label>
          <span>Note</span>
          <div className="my-2 p-2 bg-gray-700 text-gray-300">
            {orderById.note}
          </div>
        </Label>
        {clearOrderUpdateStatus === 'loading' ? (
          <>
            <FulfillingBouncingCircleSpinner size="20" />
          </>
        ) : (
          <Button type="submit" size="small">
            Submit
          </Button>
        )}
      </form>
    </div>
  )
}

function DetailOrder({ orderById }) {
  return (
    <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 ">
      <div className="grid gap-6 mt-4 mb-4 md:grid-cols-2 xl:grid-cols-2"></div>

      <div className="grid gap-6 mt-4 mb-4 md:grid-cols-2 xl:grid-cols-2">
        <Label>
          <span>SPB Number</span>
          <div className="my-2 p-2 bg-gray-700 text-gray-300">
            {orderById.number}
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
  )
}
export default EditOrderStatus
