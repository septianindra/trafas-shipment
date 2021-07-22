import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit'
import { supabase } from '../supabase'

const initialState = {
  orderList: [],
  orderListStatus: 'idle',
  orderListError: null,
  orderListByEmployeeId: [],
  orderListByEmployeeIdStatus: 'idle',
  orderListByEmployeeIdError: null,
  orderListOrderByCreatedAt: [],
  orderListOrderByCreatedAtStatus: 'idle',
  orderListOrderByCreatedAtError: null,
  orderById: [],
  orderByIdStatus: 'idle',
  orderByIdError: null,
  createOrder: [],
  createOrderStatus: 'idle',
  createOrderError: null,
  orderDelete: [],
  orderDeleteStatus: 'idle',
  orderDeleteError: null,
  orderUpdate: [],
  orderUpdateStatus: 'idle',
  orderUpdateError: null,
}

export const fetchOrder = createAsyncThunk('orders/fetchOrder', async () => {
  const response = await supabase
    .from('orders')
    .select(`*,employees:employee_id(name)`)
  return response
})

export const fetchOrderByEmployeeId = createAsyncThunk(
  'orders/fetchOrderByEmployeeId',
  async (data) => {
    const response = await supabase
      .from('orders')
      .select()
      .eq('employee_id', data)
    return response
  },
)

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (id) => {
    const response = await supabase.from('orders').select('*').eq('id', id)
    return response
  },
)

export const createNewOrder = createAsyncThunk(
  'orders/createNewOrder',
  async (data) => {
    const response = await supabase.from('orders').insert([data])
    if (response.error) {
      alert(response.error.message)
    }
    return response
  },
)

export const deleteOrder = createAsyncThunk(
  'orders/deleteOrder',
  async (id) => {
    await supabase.from('orders').delete().match({ id: id })
    return id
  },
)

export const updateStatusOrder = createAsyncThunk(
  'orders/updateStatusOrder',
  async (updatedData) => {
    const { data, error } = await supabase
      .from('orders')
      .update({
        number: updatedData.number,
        status: updatedData.status,
        recipient_name: updatedData.recipient_name,
        recipient_phone: updatedData.recipient_phone,
      })
      .eq('id', updatedData.id)
    console.log(data)
    return data
  },
)

export const updateProductList = createAsyncThunk(
  'orders/updateProductList',
  async (updatedData) => {
    const { data, error } = await supabase
      .from('orders')
      .update({
        product_list: updatedData.product_list,
      })
      .eq('id', updatedData.id)
    if (error) {
      alert(error.message)
    }

    return data
  },
)

