import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PlusCircle, Eye, Edit, Trash2, Calendar, MapPin, Users, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Card, Button, Input, Select, Textarea, Badge, StatusBadge, Modal, EmptyState } from '../../components/ui'
import { DataTable } from '../../components/shared'
import { useStore } from '../../hooks/useStore'
import { useApp } from '../../context/AppContext'
import { formatDate } from '../../lib/utils'

// ─── EVENTS LIST ───
export function AdminEventsPage() {
  const store = useStore()
  const { addToast } = useApp()
  const events = store.getEvents()
  const [deleteModal, setDeleteModal] = useState(null)

  const handleDelete = () => {
    if (deleteModal) {
      store.deleteEvent(deleteModal)
      addToast('Event deleted.', 'success')
      setDeleteModal(null)
    }
  }

  const columns = [
    {
      key: 'title', label: 'Event',
      render: r => (
        <div className="min-w-[200px]">
          <p className="font-semibold text-slate-700 truncate max-w-[280px]">{r.title}</p>
          <p className="text-[11px] text-slate-400">{r.type} • {r.department}</p>
        </div>
      )
    },
    { key: 'date', label: 'Date', render: r => <span className="text-slate-500 whitespace-nowrap">{formatDate(r.date)}</span> },
    { key: 'status', label: 'Status', render: r => <StatusBadge status={r.status} /> },
    {
      key: 'stats', label: 'Registrations',
      render: r => {
        const regs = store.getRegistrations(r.id)
        return <span className="text-slate-500">{regs.length} / {r.capacity}</span>
      }
    },
    {
      key: 'actions', label: '',
      render: r => (
        <div className="flex gap-1 justify-end">
          <button className="p-2 rounded-lg hover:bg-surface-100 text-slate-400 hover:text-brand-600 transition-colors"><Eye size={15} /></button>
          <button className="p-2 rounded-lg hover:bg-surface-100 text-slate-400 hover:text-brand-600 transition-colors"><Edit size={15} /></button>
          <button onClick={(e) => { e.stopPropagation(); setDeleteModal(r.id) }} className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
        </div>
      )
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800">Events</h1>
          <p className="text-sm text-slate-400 mt-0.5">Create and manage academic events</p>
        </div>
        <Link to="/admin/events/create"><Button icon={PlusCircle} size="sm">Create Event</Button></Link>
      </div>

      <Card>
        {events.length > 0 ? (
          <DataTable columns={columns} data={events} searchable searchPlaceholder="Search events..." />
        ) : (
          <EmptyState icon={Calendar} title="No Events" message="Create your first event to get started." action={<Link to="/admin/events/create"><Button icon={PlusCircle}>Create Event</Button></Link>} />
        )}
      </Card>

      <Modal open={!!deleteModal} onClose={() => setDeleteModal(null)} title="Delete Event" size="sm">
        <p className="text-sm text-slate-500 mb-4">Are you sure you want to delete this event? This will also remove all associated registrations and feedback. This action cannot be undone.</p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeleteModal(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete Event</Button>
        </div>
      </Modal>
    </div>
  )
}

// ─── CREATE EVENT ───
export function CreateEventPage() {
  const navigate = useNavigate()
  const store = useStore()
  const { addToast } = useApp()
  const [form, setForm] = useState({
    title: '', type: 'Seminar', description: '', venue: '',
    date: '', startTime: '', endTime: '',
    organizer: '', department: '', capacity: '100',
    status: 'active', feedbackEnabled: true,
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const update = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })) }

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    if (!form.venue.trim()) e.venue = 'Venue is required'
    if (!form.date) e.date = 'Date is required'
    if (!form.startTime) e.startTime = 'Required'
    if (!form.endTime) e.endTime = 'Required'
    if (!form.organizer.trim()) e.organizer = 'Organizer is required'
    if (!form.capacity || parseInt(form.capacity) < 1) e.capacity = 'Valid capacity required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setTimeout(() => {
      store.addEvent({ ...form, capacity: parseInt(form.capacity) })
      addToast('Event created successfully!', 'success')
      navigate('/admin/events')
      setLoading(false)
    }, 800)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin/events')} className="p-2 rounded-xl hover:bg-surface-100 text-slate-400"><ArrowLeft size={18} /></button>
        <div>
          <h1 className="text-xl font-extrabold text-slate-800">Create Event</h1>
          <p className="text-sm text-slate-400 mt-0.5">Set up a new academic event</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-700">Event Details</h3>
            <Input label="Event Title" placeholder="e.g. International Conference on AI in Education" value={form.title} onChange={e => update('title', e.target.value)} error={errors.title} required />
            <div className="grid sm:grid-cols-2 gap-4">
              <Select label="Event Type" options={[
                { value: 'Seminar', label: 'Seminar' }, { value: 'Conference', label: 'Conference' },
                { value: 'Workshop', label: 'Workshop' }, { value: 'Training', label: 'Training' },
              ]} value={form.type} onChange={e => update('type', e.target.value)} />
              <Select label="Status" options={[
                { value: 'active', label: 'Active' }, { value: 'upcoming', label: 'Upcoming' }, { value: 'draft', label: 'Draft' },
              ]} value={form.status} onChange={e => update('status', e.target.value)} />
            </div>
            <Textarea label="Description" placeholder="Provide a detailed description of the event..." value={form.description} onChange={e => update('description', e.target.value)} />
            <Input label="Venue" icon={MapPin} placeholder="Main Auditorium, Building A" value={form.venue} onChange={e => update('venue', e.target.value)} error={errors.venue} required />
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-700">Schedule & Capacity</h3>
            <Input label="Date" type="date" value={form.date} onChange={e => update('date', e.target.value)} error={errors.date} required />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Start Time" type="time" value={form.startTime} onChange={e => update('startTime', e.target.value)} error={errors.startTime} required />
              <Input label="End Time" type="time" value={form.endTime} onChange={e => update('endTime', e.target.value)} error={errors.endTime} required />
            </div>
            <Input label="Capacity" type="number" placeholder="150" value={form.capacity} onChange={e => update('capacity', e.target.value)} error={errors.capacity} required />
          </Card>

          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-700">Organizer</h3>
            <Input label="Organizer Name" placeholder="Dr. Maria Santos" value={form.organizer} onChange={e => update('organizer', e.target.value)} error={errors.organizer} required />
            <Input label="Department" placeholder="College of Computing" value={form.department} onChange={e => update('department', e.target.value)} />
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={form.feedbackEnabled} onChange={e => update('feedbackEnabled', e.target.checked)} className="rounded border-surface-300 text-brand-600" />
              <span className="text-sm text-slate-600">Enable feedback collection for this event</span>
            </label>
          </Card>

          <div className="flex gap-3">
            <Button variant="secondary" type="button" onClick={() => navigate('/admin/events')}>Cancel</Button>
            <Button type="submit" icon={CheckCircle2} loading={loading}>Publish Event</Button>
          </div>
        </form>

        {/* Preview */}
        <div>
          <Card className="p-5 sticky top-24">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Preview</h3>
            <div className="space-y-3">
              <div className="h-1.5 rounded-full bg-gradient-to-r from-brand-500 to-accent-500" />
              <div className="flex gap-2"><Badge>{form.type || 'Type'}</Badge><StatusBadge status={form.status} /></div>
              <p className="text-base font-bold text-slate-800">{form.title || 'Event Title'}</p>
              <p className="text-xs text-slate-400 line-clamp-3">{form.description || 'Event description...'}</p>
              {form.date && <p className="text-xs text-slate-400 flex items-center gap-1.5"><Calendar size={12} />{formatDate(form.date)}</p>}
              {form.venue && <p className="text-xs text-slate-400 flex items-center gap-1.5"><MapPin size={12} />{form.venue}</p>}
              {form.organizer && <p className="text-xs text-slate-400 flex items-center gap-1.5"><Users size={12} />{form.organizer}</p>}
              {form.capacity && <p className="text-xs text-slate-400 flex items-center gap-1.5"><Users size={12} />0 / {form.capacity} slots</p>}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
