import { lazy } from 'react'

const Dashboard = lazy(() => import('../pages/Dashboard'))
const TrackTrace = lazy(() => import('../pages/TraceTrack'))
const Employee = lazy(() => import('../pages/Employee'))
const CreateEmployee = lazy(() => import('../pages/CreateEmployee'))
const EditEmployee = lazy(() => import('../pages/EditEmployee'))
const Marketing = lazy(() => import('../pages/Marketing'))
const Logistic = lazy(() => import('../pages/Logistic'))
const EditLogistic = lazy(() => import('../pages/EditLogistic'))
const Courier = lazy(() => import('../pages/Courier'))
const EditCourier = lazy(() => import('../pages/EditCourier'))
const CreateOrder = lazy(() => import('../pages/CreateOrder'))
const EditOrder = lazy(() => import('../pages/EditOrder'))
const EditOrderStatus = lazy(() => import('../pages/EditOrderStatus'))

const routes = [
  {
    path: '/dashboard',
    component: Dashboard,
    roles: ['admin', 'dashboard'],
  },
  {
    path: '/marketing',
    component: Marketing,
    roles: ['admin', 'admin-marketing', 'staff-marketing'],
  },
  {
    path: '/logistic',
    component: Logistic,
    roles: ['admin', 'admin-logistic', 'staff-logistic'],
  },
  {
    path: '/logistic/edit/:link/:id',
    component: EditLogistic,
    roles: ['admin', 'admin-logistic'],
  },
  {
    path: '/courier',
    component: Courier,
    roles: ['admin', 'admin-courier', 'staff-courier'],
  },
  {
    path: '/courier/edit/:link/:id',
    component: EditCourier,
    roles: ['admin', 'admin-logistic'],
  },
  {
    path: '/order/new',
    component: CreateOrder,
    roles: ['admin', 'admin-marketing', 'staff-marketing'],
  },
  {
    path: '/order/edit/:id',
    component: EditOrder,
    roles: ['admin', 'admin-marketing'],
  },
  {
    path: '/order/edit/status/:id',
    component: EditOrderStatus,
    roles: [
      'admin',
      'admin-logistic',
      'admin-courier',
      'staff-logistic',
      'staff-courier',
    ],
  },
  {
    path: '/order/track-trace/:id',
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
]

export default routes
