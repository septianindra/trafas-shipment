import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit'
import { supabase } from '../supabase'

const initialState = {
  deliveryList: [],
  deliveryListStatus: 'idle',
  deliveryListError: null,
  deliveryListByEmployeeId: [],
  deliveryListByEmployeeIdStatus: 'idle',
  deliveryListByEmployeeIdError: null,
  deliveryListDeliveryByCreatedAt: [],
  deliveryListDeliveryByCreatedAtStatus: 'idle',
  deliveryListDeliveryByCreatedAtError: null,
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
    const response = await supabase
      .from('deliverys')
      .select(`*,orders:order_id(*)`)
    return response
  },
)

export const fetchDeliveryByEmployeeId = createAsyncThunk(
  'deliverys/fetchDeliveryByEmployeeId',
  async (data) => {
    const response = await supabase
      .from('deliverys')
      .select(`*,orders:order_id(*)`)
      .eq('employee_id', data)
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
  async (data) => {
    const response = await supabase.from('deliverys').insert([data])
    if (response.error) {
      alert(response.error.message)
    }
    const response2 = await supabase
      .from('packages')
      .insert([{ delivery_id: response.data[0].id }])
    if (response2.error) {
      alert(response2.error.message)
    }
    return response
  },
)

export const deleteDelivery = createAsyncThunk(
  'deliverys/deleteDelivery',
  async (id) => {
    await supabase.from('deliverys').delete().match({ id: id })
    return id
  },
)

export const updateStatusDelivery = createAsyncThunk(
  'deliverys/updateStatusDelivery',
  async (updatedData) => {
    const { data, error } = await supabase
      .from('deliverys')
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

export const updateDelivery = createAsyncThunk(
  'deliverys/updateDelivery',
  async (updatedData) => {
    const { data, error } = await supabase
      .from('deliverys')
      .update({
        transfer_no: updatedData.transfer_no,
        customer_name: updatedData.customer_name,
        delivery_address: updatedData.delivery_address,
        delivery_date: updatedData.delivery_date,
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
    },
    [fetchDelivery.rejected]: (state, action) => {
      state.deliveryListStatus = 'failed'
      state.deliveryListError = action.error.message
    },

    [fetchDeliveryByEmployeeId.pending]: (state, action) => {
      state.deliveryListByEmployeeIdStatus = 'loading'
    },
    [fetchDeliveryByEmployeeId.fulfilled]: (state, action) => {
      state.deliveryListByEmployeeIdStatus = 'succeeded'
      state.deliveryListByEmployeeId = action.payload.data
    },
    [fetchDeliveryByEmployeeId.rejected]: (state, action) => {
      state.deliveryListByEmployeeIdStatus = 'failed'
      state.deliveryListByEmployeeIdError = action.error.message
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
      state.deliveryListDeliveryByCreatedAtStatus =
        state.deliveryListDeliveryByCreatedAtStatus.concat(
          action.payload.data[0],
        )
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

      const array2 = current(state.deliveryListDeliveryByCreatedAt)
      // eslint-disable-next-line eqeqeq
      const temp2 = array2.filter((element) => element.id != action.payload)
      state.deliveryListDeliveryByCreatedAt = temp2
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
