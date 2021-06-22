import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit'
import { createClient } from '@supabase/supabase-js'
const { REACT_APP_SUPABASE_KEY, REACT_APP_SUPABASE_URL } = process.env
const supabase = createClient(REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_KEY)

const initialState = {
  courierList: [],
  courierListStatus: 'idle',
  courierListError: null,
  courierById: [],
  courierByIdStatus: 'idle',
  courierByIdError: null,
  createCourier: [],
  createCourierStatus: 'idle',
  createCourierError: null,
  courierDelete: [],
  courierDeleteStatus: 'idle',
  courierDeleteError: null,
  courierUpdate: [],
  courierUpdateStatus: 'idle',
  courierUpdateError: null,
}

export const fetchCourier = createAsyncThunk(
  'couriers/fetchCourier',
  async () => {
    const response = await supabase
      .from('couriers')
      .select()
      .order('courier_date', { ascending: true })
    return response
  },
)

export const fetchCourierById = createAsyncThunk(
  'couriers/fetchCourierById',
  async (id) => {
    const response = await supabase.from('couriers').select('*').eq('id', id)
    return response
  },
)

export const createNewCourier = createAsyncThunk(
  'couriers/createNewCourier',
  async (data) => {
    const response = await supabase.from('couriers').insert([data])
    return response
  },
)

export const deleteCourier = createAsyncThunk(
  'couriers/deleteCourier',
  async (id) => {
    await supabase.from('couriers').delete().match({ id: id })
    return id
  },
)

export const updateCourier = createAsyncThunk(
  'couriers/updateCourier',
  async (updatedData) => {
    const { data, error } = await supabase
      .from('couriers')
      .update({
        courier_id: updatedData.courier_id,
        employee_id: updatedData.employee_id,
        start_time: updatedData.start_time,
        end_time: updatedData.end_time,
      })
      .eq('id', updatedData.id)
    return data
  },
)

const couriersSlice = createSlice({
  name: 'couriers',
  initialState,
  reducers: {
    clearCourierList: (state) => {
      state.courierList = []
    },
    clearCourierListStatus: (state) => {
      state.courierListStatus = 'idle'
    },
    clearCourierByIdData: (state) => {
      state.courierById = []
    },
    clearCourierByIdStatus: (state) => {
      state.courierByIdStatus = 'idle'
    },
    clearCourierDeleteStatus: (state) => {
      state.courierDeleteStatus = 'idle'
    },
    clearCreateCourierStatus: (state) => {
      state.createCourierStatus = 'idle'
    },
    clearCourierUpdateStatus: (state) => {
      state.courierUpdateStatus = 'idle'
    },
    clearIdStatus: (state) => {
      state.idStatus = 'idle'
    },
  },
  extraReducers: {
    [fetchCourier.pending]: (state) => {
      state.courierListStatus = 'loading'
    },
    [fetchCourier.fulfilled]: (state, action) => {
      state.courierListStatus = 'succeeded'
      state.courierList = state.courierList.concat(action.payload.data)
    },
    [fetchCourier.rejected]: (state, action) => {
      state.courierListStatus = 'failed'
      state.courierListError = action.error.message
    },
    [fetchCourierById.pending]: (state) => {
      state.courierByIdStatus = 'loading'
    },
    [fetchCourierById.fulfilled]: (state, action) => {
      state.courierByIdStatus = 'succeeded'
      state.courierById = action.payload.data[0]
    },
    [fetchCourierById.rejected]: (state, action) => {
      state.courierByIdStatus = 'failed'
      state.courierByIdError = action.error.message
    },
    [createNewCourier.pending]: (state) => {
      state.createCourierStatus = 'loading'
    },
    [createNewCourier.fulfilled]: (state, action) => {
      state.createCourierStatus = 'succeeded'
      state.courierList = state.courierList.concat(action.payload.data[0])
    },
    [createNewCourier.rejected]: (state, action) => {
      state.createCourierStatus = 'failed'
      state.createCourierError = action.error.message
    },
    [deleteCourier.pending]: (state) => {
      state.courierDeleteStatus = 'loading'
    },
    [deleteCourier.fulfilled]: (state, action) => {
      state.courierDeleteStatus = 'succeeded'
      state.courierDelete = action.payload.data
      const array = current(state.courierList)
      // eslint-disable-next-line eqeqeq
      const temp = array.filter((element) => element.id != action.payload)
      state.courierList = temp
    },
    [deleteCourier.rejected]: (state, action) => {
      state.courierDeleteStatus = 'failed'
      state.courierDeleteError = action.error.message
    },
    [updateCourier.pending]: (state) => {
      state.courierUpdateStatus = 'loading'
    },
    [updateCourier.fulfilled]: (state, action) => {
      state.courierUpdateStatus = 'succeeded'
      state.courierUpdate = action.payload.data
    },
    [updateCourier.rejected]: (state, action) => {
      state.courierUpdateStatus = 'failed'
      state.courierUpdateError = action.error.message
    },
  },
})

export const {
  clearCourierList,
  clearCourierByIdData,
  clearCourierByIdStatus,
  clearCourierDeleteStatus,
  clearCreateCourierStatus,
  clearCourierUpdateStatus,
  clearCourierListStatus,
} = couriersSlice.actions

export default couriersSlice.reducer
