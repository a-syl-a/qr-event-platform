import { Link } from 'react-router-dom'
import { Users, ClipboardCheck, MessageSquare, Star, PlusCircle, ScanLine, Download, Settings, ChevronRight, RefreshCw, Activity, Wifi, Database, Calendar, TrendingUp } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Card, Badge, StatusBadge, Button } from '../../components/ui'
import { KPICard, Avatar, ProgressRing } from '../../components/shared'
import { useStore } from '../../hooks/useStore'
import { formatDateTime } from '../../lib/utils'

const COLORS = ['#1a44f5', '#14b8a6', '#f59e0b', '#ef4444']

export default function AdminDashboard() {
  const store = useStore()
  const analytics = store.getAnalytics()
  const events = store.getEvents()
  const regs = store.getRegistrations()
  const feedback = store.getFeedback()

  // Registration trend data
  const trendData = [
    { name: 'Week 1', registrations: 3, attendance: 2 },
    { name: 'Week 2', registrations: 5, attendance: 4 },
    { name: 'Week 3', registrations: 4, attendance: 3 },
    { name: 'Week 4', registrations: regs.length, attendance: regs.filter(r => r.attended).length },
  ]

  // Participant type distribution
  const typeData = ['Student', 'Faculty', 'Researcher', 'Professional'].map((t, i) => ({
    name: t,
    value: regs.filter(r => r.type === t).length,
  })).filter(d => d.value > 0)

  // Recent activity
  const recentRegs = [...regs].sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt)).slice(0, 5)
  const recentFeedback = [...feedback].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)).slice(0, 3)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800">Dashboard</h1>
          <p className="text-sm text-slate-400 mt-0.5">Real-time event management overview</p>
        </div>
        <Button variant="secondary" size="sm" icon={RefreshCw} onClick={() => window.location.reload()}>Refresh</Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard icon={Users} label="Registrations" value={analytics.totalRegistrations} trend={12} />
        <KPICard icon={ClipboardCheck} label="Attendance Rate" value={`${analytics.attendanceRate}%`} sub={`${analytics.totalAttended} checked in`} trend={8} />
        <KPICard icon={MessageSquare} label="Feedback Rate" value={`${analytics.feedbackRate}%`} sub={`${analytics.totalFeedback} responses`} />
        <KPICard icon={Star} label="Satisfaction" value={`${analytics.avgSatisfaction}/5`} sub="Average rating" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Trend Chart */}
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-700">Registration & Attendance Trend</h3>
              <p className="text-xs text-slate-400 mt-0.5">Weekly overview</p>
            </div>
            <TrendingUp size={16} className="text-emerald-500" />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="regGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1a44f5" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#1a44f5" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Area type="monotone" dataKey="registrations" name="Registrations" stroke="#1a44f5" fill="url(#regGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="attendance" name="Attendance" stroke="#14b8a6" fill="url(#attGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Quick Actions */}
        <Card className="p-5">
          <h3 className="text-sm font-bold text-slate-700 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { icon: PlusCircle, label: 'Create Event', path: '/admin/events/create', desc: 'Set up a new event' },
              { icon: ScanLine, label: 'Open Scanner', path: '/admin/scanner', desc: 'Scan QR codes' },
              { icon: Download, label: 'Export Report', path: '/admin/reports', desc: 'Download analytics' },
              { icon: Settings, label: 'Settings', path: '/admin/settings', desc: 'Manage account' },
            ].map((a, i) => (
              <Link key={i} to={a.path} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 border border-surface-200 transition-all group">
                <div className="p-2 rounded-lg bg-brand-50 group-hover:bg-brand-100 transition-colors">
                  <a.icon size={16} className="text-brand-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-700">{a.label}</p>
                  <p className="text-[10px] text-slate-400">{a.desc}</p>
                </div>
                <ChevronRight size={14} className="text-slate-300" />
              </Link>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Registrations */}
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-700">Recent Registrations</h3>
            <Link to="/admin/registrations" className="text-xs font-semibold text-brand-600 hover:underline">View All</Link>
          </div>
          <div className="space-y-2.5">
            {recentRegs.map(r => {
              const event = store.getEvent(r.eventId)
              return (
                <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface-50/50 hover:bg-surface-50 transition-colors">
                  <Avatar name={r.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-700 truncate">{r.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{r.type} • {event?.title}</p>
                  </div>
                  <Badge variant={r.attended ? 'success' : 'default'}>{r.attended ? 'Attended' : 'Registered'}</Badge>
                </div>
              )
            })}
            {recentRegs.length === 0 && <p className="text-sm text-slate-400 text-center py-6">No registrations yet</p>}
          </div>
        </Card>

        {/* Participant Distribution */}
        <Card className="p-5">
          <h3 className="text-sm font-bold text-slate-700 mb-4">Participant Types</h3>
          {typeData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={typeData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={4} dataKey="value" strokeWidth={0}>
                    {typeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {typeData.map((d, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-slate-500">{d.name}</span>
                    </span>
                    <span className="font-semibold text-slate-700">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : <p className="text-sm text-slate-400 text-center py-6">No data yet</p>}
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Event Status */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-700">Events Overview</h3>
            <Link to="/admin/events" className="text-xs font-semibold text-brand-600 hover:underline">Manage</Link>
          </div>
          <div className="space-y-2.5">
            {events.map(e => {
              const eRegs = store.getRegistrations(e.id)
              const attended = eRegs.filter(r => r.attended).length
              const pct = eRegs.length > 0 ? Math.round((attended / eRegs.length) * 100) : 0
              return (
                <div key={e.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface-50/50">
                  <ProgressRing value={pct} size={44} strokeWidth={5} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-700 truncate">{e.title}</p>
                    <p className="text-[11px] text-slate-400">{eRegs.length} registered • {attended} attended</p>
                  </div>
                  <StatusBadge status={e.status} />
                </div>
              )
            })}
          </div>
        </Card>

        {/* System Status */}
        <Card className="p-5">
          <h3 className="text-sm font-bold text-slate-700 mb-4">System Status</h3>
          <div className="space-y-3">
            {[
              { icon: Wifi, title: 'Platform Status', desc: 'All systems operational', status: 'Online', color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { icon: Activity, title: 'QR Scanner', desc: 'Ready for scanning', status: 'Active', color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { icon: Database, title: 'Data Store', desc: `${regs.length} records`, status: 'Healthy', color: 'text-emerald-600', bg: 'bg-emerald-50' },
            ].map((s, i) => (
              <div key={i} className={`flex items-center gap-3 p-3.5 rounded-xl ${s.bg}`}>
                <s.icon size={18} className={s.color} />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-slate-700">{s.title}</p>
                  <p className="text-[10px] text-slate-400">{s.desc}</p>
                </div>
                <span className={`text-[10px] font-bold ${s.color} uppercase tracking-wider`}>{s.status}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
