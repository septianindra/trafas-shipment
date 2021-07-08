import React, { useState, useEffect } from 'react'
import PageTitle from '../components/Typography/PageTitle'
import ReactHtmlParser, {
  processNodes,
  convertNodeToElement,
  htmlparser2,
} from 'react-html-parser'
import {
  Card,
  CardBody,
  Badge,
  Label,
  Button,
  Textarea,
  Input,
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
  clearShipmentListStatus,
  clearShipmentUpdateStatus,
  createNewShipment,
  fetchShipmentById,
  updateShipment,
} from '../app/shipmentsSlice'
import { Editor } from '@tinymce/tinymce-react'
import SectionTitle from '../components/Typography/SectionTitle'
import './pages.css'
import { useHistory } from 'react-router-dom'
import { HeartIcon } from '../icons'
import Tracking from '../components/Tracking'
import { fetchShipmentStatusAuditById } from '../app/shipmentStatusAuditsSlice'

function DetailShipment() {
  let history = useHistory()
  let { id } = useParams()
  const [status, setStatus] = useState('')
  const [query, setQuery] = useState('confirmed')
  const dispatch = useDispatch()
  const shipmentById = useSelector((state) => state.shipments.shipmentById)
  const shipmentByIdStatus = useSelector(
    (state) => state.shipments.shipmentByIdStatus,
  )
  const shipmentUpdateStatus = useSelector(
    (state) => state.shipments.shipmentUpdateStatus,
  )
  const shipmentStatusAuditById = useSelector(
    (state) => state.shipmentStatusAudits.shipmentStatusAuditById,
  )

  const statusChecked = [
    'confirmed',
    'collected',
    'delivering',
    'delivered',
    'pickup',
    'done',
  ]

  const {
    register,
    handleSubmit,
    reset,
    formState,
    formState: { errors },
    formState: { isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      recipient: shipmentById.recipient,
      phone: shipmentById.phone,
    },
  })

  useEffect(() => {
    switch (shipmentById.status) {
      case 'confirmed':
        setStatus('collected')
        break
      case 'collected':
        setStatus('delivering')
        break
      case 'delivering':
        setStatus('delivered')
        break
      case 'delivered':
        setStatus('pickup')
        break
      case 'pickup':
        setStatus('done')
        break
    }
  }, [shipmentById])

  useEffect(() => {
    if (shipmentByIdStatus === 'idle') {
      dispatch(fetchShipmentById(id))
    }
  }, [shipmentByIdStatus, dispatch])

  useEffect(() => {}, [])
  const canSave = shipmentUpdateStatus === 'idle'
  const onSubmit = async (data) => {
    if (canSave)
      try {
        data.id = id
        const resultAction = await dispatch(updateShipment(data))
        unwrapResult(resultAction)
        if (resultAction.payload.error === null) {
          toast.success('Berhasil update data!')
        }
      } catch (error) {
        if (error) throw toast.error('Gagal update data!')
      } finally {
        dispatch(clearShipmentByIdStatus())
        dispatch(clearShipmentUpdateStatus())
        reset({
          status: '',
        })
        history.push('/app')
      }
  }
  console.log(shipmentStatusAuditById)
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
          <div>Detail Shipment</div>
          <div>
            <Badge>{shipmentById.status}</Badge>
          </div>
        </div>
      </PageTitle>
      <SectionTitle>ID #{shipmentById.id}</SectionTitle>
      <hr />
      {shipmentById.status === 'done' ? (
        <div className="my-3"></div>
      ) : (
        <Card className="my-5 text-gray-300">
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Label>
                <span>Update Status</span>
                <Input
                  readOnly
                  className="mt-1"
                  value={status}
                  {...register('status', { required: true })}
                />
              </Label>
              {shipmentById.status === 'delivering' ? (
                <>
                  <Label>
                    <span>Recipient</span>
                    <Input className="mt-1" {...register('recipient')} />
                  </Label>
                  <Label>
                    <span>Phone</span>
                    <Input className="mt-1" {...register('phone')} />
                  </Label>
                </>
              ) : (
                <>
                  <Label>
                    <span>Recipient</span>
                    <Input
                      disabled
                      className="mt-1"
                      {...register('recipient')}
                    />
                  </Label>
                  <Label>
                    <span>Phone</span>
                    <Input disabled className="mt-1" {...register('phone')} />
                  </Label>
                </>
              )}
              <div className="my-5 float-right">
                {shipmentUpdateStatus === 'loading' ? (
                  <>
                    <FulfillingBouncingCircleSpinner size="20" />
                  </>
                ) : (
                  <Button type="submit" size="small">
                    Update
                  </Button>
                )}
              </div>
            </form>
          </CardBody>
        </Card>
      )}
      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 ">
        <div className="grid gap-6 mt-4 mb-4 md:grid-cols-2 xl:grid-cols-2"></div>

        <div className="grid gap-6 mt-4 mb-4 md:grid-cols-2 xl:grid-cols-2">
          <Label>
            <span>Transfer no.:</span>
            <div className="my-2 p-2 bg-gray-700 text-gray-300">
              {shipmentById.transfer_no}
            </div>
          </Label>
          <Label>
            <span>Customer Name</span>
            <div className="my-2 p-2 bg-gray-700 text-gray-300">
              {shipmentById.customer_name}
            </div>
          </Label>

          <Label className="col-span-2">
            <span>Address</span>
            <div className="my-2 p-2 bg-gray-700 text-gray-300">
              {shipmentById.shipment_address}
            </div>
          </Label>
          <Label>
            <span>Shipment Date</span>
            <div className="my-2 p-2 bg-gray-700 text-gray-300">
              {shipmentById.shipment_date}
            </div>
          </Label>

          <Label>
            <span>Pickup Date</span>
            <div className="my-2 p-2 bg-gray-700 text-gray-300">
              {shipmentById.pickup_date}
            </div>
          </Label>
        </div>

        <Label>
          <span>Product List</span>
          <div className="my-2 p-2 bg-gray-700 text-gray-300">
            {ReactHtmlParser(shipmentById.product_list)}
          </div>
        </Label>
        <Label>
          <span>Note</span>
          <div className="my-2 p-2 bg-gray-700 text-gray-300">
            {shipmentById.note}
          </div>
        </Label>
      </div>
    </>
  )
}

export default DetailShipment
