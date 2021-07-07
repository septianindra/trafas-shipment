import { configureStore } from '@reduxjs/toolkit'
import shipmentsReducer from './shipmentsSlice'
import employeesReducer from './employeesSlice'
import shipmentStatusAuditsReducer from './shipmentStatusAuditsSlice'
import deliveriesReducer from './deliveriesSlice'
import pickupsReducer from './pickupsSlice'

export default configureStore({
  reducer: {
    shipments: shipmentsReducer,
    employees: employeesReducer,
    shipmentStatusAudits: shipmentStatusAuditsReducer,
    deliveries: deliveriesReducer,
    pickups: pickupsReducer,
  },
})
