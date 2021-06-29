import { configureStore } from '@reduxjs/toolkit'
import shipmentsReducer from './shipmentsSlice'
import employeesReducer from './employeesSlice'
import shipmentStatusAuditsReducer from './shipmentStatusAuditsSlice'
import authsReducer from './authsSlice'

import schedulesReducer from './schedulesSlice'
export default configureStore({
  reducer: {
    shipments: shipmentsReducer,
    employees: employeesReducer,
    shipmentStatusAudits: shipmentStatusAuditsReducer,
    schedules: schedulesReducer,
    auths: authsReducer
  },
})
