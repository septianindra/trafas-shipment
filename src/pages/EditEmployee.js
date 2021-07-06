import React, { useEffect, useState } from 'react'
import PageTitle from '../components/Typography/PageTitle'
import { Input, HelperText, Label, Button, Select } from '@windmill/react-ui'
import { Link, useParams } from 'react-router-dom'
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
  updateShipment,
} from '../app/shipmentsSlice'
import { Editor } from '@tinymce/tinymce-react'
import {
  clearCreateEmployeeStatus,
  clearEmployeeUpdateStatus,
  createNewEmployee,
  fetchEmployeeById,
  updateEmployee,
} from '../app/employeesSlice'

function EditEmployee() {
  let { id } = useParams()
  const dispatch = useDispatch()
  const employeeById = useSelector((state) => state.employees.employeeById)
  const employeeByIdStatus = useSelector(
    (state) => state.employees.employeeByIdStatus,
  )
  const employeesUpdateStatus = useSelector(
    (state) => state.employees.employeeUpdateStatus,
  )

  const canSave = employeesUpdateStatus === 'idle'

  const {
    register,
    handleSubmit,
    reset,
    formState,
    formState: { errors },
    formState: { isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      name: '',
      role: '',
    },
  })

  useEffect(() => {
    if (employeeByIdStatus === 'idle') {
      dispatch(fetchEmployeeById(id))
    }
    reset({
      name: employeeById.name,
      role: employeeById.role,
    })
  }, [employeeByIdStatus, dispatch])

  const onSubmit = async (data) => {
    if (canSave)
      try {
        data.id = id
        const resultAction = await dispatch(updateEmployee(data))
        unwrapResult(resultAction)
        if (resultAction.payload !== null) {
          toast.success('Berhasil menambahkan data!')
        }
      } catch (error) {
        if (error) throw toast.error('Gagal menambahkan data!')
      } finally {
        dispatch(clearEmployeeUpdateStatus())
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
      <PageTitle>New Employee</PageTitle>

      <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 ">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6 mt-4 mb-4 md:grid-cols-2 xl:grid-cols-2">
            <Label>
              <span>Name :</span>
              <Input
                className="mt-1"
                {...register('name', { required: true })}
              />
            </Label>
            <Label>
              <span>Role</span>
              <Select
                className="mt-1"
                {...register('role', { required: true })}
              >
                <option value="admin">Administrator</option>
                <option value="admin-logistic">Admin Logistic</option>
                <option value="admin-courier">Admin Courier</option>
                <option value="admin-marketing">Admin Marketing</option>
                <option value="staff-logistic">Staff Logistic</option>
                <option value="staff-courier">Staff Courier</option>
                <option value="staff-marketing">Staff Marketing</option>
              </Select>
            </Label>
          </div>
          <div className="flex justify-between mt-5">
            <div>
              <Button tag={Link} to="/app/shipment" size="small">
                Cancel
              </Button>
            </div>
            <div>
              {employeesUpdateStatus === 'loading' ? (
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

export default EditEmployee
