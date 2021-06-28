import { lazy } from 'react'

const Dashboard = lazy(() => import('../pages/Dashboard'))
const Shipment = lazy(() => import('../pages/Shipment'))
const DetailShipment = lazy(() => import('../pages/DetailShipment'))
const CreateShipment = lazy(() => import('../pages/CreateShipment'))
const EditShipment = lazy(() => import('../pages/EditShipment'))
const TrackTrace = lazy(() => import('../pages/TraceTrack'))
const Employee = lazy(() => import('../pages/Employee'))
const CreateEmployee = lazy(() => import('../pages/CreateEmployee'))
const EditEmployee = lazy(() => import('../pages/EditEmployee'))
const Schedule = lazy(() => import('../pages/Schedule'))
const CreateSchedule = lazy(() => import('../pages/CreateSchedule'))
const EditSchedule = lazy(() => import('../pages/EditSchedule'))

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
    path: '/schedule',
    component: Schedule,
  },
  {
    path: '/schedule/new',
    component: CreateSchedule,
  },
  {
    path: '/schedule/edit/:id',
    component: EditSchedule,
  },
]

export default routes
