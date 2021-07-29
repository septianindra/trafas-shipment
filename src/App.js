import React, { lazy } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import AccessibleNavigationAnnouncer from './components/AccessibleNavigationAnnouncer'
import { PrivateRoute } from './routes/PrivateRoute'
import { AuthProvider } from './contexts/Auth'

const Layout = lazy(() => import('./containers/Layout'))
const Login = lazy(() => import('./pages/Login'))
const Dashboard = lazy(() => import('./pages/Dashboard'))

function App() {
  return (
    <>
      <Router>
        <AccessibleNavigationAnnouncer />
        <AuthProvider>
          <Switch>
            <Route path="/login" component={Login} />
            <PrivateRoute path="/dashboard" component={Dashboard} />
            <Route path="/app" component={Layout} />
            <Redirect exact from="/" to="/login" />
          </Switch>
        </AuthProvider>
      </Router>
    </>
  )
}

export default App
