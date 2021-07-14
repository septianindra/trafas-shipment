import { configureStore } from '@reduxjs/toolkit'
import employeesReducer from './employeesSlice'
import ordersReducer from './ordersSlice'
import packagesReducer from './packagesSlice'
import deliverysReducer from './deliveriesSlice'
import pickupsReducer from './pickupsSlice'
import returnsReducer from './returnsSlice'

export default configureStore({
  reducer: {
    employees: employeesReducer,
    orders: ordersReducer,
    packages: packagesReducer,
    deliverys: deliverysReducer,
    pickups: pickupsReducer,
    returns: returnsReducer,
  },
})
