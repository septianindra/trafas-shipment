import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit'
import { supabase } from '../supabase'

const initialState = {
  isAuthenticated: false,
  isAuthenticatedStatus: 'idle',
  isAuthenticatedError: null,
  user: [],
  session: [],
}

export const signIn = createAsyncThunk('auths/signIn', async (data) => {
  const { user, session, error } = await supabase.auth.signIn({
    email: data.email,
    password: data.password,
  })
  if (error) {
    alert(error.message)
  }
  return [user, session]
})

export const signOut = createAsyncThunk('auths/signOut', async (data) => {
  const { error } = await supabase.auth.signOut()
  if (error) {
    alert(error.message)
  }
  return null
})

const authsSlice = createSlice({
  name: 'auths',
  initialState,
  reducers: {
    clearIsAuthenticatedStatus: (state) => {
      state.isAuthenticatedStatus = 'idle'
    },
  },
  extraReducers: {
    [signIn.pending]: (state) => {
      state.isAuthenticatedStatus = 'loading'
    },
    [signIn.fulfilled]: (state, action) => {
      state.isAuthenticatedStatus = 'succeeded'
      state.isAuthenticated = true
      // state.user = action.payload.data[0]
      // state.session = action.payload.data[1]
    },
    [signIn.rejected]: (state, action) => {
      state.isAuthenticatedStatus = 'loading'
      state.isAuthenticatedError = action.error.message
    },
  },
})

export const { clearIsAuthenticatedStatus } = authsSlice.actions

export default authsSlice.reducer
