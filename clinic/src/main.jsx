import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Login from './pages/Login'
import './index.css'

//react router
import { createBrowserRouter, RouterProvider } from 'react-router'

//toastify
import Dashboard from './pages/Dashboard'
import { AuthProvider } from './contexts/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import DashboardLayout from './layouts/DashboardLayout'
import MedicalRecordList from './components/MedicalRecordList'
import RegisterFormPatient from './pages/RegisterFormPatient'
import { ToastContainer } from 'react-toastify'
import ConsultationForm from './components/ConsultationForm'
import PatientDetails from './components/PatientDetails'



export const router = createBrowserRouter([
    {path:"/", element:<Login/>},
    { 
      element: (
      <PrivateRoute>
        <DashboardLayout/>
      </PrivateRoute>
      ),
      children: [
        {path: "/dashboard", element: <Dashboard/>},
        { path: "/prontuarios", element: <MedicalRecordList/> },
        { path: "/pacientes", element: <RegisterFormPatient /> },
        { path: "/consultas", element: <ConsultationForm /> },
        { path: "/paciente/:id", element: <PatientDetails/> }
      ]
    }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <ToastContainer />
    <RouterProvider router={router}/>
    </AuthProvider>
  </StrictMode>,
)
