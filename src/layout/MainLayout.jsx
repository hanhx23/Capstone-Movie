import { APP_CONFIG } from '@/config'
import { PRIVATE_PATH, PUBLIC_PATH } from '@/constant'
import { Footer, Header } from '@/shared/components'
import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router'
// import Header from '../../shared/components/Header'

const AUTH_ROUTES = [PUBLIC_PATH.SIGN_IN, PUBLIC_PATH.REGISTER]

export const MainLayout = () => {
  const userInfo = useSelector((s) => s.auth.userInfo)

  const { pathname } = useLocation

  const isAuthRoute = AUTH_ROUTES.some((route) => route.startsWith(pathname))
  const isPrivateRoute = Object.values(PRIVATE_PATH).some((route) => route.startsWith(pathname))

  const routeRender = () => {
    if (isAuthRoute && userInfo) {
      return (
        <>
          <Navigate to={PUBLIC_PATH.HOME} />
          <Outlet />
        </>
      )
    }
    if (isPrivateRoute && !userInfo) {
      return (
        <>
          <Navigate to={`${PUBLIC_PATH.SIGN_IN}?from=${pathname}`} />
          <Outlet />
        </>
      )
    }
    return <Outlet />
  }

  return (
    <div className='flex flex-col min-h-screen'>
      <Header
        className="bg-gray-900 text-white shadow-lg"
        style={{ minHeight: APP_CONFIG.HEADER_HEIGHT, display: "flex", alignItems: "center" }} />
      <main className='flex-1 overflow-auto container mx-auto py-5'>
        {routeRender()}
      </main>
      <Footer />
    </div>
  )
}

