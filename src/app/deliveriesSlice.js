import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit'
import { supabase } from '../supabase'

const initialState = {
  deliverieList: [],
  deliverieListStatus: 'idle',
  deliverieListError: null,
  deliverieById: [],
  deliverieByIdStatus: 'idle',
  deliverieByIdError: null,
  createDeliverie: [],
  createDeliverieStatus: 'idle',
  createDeliverieError: null,
  deliverieDelete: [],
  deliverieDeleteStatus: 'idle',
  deliverieDeleteError: null,
  deliverieUpdate: [],
  deliverieUpdateStatus: 'idle',
  deliverieUpdateError: null,
}

export const fetchDeliverie = createAsyncThunk(
  'deliveries/fetchDeliverie',
  async () => {
    const response = await supabase.from('schedules_delivery').select()
    return response
  },
)

export const fetchDeliverieById = createAsyncThunk(
  'deliveries/fetchDeliverieById',
  async (id) => {
    const response = await supabase
      .from('schedules_delivery')
      .select('*')
      .eq('id', id)
    return response
  },
)

export const createNewDeliverie = createAsyncThunk(
  'deliveries/createNewDeliverie',
  async (data) => {
    const response = await supabase.from('schedules_delivery').insert([data])
    return response
  },
)

export const deleteDeliverie = createAsyncThunk(
  'deliveries/deleteDeliverie',
  async (id) => {
    await supabase.from('schedules_delivery').delete().match({ id: id })
    return id
  },
)

export const updateDeliverie = createAsyncThunk(
  'deliveries/updateDeliverie',
  async (updatedData) => {
    const { data, error } = await supabase
      .from('schedules_delivery')
      .update({
        shipment_id: updatedData.shipment_id,
        employee_id: updatedData.employee_id,
        start_date: updatedData.start_date,
        end_date: updatedData.end_date,
        start_time: updatedData.start_time,
        end_time: updatedData.end_time,
      })
      .eq('id', updatedData.id)
    return data
  },
)

const deliveriesSlice = createSlice({
  name: 'deliveries',
  initialState,
  reducers: {
    clearDeliverieList: (state) => {
      state.deliverieList = []
    },
    clearDeliverieListStatus: (state) => {
      state.deliverieListStatus = 'idle'
    },
    clearDeliverieByIdData: (state) => {
      state.deliverieById = []
    },
    clearDeliverieByIdStatus: (state) => {
      state.deliverieByIdStatus = 'idle'
    },
    clearDeliverieDeleteStatus: (state) => {
      state.deliverieDeleteStatus = 'idle'
    },
    clearCreateDeliverieStatus: (state) => {
      state.createDeliverieStatus = 'idle'
    },
    clearDeliverieUpdateStatus: (state) => {
      state.deliverieUpdateStatus = 'idle'
    },
    clearIdStatus: (state) => {
      state.idStatus = 'idle'
    },
  },
  extraReducers: {
    [fetchDeliverie.pending]: (state) => {
      state.deliverieListStatus = 'loading'
    },
    [fetchDeliverie.fulfilled]: (state, action) => {
      state.deliverieListStatus = 'succeeded'
      state.deliverieList = state.deliverieList.concat(action.payload.data)
    },
    [fetchDeliverie.rejected]: (state, action) => {
      state.deliverieListStatus = 'failed'
      state.deliverieListError = action.error.message
    },
    [fetchDeliverieById.pending]: (state) => {
      state.deliverieByIdStatus = 'loading'
    },
    [fetchDeliverieById.fulfilled]: (state, action) => {
      state.deliverieByIdStatus = 'succeeded'
      state.deliverieById = action.payload.data[0]
    },
    [fetchDeliverieById.rejected]: (state, action) => {
      state.deliverieByIdStatus = 'failed'
      state.deliverieByIdError = action.error.message
    },
    [createNewDeliverie.pending]: (state) => {
      state.createDeliverieStatus = 'loading'
    },
    [createNewDeliverie.fulfilled]: (state, action) => {
      state.createDeliverieStatus = 'succeeded'
      state.deliverieList = state.deliverieList.concat(action.payload.data[0])
    },
    [createNewDeliverie.rejected]: (state, action) => {
      state.createDeliverieStatus = 'failed'
      state.createDeliverieError = action.error.message
    },
    [deleteDeliverie.pending]: (state) => {
      state.deliverieDeleteStatus = 'loading'
    },
    [deleteDeliverie.fulfilled]: (state, action) => {
      state.deliverieDeleteStatus = 'succeeded'
      state.deliverieDelete = action.payload.data
      const array = current(state.deliverieList)
      // eslint-disable-next-line eqeqeq
      const temp = array.filter((element) => element.id != action.payload)
      state.deliverieList = temp
    },
    [deleteDeliverie.rejected]: (state, action) => {
      state.deliverieDeleteStatus = 'failed'
      state.deliverieDeleteError = action.error.message
    },
    [updateDeliverie.pending]: (state) => {
      state.deliverieUpdateStatus = 'loading'
    },
    [updateDeliverie.fulfilled]: (state, action) => {
      state.deliverieUpdateStatus = 'succeeded'
      state.deliverieUpdate = action.payload.data
    },
    [updateDeliverie.rejected]: (state, action) => {
      state.deliverieUpdateStatus = 'failed'
      state.deliverieUpdateError = action.error.message
    },
  },
})

export const {
  clearDeliverieList,
  clearDeliverieByIdData,
  clearDeliverieByIdStatus,
  clearDeliverieDeleteStatus,
  clearCreateDeliverieStatus,
  clearDeliverieUpdateStatus,
  clearDeliverieListStatus,
} = deliveriesSlice.actions

export default deliveriesSlice.reducer
