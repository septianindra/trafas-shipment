let routes
switch ('admin') {
  case 'admin':
    routes = [
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
    ]
    break
  case 'admin-logistic':
    routes = [
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
    ]
    break
  case 'admin-courier':
    routes = [
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
    ]
    break
  case 'admin-marketing':
    routes = [
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
    ]
    break
  case 'staff-logistic':
    routes = [
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
    ]
    break
  case 'staff-courier':
    routes = [
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
    ]
    break
  case 'staff-marketing':
    routes = [
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
    ]
}

export default routes
