import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useApp } from './context/AppContext'
import { PublicNavbar, PublicFooter, AdminSidebar, AdminHeader, ParticipantHeader } from './components/layout'
import { ToastContainer } from './components/ui'

// Public pages
import HomePage from './pages/public/Home'
import { LoginPage, RegisterOrganizerPage } from './pages/public/Auth'

// Participant pages
import { EventsListPage, EventDetailsPage, ParticipantRegisterPage, ConfirmationPage, QRPassPage, MyPassesPage, FeedbackFormPage } from './pages/participant'

// Admin pages
import AdminDashboard from './pages/admin/Dashboard'
import { AdminEventsPage, CreateEventPage } from './pages/admin/Events'
import AdminScannerPage from './pages/admin/Scanner'
import AdminRegistrationsPage from './pages/admin/Registrations'
import AdminAttendancePage from './pages/admin/Attendance'
import AdminFeedbackPage from './pages/admin/Feedback'
import AdminReportsPage from './pages/admin/Reports'
import AdminSettingsPage from './pages/admin/Settings'

// ─── LAYOUTS ───
function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicNavbar />
      <main className="flex-1"><Outlet /></main>
      <PublicFooter />
    </div>
  )
}

function ParticipantLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-surface-50">
      <ParticipantHeader />
      <main className="flex-1"><Outlet /></main>
    </div>
  )
}

function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <div className="flex min-h-screen bg-surface-50">
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 min-w-0 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

// ─── PROTECTED ROUTE ───
function ProtectedRoute({ children }) {
  const { user } = useApp()
  const location = useLocation()
  
  if (!user || user.role !== 'organizer') {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return children || <Outlet />
}

// ─── APP ───
export default function App() {
  const { toasts, removeToast } = useApp()

  return (
    <>
      <Routes>
        {/* Public */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register-organizer" element={<RegisterOrganizerPage />} />
        </Route>

        {/* Participant */}
        <Route element={<ParticipantLayout />}>
          <Route path="/events" element={<EventsListPage />} />
          <Route path="/events/:id" element={<EventDetailsPage />} />
          <Route path="/participant/register/:eventId" element={<ParticipantRegisterPage />} />
          <Route path="/participant/confirmation/:regId" element={<ConfirmationPage />} />
          <Route path="/participant/qr-pass/:regId" element={<QRPassPage />} />
          <Route path="/participant/my-passes" element={<MyPassesPage />} />
          <Route path="/participant/feedback/:regId" element={<FeedbackFormPage />} />
        </Route>

        {/* Admin (Protected) */}
        <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/events" element={<AdminEventsPage />} />
          <Route path="/admin/events/create" element={<CreateEventPage />} />
          <Route path="/admin/scanner" element={<AdminScannerPage />} />
          <Route path="/admin/registrations" element={<AdminRegistrationsPage />} />
          <Route path="/admin/attendance" element={<AdminAttendancePage />} />
          <Route path="/admin/feedback" element={<AdminFeedbackPage />} />
          <Route path="/admin/reports" element={<AdminReportsPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}