export const updateOrder = createAsyncThunk(
  'orders/updateOrder',
  async (updatedData) => {
    const { data, error } = await supabase
      .from('orders')
      .update({
        customer_name: updatedData.customer_name,
        customer_address: updatedData.customer_address,
        product_list: updatedData.product_list,
        note: updatedData.note,
      })
      .eq('id', updatedData.id)
    console.log(data)
    return data
  },
)

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderList: (state) => {
      state.orderList = []
    },
    clearOrderListStatus: (state) => {
      state.orderListStatus = 'idle'
    },
    clearOrderByIdData: (state) => {
      state.orderById = []
    },
    clearOrderByIdStatus: (state) => {
      state.orderByIdStatus = 'idle'
    },
    clearOrderDeleteStatus: (state) => {
      state.orderDeleteStatus = 'idle'
    },
    clearCreateOrderStatus: (state) => {
      state.createOrderStatus = 'idle'
    },
    clearOrderUpdateStatus: (state) => {
      state.orderUpdateStatus = 'idle'
    },
    clearIdStatus: (state) => {
      state.idStatus = 'idle'
    },
  },
  extraReducers: {
    [fetchOrder.pending]: (state) => {
      state.orderListStatus = 'loading'
    },
    [fetchOrder.fulfilled]: (state, action) => {
      state.orderListStatus = 'succeeded'
      state.orderList = action.payload.data
    },
    [fetchOrder.rejected]: (state, action) => {
      state.orderListStatus = 'failed'
      state.orderListError = action.error.message
    },

    [fetchOrderByEmployeeId.pending]: (state, action) => {
      state.orderListByEmployeeIdStatus = 'loading'
    },
    [fetchOrderByEmployeeId.fulfilled]: (state, action) => {
      state.orderListByEmployeeIdStatus = 'succeeded'
      state.orderListByEmployeeId = action.payload.data
    },
    [fetchOrderByEmployeeId.rejected]: (state, action) => {
      state.orderListByEmployeeIdStatus = 'failed'
      state.orderListByEmployeeIdError = action.error.message
    },
    [fetchOrderById.pending]: (state) => {
      state.orderByIdStatus = 'loading'
    },
    [fetchOrderById.fulfilled]: (state, action) => {
      state.orderByIdStatus = 'succeeded'
      state.orderById = action.payload.data[0]
    },
    [fetchOrderById.rejected]: (state, action) => {
      state.orderByIdStatus = 'failed'
      state.orderByIdError = action.error.message
    },
    [createNewOrder.pending]: (state) => {
      state.createOrderStatus = 'loading'
    },
    [createNewOrder.fulfilled]: (state, action) => {
      state.createOrderStatus = 'succeeded'
      state.orderList = state.orderList.concat(action.payload.data[0])
      state.orderListOrderByCreatedAtStatus =
        state.orderListOrderByCreatedAtStatus.concat(action.payload.data[0])
    },
    [createNewOrder.rejected]: (state, action) => {
      state.createOrderStatus = 'failed'
      state.createOrderError = action.error.message
    },
    [deleteOrder.pending]: (state) => {
      state.orderDeleteStatus = 'loading'
    },
    [deleteOrder.fulfilled]: (state, action) => {
      state.orderDeleteStatus = 'succeeded'
      state.orderDelete = action.payload.data
      const array = current(state.orderList)
      // eslint-disable-next-line eqeqeq
      const temp = array.filter((element) => element.id != action.payload)
      state.orderList = temp

      const array2 = current(state.orderListOrderByCreatedAt)
      // eslint-disable-next-line eqeqeq
      const temp2 = array2.filter((element) => element.id != action.payload)
      state.orderListOrderByCreatedAt = temp2
    },
    [deleteOrder.rejected]: (state, action) => {
      state.orderDeleteStatus = 'failed'
      state.orderDeleteError = action.error.message
    },
    [updateStatusOrder.pending]: (state) => {
      state.orderUpdateStatus = 'loading'
    },
    [updateStatusOrder.fulfilled]: (state, action) => {
      state.orderUpdateStatus = 'succeeded'
      state.orderUpdate = action.payload.data
    },
    [updateStatusOrder.rejected]: (state, action) => {
      state.orderUpdateStatus = 'failed'
      state.orderUpdateError = action.error.message
    },
    [updateOrder.pending]: (state) => {
      state.orderUpdateStatus = 'loading'
    },
    [updateOrder.fulfilled]: (state, action) => {
      state.orderUpdateStatus = 'succeeded'
      state.orderUpdate = action.payload.data
    },
    [updateOrder.rejected]: (state, action) => {
      state.orderUpdateStatus = 'failed'
      state.orderUpdateError = action.error.message
    },

    [updateProductList.pending]: (state) => {
      state.orderUpdateStatus = 'loading'
    },
    [updateProductList.fulfilled]: (state) => {
      state.orderUpdateStatus = 'succeeded'
    },
    [updateProductList.rejected]: (state) => {
      state.orderUpdateStatus = 'failed'
    },
  },
})

export const {
  clearOrderList,
  clearOrderByIdData,
  clearOrderByIdStatus,
  clearOrderDeleteStatus,
  clearCreateOrderStatus,
  clearOrderUpdateStatus,
  clearOrderListStatus,
} = ordersSlice.actions

export default ordersSlice.reducer
