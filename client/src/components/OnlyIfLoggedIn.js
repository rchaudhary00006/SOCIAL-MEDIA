import React from 'react'
import { KEY_ACCESS_TOKEN } from '../utils/localStorageManager'
import { Navigate, Outlet } from 'react-router-dom';

const OnlyIfLoggedIn = () => {
    const user = localStorage.getItem(KEY_ACCESS_TOKEN);
  return (
    user ? <Navigate to="/"/> : <Outlet/>
  )
}

export default OnlyIfLoggedIn