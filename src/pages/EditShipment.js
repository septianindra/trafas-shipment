import React, { useState, useEffect } from 'react'
import PageTitle from '../components/Typography/PageTitle'
import {
  Input,
  HelperText,
  Label,
  Button,
  Textarea,
  Select,
} from '@windmill/react-ui'
import { Link, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import toast, { Toaster, useToaster } from 'react-hot-toast'
import { FulfillingBouncingCircleSpinner } from 'react-epic-spinners'
import {
  clearCreateShipmentStatus,
  clearShipmentByIdStatus,
  clearShipmentList,
  clearShipmentListStatus,
  clearShipmentUpdateStatus,
  createNewShipment,
  fetchShipmentById,
  updateShipment,
} from '../app/shipmentsSlice'
import { Editor } from '@tinymce/tinymce-react'

function EditShipment() {
  let { id } = useParams()
  const dispatch = useDispatch()
  const [product_list, setProduct_list] = useState('')
  const shipmentById = useSelector((state) => state.shipments.shipmentById)
  const shipmentByIdStatus = useSelector(
    (state) => state.shipments.shipmentByIdStatus,
  )
  const shipmentUpdateStatus = useSelector(
    (state) => state.shipments.shipmentUpdateStatus,
  )
  const {
    register,
    handleSubmit,
    reset,
    formState,
    formState: { errors },
    formState: { isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      transfer_no: '',
      customer_name: '',
      shipment_address: '',
      shipment_date: '',
      pickup_date: '',
      status: '',
      product_list: '',
    },
  })

  useEffect(() => {
    if (shipmentByIdStatus === 'idle') {
      dispatch(fetchShipmentById(id))
    }
    reset({
      transfer_no: shipmentById.transfer_no,
      customer_name: shipmentById.customer_name,
      shipment_address: shipmentById.shipment_address,
      shipment_date: shipmentById.shipment_date,
      pickup_date: shipmentById.pickup_date,
      status: shipmentById.status,
      product_list: shipmentById.product_list,
    })
    setProduct_list(shipmentById.product_list)
  }, [shipmentByIdStatus, dispatch])

  const canSave = shipmentUpdateStatus === 'idle'

  const onSubmit = async (data) => {
    if (canSave)
      try {
        data.product_list = product_list
        data.id = id
        const resultAction = await dispatch(updateShipment(data))
        unwrapResult(resultAction)
        if (resultAction.payload !== null) {
          toast.success('Berhasil update data!')
        } else {
          toast.success('Gagal update data!')
        }
      } catch (error) {
        if (error) throw toast.error('Gagal update data!')
      } finally {
        dispatch(clearShipmentUpdateStatus())
      }
  }

  React.useEffect(() => {
    if (isSubmitSuccessful) {
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

      <PageTitle>Edit Shipment</PageTitle>
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 ">
        <div className="grid gap-6 mt-4 mb-4 md:grid-cols-2 xl:grid-cols-2"></div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6 mt-4 mb-4 md:grid-cols-2 xl:grid-cols-2">
            <Label>
              <span>Transfer no.:</span>
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
                <option value="order confirmed">Order confirmed</option>
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
                initialValue={shipmentById.product_list}
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
              {shipmentUpdateStatus === 'loading' ? (
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

export default EditShipment
