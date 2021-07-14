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
    ],
  },
  {
    role: 'admin-logistic',
    routes: [
      {
        path: '/dashboard',
        icon: 'HomeIcon',
        name: 'Dashboard',
      },
      {
        path: '/app/shipment',
        icon: 'MailIcon',
        name: 'Shipment',
      },
    ],
  },
  {
    role: 'admin-courier',
    routes: [
      {
        path: '/dashboard',
        icon: 'HomeIcon',
        name: 'Dashboard',
      },
      {
        path: '/app/schedule',
        icon: 'GithubIcon',
        name: 'Courier Schedule',
      },
    ],
  },
  {
    role: 'admin-marketing',
    routes: [
      {
        path: '/dashboard',
        icon: 'HomeIcon',
        name: 'Dashboard',
      },
      {
        path: '/app/shipment',
        icon: 'MailIcon',
        name: 'Shipment',
      },
    ],
  },
  {
    role: 'staff-logistic',
    routes: [
      {
        path: '/app/shipment',
        icon: 'MailIcon',
        name: 'Shipment',
      },
    ],
  },
  {
    role: 'staff-courier',
    routes: [
      {
        path: '/app/schedule',
        icon: 'GithubIcon',
        name: 'Courier Schedule',
      },
    ],
  },
  {
    role: 'staff-marketing',
    routes: [
      {
        path: '/app/shipment',
        icon: 'MailIcon',
        name: 'Shipment',
      },
    ],
  },
]

export default roles
