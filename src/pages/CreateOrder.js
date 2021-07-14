import React, { useState } from 'react'
import PageTitle from '../components/Typography/PageTitle'
import { Input, Textarea, Label, Button } from '@windmill/react-ui'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import toast, { Toaster } from 'react-hot-toast'
import { FulfillingBouncingCircleSpinner } from 'react-epic-spinners'
import { Editor } from '@tinymce/tinymce-react'
import { clearCreateOrderStatus, createNewOrder } from '../app/ordersSlice'
import { useAuth } from '../contexts/Auth'

function CreateOrder() {
  const { user } = useAuth()
  const dispatch = useDispatch()
  const [product_list, setProduct_list] = useState('')

  const createOrderStatus = useSelector(
    (state) => state.orders.createOrderStatus,
  )
  const canSave = createOrderStatus === 'idle'

  const {
    register,
    handleSubmit,
    reset,
    formState,
    formState: { isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      employee_id: user.id,
      customer_name: '',
      customer_address: '',
      delivery_date: '',
      pickup_date: '',
      product_list: '',
      status: 'confirmed',
      note: '',
    },
  })

  const onSubmit = async (data) => {
    if (canSave)
      try {
        data.product_list = product_list
        const resultAction = await dispatch(createNewOrder(data))
        unwrapResult(resultAction)
        if (resultAction.payload.error === null) {
          toast.success('Berhasil menambahkan data!')
        }
      } catch (error) {
        if (error) throw toast.error('Gagal menambahkan data!')
      } finally {
        dispatch(clearCreateOrderStatus())
      }
  }

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        employee_id: user.id,
        customer_name: '',
        customer_address: '',
        delivery_date: '',
        pickup_date: '',
        product_list: '',
        status: 'confirmed',
        note: '',
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
      <PageTitle>New Order :{user.id}</PageTitle>

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
              <span>Shipment Date</span>
              <Input
                className="mt-1"
                type="datetime-local"
                {...register('delivery_date', { required: true })}
              />
            </Label>
            <Label>
              <span>Pick Up Date</span>
              <Input
                className="mt-1"
                type="datetime-local"
                {...register('pickup_date', { required: true })}
              />
            </Label>
          </div>
          <Label>
            <span>Product List</span>
            <div className="my-2">
              <Editor
                apiKey="53pih1o4nmih8lqfxw6b8v8xk1og6bgrjww43pwbdgsf5668"
                onEditorChange={(data) => setProduct_list(data)}
                init={{
                  height: 500,
                  menubar: false,
                  plugins: [
                    'advlist autolink lists link image charmap print preview anchor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table paste code help wordcount',
                  ],
                  toolbar:
                    'undo redo | formatselect | ' +
                    'bold italic backcolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                  content_style:
                    'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                }}
              />
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
              {createOrderStatus === 'loading' ? (
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

export default CreateOrder