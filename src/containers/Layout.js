import React, { useContext, Suspense, useEffect, lazy } from 'react'
import { Switch, Route, Redirect, useLocation } from 'react-router-dom'
import routes from '../routes'

import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import Main from '../containers/Main'
import ThemedSuspense from '../components/ThemedSuspense'
import { SidebarContext } from '../context/SidebarContext'
import { PrivateRoute } from '../routes/PrivateRoute'
import { useAuth } from '../contexts/Auth'

const Page404 = lazy(() => import('../pages/404'))

function Layout() {
  const { user } = useAuth()
  const { isSidebarOpen, closeSidebar } = useContext(SidebarContext)
  let location = useLocation()

  useEffect(() => {
    closeSidebar()
  }, [location])

  return (
    <div
      className={`flex h-screen bg-gray-50 dark:bg-gray-900 ${
        isSidebarOpen && 'overflow-hidden'
      }`}
    >
      <Sidebar />

      <div className="flex flex-col flex-1 w-full">
        <Header />
        <Main>
          <Suspense fallback={<ThemedSuspense />}>
            <Switch>
              {routes.map((route, i) => {
                return route.component ? (
                  <PrivateRoute
                    key={i}
                    exact={true}
                    path={`/app${route.path}`}
                    roles={route.roles}
                    component={route.component}
                    // render={(props) => <route.component {...props} />}
                  />
                ) : null
              })}
              {user?.user_metadata?.role === 'admin-marketing' ||
              user?.user_metadata?.role === 'staff-marketing' ? (
                <Redirect exact from="/app" to="/app/marketing" />
              ) : user?.user_metadata?.role === 'admin-logistic' ||
                user?.user_metadata?.role === 'staff-logistic' ? (
                <Redirect exact from="/app" to="/app/logistic" />
              ) : user?.user_metadata?.role === 'admin-courier' ||
                user?.user_metadata?.role === 'staff-courier' ? (
                <Redirect exact from="/app" to="/app/courier" />
              ) : (
                <Redirect exact from="/app" to="/app/employee" />
              )}

              <Route component={Page404} />
            </Switch>
          </Suspense>
        </Main>
      </div>
    </div>
  )
}

export default Layout
