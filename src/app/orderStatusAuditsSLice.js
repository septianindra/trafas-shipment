import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit'
import { supabase } from '../supabase'

const initialState = {
  orderStatusAuditList: [],
  orderStatusAuditListStatus: 'idle',
  orderStatusAuditListError: null,
  orderStatusAuditById: [],
  orderStatusAuditByIdStatus: 'idle',
  orderStatusAuditByIdError: null,
  createOrderStatusAudit: [],
  createOrderStatusAuditStatus: 'idle',
  createOrderStatusAuditError: null,
  orderStatusAuditDelete: [],
  orderStatusAuditDeleteStatus: 'idle',
  orderStatusAuditDeleteError: null,
  orderStatusAuditUpdate: [],
  orderStatusAuditUpdateStatus: 'idle',
  orderStatusAuditUpdateError: null,
}

export const fetchOrderStatusAudit = createAsyncThunk(
  'orderStatusAudits/fetchOrderStatusAudit',
  async () => {
    const response = await supabase
      .from('order_status_audits')
      .select()
      .order('orderStatusAudit_date', { ascending: true })
    return response
  },
)

export const fetchOrderStatusAuditById = createAsyncThunk(
  'orderStatusAudits/fetchOrderStatusAuditById',
  async (id) => {
    const response = await supabase
      .from('order_status_audits')
      .select('*')
      .eq('order_id', id)
    return response
  },
)

export const createNewOrderStatusAudit = createAsyncThunk(
  'orderStatusAudits/createNewOrderStatusAudit',
  async (data) => {
    const response = await supabase.from('order_status_audits').insert([data])
    return response
  },
)

export const deleteOrderStatusAudit = createAsyncThunk(
  'orderStatusAudits/deleteOrderStatusAudit',
  async (id) => {
    await supabase.from('order_status_audits').delete().match({ id: id })
    return id
  },
)

export const updateOrderStatusAudit = createAsyncThunk(
  'orderStatusAudits/updateOrderStatusAudit',
  async (updatedData) => {
    const { data, error } = await supabase
      .from('order_status_audits')
      .update({
        orderStatusAudit_id: updatedData.orderStatusAudit_id,
        start_time: updatedData.start_time,
        end_time: updatedData.end_time,
      })
      .eq('id', updatedData.id)
    return data
  },
)

const orderStatusAuditsSlice = createSlice({
  name: 'orderStatusAudits',
  initialState,
  reducers: {
    clearOrderStatusAuditList: (state) => {
      state.orderStatusAuditList = []
    },
    clearOrderStatusAuditListStatus: (state) => {
      state.orderStatusAuditListStatus = 'idle'
    },
    clearOrderStatusAuditByIdData: (state) => {
      state.orderStatusAuditById = []
    },
    clearOrderStatusAuditByIdStatus: (state) => {
      state.orderStatusAuditByIdStatus = 'idle'
    },
    clearOrderStatusAuditDeleteStatus: (state) => {
      state.orderStatusAuditDeleteStatus = 'idle'
    },
    clearCreateOrderStatusAuditStatus: (state) => {
      state.createOrderStatusAuditStatus = 'idle'
    },
    clearOrderStatusAuditUpdateStatus: (state) => {
      state.orderStatusAuditUpdateStatus = 'idle'
    },
    clearIdStatus: (state) => {
      state.idStatus = 'idle'
    },
  },
  extraReducers: {
    [fetchOrderStatusAudit.pending]: (state) => {
      state.orderStatusAuditListStatus = 'loading'
    },
    [fetchOrderStatusAudit.fulfilled]: (state, action) => {
      state.orderStatusAuditListStatus = 'succeeded'
      state.orderStatusAuditList = state.orderStatusAuditList.concat(
        action.payload.data,
      )
    },
    [fetchOrderStatusAudit.rejected]: (state, action) => {
      state.orderStatusAuditListStatus = 'failed'
      state.orderStatusAuditListError = action.error.message
    },
    [fetchOrderStatusAuditById.pending]: (state) => {
      state.orderStatusAuditByIdStatus = 'loading'
    },
    [fetchOrderStatusAuditById.fulfilled]: (state, action) => {
      state.orderStatusAuditByIdStatus = 'succeeded'
      state.orderStatusAuditById = action.payload.data
    },
    [fetchOrderStatusAuditById.rejected]: (state, action) => {
      state.orderStatusAuditByIdStatus = 'failed'
      state.orderStatusAuditByIdError = action.error.message
    },
    [createNewOrderStatusAudit.pending]: (state) => {
      state.createOrderStatusAuditStatus = 'loading'
    },
    [createNewOrderStatusAudit.fulfilled]: (state, action) => {
      state.createOrderStatusAuditStatus = 'succeeded'
      state.orderStatusAuditList = state.orderStatusAuditList.concat(
        action.payload.data,
      )
    },
    [createNewOrderStatusAudit.rejected]: (state, action) => {
      state.createOrderStatusAuditStatus = 'failed'
      state.createOrderStatusAuditError = action.error.message
    },
    [deleteOrderStatusAudit.pending]: (state) => {
      state.orderStatusAuditDeleteStatus = 'loading'
    },
    [deleteOrderStatusAudit.fulfilled]: (state, action) => {
      state.orderStatusAuditDeleteStatus = 'succeeded'
      state.orderStatusAuditDelete = action.payload.data
      const array = current(state.orderStatusAuditList)
      // eslint-disable-next-line eqeqeq
      const temp = array.filter((element) => element.id != action.payload)
      state.orderStatusAuditList = temp
    },
    [deleteOrderStatusAudit.rejected]: (state, action) => {
      state.orderStatusAuditDeleteStatus = 'failed'
      state.orderStatusAuditDeleteError = action.error.message
    },
    [updateOrderStatusAudit.pending]: (state) => {
      state.orderStatusAuditUpdateStatus = 'loading'
    },
    [updateOrderStatusAudit.fulfilled]: (state, action) => {
      state.orderStatusAuditUpdateStatus = 'succeeded'
      state.orderStatusAuditUpdate = action.payload.data
    },
    [updateOrderStatusAudit.rejected]: (state, action) => {
      state.orderStatusAuditUpdateStatus = 'failed'
      state.orderStatusAuditUpdateError = action.error.message
    },
  },
})

export const {
  clearOrderStatusAuditList,
  clearOrderStatusAuditByIdData,
  clearOrderStatusAuditByIdStatus,
  clearOrderStatusAuditDeleteStatus,
  clearCreateOrderStatusAuditStatus,
  clearOrderStatusAuditUpdateStatus,
  clearOrderStatusAuditListStatus,
} = orderStatusAuditsSlice.actions

export default orderStatusAuditsSlice.reducer
