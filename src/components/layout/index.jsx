import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { cn } from '../../lib/utils'
import { useApp } from '../../context/AppContext'
import {
  QrCode, Menu, X, LogOut, ChevronLeft, ChevronsRight, Bell,
  LayoutDashboard, Calendar, Users, ScanLine, ClipboardCheck,
  MessageSquare, BarChart3, Settings, ChevronRight
} from 'lucide-react'

// ─── PUBLIC NAVBAR ───
export function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const links = [
    { path: '/', label: 'Home' },
    { path: '/events', label: 'Events' },
  ]

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-surface-200/60 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-brand-600 to-brand-700 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <QrCode size={18} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 leading-tight tracking-tight">QR-Attend</p>
              <p className="text-[10px] text-slate-400 leading-tight">Event Platform</p>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center gap-1">
            {links.map(l => (
              <Link key={l.path} to={l.path} className={cn(
                'px-3.5 py-2 text-sm font-medium rounded-xl transition-all duration-200',
                location.pathname === l.path
                  ? 'text-brand-600 bg-brand-50 font-semibold'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-surface-100'
              )}>{l.label}</Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2.5">
            <Link to="/login" className="btn-secondary !py-2 !text-xs">Organizer Login</Link>
            <Link to="/events" className="btn-primary !py-2 !text-xs">Register for Event</Link>
          </div>

          <button className="md:hidden p-2 rounded-xl hover:bg-surface-100" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-surface-200 bg-white p-4 space-y-2 animate-slide-up">
          {links.map(l => (
            <Link key={l.path} to={l.path} onClick={() => setMobileOpen(false)}
              className={cn('block px-4 py-2.5 text-sm font-medium rounded-xl', location.pathname === l.path ? 'text-brand-600 bg-brand-50' : 'text-slate-500')}>
              {l.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-surface-200 flex gap-2">
            <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-secondary flex-1 justify-center !py-2.5 !text-xs">Login</Link>
            <Link to="/events" onClick={() => setMobileOpen(false)} className="btn-primary flex-1 justify-center !py-2.5 !text-xs">Events</Link>
          </div>
        </div>
      )}
    </nav>
  )
}

// ─── PUBLIC FOOTER ───
export function PublicFooter() {
  return (
    <footer className="bg-navy-950 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
          <div className="max-w-md">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 bg-brand-600 rounded-xl flex items-center justify-center"><QrCode size={16} /></div>
              <span className="font-bold text-sm">QR-Attend Platform</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">Automating event attendance verification and feedback collection for academic seminars and conferences.</p>
          </div>
          <div className="flex gap-12">
            <div>
              <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-400 mb-3">Platform</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><Link to="/events" className="hover:text-white transition-colors">Events</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Organizer Login</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6">
          <p className="text-xs text-slate-600">© {new Date().getFullYear()} QR-Attend Platform. Academic Event Management System.</p>
        </div>
      </div>
    </footer>
  )
}

// ─── ADMIN SIDEBAR ───
export function AdminSidebar({ collapsed, setCollapsed }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useApp()

  const sections = [
    { label: 'Main', items: [
      { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
      { path: '/admin/events', icon: Calendar, label: 'Events' },
      { path: '/admin/registrations', icon: Users, label: 'Registrations' },
    ]},
    { label: 'Operations', items: [
      { path: '/admin/scanner', icon: ScanLine, label: 'QR Scanner' },
      { path: '/admin/attendance', icon: ClipboardCheck, label: 'Attendance' },
      { path: '/admin/feedback', icon: MessageSquare, label: 'Feedback' },
      { path: '/admin/reports', icon: BarChart3, label: 'Reports' },
    ]},
    { label: 'System', items: [
      { path: '/admin/settings', icon: Settings, label: 'Settings' },
    ]},
  ]

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path
    return location.pathname.startsWith(item.path)
  }

  return (
    <aside className={cn(
      'bg-navy-950 text-white flex-shrink-0 flex flex-col h-screen sticky top-0 transition-all duration-300 overflow-hidden',
      collapsed ? 'w-[68px]' : 'w-[240px]'
    )}>
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        {!collapsed && (
          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand-600 rounded-xl flex items-center justify-center"><QrCode size={16} /></div>
            <span className="text-sm font-bold">QR-Attend</span>
          </Link>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 transition-colors">
          {collapsed ? <ChevronsRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        {sections.map(s => (
          <div key={s.label}>
            {!collapsed && <p className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em]">{s.label}</p>}
            <div className="space-y-0.5">
              {s.items.map(item => (
                <Link key={item.path} to={item.path} className={cn(
                  'sidebar-link', collapsed && 'justify-center !px-2',
                  isActive(item) ? 'sidebar-link-active' : 'sidebar-link-inactive'
                )}>
                  <item.icon size={18} />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/5">
        <button onClick={() => { logout(); navigate('/') }} className={cn('sidebar-link sidebar-link-inactive w-full', collapsed && 'justify-center !px-2')}>
          <LogOut size={18} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  )
}

// ─── ADMIN HEADER ───
export function AdminHeader() {
  const { user } = useApp()
  const [notifOpen, setNotifOpen] = useState(false)

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-surface-200/60 sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-3">
        <div>
          <h1 className="text-sm font-semibold text-slate-700">Administration</h1>
          <p className="text-[11px] text-slate-400">Event Management Dashboard</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button onClick={() => setNotifOpen(!notifOpen)} className="p-2 rounded-xl hover:bg-surface-100 text-slate-400 transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-elevated border border-surface-200 p-2 animate-slide-up">
                <p className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Notifications</p>
                <div className="text-center py-6 text-xs text-slate-400">No new notifications</div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2.5 pl-3 border-l border-surface-200">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-[10px] font-bold">
              {user ? user.name.split(' ').map(n => n[0]).join('') : 'AD'}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-slate-700">{user?.name || 'Admin User'}</p>
              <p className="text-[10px] text-slate-400">Organizer</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

// ─── PARTICIPANT HEADER ───
export function ParticipantHeader() {
  const navigate = useNavigate()
  const { user, logout } = useApp()

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-surface-200/60 sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/events" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-brand-600 to-brand-700 rounded-xl flex items-center justify-center">
            <QrCode size={16} className="text-white" />
          </div>
          <span className="text-sm font-bold text-slate-800">QR-Attend</span>
        </Link>
        <div className="flex items-center gap-1">
          <Link to="/events" className="btn-ghost !text-xs"><Calendar size={14} /> Events</Link>
          {user && <Link to="/participant/my-passes" className="btn-ghost !text-xs"><QrCode size={14} /> My Passes</Link>}
          {user ? (
            <button onClick={() => { logout(); navigate('/') }} className="btn-ghost !text-xs"><LogOut size={14} /> Exit</button>
          ) : (
            <Link to="/login" className="btn-ghost !text-xs">Login</Link>
          )}
        </div>
      </div>
    </header>
  )
}
