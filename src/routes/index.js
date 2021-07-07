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
    roles: [
      'admin',
      'admin-logistic',
      'admin-courier',
      'admin-marketing',
      'staff-logistic',
      'staff-courier',
      'staff-marketing',
    ],
  },
  {
    path: '/shipment',
    component: Shipment,
    roles: [
      'admin',
      'admin-logistic',
      'admin-courier',
      'admin-marketing',
      'staff-logistic',
      'staff-courier',
      'staff-marketing',
    ],
  },
  {
    path: '/shipment/new',
    component: CreateShipment,
    roles: [
      'admin',
      'admin-logistic',
      'admin-marketing',
      'staff-logistic',
      'staff-marketing',
    ],
  },
  {
    path: '/shipment/edit/:id',
    component: EditShipment,
    roles: ['admin', 'admin-logistic', 'admin-marketing'],
  },
  {
    path: '/shipment/track-trace/:id',
    component: TrackTrace,
    roles: [
      'admin',
      'admin-logistic',
      'admin-courier',
      'admin-marketing',
      'staff-logistic',
      'staff-courier',
      'staff-marketing',
    ],
  },
  {
    path: '/shipment/detail/:id',
    component: DetailShipment,
    roles: [
      'admin',
      'admin-logistic',
      'admin-courier',
      'admin-marketing',
      'staff-logistic',
      'staff-courier',
      'staff-marketing',
    ],
  },
  {
    path: '/employee',
    component: Employee,
    roles: ['admin'],
  },
  {
    path: '/employee/new',
    component: CreateEmployee,
    roles: ['admin'],
  },
  {
    path: '/employee/edit/:id',
    component: EditEmployee,
    roles: ['admin'],
  },
  {
    path: '/schedule',
    component: Schedule,
    roles: ['admin', 'admin-courier', 'staff-courier'],
  },
  {
    path: '/schedule/new/:type',
    component: CreateSchedule,
    roles: ['admin', 'admin-courier'],
  },
  {
    path: '/schedule/edit/:type/:id',
    component: EditSchedule,
    roles: ['admin', 'admin-courier'],
  },
]

export default routes
