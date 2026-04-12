import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Download, Users, QrCode, CheckCircle2, Eye } from 'lucide-react'
import { Card, Button, Badge, Select } from '../../components/ui'
import { DataTable, KPICard, Avatar } from '../../components/shared'
import { useStore } from '../../hooks/useStore'
import { useApp } from '../../context/AppContext'
import { formatDateTime } from '../../lib/utils'

export default function AdminRegistrationsPage() {
  const store = useStore()
  const { addToast } = useApp()
  const [eventFilter, setEventFilter] = useState('')
  const events = store.getEvents()
  
  const regs = store.getRegistrations(eventFilter || undefined)

  const handleExport = () => {
    const headers = ['Name', 'Email', 'Phone', 'Type', 'Affiliation', 'QR Code', 'Attended', 'Check-in Time']
    const rows = regs.map(r => [r.name, r.email, r.phone, r.type, r.affiliation, r.qrCode, r.attended ? 'Yes' : 'No', r.checkInTime || ''])
    const csv = [headers, ...rows].map(row => row.map(c => `"${c}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `registrations-${new Date().toISOString().split('T')[0]}.csv`; a.click()
    URL.revokeObjectURL(url)
    addToast('Registrations exported to CSV', 'success')
  }

  const columns = [
    {
      key: 'name', label: 'Participant',
      render: r => (
        <div className="flex items-center gap-3">
          <Avatar name={r.name} size="sm" />
          <div>
            <p className="font-semibold text-slate-700 text-sm">{r.name}</p>
            <p className="text-[11px] text-slate-400">{r.email}</p>
          </div>
        </div>
      )
    },
    { key: 'type', label: 'Type', render: r => <Badge variant="primary">{r.type}</Badge> },
    { key: 'affiliation', label: 'Affiliation', render: r => <span className="text-slate-500 text-xs">{r.affiliation}</span> },
    { key: 'qrCode', label: 'QR Code', render: r => <span className="font-mono text-xs text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">{r.qrCode}</span> },
    {
      key: 'status', label: 'Status',
      render: r => (
        <div className="flex flex-col gap-1">
          <Badge variant={r.attended ? 'success' : 'default'}>{r.attended ? 'Attended' : 'Registered'}</Badge>
          {r.feedbackSubmitted && <Badge variant="accent">Feedback ✓</Badge>}
        </div>
      )
    },
    {
      key: 'date', label: 'Registered',
      render: r => <span className="text-xs text-slate-400 whitespace-nowrap">{formatDateTime(r.registeredAt)}</span>
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800">Registrations</h1>
          <p className="text-sm text-slate-400 mt-0.5">Manage participant registrations across events</p>
        </div>
        <div className="flex gap-2">
          <select className="input-field !py-2 !text-xs max-w-[220px]" value={eventFilter} onChange={e => setEventFilter(e.target.value)}>
            <option value="">All Events</option>
            {events.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
          </select>
          <Button variant="secondary" size="sm" icon={Download} onClick={handleExport}>Export CSV</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard icon={Users} label="Total Registered" value={regs.length} />
        <KPICard icon={CheckCircle2} label="Attended" value={regs.filter(r => r.attended).length} />
        <KPICard icon={QrCode} label="QR Codes Issued" value={regs.length} />
        <KPICard icon={Users} label="Pending" value={regs.filter(r => !r.attended).length} />
      </div>

      <Card>
        <DataTable
          columns={columns}
          data={regs}
          searchable
          searchPlaceholder="Search by name, email, or QR code..."
          emptyMessage="No registrations found."
        />
      </Card>
    </div>
  )
}
