import { useState } from 'react'
import { Users, ClipboardCheck, Clock, Percent } from 'lucide-react'
import { Card, Badge, Button } from '../../components/ui'
import { DataTable, KPICard, Avatar, ProgressRing } from '../../components/shared'
import { useStore } from '../../hooks/useStore'
import { formatDateTime, formatDate } from '../../lib/utils'

export default function AdminAttendancePage() {
  const store = useStore()
  const [eventFilter, setEventFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const events = store.getEvents()

  let regs = store.getRegistrations(eventFilter || undefined)
  if (statusFilter === 'attended') regs = regs.filter(r => r.attended)
  if (statusFilter === 'absent') regs = regs.filter(r => !r.attended)

  const total = store.getRegistrations(eventFilter || undefined)
  const attended = total.filter(r => r.attended)
  const rate = total.length > 0 ? ((attended.length / total.length) * 100).toFixed(1) : 0

  const columns = [
    {
      key: 'name', label: 'Participant',
      render: r => (
        <div className="flex items-center gap-3">
          <Avatar name={r.name} size="sm" />
          <div>
            <p className="font-semibold text-slate-700 text-sm">{r.name}</p>
            <p className="text-[11px] text-slate-400">{r.type} • {r.affiliation}</p>
          </div>
        </div>
      )
    },
    { key: 'qrCode', label: 'QR Code', render: r => <span className="font-mono text-xs text-brand-600">{r.qrCode}</span> },
    {
      key: 'checkInTime', label: 'Check-in Time',
      render: r => r.checkInTime
        ? <span className="text-xs text-slate-600">{formatDateTime(r.checkInTime)}</span>
        : <span className="text-xs text-slate-300">—</span>
    },
    {
      key: 'status', label: 'Status',
      render: r => (
        <Badge variant={r.attended ? 'success' : 'default'}>
          {r.attended ? '✓ Present' : 'Absent'}
        </Badge>
      )
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-extrabold text-slate-800">Attendance Records</h1>
        <p className="text-sm text-slate-400 mt-0.5">View and manage attendance logs</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard icon={Users} label="Total Registered" value={total.length} />
        <KPICard icon={ClipboardCheck} label="Checked In" value={attended.length} />
        <KPICard icon={Clock} label="Pending" value={total.length - attended.length} />
        <Card className="p-5 flex items-center justify-center">
          <ProgressRing value={parseFloat(rate)} size={72} strokeWidth={7} color="#14b8a6" label="Rate" />
        </Card>
      </div>

      {/* Per-event breakdown */}
      {!eventFilter && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map(ev => {
            const evRegs = store.getRegistrations(ev.id)
            const evAtt = evRegs.filter(r => r.attended).length
            const evRate = evRegs.length > 0 ? Math.round((evAtt / evRegs.length) * 100) : 0
            return (
              <Card key={ev.id} className="p-4 flex items-center gap-4 cursor-pointer hover:border-brand-200 transition-colors" onClick={() => setEventFilter(ev.id)}>
                <ProgressRing value={evRate} size={50} strokeWidth={5} color="#1a44f5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-700 truncate">{ev.title}</p>
                  <p className="text-xs text-slate-400">{evAtt} / {evRegs.length} attended</p>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Filters & Table */}
      <Card>
        <div className="p-4 border-b border-surface-200 flex flex-wrap gap-3">
          <select className="input-field !py-2 !text-xs max-w-[220px]" value={eventFilter} onChange={e => setEventFilter(e.target.value)}>
            <option value="">All Events</option>
            {events.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
          </select>
          <select className="input-field !py-2 !text-xs max-w-[160px]" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="attended">Present</option>
            <option value="absent">Absent</option>
          </select>
          {eventFilter && <Button variant="ghost" size="xs" onClick={() => setEventFilter('')}>Clear Filter</Button>}
        </div>
        <DataTable columns={columns} data={regs} searchable searchPlaceholder="Search attendees..." emptyMessage="No attendance records found." />
      </Card>
    </div>
  )
}
