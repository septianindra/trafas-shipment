import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit'
import { supabase } from '../supabase'

const initialState = {
  deliveryList: [],
  deliveryListByRoleCourier: [],
  deliveryListStatus: 'idle',
  deliveryListError: null,
  deliveryById: [],
  deliveryByIdStatus: 'idle',
  deliveryByIdError: null,
  createDelivery: [],
  createDeliveryStatus: 'idle',
  createDeliveryError: null,
  deliveryDelete: [],
  deliveryDeleteStatus: 'idle',
  deliveryDeleteError: null,
  deliveryUpdate: [],
  deliveryUpdateStatus: 'idle',
  deliveryUpdateError: null,
}

export const fetchDelivery = createAsyncThunk(
  'deliverys/fetchDelivery',
  async () => {
    const response = await supabase.from('deliverys').select()
    return response
  },
)

export const fetchDeliveryById = createAsyncThunk(
  'deliverys/fetchDeliveryById',
  async (id) => {
    const response = await supabase.from('deliverys').select('*').eq('id', id)
    return response
  },
)

export const createNewDelivery = createAsyncThunk(
  'deliverys/createNewDelivery',
  async (newData) => {
    const { data, error } = await supabase.auth.signUp({
      email: newData.email,
      password: newData.password,
    })
    if (error) {
      alert(error.message)
    }
    return data
  },
)

export const deleteDelivery = createAsyncThunk(
  'deliverys/deleteDelivery',
  async (id) => {
    await supabase.from('deliverys').delete().match({ id: id })
    return id
  },
)

export const updateDelivery = createAsyncThunk(
  'deliverys/updateDelivery',
  async (updatedData) => {
    const { data, error } = await supabase
      .from('deliverys')
      .update({
        name: updatedData.name,
        phone: updatedData.phone,
        role: updatedData.role,
      })
      .eq('id', updatedData.id)
    if (error) {
      alert(error.message)
    }
    return data
  },
)

const deliverysSlice = createSlice({
  name: 'deliverys',
  initialState,
  reducers: {
    clearDeliveryList: (state) => {
      state.deliveryList = []
    },
    clearDeliveryListStatus: (state) => {
      state.deliveryListStatus = 'idle'
    },
    clearDeliveryByIdData: (state) => {
      state.deliveryById = []
    },
    clearDeliveryByIdStatus: (state) => {
      state.deliveryByIdStatus = 'idle'
    },
    clearDeliveryDeleteStatus: (state) => {
      state.deliveryDeleteStatus = 'idle'
    },
    clearCreateDeliveryStatus: (state) => {
      state.createDeliveryStatus = 'idle'
    },
    clearDeliveryUpdateStatus: (state) => {
      state.deliveryUpdateStatus = 'idle'
    },
    clearIdStatus: (state) => {
      state.idStatus = 'idle'
    },
  },
  extraReducers: {
    [fetchDelivery.pending]: (state) => {
      state.deliveryListStatus = 'loading'
    },
    [fetchDelivery.fulfilled]: (state, action) => {
      state.deliveryListStatus = 'succeeded'
      state.deliveryList = action.payload.data
      // let filterCourier = action.payload.data.filter(
      //   (data) =>
      //     data.role.role === 'staff-courier' ||
      //     data.role.role === 'admin-courier' ||
      //     '',
      // )
      state.deliveryListByRoleCourier = action.payload.data
    },
    [fetchDelivery.rejected]: (state, action) => {
      state.deliveryListStatus = 'failed'
      state.deliveryListError = action.error.message
    },
    [fetchDeliveryById.pending]: (state) => {
      state.deliveryByIdStatus = 'loading'
    },
    [fetchDeliveryById.fulfilled]: (state, action) => {
      state.deliveryByIdStatus = 'succeeded'
      state.deliveryById = action.payload.data[0]
    },
    [fetchDeliveryById.rejected]: (state, action) => {
      state.deliveryByIdStatus = 'failed'
      state.deliveryByIdError = action.error.message
    },
    [createNewDelivery.pending]: (state) => {
      state.createDeliveryStatus = 'loading'
    },
    [createNewDelivery.fulfilled]: (state, action) => {
      state.createDeliveryStatus = 'succeeded'
      state.deliveryList = state.deliveryList.concat(action.payload.data[0])
    },
    [createNewDelivery.rejected]: (state, action) => {
      state.createDeliveryStatus = 'failed'
      state.createDeliveryError = action.error.message
    },
    [deleteDelivery.pending]: (state) => {
      state.deliveryDeleteStatus = 'loading'
    },
    [deleteDelivery.fulfilled]: (state, action) => {
      state.deliveryDeleteStatus = 'succeeded'
      state.deliveryDelete = action.payload.data
      const array = current(state.deliveryList)
      // eslint-disable-next-line eqeqeq
      const temp = array.filter((element) => element.id != action.payload)
      state.deliveryList = temp
    },
    [deleteDelivery.rejected]: (state, action) => {
      state.deliveryDeleteStatus = 'failed'
      state.deliveryDeleteError = action.error.message
    },
    [updateDelivery.pending]: (state) => {
      state.deliveryUpdateStatus = 'loading'
    },
    [updateDelivery.fulfilled]: (state, action) => {
      state.deliveryUpdateStatus = 'succeeded'
      state.deliveryUpdate = action.payload.data
    },
    [updateDelivery.rejected]: (state, action) => {
      state.deliveryUpdateStatus = 'failed'
      state.deliveryUpdateError = action.error.message
    },
  },
})

export const {
  clearDeliveryList,
  clearDeliveryByIdData,
  clearDeliveryByIdStatus,
  clearDeliveryDeleteStatus,
  clearCreateDeliveryStatus,
  clearDeliveryUpdateStatus,
  clearDeliveryListStatus,
} = deliverysSlice.actions

export default deliverysSlice.reducer
