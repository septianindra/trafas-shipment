import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit'
import { supabase } from '../supabase'

const date = new Date()
const year = date.getFullYear()
const month = date.getMonth()
const dt = date.getDate()
const shipment_date = String(year) + '-' + String(month) + '-' + String(dt)

const initialState = {
  shipmentList: [],
  shipmentListByTodayDate: [],
  shipmentListByStatusNotDone: [],
  shipmentListByStatusCollected: [],
  shipmentListByStatusDelivering: [],
  shipmentListStatus: 'idle',
  shipmentListError: null,
  shipmentListOrderByCreatedAt: [],
  shipmentListOrderByCreatedAtStatus: 'idle',
  shipmentListOrderByCreatedAtError: null,
  shipmentById: [],
  shipmentByIdStatus: 'idle',
  shipmentByIdError: null,
  createShipment: [],
  createShipmentStatus: 'idle',
  createShipmentError: null,
  shipmentDelete: [],
  shipmentDeleteStatus: 'idle',
  shipmentDeleteError: null,
  shipmentUpdate: [],
  shipmentUpdateStatus: 'idle',
  shipmentUpdateError: null,
}

export const fetchShipment = createAsyncThunk(
  'shipments/fetchShipment',
  async () => {
    const response = await supabase
      .from('shipments')
      .select()
      .order('shipment_date', { ascending: true })
    return response
  },
)

export const fetchShipmentOrderByCreatedAt = createAsyncThunk(
  'shipments/fetchShipmentOrderByCreatedAt',
  async () => {
    const response = await supabase
      .from('shipments')
      .select()
      .order('created_at', { ascending: false })
    return response
  },
)

export const fetchShipmentById = createAsyncThunk(
  'shipments/fetchShipmentById',
  async (id) => {
    const response = await supabase.from('shipments').select('*').eq('id', id)
    return response
  },
)

export const createNewShipment = createAsyncThunk(
  'shipments/createNewShipment',
  async (data) => {
    const response = await supabase.from('shipments').insert([data])
    return response
  },
)

export const deleteShipment = createAsyncThunk(
  'shipments/deleteShipment',
  async (id) => {
    await supabase.from('shipments').delete().match({ id: id })
    return id
  },
)

export const updateStatusShipment = createAsyncThunk(
  'shipments/updateStatusShipment',
  async (updatedData) => {
    const { data, error } = await supabase
      .from('shipments')
      .update({
        status: updatedData.status,
        recipient: updatedData.recipient,
        phone: updatedData.phone,
      })
      .eq('id', updatedData.id)
    console.log(data)
    return data
  },
)

export const updateShipment = createAsyncThunk(
  'shipments/updateShipment',
  async (updatedData) => {
    const { data, error } = await supabase
      .from('shipments')
      .update({
        transfer_no: updatedData.transfer_no,
        customer_name: updatedData.customer_name,
        shipment_address: updatedData.shipment_address,
        shipment_date: updatedData.shipment_date,
        pickup_date: updatedData.pickup_date,
        status: updatedData.status,
        recipient: updatedData.recipient,
        phone: updatedData.phone,
        product_list: updatedData.product_list,
      })
      .eq('id', updatedData.id)
    console.log(data)
    return data
  },
)

