import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit'
import { supabase } from '../supabase'

const initialState = {
  pickupList: [],
  pickupListStatus: 'idle',
  pickupListError: null,
  pickupById: [],
  pickupByIdStatus: 'idle',
  pickupByIdError: null,
  createPickup: [],
  createPickupStatus: 'idle',
  createPickupError: null,
  pickupDelete: [],
  pickupDeleteStatus: 'idle',
  pickupDeleteError: null,
  pickupUpdate: [],
  pickupUpdateStatus: 'idle',
  pickupUpdateError: null,
}

export const fetchPickup = createAsyncThunk('pickups/fetchPickup', async () => {
  const response = await supabase.from('schedules_pickup').select(`
  *,
  employees:employee_id ( name ),
  shipments:shipment_id ( customer_name,status )
  `)
  return response
})

export const fetchPickupById = createAsyncThunk(
  'pickups/fetchPickupById',
  async (id) => {
    const response = await supabase
      .from('schedules_pickup')
      .select('*')
      .eq('id', id)
    return response
  },
)

export const createNewPickup = createAsyncThunk(
  'pickups/createNewPickup',
  async (data) => {
    const response = await supabase.from('schedules_pickup').insert([data])
    return response
  },
)

export const deletePickup = createAsyncThunk(
  'pickups/deletePickup',
  async (id) => {
    await supabase.from('schedules_pickup').delete().match({ id: id })
    return id
  },
)

export const updatePickup = createAsyncThunk(
  'pickups/updatePickup',
  async (updatedData) => {
    const { data, error } = await supabase
      .from('schedules_pickup')
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

const pickupsSlice = createSlice({
  name: 'pickups',
  initialState,
  reducers: {
    clearPickupList: (state) => {
      state.pickupList = []
    },
    clearPickupListStatus: (state) => {
      state.pickupListStatus = 'idle'
    },
    clearPickupByIdData: (state) => {
      state.pickupById = []
    },
    clearPickupByIdStatus: (state) => {
      state.pickupByIdStatus = 'idle'
    },
    clearPickupDeleteStatus: (state) => {
      state.pickupDeleteStatus = 'idle'
    },
    clearCreatePickupStatus: (state) => {
      state.createPickupStatus = 'idle'
    },
    clearPickupUpdateStatus: (state) => {
      state.pickupUpdateStatus = 'idle'
    },
    clearIdStatus: (state) => {
      state.idStatus = 'idle'
    },
  },
  extraReducers: {
    [fetchPickup.pending]: (state) => {
      state.pickupListStatus = 'loading'
    },
    [fetchPickup.fulfilled]: (state, action) => {
      state.pickupListStatus = 'succeeded'
      state.pickupList = action.payload.data
    },
    [fetchPickup.rejected]: (state, action) => {
      state.pickupListStatus = 'failed'
      state.pickupListError = action.error.message
    },
    [fetchPickupById.pending]: (state) => {
      state.pickupByIdStatus = 'loading'
    },
    [fetchPickupById.fulfilled]: (state, action) => {
      state.pickupByIdStatus = 'succeeded'
      state.pickupById = action.payload.data[0]
    },
    [fetchPickupById.rejected]: (state, action) => {
      state.pickupByIdStatus = 'failed'
      state.pickupByIdError = action.error.message
    },
    [createNewPickup.pending]: (state) => {
      state.createPickupStatus = 'loading'
    },
    [createNewPickup.fulfilled]: (state, action) => {
      state.createPickupStatus = 'succeeded'
      state.pickupList = state.pickupList.concat(action.payload.data[0])
    },
    [createNewPickup.rejected]: (state, action) => {
      state.createPickupStatus = 'failed'
      state.createPickupError = action.error.message
    },
    [deletePickup.pending]: (state) => {
      state.pickupDeleteStatus = 'loading'
    },
    [deletePickup.fulfilled]: (state, action) => {
      state.pickupDeleteStatus = 'succeeded'
      state.pickupDelete = action.payload.data
      const array = current(state.pickupList)
      // eslint-disable-next-line eqeqeq
      const temp = array.filter((element) => element.id != action.payload)
      state.pickupList = temp
    },
    [deletePickup.rejected]: (state, action) => {
      state.pickupDeleteStatus = 'failed'
      state.pickupDeleteError = action.error.message
    },
    [updatePickup.pending]: (state) => {
      state.pickupUpdateStatus = 'loading'
    },
    [updatePickup.fulfilled]: (state, action) => {
      state.pickupUpdateStatus = 'succeeded'
      state.pickupUpdate = action.payload.data
    },
    [updatePickup.rejected]: (state, action) => {
      state.pickupUpdateStatus = 'failed'
      state.pickupUpdateError = action.error.message
    },
  },
})

export const {
  clearPickupList,
  clearPickupByIdData,
  clearPickupByIdStatus,
  clearPickupDeleteStatus,
  clearCreatePickupStatus,
  clearPickupUpdateStatus,
  clearPickupListStatus,
} = pickupsSlice.actions

export default pickupsSlice.reducer
