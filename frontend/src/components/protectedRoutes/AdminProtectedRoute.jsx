import React from 'react'
import { Navigate } from 'react-router-dom'


const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem("user") || "null");4

  if(!token || !user || user.role !== "admin") {
    return <Navigate to='/' replace/> // redirect normal user to home page
  }
  return children
}

export default AdminProtectedRoute