import React from 'react'

import { Route, Redirect } from 'react-router-dom'
import { useAuth } from '../contexts/Auth'

export function PrivateRoute({ component: Component, roles, ...rest }) {
  const { user } = useAuth()
  console.log(user)
  const temp = user?.user_metadata?.role ?? 'admin'

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!user || user.user_metadata === null) {
          return <Redirect to="/login" />
        }
        if (roles && roles.indexOf(temp) === -1) {
          return <Redirect to="/app" />
        }
        return <Component {...props} />
      }}
    />
  )
}
