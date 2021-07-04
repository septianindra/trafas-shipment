import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit'
import { supabase } from '../supabase'

const initialState = {
  shipmentStatusAuditList: [],
  shipmentStatusAuditListStatus: 'idle',
  shipmentStatusAuditListError: null,
  shipmentStatusAuditById: [],
  shipmentStatusAuditByIdStatus: 'idle',
  shipmentStatusAuditByIdError: null,
  createShipmentStatusAudit: [],
  createShipmentStatusAuditStatus: 'idle',
  createShipmentStatusAuditError: null,
  shipmentStatusAuditDelete: [],
  shipmentStatusAuditDeleteStatus: 'idle',
  shipmentStatusAuditDeleteError: null,
  shipmentStatusAuditUpdate: [],
  shipmentStatusAuditUpdateStatus: 'idle',
  shipmentStatusAuditUpdateError: null,
}

export const fetchShipmentStatusAudit = createAsyncThunk(
  'shipmentStatusAudits/fetchShipmentStatusAudit',
  async () => {
    const response = await supabase
      .from('shipment_status_audits')
      .select()
      .order('shipmentStatusAudit_date', { ascending: true })
    return response
  },
)

export const fetchShipmentStatusAuditById = createAsyncThunk(
  'shipmentStatusAudits/fetchShipmentStatusAuditById',
  async (id) => {
    const response = await supabase
      .from('shipment_status_audits')
      .select('*')
      .eq('shipment_id', id)
    return response
  },
)

export const createNewShipmentStatusAudit = createAsyncThunk(
  'shipmentStatusAudits/createNewShipmentStatusAudit',
  async (data) => {
    const response = await supabase
      .from('shipment_status_audits')
      .insert([data])
    return response
  },
)

export const deleteShipmentStatusAudit = createAsyncThunk(
  'shipmentStatusAudits/deleteShipmentStatusAudit',
  async (id) => {
    await supabase.from('shipment_status_audits').delete().match({ id: id })
    return id
  },
)

export const updateShipmentStatusAudit = createAsyncThunk(
  'shipmentStatusAudits/updateShipmentStatusAudit',
  async (updatedData) => {
    const { data, error } = await supabase
      .from('shipment_status_audits')
      .update({
        shipmentStatusAudit_id: updatedData.shipmentStatusAudit_id,
        start_time: updatedData.start_time,
        end_time: updatedData.end_time,
      })
      .eq('id', updatedData.id)
    return data
  },
)

const shipmentStatusAuditsSlice = createSlice({
  name: 'shipmentStatusAudits',
  initialState,
  reducers: {
    clearShipmentStatusAuditList: (state) => {
      state.shipmentStatusAuditList = []
    },
    clearShipmentStatusAuditListStatus: (state) => {
      state.shipmentStatusAuditListStatus = 'idle'
    },
    clearShipmentStatusAuditByIdData: (state) => {
      state.shipmentStatusAuditById = []
    },
    clearShipmentStatusAuditByIdStatus: (state) => {
      state.shipmentStatusAuditByIdStatus = 'idle'
    },
    clearShipmentStatusAuditDeleteStatus: (state) => {
      state.shipmentStatusAuditDeleteStatus = 'idle'
    },
    clearCreateShipmentStatusAuditStatus: (state) => {
      state.createShipmentStatusAuditStatus = 'idle'
    },
    clearShipmentStatusAuditUpdateStatus: (state) => {
      state.shipmentStatusAuditUpdateStatus = 'idle'
    },
    clearIdStatus: (state) => {
      state.idStatus = 'idle'
    },
  },
  extraReducers: {
    [fetchShipmentStatusAudit.pending]: (state) => {
      state.shipmentStatusAuditListStatus = 'loading'
    },
    [fetchShipmentStatusAudit.fulfilled]: (state, action) => {
      state.shipmentStatusAuditListStatus = 'succeeded'
      state.shipmentStatusAuditList = state.shipmentStatusAuditList.concat(
        action.payload.data,
      )
    },
    [fetchShipmentStatusAudit.rejected]: (state, action) => {
      state.shipmentStatusAuditListStatus = 'failed'
      state.shipmentStatusAuditListError = action.error.message
    },
    [fetchShipmentStatusAuditById.pending]: (state) => {
      state.shipmentStatusAuditByIdStatus = 'loading'
    },
    [fetchShipmentStatusAuditById.fulfilled]: (state, action) => {
      state.shipmentStatusAuditByIdStatus = 'succeeded'
      state.shipmentStatusAuditById = action.payload.data
    },
    [fetchShipmentStatusAuditById.rejected]: (state, action) => {
      state.shipmentStatusAuditByIdStatus = 'failed'
      state.shipmentStatusAuditByIdError = action.error.message
    },
    [createNewShipmentStatusAudit.pending]: (state) => {
      state.createShipmentStatusAuditStatus = 'loading'
    },
    [createNewShipmentStatusAudit.fulfilled]: (state, action) => {
      state.createShipmentStatusAuditStatus = 'succeeded'
      state.shipmentStatusAuditList = state.shipmentStatusAuditList.concat(
        action.payload.data,
      )
    },
    [createNewShipmentStatusAudit.rejected]: (state, action) => {
      state.createShipmentStatusAuditStatus = 'failed'
      state.createShipmentStatusAuditError = action.error.message
    },
    [deleteShipmentStatusAudit.pending]: (state) => {
      state.shipmentStatusAuditDeleteStatus = 'loading'
    },
    [deleteShipmentStatusAudit.fulfilled]: (state, action) => {
      state.shipmentStatusAuditDeleteStatus = 'succeeded'
      state.shipmentStatusAuditDelete = action.payload.data
      const array = current(state.shipmentStatusAuditList)
      // eslint-disable-next-line eqeqeq
      const temp = array.filter((element) => element.id != action.payload)
      state.shipmentStatusAuditList = temp
    },
    [deleteShipmentStatusAudit.rejected]: (state, action) => {
      state.shipmentStatusAuditDeleteStatus = 'failed'
      state.shipmentStatusAuditDeleteError = action.error.message
    },
    [updateShipmentStatusAudit.pending]: (state) => {
      state.shipmentStatusAuditUpdateStatus = 'loading'
    },
    [updateShipmentStatusAudit.fulfilled]: (state, action) => {
      state.shipmentStatusAuditUpdateStatus = 'succeeded'
      state.shipmentStatusAuditUpdate = action.payload.data
    },
    [updateShipmentStatusAudit.rejected]: (state, action) => {
      state.shipmentStatusAuditUpdateStatus = 'failed'
      state.shipmentStatusAuditUpdateError = action.error.message
    },
  },
})

export const {
  clearShipmentStatusAuditList,
  clearShipmentStatusAuditByIdData,
  clearShipmentStatusAuditByIdStatus,
  clearShipmentStatusAuditDeleteStatus,
  clearCreateShipmentStatusAuditStatus,
  clearShipmentStatusAuditUpdateStatus,
  clearShipmentStatusAuditListStatus,
} = shipmentStatusAuditsSlice.actions

export default shipmentStatusAuditsSlice.reducer
