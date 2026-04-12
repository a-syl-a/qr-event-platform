import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Calendar, MapPin, User, Clock, ArrowLeft, ArrowRight, Users, Mail, Phone, Building2, Send, CheckCircle2, QrCode, Printer, Download, Share2, ThumbsUp, AlertCircle, ScanLine } from 'lucide-react'
import { Button, Card, Input, Select, Textarea, Badge, StatusBadge, EmptyState } from '../../components/ui'
import { QRCodeDisplay } from '../../components/shared'
import { useStore } from '../../hooks/useStore'
import { useApp } from '../../context/AppContext'
import { formatDate, formatTime } from '../../lib/utils'

// ─── EVENTS LIST ───
export function EventsListPage() {
  const store = useStore()
  const events = store.getEvents().filter(e => e.status !== 'draft')

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-800">Academic Events</h1>
        <p className="text-sm text-slate-400 mt-1">Browse and register for upcoming seminars and conferences</p>
      </div>
      {events.length === 0 ? (
        <EmptyState icon={Calendar} title="No Events Available" message="Check back later for upcoming events." />
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {events.map(event => {
            const regs = store.getRegistrations(event.id)
            return (
              <Link key={event.id} to={`/events/${event.id}`} className="card-interactive overflow-hidden group">
                <div className="h-1.5 bg-gradient-to-r from-brand-500 to-accent-500" />
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <StatusBadge status={event.status} />
                    <Badge>{event.type}</Badge>
                  </div>
                  <h3 className="text-base font-bold text-slate-800 leading-snug group-hover:text-brand-600 transition-colors">{event.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{event.description}</p>
                  <div className="space-y-1.5 text-xs text-slate-400">
                    <p className="flex items-center gap-2"><Calendar size={13} />{formatDate(event.date)} • {formatTime(event.startTime)} – {formatTime(event.endTime)}</p>
                    <p className="flex items-center gap-2"><MapPin size={13} />{event.venue}</p>
                    <p className="flex items-center gap-2"><User size={13} />{event.organizer}</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-surface-200">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Users size={13} />{regs.length}/{event.capacity} registered
                    </div>
                    <span className="text-xs font-semibold text-brand-600 flex items-center gap-1">
                      View Details <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── EVENT DETAILS ───
export function EventDetailsPage() {
  const { id } = useParams()
  const store = useStore()
  const event = store.getEvent(id)
  const regs = store.getRegistrations(id)

  if (!event) return <div className="max-w-4xl mx-auto px-4 py-12"><EmptyState icon={Calendar} title="Event Not Found" message="This event doesn't exist." action={<Link to="/events" className="btn-primary">Browse Events</Link>} /></div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/events" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 mb-6 transition-colors"><ArrowLeft size={16} />Back to Events</Link>
      <Card className="overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-brand-500 to-accent-500" />
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap gap-2 mb-4"><StatusBadge status={event.status} /><Badge>{event.type}</Badge></div>
          <h1 className="text-2xl font-extrabold text-slate-800 mb-3">{event.title}</h1>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">{event.description}</p>
          <div className="grid sm:grid-cols-2 gap-3 mb-8">
            {[
              { icon: Calendar, l: 'Date', v: formatDate(event.date) },
              { icon: Clock, l: 'Time', v: `${formatTime(event.startTime)} – ${formatTime(event.endTime)}` },
              { icon: MapPin, l: 'Venue', v: event.venue },
              { icon: User, l: 'Organizer', v: event.organizer },
              { icon: Building2, l: 'Department', v: event.department },
              { icon: Users, l: 'Capacity', v: `${regs.length} / ${event.capacity} registered` },
            ].map((d, i) => (
              <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl bg-surface-50 border border-surface-200">
                <d.icon size={16} className="text-brand-600 flex-shrink-0" />
                <div><p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">{d.l}</p><p className="text-sm font-medium text-slate-700">{d.v}</p></div>
              </div>
            ))}
          </div>
          {event.status !== 'completed' && regs.length < event.capacity ? (
            <Link to={`/participant/register/${event.id}`} className="btn-primary !py-3 !text-base w-full sm:w-auto justify-center">
              <ScanLine size={18} /> Register for This Event
            </Link>
          ) : event.status === 'completed' ? (
            <div className="p-4 rounded-xl bg-surface-50 border border-surface-200 text-sm text-slate-500">This event has already been completed.</div>
          ) : (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-700">This event has reached full capacity.</div>
          )}
        </div>
      </Card>
    </div>
  )
}

// ─── PARTICIPANT REGISTRATION ───
export function ParticipantRegisterPage() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const store = useStore()
  const { addToast } = useApp()
  const event = store.getEvent(eventId)
  const [form, setForm] = useState({ name: '', email: '', phone: '', affiliation: '', type: 'Student', notes: '', privacy: false })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const update = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })) }

  if (!event) return <div className="max-w-2xl mx-auto px-4 py-12"><EmptyState icon={Calendar} title="Event Not Found" message="This event doesn't exist." /></div>

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Full name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address'
    if (!form.phone.trim()) e.phone = 'Contact number is required'
    if (!form.affiliation.trim()) e.affiliation = 'Affiliation is required'
    if (!form.privacy) e.privacy = 'You must accept the privacy notice'
    
    // Check duplicate
    const existing = store.getRegistrationByEmail(form.email, eventId)
    if (existing) e.email = 'This email is already registered for this event'
    
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setTimeout(() => {
      const reg = store.addRegistration({
        eventId, name: form.name, email: form.email, phone: form.phone,
        affiliation: form.affiliation, type: form.type,
      })
      addToast('Registration successful! QR code generated.', 'success')
      navigate(`/participant/confirmation/${reg.id}`)
      setLoading(false)
    }, 1200)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link to={`/events/${eventId}`} className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 mb-6 transition-colors"><ArrowLeft size={16} />Back to Event</Link>
      <Card className="p-6 sm:p-8">
        <h2 className="text-xl font-extrabold text-slate-800 mb-1">Event Registration</h2>
        <p className="text-sm text-slate-400 mb-6">Registering for: <span className="font-semibold text-slate-600">{event.title}</span></p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full Name" icon={User} placeholder="Juan Dela Cruz" value={form.name} onChange={e => update('name', e.target.value)} error={errors.name} required />
          <Input label="Email Address" icon={Mail} type="email" placeholder="juan@university.edu.ph" value={form.email} onChange={e => update('email', e.target.value)} error={errors.email} required />
          <Input label="Contact Number" icon={Phone} placeholder="+63 912 345 6789" value={form.phone} onChange={e => update('phone', e.target.value)} error={errors.phone} required />
          <Input label="Affiliation / Organization" icon={Building2} placeholder="College of Engineering" value={form.affiliation} onChange={e => update('affiliation', e.target.value)} error={errors.affiliation} required />
          <Select label="Participant Type" options={[
            { value: 'Student', label: 'Student' }, { value: 'Faculty', label: 'Faculty' },
            { value: 'Researcher', label: 'Researcher' }, { value: 'Professional', label: 'Professional' },
          ]} value={form.type} onChange={e => update('type', e.target.value)} />
          <Textarea label="Notes (Optional)" placeholder="Any special requirements or accessibility needs" value={form.notes} onChange={e => update('notes', e.target.value)} />
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input type="checkbox" checked={form.privacy} onChange={e => update('privacy', e.target.checked)} className="rounded border-surface-300 text-brand-600 mt-0.5" />
            <span className="text-xs text-slate-400 leading-relaxed">I consent to the collection and processing of my personal data for event management purposes as outlined in the data privacy notice.</span>
          </label>
          {errors.privacy && <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle size={12} />{errors.privacy}</p>}
          <Button className="w-full !py-3" loading={loading} icon={Send} disabled={!form.privacy}>Complete Registration</Button>
        </form>
      </Card>
    </div>
  )
}

// ─── CONFIRMATION ───
export function ConfirmationPage() {
  const { regId } = useParams()
  const store = useStore()
  const reg = store.getRegistration(regId)
  const event = reg ? store.getEvent(reg.eventId) : null

  if (!reg || !event) return <div className="max-w-lg mx-auto px-4 py-12"><EmptyState icon={CheckCircle2} title="Registration Not Found" message="Could not find this registration." action={<Link to="/events" className="btn-primary">Browse Events</Link>} /></div>

  return (
    <div className="max-w-lg mx-auto px-4 py-12 text-center">
      <Card className="p-8">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4 animate-bounce-subtle">
          <CheckCircle2 size={32} className="text-emerald-600" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-800 mb-2">Registration Successful!</h2>
        <p className="text-sm text-slate-400 mb-6">Your QR code has been generated for attendance verification.</p>
        <div className="p-4 rounded-xl bg-surface-50 border border-surface-200 mb-6 text-left space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-slate-400">Name</span><span className="font-medium text-slate-700">{reg.name}</span></div>
          <div className="flex justify-between"><span className="text-slate-400">Event</span><span className="font-medium text-slate-700 text-right max-w-[200px]">{event.title}</span></div>
          <div className="flex justify-between"><span className="text-slate-400">Date</span><span className="font-medium text-slate-700">{formatDate(event.date)}</span></div>
          <div className="flex justify-between"><span className="text-slate-400">Reference</span><span className="font-mono font-semibold text-brand-600">{reg.qrCode}</span></div>
        </div>
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-700 mb-6">
          Present your QR pass at the event venue for attendance verification.
        </div>
        <Link to={`/participant/qr-pass/${reg.id}`} className="btn-primary w-full justify-center !py-3">
          <QrCode size={18} /> View My QR Pass
        </Link>
      </Card>
    </div>
  )
}

// ─── QR PASS ───
export function QRPassPage() {
  const { regId } = useParams()
  const store = useStore()
  const reg = store.getRegistration(regId)
  const event = reg ? store.getEvent(reg.eventId) : null

  if (!reg || !event) return <div className="max-w-md mx-auto px-4 py-12"><EmptyState icon={QrCode} title="Pass Not Found" message="Could not find this QR pass." action={<Link to="/events" className="btn-primary">Browse Events</Link>} /></div>

  const handlePrint = () => window.print()
  const handleDownload = () => {
    const canvas = document.querySelector('.qr-pass-container img')
    if (canvas) {
      const link = document.createElement('a')
      link.download = `${reg.qrCode}.png`
      link.href = canvas.src
      link.click()
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <Card className="overflow-hidden qr-pass-container">
        <div className="bg-gradient-to-br from-brand-600 via-brand-700 to-navy-900 p-6 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="relative">
            <QrCode size={24} className="mx-auto mb-2" />
            <h2 className="text-lg font-bold">Digital Event Pass</h2>
            <p className="text-xs text-white/60">QR-Based Attendance Verification</p>
          </div>
        </div>
        <div className="p-6 space-y-5">
          <div className="flex justify-center">
            <div className="p-3 bg-white border-2 border-surface-200 rounded-2xl shadow-sm">
              <QRCodeDisplay value={reg.qrCode} size={200} />
            </div>
          </div>
          <p className="text-center font-mono text-sm font-bold text-brand-600 tracking-wider">{reg.qrCode}</p>
          <div className="space-y-0 divide-y divide-surface-100">
            {[
              { l: 'Participant', v: reg.name },
              { l: 'Event', v: event.title },
              { l: 'Date', v: formatDate(event.date) },
              { l: 'Time', v: `${formatTime(event.startTime)} – ${formatTime(event.endTime)}` },
              { l: 'Venue', v: event.venue },
              { l: 'Type', v: reg.type },
              { l: 'Status', v: reg.attended ? '✓ Checked In' : 'Pending Check-in' },
            ].map((d, i) => (
              <div key={i} className="flex justify-between items-center py-2.5">
                <span className="text-xs text-slate-400">{d.l}</span>
                <span className="text-xs font-medium text-slate-700 text-right max-w-[220px]">{d.v}</span>
              </div>
            ))}
          </div>
          <div className="p-3 rounded-xl bg-brand-50 border border-brand-100 text-xs text-brand-700">
            Present this QR code at the event entrance. Keep this pass accessible on your device.
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1" size="sm" icon={Printer} onClick={handlePrint}>Print</Button>
            <Button variant="secondary" className="flex-1" size="sm" icon={Download} onClick={handleDownload}>Save</Button>
            <Button variant="secondary" className="flex-1" size="sm" icon={Share2} onClick={() => { navigator.share?.({ title: 'QR Pass', text: reg.qrCode }) }}>Share</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

// ─── MY PASSES ───
export function MyPassesPage() {
  const store = useStore()
  const [email, setEmail] = useState('')
  const [passes, setPasses] = useState([])
  const [searched, setSearched] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    const regs = store.getRegistrations().filter(r => r.email.toLowerCase() === email.toLowerCase())
    setPasses(regs)
    setSearched(true)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-extrabold text-slate-800 mb-2">My Event Passes</h1>
      <p className="text-sm text-slate-400 mb-6">Enter your registered email to view your QR passes</p>
      <Card className="p-5 mb-6">
        <form onSubmit={handleSearch} className="flex gap-3">
          <Input icon={Mail} type="email" placeholder="Enter your registered email" value={email} onChange={e => setEmail(e.target.value)} className="flex-1" />
          <Button type="submit">Find Passes</Button>
        </form>
      </Card>
      {searched && passes.length === 0 && <EmptyState icon={QrCode} title="No Passes Found" message="No registrations found for this email address." />}
      {passes.length > 0 && (
        <div className="space-y-4">
          {passes.map(reg => {
            const event = store.getEvent(reg.eventId)
            return (
              <Card key={reg.id} interactive className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-slate-800">{event?.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">{formatDate(event?.date)} • {event?.venue}</p>
                    <p className="text-xs font-mono text-brand-600 mt-2">{reg.qrCode}</p>
                    <div className="flex gap-2 mt-3">
                      <Badge variant={reg.attended ? 'success' : 'warning'}>{reg.attended ? 'Checked In' : 'Not Yet'}</Badge>
                      {reg.attended && !reg.feedbackSubmitted && (
                        <Link to={`/participant/feedback/${reg.id}`}><Badge variant="accent">Give Feedback →</Badge></Link>
                      )}
                    </div>
                  </div>
                  <Link to={`/participant/qr-pass/${reg.id}`}>
                    <QRCodeDisplay value={reg.qrCode} size={80} className="rounded-lg" />
                  </Link>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── FEEDBACK FORM ───
export function FeedbackFormPage() {
  const { regId } = useParams()
  const navigate = useNavigate()
  const store = useStore()
  const { addToast } = useApp()
  const reg = store.getRegistration(regId)
  const event = reg ? store.getEvent(reg.eventId) : null
  const [ratings, setRatings] = useState({})
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const questions = [
    { id: 'q1', text: 'The system is easy to use.' },
    { id: 'q2', text: 'QR attendance scanning is fast.' },
    { id: 'q3', text: 'Feedback submission is convenient.' },
    { id: 'q4', text: 'The dashboard information is clear.' },
    { id: 'q5', text: 'Overall experience using the system is satisfactory.' },
  ]
  const scale = [
    { v: 1, l: 'Strongly Disagree' }, { v: 2, l: 'Disagree' },
    { v: 3, l: 'Neutral' }, { v: 4, l: 'Agree' }, { v: 5, l: 'Strongly Agree' },
  ]

  if (!reg || !event) return <EmptyState icon={MessageSquare} title="Not Found" message="Registration not found." />
  if (!reg.attended) return (
    <div className="max-w-md mx-auto px-4 py-12 text-center">
      <Card className="p-8"><AlertCircle size={40} className="text-amber-500 mx-auto mb-4" />
        <h2 className="text-lg font-bold text-slate-800 mb-2">Attendance Required</h2>
        <p className="text-sm text-slate-400 mb-4">You must check in at the event before submitting feedback.</p>
        <Link to={`/participant/qr-pass/${reg.id}`} className="btn-primary">View QR Pass</Link>
      </Card>
    </div>
  )
  if (reg.feedbackSubmitted) return (
    <div className="max-w-md mx-auto px-4 py-12 text-center">
      <Card className="p-8"><CheckCircle2 size={40} className="text-emerald-500 mx-auto mb-4" />
        <h2 className="text-lg font-bold text-slate-800 mb-2">Already Submitted</h2>
        <p className="text-sm text-slate-400 mb-4">You have already submitted feedback for this event. Thank you!</p>
        <Link to="/events" className="btn-primary">Back to Events</Link>
      </Card>
    </div>
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    if (Object.keys(ratings).length < 5) { addToast('Please rate all questions.', 'warning'); return }
    setLoading(true)
    setTimeout(() => {
      store.addFeedback({ registrationId: reg.id, eventId: reg.eventId, ...ratings, comment })
      addToast('Feedback submitted successfully!', 'success')
      setSubmitted(true)
      setLoading(false)
    }, 1000)
  }

  if (submitted) return (
    <div className="max-w-md mx-auto px-4 py-12 text-center">
      <Card className="p-8"><ThumbsUp size={40} className="text-emerald-500 mx-auto mb-4 animate-bounce-subtle" />
        <h2 className="text-lg font-bold text-slate-800 mb-2">Thank You!</h2>
        <p className="text-sm text-slate-400 mb-6">Your feedback has been submitted and will help improve future events.</p>
        <Link to="/events" className="btn-primary">Back to Events</Link>
      </Card>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Card className="p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-1"><CheckCircle2 size={16} className="text-emerald-500" /><span className="text-xs font-semibold text-emerald-600">Verified Attendee</span></div>
        <h2 className="text-xl font-extrabold text-slate-800 mb-1">Event Feedback</h2>
        <p className="text-sm text-slate-400 mb-6">{event.title}</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((q, qi) => (
            <div key={q.id} className="space-y-2.5">
              <p className="text-sm font-semibold text-slate-700">{qi + 1}. {q.text}</p>
              <div className="flex flex-wrap gap-2">
                {scale.map(s => (
                  <button key={s.v} type="button" onClick={() => setRatings(r => ({ ...r, [q.id]: s.v }))}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border-2 transition-all ${
                      ratings[q.id] === s.v 
                        ? 'bg-brand-600 text-white border-brand-600 shadow-sm' 
                        : 'bg-white text-slate-500 border-surface-200 hover:border-brand-300'
                    }`}>{s.v} – {s.l}</button>
                ))}
              </div>
            </div>
          ))}
          <Textarea label="Additional Comments (Optional)" placeholder="Share your thoughts about the event experience..." value={comment} onChange={e => setComment(e.target.value)} />
          <Button className="w-full !py-3" loading={loading} icon={Send} disabled={Object.keys(ratings).length < 5}>Submit Feedback</Button>
        </form>
      </Card>
    </div>
  )
}
