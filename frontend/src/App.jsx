import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import ProtectedLayout from './components/layout/ProtectedLayout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import TicketListPage from './pages/TicketListPage'
import TicketFormPage from './pages/TicketFormPage'
import TicketDetailPage from './pages/TicketDetailPage'
import UserManagementPage from './pages/UserManagementPage'
import CategoryManagementPage from './pages/CategoryManagementPage'
import NotFoundPage from './pages/NotFoundPage'

function AdminRoute({ children }) {
  const { user } = useAuth()
  if (user?.role !== 'ADMIN') return <Navigate to="/dashboard" replace />
  return children
}

function TechAdminRoute({ children }) {
  const { user } = useAuth()
  if (user?.role === 'USER') return <Navigate to="/tickets" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<TechAdminRoute><DashboardPage /></TechAdminRoute>} />
        <Route path="/tickets" element={<TicketListPage />} />
        <Route path="/tickets/new" element={<TicketFormPage />} />
        <Route path="/tickets/:id" element={<TicketDetailPage />} />
        <Route path="/users" element={<AdminRoute><UserManagementPage /></AdminRoute>} />
        <Route path="/categories" element={<AdminRoute><CategoryManagementPage /></AdminRoute>} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
