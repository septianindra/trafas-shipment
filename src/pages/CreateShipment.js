import React, { useEffect, useState } from 'react'
import PageTitle from '../components/Typography/PageTitle'
import { Input, HelperText, Label, Button, Select } from '@windmill/react-ui'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import toast, { Toaster, useToaster } from 'react-hot-toast'
import { FulfillingBouncingCircleSpinner } from 'react-epic-spinners'
import {
  clearCreateShipmentStatus,
  clearShipmentList,
  clearShipmentListStatus,
  createNewShipment,
  fetchShipment,
} from '../app/shipmentsSlice'
import { Editor } from '@tinymce/tinymce-react'
import { romanize } from 'react-roman'

function CreateShipment() {
  const dispatch = useDispatch()
  const [product_list, setProduct_list] = useState('')

  const shipmentList = useSelector((state) => state.shipments.shipmentList)
  const shipmentListStatus = useSelector(
    (state) => state.shipments.shipmentListStatus,
  )
  const createShipmentStatus = useSelector(
    (state) => state.shipments.createShipmentStatus,
  )
  const canSave = createShipmentStatus === 'idle'

  useEffect(() => {
    if (shipmentListStatus === 'idle') {
      dispatch(fetchShipment())
    }
  }, [shipmentListStatus, dispatch])

  Number.prototype.pad = function (size) {
    var s = String(this)
    while (s.length < (size || 2)) {
      s = '0' + s
    }
    return s
  }

  const date = new Date()
  const month = date.getMonth()
  const year = date.getFullYear()
  const setnumber =
    (shipmentList.length + 1).pad(4) + '/DO-MFS/' + romanize(month) + '/' + year

  const {
    register,
    handleSubmit,
    reset,
    formState,
    formState: { errors },
    formState: { isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      transfer_no: setnumber,
      customer_name: '',
      shipment_address: '',
      shipment_date: '',
      pickup_date: '',
      status: 'order confirmed',
      product_list: '',
    },
  })

  const onSubmit = async (data) => {
    if (canSave)
      try {
        data.product_list = product_list
        const resultAction = await dispatch(createNewShipment(data))
        unwrapResult(resultAction)
        if (resultAction.payload.error === null) {
          toast.success('Berhasil menambahkan data!')
        }
      } catch (error) {
        if (error) throw toast.error('Gagal menambahkan data!')
      } finally {
        dispatch(clearCreateShipmentStatus())
        dispatch(clearShipmentListStatus())
      }
  }

  React.useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        transfer_no: '',
        customer_name: '',
        shipment_address: '',
        shipment_date: '',
        pickup_date: '',
        status: 'order confirmed',
        product_list: '',
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
      <PageTitle>New Shipment</PageTitle>

      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 ">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6 mt-4 mb-4 md:grid-cols-2 xl:grid-cols-2">
            <Label>
              <span>Set no.:</span>
              <Input
                className="mt-1"
                {...register('transfer_no', { required: true })}
              />
            </Label>
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
                {...register('shipment_address', { required: true })}
              />
            </Label>
            <Label>
              <span>Shipment Date</span>
              <Input
                className="mt-1"
                type="datetime-local"
                {...register('shipment_date', { required: true })}
              />
            </Label>
            <Label>
              <span>Status</span>
              <Select
                className="mt-1"
                {...register('status', { required: true })}
              >
                <option value="confirmed">Order confirmed</option>
              </Select>
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
          <div className="flex justify-between mt-5">
            <div>
              <Button tag={Link} to="/app/shipment" size="small">
                Cancel
              </Button>
            </div>
            <div>
              {createShipmentStatus === 'loading' ? (
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

export default CreateShipment
