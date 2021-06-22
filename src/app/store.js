import { configureStore } from '@reduxjs/toolkit'
import shipmentsReducer from './shipmentsSlice'
import employeesReducer from './employeesSlice'
import shipmentStatusAuditsReducer from './shipmentStatusAuditsSlice'
import couriersReducer from './couriersSlice'

export default configureStore({
  reducer: {
    shipments: shipmentsReducer,
    employees: employeesReducer,
    shipmentStatusAudits: shipmentStatusAuditsReducer,
    courier: couriersReducer,
  },
})