const shipmentsSlice = createSlice({
  name: 'shipments',
  initialState,
  reducers: {
    clearShipmentList: (state) => {
      state.shipmentList = []
    },
    clearShipmentListStatus: (state) => {
      state.shipmentListStatus = 'idle'
    },
    clearShipmentByIdData: (state) => {
      state.shipmentById = []
    },
    clearShipmentByIdStatus: (state) => {
      state.shipmentByIdStatus = 'idle'
    },
    clearShipmentDeleteStatus: (state) => {
      state.shipmentDeleteStatus = 'idle'
    },
    clearCreateShipmentStatus: (state) => {
      state.createShipmentStatus = 'idle'
    },
    clearShipmentUpdateStatus: (state) => {
      state.shipmentUpdateStatus = 'idle'
    },
    clearIdStatus: (state) => {
      state.idStatus = 'idle'
    },
  },
  extraReducers: {
    [fetchShipment.pending]: (state) => {
      state.shipmentListStatus = 'loading'
    },
    [fetchShipment.fulfilled]: (state, action) => {
      state.shipmentListStatus = 'succeeded'
      state.shipmentList = action.payload.data
      let filterNotDone = action.payload.data.filter(
        (data) => data.status !== 'done',
      )
      state.shipmentListByStatusNotDone = filterNotDone

      let filterStatusConfirmed = action.payload.data.filter(
        (data) => data.status === 'confirmed',
      )

      let filterTodayShipment = filterStatusConfirmed.filter(
        (data) =>
          new Date(String(data.shipment_date)).toDateString() ===
          new Date().toDateString(),
      )
      state.shipmentListByTodayDate = filterTodayShipment

      let filterStatusCollected = action.payload.data.filter(
        (data) => data.status === 'collected',
      )
      state.shipmentListByStatusCollected = filterStatusCollected
      let filterStatusDelivering = action.payload.data.filter(
        (data) => data.status === 'delivered',
      )
      state.shipmentListByStatusDelivering = filterStatusDelivering
    },
    [fetchShipment.rejected]: (state, action) => {
      state.shipmentListStatus = 'failed'
      state.shipmentListError = action.error.message
    },
    [fetchShipmentOrderByCreatedAt.pending]: (state, action) => {
      state.shipmentListOrderByCreatedAtStatus = 'loading'
    },
    [fetchShipmentOrderByCreatedAt.fulfilled]: (state, action) => {
      state.shipmentListOrderByCreatedAtStatus = 'succeeded'
      state.shipmentListOrderByCreatedAt = action.payload.data
    },
    [fetchShipmentOrderByCreatedAt.rejected]: (state, action) => {
      state.shipmentListOrderByCreatedAtStatus = 'failed'
      state.shipmentListOrderByCreatedAtError = action.error.message
    },
    [fetchShipmentById.pending]: (state) => {
      state.shipmentByIdStatus = 'loading'
    },
    [fetchShipmentById.fulfilled]: (state, action) => {
      state.shipmentByIdStatus = 'succeeded'
      state.shipmentById = action.payload.data[0]
    },
    [fetchShipmentById.rejected]: (state, action) => {
      state.shipmentByIdStatus = 'failed'
      state.shipmentByIdError = action.error.message
    },
    [createNewShipment.pending]: (state) => {
      state.createShipmentStatus = 'loading'
    },
    [createNewShipment.fulfilled]: (state, action) => {
      state.createShipmentStatus = 'succeeded'
      state.shipmentList = state.shipmentList.concat(action.payload.data[0])
      state.shipmentListOrderByCreatedAtStatus =
        state.shipmentListOrderByCreatedAtStatus.concat(action.payload.data[0])
    },
    [createNewShipment.rejected]: (state, action) => {
      state.createShipmentStatus = 'failed'
      state.createShipmentError = action.error.message
    },
    [deleteShipment.pending]: (state) => {
      state.shipmentDeleteStatus = 'loading'
    },
    [deleteShipment.fulfilled]: (state, action) => {
      state.shipmentDeleteStatus = 'succeeded'
      state.shipmentDelete = action.payload.data
      const array = current(state.shipmentList)
      // eslint-disable-next-line eqeqeq
      const temp = array.filter((element) => element.id != action.payload)
      state.shipmentList = temp

      const array2 = current(state.shipmentListOrderByCreatedAt)
      // eslint-disable-next-line eqeqeq
      const temp2 = array2.filter((element) => element.id != action.payload)
      state.shipmentListOrderByCreatedAt = temp2
    },
    [deleteShipment.rejected]: (state, action) => {
      state.shipmentDeleteStatus = 'failed'
      state.shipmentDeleteError = action.error.message
    },
    [updateShipment.pending]: (state) => {
      state.shipmentUpdateStatus = 'loading'
    },
    [updateShipment.fulfilled]: (state, action) => {
      state.shipmentUpdateStatus = 'succeeded'
      state.shipmentUpdate = action.payload.data
    },
    [updateShipment.rejected]: (state, action) => {
      state.shipmentUpdateStatus = 'failed'
      state.shipmentUpdateError = action.error.message
    },
  },
})

export const {
  clearShipmentList,
  clearShipmentByIdData,
  clearShipmentByIdStatus,
  clearShipmentDeleteStatus,
  clearCreateShipmentStatus,
  clearShipmentUpdateStatus,
  clearShipmentListStatus,
} = shipmentsSlice.actions

export default shipmentsSlice.reducer
