import { useState } from 'react'
import { Download, FileText, BarChart3, Users, MessageSquare, Star } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Card, Button, Badge, Select } from '../../components/ui'
import { DataTable, KPICard } from '../../components/shared'
import { useStore } from '../../hooks/useStore'
import { useApp } from '../../context/AppContext'
import { formatDate } from '../../lib/utils'

const COLORS = ['#1a44f5', '#14b8a6', '#f59e0b', '#ef4444']

export default function AdminReportsPage() {
  const store = useStore()
  const { addToast } = useApp()
  const [eventFilter, setEventFilter] = useState('')
  const [reportType, setReportType] = useState('summary')
  const events = store.getEvents()

  const generateReport = () => {
    const regs = store.getRegistrations(eventFilter || undefined)
    const feedback = store.getFeedback(eventFilter || undefined)
    const attended = regs.filter(r => r.attended)

    let csvContent = ''

    if (reportType === 'attendance' || reportType === 'summary') {
      csvContent += 'ATTENDANCE REPORT\n'
      csvContent += 'Name,Email,Type,Affiliation,QR Code,Attended,Check-in Time\n'
      regs.forEach(r => {
        csvContent += `"${r.name}","${r.email}","${r.type}","${r.affiliation}","${r.qrCode}","${r.attended ? 'Yes' : 'No'}","${r.checkInTime || ''}"\n`
      })
      csvContent += `\nTotal Registered,${regs.length}\nTotal Attended,${attended.length}\nAttendance Rate,${regs.length ? ((attended.length/regs.length)*100).toFixed(1) : 0}%\n`
    }

    if (reportType === 'feedback' || reportType === 'summary') {
      csvContent += '\n\nFEEDBACK REPORT\n'
      csvContent += 'Respondent,Ease of Use,Speed,Convenience,Clarity,Overall,Comment,Date\n'
      feedback.forEach(f => {
        const reg = store.getRegistration(f.registrationId)
        csvContent += `"${reg?.name || 'Unknown'}",${f.q1},${f.q2},${f.q3},${f.q4},${f.q5},"${f.comment || ''}","${f.submittedAt}"\n`
      })
      const avg = feedback.length > 0 ? (feedback.reduce((s, f) => s + (f.q1+f.q2+f.q3+f.q4+f.q5)/5, 0) / feedback.length).toFixed(2) : 0
      csvContent += `\nTotal Responses,${feedback.length}\nAverage Rating,${avg}\n`
    }

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `report-${reportType}-${new Date().toISOString().split('T')[0]}.csv`; a.click()
    URL.revokeObjectURL(url)
    addToast('Report exported successfully!', 'success')
  }

  // Chart data - attendance per event
  const eventChartData = events.map(ev => {
    const evRegs = store.getRegistrations(ev.id)
    const evAtt = evRegs.filter(r => r.attended).length
    return {
      name: ev.title.length > 20 ? ev.title.slice(0, 20) + '...' : ev.title,
      registered: evRegs.length,
      attended: evAtt,
    }
  })

  // Satisfaction per event
  const satData = events.map(ev => {
    const fb = store.getFeedback(ev.id)
    const avg = fb.length > 0 ? (fb.reduce((s, f) => s + (f.q1+f.q2+f.q3+f.q4+f.q5)/5, 0) / fb.length).toFixed(2) : 0
    return { name: ev.title.length > 20 ? ev.title.slice(0, 20) + '...' : ev.title, satisfaction: parseFloat(avg), responses: fb.length }
  })

  const analytics = store.getAnalytics()

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800">Reports</h1>
          <p className="text-sm text-slate-400 mt-0.5">Generate and export event reports</p>
        </div>
        <Button icon={Download} onClick={generateReport}>Export Report</Button>
      </div>

      {/* Filters */}
      <Card className="p-5">
        <h3 className="text-sm font-bold text-slate-700 mb-3">Report Configuration</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          <select className="input-field !py-2 !text-xs" value={eventFilter} onChange={e => setEventFilter(e.target.value)}>
            <option value="">All Events</option>
            {events.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
          </select>
          <select className="input-field !py-2 !text-xs" value={reportType} onChange={e => setReportType(e.target.value)}>
            <option value="summary">Full Summary</option>
            <option value="attendance">Attendance Only</option>
            <option value="feedback">Feedback Only</option>
          </select>
          <Button variant="secondary" icon={Download} onClick={generateReport} className="justify-center">Download CSV</Button>
        </div>
      </Card>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard icon={Users} label="Registrations" value={analytics.totalRegistrations} />
        <KPICard icon={BarChart3} label="Attendance Rate" value={`${analytics.attendanceRate}%`} />
        <KPICard icon={MessageSquare} label="Feedback Rate" value={`${analytics.feedbackRate}%`} />
        <KPICard icon={Star} label="Satisfaction" value={`${analytics.avgSatisfaction}/5`} />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="text-sm font-bold text-slate-700 mb-1">Attendance per Event</h3>
          <p className="text-xs text-slate-400 mb-4">Registered vs. Attended</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={eventChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Bar dataKey="registered" name="Registered" fill="#1a44f5" radius={[4, 4, 0, 0]} barSize={16} />
              <Bar dataKey="attended" name="Attended" fill="#14b8a6" radius={[4, 4, 0, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-bold text-slate-700 mb-1">Satisfaction per Event</h3>
          <p className="text-xs text-slate-400 mb-4">Average rating (out of 5.0)</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={satData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#94a3b8' }} />
              <YAxis domain={[0, 5]} tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Bar dataKey="satisfaction" name="Avg Rating" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={20}>
                {satData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Tables */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="text-sm font-bold text-slate-700 mb-4">Event Attendance Summary</h3>
          <DataTable columns={[
            { key: 'title', label: 'Event', render: r => <span className="text-sm font-medium text-slate-700 truncate max-w-[180px] block">{r.title}</span> },
            { key: 'reg', label: 'Registered', render: r => store.getRegistrations(r.id).length },
            { key: 'att', label: 'Attended', render: r => store.getRegistrations(r.id).filter(reg => reg.attended).length },
            { key: 'rate', label: 'Rate', render: r => {
              const regs = store.getRegistrations(r.id)
              const att = regs.filter(reg => reg.attended).length
              const rate = regs.length > 0 ? Math.round((att / regs.length) * 100) : 0
              return <span className="font-bold text-emerald-600">{rate}%</span>
            }},
          ]} data={events} />
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-bold text-slate-700 mb-4">Feedback Summary</h3>
          <DataTable columns={[
            { key: 'title', label: 'Event', render: r => <span className="text-sm font-medium text-slate-700 truncate max-w-[180px] block">{r.title}</span> },
            { key: 'responses', label: 'Responses', render: r => store.getFeedback(r.id).length },
            { key: 'avg', label: 'Avg Rating', render: r => {
              const fb = store.getFeedback(r.id)
              const avg = fb.length > 0 ? (fb.reduce((s, f) => s + (f.q1+f.q2+f.q3+f.q4+f.q5)/5, 0) / fb.length).toFixed(2) : '—'
              return <span className="font-bold text-brand-600">{avg}</span>
            }},
          ]} data={events} />
        </Card>
      </div>
    </div>
  )
}
