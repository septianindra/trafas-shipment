import React, { useEffect } from 'react'
import { useAuth } from '../contexts/Auth'
import { unwrapResult } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast, { Toaster } from 'react-hot-toast'
import { Label, Button, Select } from '@windmill/react-ui'
import { FulfillingBouncingCircleSpinner } from 'react-epic-spinners'
import {
  updatePackage,
  fetchPackageById,
  clearPackageUpdateStatus,
} from '../app/packagesSlice'
import {
  updateReturn,
  fetchReturnById,
  clearReturnUpdateStatus,
} from '../app/returnsSlice'
import { fetchEmployee } from '../app/employeesSlice'
import PageTitle from '../components/Typography/PageTitle'
import HtmlParser from 'react-html-parser'

function EditLogistic() {
  const { user } = useAuth()
  const dispatch = useDispatch()
  const { link, id } = useParams('package')
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
        {link === 'package' ? (
          <EditPackageFrom
            id={id}
            employeeListByRoleCourier={employeeListByRoleCourier}
            employeeListByRoleLogistic={employeeListByRoleLogistic}
          />
        ) : (
          <EditReturnFrom
            id={id}
            employeeListByRoleCourier={employeeListByRoleCourier}
            employeeListByRoleLogistic={employeeListByRoleLogistic}
          />
        )}
      </div>
    </>
  )
}

function EditPackageFrom({
  id,
  employeeListByRoleCourier,
  employeeListByRoleLogistic,
}) {
  const dispatch = useDispatch()
  const packageById = useSelector((state) => state.packages.packageById)
  const packageByIdStatus = useSelector(
    (state) => state.packages.packageByIdStatus,
  )
  const packageUpdateStatus = useSelector(
    (state) => state.packages.packageUpdateStatus,
  )

  useEffect(() => {
    if (packageByIdStatus === 'idle') {
      dispatch(fetchPackageById(id))
    }
  }, [packageByIdStatus, dispatch])

  const canSave = packageUpdateStatus === 'idle'

  const onSubmit = async (data) => {
    if (canSave)
      try {
        data.id = id
        const resultAction = await dispatch(updatePackage(data))
        unwrapResult(resultAction)
        if (resultAction.payload[0]) {
          toast.success('Berhasil menambahkan data!')
        }
      } catch (error) {
        if (error) throw toast.error('Gagal menambahkan data!')
      } finally {
        dispatch(clearPackageUpdateStatus())
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
    },
  })
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Label>
        <span>Order Id</span>
        <div className="my-2 p-2 bg-gray-700 text-gray-500">
          {packageById?.orders?.id ?? ''}
        </div>
      </Label>
      <Label>
        <span>Customer Name</span>
        <div className="my-2 p-2 bg-gray-700 text-gray-500">
          {packageById?.orders?.customer_name ?? ''}
        </div>
      </Label>
      <Label>
        <span>Address</span>
        <div className="my-2 p-2 bg-gray-700 text-gray-500">
          {packageById?.orders?.customer_address ?? ''}
        </div>
      </Label>
      <Label>
        <span>Order Id</span>
        <div className="my-2 p-2 bg-gray-700 text-gray-500">
          {HtmlParser(packageById?.orders?.product_list ?? '')}
        </div>
      </Label>
      <Label>
        <span>Choose employee</span>
        <Select className="mt-1" {...register('employee_id')}>
          <option disabled>select option</option>
          {employeeListByRoleLogistic.map((data) => {
            return <option value={data.id}>{data.name}</option>
          })}
        </Select>
      </Label>
      <div className="mt-4 float-right">
        {clearPackageUpdateStatus === 'loading' ? (
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

function EditReturnFrom() {
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    reset,
    formState,
    formState: { isSubmitSuccessful },
  } = useForm({
    defaultValues: {
      employee_id: '',
    },
  })
  return <form></form>
}

export default EditLogistic
