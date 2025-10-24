
import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import PublicReports from './pages/PublicReports'
import MapPage from './pages/MapPage'
import NewReport from './pages/NewReport'
import AdminDashboard from './pages/AdminDashboard'
import ReportDetail from './pages/ReportDetail'

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/publico', element: <PublicReports /> },
  { path: '/mapa', element: <MapPage /> },
  { path: '/nova', element: <NewReport /> },
  { path: '/admin', element: <AdminDashboard /> },
  { path: '/report/:id', element: <ReportDetail /> },
])

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
