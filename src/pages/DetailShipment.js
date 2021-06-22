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

import { HeartIcon } from '../icons'
import Tracking from '../components/Tracking'
import { fetchShipmentStatusAuditById } from '../app/shipmentStatusAuditsSlice'

function DetailShipment(url) {
  let { id } = useParams()
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
  const shipmentStatusAuditByIdStatus = useSelector(
    (status) => status.shipmentStatusAudits.shipmentStatusAuditByIdStatus,
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
    defaultValues: {},
  })

  useEffect(() => {
    if (shipmentByIdStatus === 'idle') {
      dispatch(fetchShipmentById(id))
      dispatch(fetchShipmentStatusAuditById(id))
    }
  }, [shipmentByIdStatus, dispatch])

  // useEffect(() => {
  //   if (shipmentStatusAuditByIdStatus === 'idle') {
  //     dispatch(fetchShipmentById(id))
  //     dispatch(fetchShipmentStatusAuditById(id))
  //   }
  // }, [shipmentStatusAuditByIdStatus, dispatch])

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
                  className="mt-1"
                  value={
                    shipmentById.status === 'confirmed'
                      ? 'collected'
                      : shipmentById.status === 'collected'
                      ? 'delivering'
                      : shipmentById.status === 'delivering'
                      ? 'delivered'
                      : shipmentById.status === 'delivered'
                      ? 'pickup'
                      : 'done'
                  }
                  {...register('status', { required: true })}
                />
              </Label>
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
        {/* <div className="flex justify-between mt-5">
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
        </div> */}
      </div>
    </>
  )
}

export default DetailShipment
