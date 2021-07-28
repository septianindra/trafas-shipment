const roles = [
  {
    role: 'dashboard',
    routes: [
      {
        path: '/dashboard',
        icon: 'HomeIcon',
        name: 'Dashboard',
      },
    ],
  },
  {
    role: 'admin',
    routes: [
      {
        path: '/app/marketing',
        icon: 'MarketingIcon',
        name: 'Marketing',
      },
      {
        path: '/app/logistic',
        icon: 'LogisticIcon',
        name: 'Logistic',
      },
      {
        path: '/app/courier',
        icon: 'CourierIcon',
        name: 'Courier',
      },
      {
        path: '/app/employee',
        icon: 'PeopleIcon',
        name: 'Employee',
      },
      {
        path: '/app/report',
        icon: 'ModalsIcon',
        name: 'Report',
      },
    ],
  },
  {
    role: 'admin-logistic',
    routes: [
      {
        path: '/app/logistic',
        icon: 'LogisticIcon',
        name: 'Logistic',
      },
    ],
  },
  {
    role: 'admin-courier',
    routes: [
      {
        path: '/app/courier',
        icon: 'CourierIcon',
        name: 'Courier',
      },
    ],
  },
  {
    role: 'admin-marketing',
    routes: [
      {
        path: '/app/marketing',
        icon: 'MarketingIcon',
        name: 'Marketing',
      },
    ],
  },
  {
    role: 'staff-logistic',
    routes: [
      {
        path: '/app/logistic',
        icon: 'LogisticIcon',
        name: 'Logistic',
      },
    ],
  },
  {
    role: 'staff-courier',
    routes: [
      {
        path: '/app/courier',
        icon: 'CourierIcon',
        name: 'Courier',
      },
    ],
  },
  {
    role: 'staff-marketing',
    routes: [
      {
        path: '/app/marketing',
        icon: 'MarketingIcon',
        name: 'Marketing',
      },
    ],
  },
]

export default roles
