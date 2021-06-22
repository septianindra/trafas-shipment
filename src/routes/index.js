import { lazy } from 'react'

const Dashboard = lazy(() => import('../pages/Dashboard'))
const Shipment = lazy(() => import('../pages/Shipment'))
const CreateShipment = lazy(() => import('../pages/CreateShipment'))
const EditShipment = lazy(() => import('../pages/EditShipment'))
const TrackTrace = lazy(() => import('../pages/TraceTrack'))
const DetailShipment = lazy(() => import('../pages/DetailShipment'))
const Employee = lazy(() => import('../pages/Employee'))
const CreateEmployee = lazy(() => import('../pages/CreateEmployee'))
const EditEmployee = lazy(() => import('../pages/EditEmployee'))
const Courier = lazy(() => import('../pages/Courier'))
const CreateCourier = lazy(() => import('../pages/CreateCourier'))
const EditCourier = lazy(() => import('../pages/EditCourier'))

const routes = [
  {
    path: '/dashboard',
    component: Dashboard,
  },
  {
    path: '/shipment',
    component: Shipment,
  },
  {
    path: '/shipment/new',
    component: CreateShipment,
  },
  {
    path: '/shipment/edit/:id',
    component: EditShipment,
  },
  {
    path: '/shipment/track-trace/:id',
    component: TrackTrace,
  },
  {
    path: '/shipment/detail/:id',
    component: DetailShipment,
  },
  {
    path: '/employee',
    component: Employee,
  },
  {
    path: '/employee/new',
    component: CreateEmployee,
  },
  {
    path: '/employee/edit/:id',
    component: EditEmployee,
  },
  {
    path: '/courier',
    component: Courier,
  },
  {
    path: '/courier/new',
    component: Employee,
  },
  {
    path: '/courier/edit/:id',
    component: Employee,
  },
]

export default routes
