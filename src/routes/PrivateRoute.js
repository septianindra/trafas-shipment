import React from 'react'
import { Route, Redirect } from 'react-router-dom'

import { useAuth } from '../contexts/Auth'

export function PrivateRoute({ component: Component, roles, ...rest }) {
  const { user } = useAuth()
  // console.log(user.id)

  return (
    <Route
      // {...rest}
      // render={(props) => {
      //   // Renders the page only if `user` is present (user is authenticated)
      //   // Otherwise, redirect to the login page
      //   console.log(props)
      //   return user ? <Component {...props} /> : <Redirect to="/login" />
      // }}
      //--------------------------------------------------------------------------
      {...rest}
      render={(props) => {
        if (!user) {
          // not logged in so redirect to login page with the return url
          return <Redirect to="/login" />
        }
        // check if route is restricted by role
        if (roles && roles.indexOf('admin') === -1) {
          // role not authorised so redirect to home page
          return <Redirect to="/app" />
        }
        // console.log(roles)
        // authorised so return component
        return <Component {...props} />
      }}
    />
  )
}
