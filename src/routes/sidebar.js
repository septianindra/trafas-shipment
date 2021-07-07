const roles = [
  {
    role: 'admin',
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
      {
        path: '/app/schedule',
        icon: 'GithubIcon',
        name: 'Courier Schedule',
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
    role: 'staff-courier',
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
    role: 'staff-marketing',
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
]

export default roles
