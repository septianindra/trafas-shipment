import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit'
import { supabase } from '../supabase'

const initialState = {
  returnList: [],
  returnListStatus: 'idle',
  returnListError: null,
  returnListByEmployeeId: [],
  returnListByEmployeeIdStatus: 'idle',
  returnListByEmployeeIdError: null,
  returnListReturnByCreatedAt: [],
  returnListReturnByCreatedAtStatus: 'idle',
  returnListReturnByCreatedAtError: null,
  returnById: [],
  returnByIdStatus: 'idle',
  returnByIdError: null,
  createReturn: [],
  createReturnStatus: 'idle',
  createReturnError: null,
  returnDelete: [],
  returnDeleteStatus: 'idle',
  returnDeleteError: null,
  returnUpdate: [],
  returnUpdateStatus: 'idle',
  returnUpdateError: null,
}

export const fetchReturn = createAsyncThunk('returns/fetchReturn', async () => {
  const response = await supabase
    .from('returns')
    .select(`*,orders:order_id(*),employees:employee_id(*)`)
  return response
})

export const fetchReturnByEmployeeId = createAsyncThunk(
  'returns/fetchReturnByEmployeeId',
  async (data) => {
    const response = await supabase
      .from('returns')
      .select(`*,orders:order_id(*),employees:employee_id(*)`)
      .eq('employee_id', data)
    return response
  },
)

export const fetchReturnById = createAsyncThunk(
  'returns/fetchReturnById',
  async (id) => {
    const response = await supabase.from('returns').select('*').eq('id', id)
    return response
  },
)

export const createNewReturn = createAsyncThunk(
  'returns/createNewReturn',
  async (data) => {
    const response = await supabase.from('returns').insert([data])
    if (response.error) {
      alert(response.error.message)
    }
    const response2 = await supabase
      .from('packages')
      .insert([{ return_id: response.data[0].id }])
    if (response2.error) {
      alert(response2.error.message)
    }
    return response
  },
)

export const deleteReturn = createAsyncThunk(
  'returns/deleteReturn',
  async (id) => {
    await supabase.from('returns').delete().match({ id: id })
    return id
  },
)

export const updateStatusReturn = createAsyncThunk(
  'returns/updateStatusReturn',
  async (updatedData) => {
    const { data, error } = await supabase
      .from('returns')
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

export const updateReturn = createAsyncThunk(
  'returns/updateReturn',
  async (updatedData) => {
    const { data, error } = await supabase
      .from('returns')
      .update({
        employee_id: updatedData.employee_id,
      })
      .eq('id', updatedData.id)
    console.log(data)
    return data
  },
)

const returnsSlice = createSlice({
  name: 'returns',
  initialState,
  reducers: {
    clearReturnList: (state) => {
      state.returnList = []
    },
    clearReturnListStatus: (state) => {
      state.returnListStatus = 'idle'
    },
    clearReturnByIdData: (state) => {
      state.returnById = []
    },
    clearReturnByIdStatus: (state) => {
      state.returnByIdStatus = 'idle'
    },
    clearReturnDeleteStatus: (state) => {
      state.returnDeleteStatus = 'idle'
    },
    clearCreateReturnStatus: (state) => {
      state.createReturnStatus = 'idle'
    },
    clearReturnUpdateStatus: (state) => {
      state.returnUpdateStatus = 'idle'
    },
    clearIdStatus: (state) => {
      state.idStatus = 'idle'
    },
  },
  extraReducers: {
    [fetchReturn.pending]: (state) => {
      state.returnListStatus = 'loading'
    },
    [fetchReturn.fulfilled]: (state, action) => {
      state.returnListStatus = 'succeeded'
      state.returnList = action.payload.data
    },
    [fetchReturn.rejected]: (state, action) => {
      state.returnListStatus = 'failed'
      state.returnListError = action.error.message
    },

    [fetchReturnByEmployeeId.pending]: (state, action) => {
      state.returnListByEmployeeIdStatus = 'loading'
    },
    [fetchReturnByEmployeeId.fulfilled]: (state, action) => {
      state.returnListByEmployeeIdStatus = 'succeeded'
      state.returnListByEmployeeId = action.payload.data
    },
    [fetchReturnByEmployeeId.rejected]: (state, action) => {
      state.returnListByEmployeeIdStatus = 'failed'
      state.returnListByEmployeeIdError = action.error.message
    },
    [fetchReturnById.pending]: (state) => {
      state.returnByIdStatus = 'loading'
    },
    [fetchReturnById.fulfilled]: (state, action) => {
      state.returnByIdStatus = 'succeeded'
      state.returnById = action.payload.data[0]
    },
    [fetchReturnById.rejected]: (state, action) => {
      state.returnByIdStatus = 'failed'
      state.returnByIdError = action.error.message
    },
    [createNewReturn.pending]: (state) => {
      state.createReturnStatus = 'loading'
    },
    [createNewReturn.fulfilled]: (state, action) => {
      state.createReturnStatus = 'succeeded'
      state.returnList = state.returnList.concat(action.payload.data[0])
      state.returnListReturnByCreatedAtStatus =
        state.returnListReturnByCreatedAtStatus.concat(action.payload.data[0])
    },
    [createNewReturn.rejected]: (state, action) => {
      state.createReturnStatus = 'failed'
      state.createReturnError = action.error.message
    },
    [deleteReturn.pending]: (state) => {
      state.returnDeleteStatus = 'loading'
    },
    [deleteReturn.fulfilled]: (state, action) => {
      state.returnDeleteStatus = 'succeeded'
      state.returnDelete = action.payload.data
      const array = current(state.returnList)
      // eslint-disable-next-line eqeqeq
      const temp = array.filter((element) => element.id != action.payload)
      state.returnList = temp

      const array2 = current(state.returnListReturnByCreatedAt)
      // eslint-disable-next-line eqeqeq
      const temp2 = array2.filter((element) => element.id != action.payload)
      state.returnListReturnByCreatedAt = temp2
    },
    [deleteReturn.rejected]: (state, action) => {
      state.returnDeleteStatus = 'failed'
      state.returnDeleteError = action.error.message
    },
    [updateReturn.pending]: (state) => {
      state.returnUpdateStatus = 'loading'
    },
    [updateReturn.fulfilled]: (state, action) => {
      state.returnUpdateStatus = 'succeeded'
      state.returnUpdate = action.payload.data
    },
    [updateReturn.rejected]: (state, action) => {
      state.returnUpdateStatus = 'failed'
      state.returnUpdateError = action.error.message
    },
  },
})

export const {
  clearReturnList,
  clearReturnByIdData,
  clearReturnByIdStatus,
  clearReturnDeleteStatus,
  clearCreateReturnStatus,
  clearReturnUpdateStatus,
  clearReturnListStatus,
} = returnsSlice.actions

export default returnsSlice.reducer
