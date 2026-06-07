import { useState, useEffect, useRef, useCallback } from "react"
import {
  Calendar, MapPin, Users, Clock, QrCode, Star, ArrowRight, ArrowLeft,
  CheckCircle2, MessageSquare, BarChart3, Bell, Settings, LogOut, Search,
  Plus, Download, Eye, Edit, Trash2, ScanLine, ChevronRight, ChevronDown,
  Shield, Zap, Smartphone, Award, Badge as BadgeIcon, FileText, Image,
  List, CheckSquare, Square, Copy, ExternalLink, Globe, Tag, Hash,
  TrendingUp, Percent, ThumbsUp, AlertCircle, X, Menu, Filter, Share2,
  Upload, Link, Lock, UserCheck, Layers, BookOpen, PieChart, Activity,
  RefreshCw, Mail, Phone, Building2, User, Send, Printer, Target,
  MapPinned, Sparkles, Trophy, Gift, Camera, Flag, ClipboardList
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart as RPieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts"

// ─── THEME ───────────────────────────────────────────────────────────────────
const COLORS = { brand: "#1a44f5", accent: "#14b8a6", amber: "#f59e0b", rose: "#ef4444", emerald: "#10b981", violet: "#8b5cf6", slate: "#64748b" }
const PIE_COLORS = ["#1a44f5","#14b8a6","#f59e0b","#ef4444","#8b5cf6"]

// ─── MOCK DATA STORE ──────────────────────────────────────────────────────────
function createStore() {
  const EVENTS = [
    {
      id: "evt-001", title: "AI in Education Summit 2025", type: "Conference", isPrivate: false,
      slug: "ai-education-summit-2025", privateLink: null,
      description: "Exploring AI/ML in academic institutions with live demos and keynote speakers.",
      venue: "Main Auditorium, College of Computing", location: "Quezon City, Metro Manila",
      date: "2025-08-15", startTime: "08:00", endTime: "17:00",
      organizer: "Dr. Maria Santos", department: "College of Computing",
      capacity: 150, status: "upcoming", feedbackEnabled: true,
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
      requiresCertificate: true, metaPixelId: "1234567890",
      taskTemplateId: "tmpl-001",
      tasks: [
        { id: "t1", label: "Send invitations", done: true, dueDate: "2025-07-30" },
        { id: "t2", label: "Confirm AV equipment", done: true, dueDate: "2025-08-01" },
        { id: "t3", label: "Prepare name tags", done: false, dueDate: "2025-08-14" },
        { id: "t4", label: "Print certificates", done: false, dueDate: "2025-08-14" },
        { id: "t5", label: "Set up registration booth", done: false, dueDate: "2025-08-15" },
      ],
      createdAt: "2025-06-01T08:00:00", tags: ["AI", "Education", "Conference"],
    },
    {
      id: "evt-002", title: "Research Methods Workshop", type: "Workshop", isPrivate: false,
      slug: "research-methods-workshop", privateLink: null,
      description: "Intensive workshop on quantitative and qualitative research for graduate students.",
      venue: "Room 301, Graduate School Building", location: "Makati City, Metro Manila",
      date: "2025-09-20", startTime: "09:00", endTime: "16:00",
      organizer: "Prof. James Cruz", department: "Graduate School",
      capacity: 80, status: "upcoming", feedbackEnabled: true,
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80",
      requiresCertificate: false, metaPixelId: "",
      taskTemplateId: "tmpl-002",
      tasks: [
        { id: "t1", label: "Book venue", done: true, dueDate: "2025-09-01" },
        { id: "t2", label: "Prepare workshop materials", done: false, dueDate: "2025-09-18" },
        { id: "t3", label: "Send calendar invites", done: false, dueDate: "2025-09-15" },
      ],
      createdAt: "2025-07-01T10:00:00", tags: ["Research", "Graduate", "Workshop"],
    },
    {
      id: "evt-003", title: "Cybersecurity Awareness Seminar", type: "Seminar", isPrivate: true,
      slug: "cybersecurity-awareness-2025", privateLink: "sec-access-7f3d",
      description: "Internal cybersecurity training for faculty and staff. Includes live threat demonstrations.",
      venue: "ICT Training Center", location: "Pasig City, Metro Manila",
      date: "2025-07-10", startTime: "13:00", endTime: "17:00",
      organizer: "Engr. Ana Reyes", department: "IT Department",
      capacity: 100, status: "completed", feedbackEnabled: true,
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
      requiresCertificate: true, metaPixelId: "",
      taskTemplateId: null,
      tasks: [
        { id: "t1", label: "Prepare slides", done: true, dueDate: "2025-07-08" },
        { id: "t2", label: "Test demo environment", done: true, dueDate: "2025-07-09" },
        { id: "t3", label: "Issue certificates", done: true, dueDate: "2025-07-12" },
      ],
      createdAt: "2025-06-15T14:00:00", tags: ["Security", "Internal"],
    },
  ]

  const REGISTRATIONS = [
    { id: "reg-001", eventId: "evt-001", name: "Juan Dela Cruz", email: "juan@edu.ph", phone: "+63 912 345 6789", affiliation: "College of Engineering", type: "Student", qrCode: "QR-E001-P001-2025", registeredAt: "2025-07-01T08:30:00", attended: false, checkInTime: null, feedbackSubmitted: false, isWalkIn: false, needsCertificate: true },
    { id: "reg-002", eventId: "evt-001", name: "Maria Garcia", email: "maria@edu.ph", phone: "+63 917 654 3210", affiliation: "College of Science", type: "Faculty", qrCode: "QR-E001-P002-2025", registeredAt: "2025-07-02T10:15:00", attended: false, checkInTime: null, feedbackSubmitted: false, isWalkIn: false, needsCertificate: false },
    { id: "reg-003", eventId: "evt-002", name: "Angela Torres", email: "angela@edu.ph", phone: "+63 919 333 4444", affiliation: "College of Computing", type: "Student", qrCode: "QR-E002-P001-2025", registeredAt: "2025-08-05T09:00:00", attended: false, checkInTime: null, feedbackSubmitted: false, isWalkIn: false, needsCertificate: true },
    { id: "reg-004", eventId: "evt-003", name: "Roberto Santos", email: "roberto@edu.ph", phone: "+63 920 555 6666", affiliation: "Graduate School", type: "Faculty", qrCode: "QR-E003-P001-2025", registeredAt: "2025-06-20T11:30:00", attended: true, checkInTime: "2025-07-10T13:05:00", feedbackSubmitted: true, isWalkIn: false, needsCertificate: true },
    { id: "reg-005", eventId: "evt-003", name: "Mark Lim", email: "mark@edu.ph", phone: "+63 922 999 0000", affiliation: "IT Department", type: "Faculty", qrCode: "QR-E003-P002-2025", registeredAt: "2025-06-22T13:00:00", attended: true, checkInTime: "2025-07-10T13:12:00", feedbackSubmitted: true, isWalkIn: false, needsCertificate: true },
    { id: "reg-006", eventId: "evt-003", name: "Walk-in Guest", email: "walkin-001@tmp", phone: "", affiliation: "Visitor", type: "Professional", qrCode: "QR-E003-WI001-2025", registeredAt: "2025-07-10T13:00:00", attended: true, checkInTime: "2025-07-10T13:00:00", feedbackSubmitted: false, isWalkIn: true, needsCertificate: false },
  ]

  const FEEDBACK = [
    { id: "fb-001", registrationId: "reg-004", eventId: "evt-003", q1: 5, q2: 5, q3: 4, q4: 5, q5: 5, comment: "Excellent event! The hands-on demos were very eye-opening. Would love a follow-up session.", submittedAt: "2025-07-10T16:45:00", isHighlighted: true, badge: "⭐ Top Reviewer" },
    { id: "fb-002", registrationId: "reg-005", eventId: "evt-003", q1: 4, q2: 5, q3: 5, q4: 4, q5: 4, comment: "Very informative session. The QR check-in was super smooth.", submittedAt: "2025-07-10T16:30:00", isHighlighted: false, badge: null },
  ]

  const TASK_TEMPLATES = [
    { id: "tmpl-001", name: "Conference Standard", tasks: ["Send invitations", "Confirm AV equipment", "Prepare name tags", "Print certificates", "Set up registration booth", "Post-event survey sent"] },
    { id: "tmpl-002", name: "Workshop Checklist", tasks: ["Book venue", "Prepare workshop materials", "Send calendar invites", "Arrange refreshments", "Print handouts"] },
    { id: "tmpl-003", name: "Seminar Basic", tasks: ["Prepare slides", "Test demo environment", "Issue certificates"] },
  ]

  let events = [...EVENTS]
  let registrations = [...REGISTRATIONS]
  let feedback = [...FEEDBACK]
  let taskTemplates = [...TASK_TEMPLATES]
  let organizer = { name: "Admin User", email: "admin@university.edu.ph", institution: "College of Computing" }

  return {
    getEvents: () => events,
    getEvent: (id) => events.find(e => e.id === id),
    getEventBySlug: (slug) => events.find(e => e.slug === slug),
    addEvent: (ev) => {
      const id = `evt-${String(events.length + 1).padStart(3, "0")}`
      const slug = ev.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
      const newEv = { ...ev, id, slug, tasks: (ev.taskTemplateId ? (taskTemplates.find(t => t.id === ev.taskTemplateId)?.tasks || []).map((label, i) => ({ id: `t${i+1}`, label, done: false, dueDate: "" })) : []), createdAt: new Date().toISOString() }
      events = [...events, newEv]
      return newEv
    },
    updateEvent: (id, upd) => { events = events.map(e => e.id === id ? { ...e, ...upd } : e) },
    toggleTask: (eventId, taskId) => {
      events = events.map(e => e.id === eventId ? { ...e, tasks: e.tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t) } : e)
    },
    addTask: (eventId, label) => {
      events = events.map(e => e.id === eventId ? { ...e, tasks: [...e.tasks, { id: `t${Date.now()}`, label, done: false, dueDate: "" }] } : e)
    },
    deleteEvent: (id) => { events = events.filter(e => e.id !== id); registrations = registrations.filter(r => r.eventId !== id); feedback = feedback.filter(f => f.eventId !== id) },
    getRegistrations: (eventId) => eventId ? registrations.filter(r => r.eventId === eventId) : registrations,
    getRegistration: (id) => registrations.find(r => r.id === id),
    addRegistration: (reg) => {
      const idx = registrations.filter(r => r.eventId === reg.eventId).length + 1
      const evNum = reg.eventId.replace("evt-", "")
      const prefix = reg.isWalkIn ? "WI" : "P"
      const newReg = { ...reg, id: `reg-${Date.now()}`, qrCode: `QR-E${evNum}-${prefix}${String(idx).padStart(3,"0")}-2025`, registeredAt: new Date().toISOString(), attended: reg.isWalkIn, checkInTime: reg.isWalkIn ? new Date().toISOString() : null, feedbackSubmitted: false }
      registrations = [...registrations, newReg]
      return newReg
    },
    markAttendance: (qr) => {
      const reg = registrations.find(r => r.qrCode === qr)
      if (!reg) return { success: false, type: "not_found" }
      if (reg.attended) return { success: false, type: "duplicate", registration: reg }
      registrations = registrations.map(r => r.id === reg.id ? { ...r, attended: true, checkInTime: new Date().toISOString() } : r)
      return { success: true, registration: registrations.find(r => r.id === reg.id) }
    },
    getFeedback: (eventId) => eventId ? feedback.filter(f => f.eventId === eventId) : feedback,
    addFeedback: (fb) => {
      const count = feedback.filter(f => f.eventId === fb.eventId).length
      const badge = count >= 2 ? "🏆 Super Reviewer" : count >= 1 ? "⭐ Top Reviewer" : null
      const newFb = { ...fb, id: `fb-${Date.now()}`, submittedAt: new Date().toISOString(), isHighlighted: (fb.q1+fb.q2+fb.q3+fb.q4+fb.q5)/5 >= 4.5, badge }
      feedback = [...feedback, newFb]
      registrations = registrations.map(r => r.id === fb.registrationId ? { ...r, feedbackSubmitted: true } : r)
      return newFb
    },
    getTaskTemplates: () => taskTemplates,
    addTaskTemplate: (tmpl) => {
      const newT = { ...tmpl, id: `tmpl-${Date.now()}` }
      taskTemplates = [...taskTemplates, newT]
      return newT
    },
    getAnalytics: () => {
      const regs = registrations; const att = regs.filter(r => r.attended); const fb = feedback
      const avg = fb.length > 0 ? fb.reduce((s, f) => s + (f.q1+f.q2+f.q3+f.q4+f.q5)/5, 0) / fb.length : 0
      return { totalEvents: events.length, totalRegistrations: regs.length, totalAttended: att.length, attendanceRate: regs.length > 0 ? ((att.length/regs.length)*100).toFixed(1) : 0, totalFeedback: fb.length, feedbackRate: att.length > 0 ? ((fb.length/att.length)*100).toFixed(1) : 0, avgSatisfaction: avg.toFixed(2) }
    },
    getOrganizer: () => organizer,
  }
}

const store = createStore()

// ─── UTILITIES ────────────────────────────────────────────────────────────────
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" }) : ""
const fmtTime = (t) => { if (!t) return ""; const [h,m] = t.split(":"); const ampm = h >= 12 ? "PM" : "AM"; return `${h%12||12}:${m} ${ampm}` }
const cn = (...args) => args.filter(Boolean).join(" ")

// Detect locale from browser
const getUserLocale = () => {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ""
  if (tz.includes("Manila") || tz.includes("Asia/Phil")) return { city: "Metro Manila", region: "NCR", country: "Philippines", flag: "🇵🇭" }
  if (tz.includes("Singapore")) return { city: "Singapore", region: "Central", country: "Singapore", flag: "🇸🇬" }
  if (tz.includes("Jakarta")) return { city: "Jakarta", region: "DKI Jakarta", country: "Indonesia", flag: "🇮🇩" }
  return { city: "Your Area", region: "Local", country: "Global", flag: "🌏" }
}

const locale = getUserLocale()

// Suggested events by locale (simulated)
const getLocaleSuggestions = (events) => events.filter(e => e.status !== "completed").slice(0, 3)

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
const Badge2 = ({ children, color = "blue", size = "sm" }) => {
  const cls = { blue: "bg-blue-50 text-blue-700 border-blue-100", teal: "bg-teal-50 text-teal-700 border-teal-100", amber: "bg-amber-50 text-amber-700 border-amber-100", red: "bg-red-50 text-red-700 border-red-100", green: "bg-emerald-50 text-emerald-700 border-emerald-100", violet: "bg-violet-50 text-violet-700 border-violet-100", gray: "bg-slate-50 text-slate-600 border-slate-200", private: "bg-rose-50 text-rose-700 border-rose-100" }
  return <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full border font-medium", size === "xs" ? "text-[10px]" : "text-[11px]", cls[color] || cls.gray)}>{children}</span>
}

const StatusBadge = ({ status }) => {
  const map = { active: ["green", "Active"], upcoming: ["blue", "Upcoming"], completed: ["gray", "Completed"], draft: ["amber", "Draft"] }
  const [c, l] = map[status] || ["gray", status]
  return <Badge2 color={c}><span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />{l}</Badge2>
}

const Card = ({ children, className = "", onClick }) => (
  <div onClick={onClick} className={cn("bg-white rounded-2xl border border-slate-100 shadow-sm", className)}>{children}</div>
)

const Btn = ({ children, onClick, variant = "primary", size = "md", icon: Icon, loading, disabled, className = "", type = "button" }) => {
  const base = "inline-flex items-center gap-2 font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm", lg: "px-6 py-3 text-base" }
  const variants = { primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-200", secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50", danger: "bg-red-600 text-white hover:bg-red-700", ghost: "text-slate-600 hover:bg-slate-100" }
  return (
    <button type={type} onClick={onClick} disabled={disabled || loading} className={cn(base, sizes[size], variants[variant], className)}>
      {loading ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : Icon ? <Icon size={size === "sm" ? 13 : 15} /> : null}
      {children}
    </button>
  )
}

const Input = ({ label, value, onChange, placeholder, type = "text", icon: Icon, error, required, disabled }) => (
  <div>
    {label && <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>}
    <div className="relative">
      {Icon && <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled}
        className={cn("w-full rounded-xl border text-sm px-3 py-2.5 outline-none transition-all", Icon && "pl-9", error ? "border-red-300 bg-red-50" : "border-slate-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-50", disabled && "opacity-50 cursor-not-allowed")} />
    </div>
    {error && <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1"><AlertCircle size={11} />{error}</p>}
  </div>
)

const Select = ({ label, value, onChange, options }) => (
  <div>
    {label && <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</label>}
    <select value={value} onChange={onChange} className="w-full rounded-xl border border-slate-200 bg-white text-sm px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all">
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
)

const Textarea = ({ label, value, onChange, placeholder, rows = 3 }) => (
  <div>
    {label && <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</label>}
    <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows}
      className="w-full rounded-xl border border-slate-200 bg-white text-sm px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all resize-none" />
  </div>
)

const Modal = ({ open, onClose, title, children, size = "md" }) => {
  if (!open) return null
  const maxW = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className={cn("relative bg-white rounded-2xl shadow-2xl w-full", maxW[size])} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><X size={16} /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

const StarRating = ({ value, onChange, readonly }) => (
  <div className="flex gap-1">
    {[1,2,3,4,5].map(n => (
      <button key={n} type="button" onClick={() => !readonly && onChange && onChange(n)} className={cn("transition-all", readonly ? "cursor-default" : "hover:scale-110")}>
        <Star size={20} className={n <= value ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-100"} />
      </button>
    ))}
  </div>
)

const KPICard = ({ icon: Icon, label, value, sub, trend, color = "blue" }) => {
  const colors = { blue: "bg-blue-50 text-blue-600", teal: "bg-teal-50 text-teal-600", amber: "bg-amber-50 text-amber-600", violet: "bg-violet-50 text-violet-600" }
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", colors[color] || colors.blue)}><Icon size={18} /></div>
        {trend && <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5"><TrendingUp size={11} />+{trend}%</span>}
      </div>
      <p className="text-2xl font-extrabold text-slate-800">{value}</p>
      <p className="text-xs font-semibold text-slate-500 mt-0.5">{label}</p>
      {sub && <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>}
    </Card>
  )
}

// ─── VIEWS ENUM ──────────────────────────────────────────────────────────────
const VIEWS = {
  HOME: "home", EVENTS_LIST: "events_list", EVENT_DETAIL: "event_detail",
  REGISTER: "register", CONFIRMATION: "confirmation", QR_PASS: "qr_pass",
  FEEDBACK: "feedback", FEEDBACK_SUCCESS: "feedback_success",
  LOGIN: "login",
  ADMIN_DASHBOARD: "admin_dashboard", ADMIN_EVENTS: "admin_events",
  ADMIN_CREATE_EVENT: "admin_create_event", ADMIN_EVENT_VIEW: "admin_event_view",
  ADMIN_SCANNER: "admin_scanner", ADMIN_FEEDBACK: "admin_feedback",
  ADMIN_REPORTS: "admin_reports", ADMIN_SETTINGS: "admin_settings",
  ADMIN_TASK_TEMPLATES: "admin_task_templates",
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState(VIEWS.HOME)
  const [user, setUser] = useState(null)
  const [params, setParams] = useState({})
  const [toasts, setToasts] = useState([])
  const [data, setData] = useState(0) // force re-renders

  const nav = useCallback((v, p = {}) => { setView(v); setParams(p); window.scrollTo(0,0) }, [])
  const refresh = () => setData(d => d + 1)

  const toast = useCallback((msg, type = "success") => {
    const id = Date.now()
    setToasts(t => [...t, { id, msg, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000)
  }, [])

  const login = (u) => { setUser(u); nav(VIEWS.ADMIN_DASHBOARD) }
  const logout = () => { setUser(null); nav(VIEWS.HOME) }

  const isAdmin = user?.role === "organizer"

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", minHeight: "100vh", background: "#f8fafc" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .animate-fade { animation: fadeIn 0.3s ease }
        .animate-slide { animation: slideUp 0.3s ease }
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
        .line-clamp-2 { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden }
        .line-clamp-3 { display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden }
        input, select, textarea, button { font-family: inherit }
        ::-webkit-scrollbar { width: 6px } ::-webkit-scrollbar-track { background: #f1f5f9 }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px }
        .glass { background: rgba(255,255,255,0.8); backdrop-filter: blur(12px) }
      `}</style>

      {/* Toast */}
      <div style={{ position: "fixed", top: 16, right: 16, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
        {toasts.map(t => (
          <div key={t.id} className="animate-slide" style={{ background: t.type === "success" ? "#10b981" : t.type === "error" ? "#ef4444" : "#1a44f5", color: "#fff", padding: "10px 16px", borderRadius: 12, fontSize: 13, fontWeight: 600, boxShadow: "0 4px 20px rgba(0,0,0,0.15)", minWidth: 220, display: "flex", alignItems: "center", gap: 8 }}>
            {t.type === "success" ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
            {t.msg}
          </div>
        ))}
      </div>

      {/* Render View */}
      {!isAdmin && <PublicLayout view={view} nav={nav} user={user} />}
      {isAdmin && <AdminLayout view={view} nav={nav} logout={logout} />}

      <div className="animate-fade">
        {/* PUBLIC VIEWS */}
        {view === VIEWS.HOME && <HomePage nav={nav} />}
        {view === VIEWS.EVENTS_LIST && <EventsListPage nav={nav} />}
        {view === VIEWS.EVENT_DETAIL && <EventDetailPage nav={nav} params={params} />}
        {view === VIEWS.REGISTER && <RegisterPage nav={nav} params={params} toast={toast} refresh={refresh} />}
        {view === VIEWS.CONFIRMATION && <ConfirmationPage nav={nav} params={params} />}
        {view === VIEWS.QR_PASS && <QRPassPage nav={nav} params={params} />}
        {view === VIEWS.FEEDBACK && <FeedbackPage nav={nav} params={params} toast={toast} refresh={refresh} />}
        {view === VIEWS.FEEDBACK_SUCCESS && <FeedbackSuccessPage nav={nav} params={params} />}
        {view === VIEWS.LOGIN && <LoginPage nav={nav} login={login} />}

        {/* ADMIN VIEWS */}
        {isAdmin && view === VIEWS.ADMIN_DASHBOARD && <AdminDashboard nav={nav} />}
        {isAdmin && view === VIEWS.ADMIN_EVENTS && <AdminEvents nav={nav} toast={toast} refresh={refresh} />}
        {isAdmin && view === VIEWS.ADMIN_CREATE_EVENT && <AdminCreateEvent nav={nav} params={params} toast={toast} refresh={refresh} />}
        {isAdmin && view === VIEWS.ADMIN_EVENT_VIEW && <AdminEventView nav={nav} params={params} toast={toast} refresh={refresh} />}
        {isAdmin && view === VIEWS.ADMIN_SCANNER && <AdminScanner nav={nav} params={params} toast={toast} refresh={refresh} />}
        {isAdmin && view === VIEWS.ADMIN_FEEDBACK && <AdminFeedback nav={nav} />}
        {isAdmin && view === VIEWS.ADMIN_REPORTS && <AdminReports nav={nav} toast={toast} />}
        {isAdmin && view === VIEWS.ADMIN_SETTINGS && <AdminSettings nav={nav} />}
        {isAdmin && view === VIEWS.ADMIN_TASK_TEMPLATES && <AdminTaskTemplates nav={nav} toast={toast} refresh={refresh} />}
      </div>
    </div>
  )
}

// ─── PUBLIC LAYOUT ────────────────────────────────────────────────────────────
function PublicLayout({ view, nav }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const isHome = view === VIEWS.HOME
  return (
    <nav style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid #e2e8f0", position: "sticky", top: 0, zIndex: 40 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => nav(VIEWS.HOME)} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer" }}>
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #1a44f5, #1436c4)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <QrCode size={18} color="white" />
          </div>
          <div style={{ textAlign: "left" }}>
            <p style={{ fontSize: 14, fontWeight: 800, color: "#1e293b", lineHeight: 1 }}>QR-Attend</p>
            <p style={{ fontSize: 10, color: "#94a3b8", lineHeight: 1, marginTop: 2 }}>Event Platform</p>
          </div>
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => nav(VIEWS.EVENTS_LIST)} style={{ padding: "6px 14px", borderRadius: 10, border: "1px solid #e2e8f0", background: "white", fontSize: 13, fontWeight: 600, color: "#475569", cursor: "pointer" }}>Events</button>
          <button onClick={() => nav(VIEWS.LOGIN)} style={{ padding: "6px 14px", borderRadius: 10, border: "none", background: "#1a44f5", fontSize: 13, fontWeight: 600, color: "white", cursor: "pointer" }}>Organizer</button>
        </div>
      </div>
    </nav>
  )
}

// ─── ADMIN LAYOUT ─────────────────────────────────────────────────────────────
function AdminLayout({ view, nav, logout }) {
  const [collapsed, setCollapsed] = useState(false)
  const org = store.getOrganizer()
  const navItems = [
    { icon: BarChart3, label: "Dashboard", v: VIEWS.ADMIN_DASHBOARD },
    { icon: Calendar, label: "Events", v: VIEWS.ADMIN_EVENTS },
    { icon: ScanLine, label: "Scanner", v: VIEWS.ADMIN_SCANNER },
    { icon: MessageSquare, label: "Feedback", v: VIEWS.ADMIN_FEEDBACK },
    { icon: FileText, label: "Reports", v: VIEWS.ADMIN_REPORTS },
    { icon: ClipboardList, label: "Task Templates", v: VIEWS.ADMIN_TASK_TEMPLATES },
    { icon: Settings, label: "Settings", v: VIEWS.ADMIN_SETTINGS },
  ]
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <div style={{ width: collapsed ? 64 : 220, background: "#0f172a", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", transition: "width 0.2s", flexShrink: 0, zIndex: 30 }}>
        <div style={{ padding: collapsed ? "16px 12px" : "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "space-between" }}>
          {!collapsed && <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#1a44f5,#1436c4)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}><QrCode size={15} color="white" /></div>
            <span style={{ fontSize: 13, fontWeight: 800, color: "white" }}>QR-Attend</span>
          </div>}
          <button onClick={() => setCollapsed(!collapsed)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: 4, display: "flex" }}>
            {collapsed ? <ChevronRight size={16} /> : <ArrowLeft size={16} />}
          </button>
        </div>
        <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
          {navItems.map(({ icon: Icon, label, v }) => (
            <button key={v} onClick={() => nav(v)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: collapsed ? "10px 12px" : "10px 14px", borderRadius: 10, border: "none", cursor: "pointer", marginBottom: 2, justifyContent: collapsed ? "center" : "flex-start", background: view === v ? "rgba(26,68,245,0.15)" : "none", color: view === v ? "#93c5fd" : "#64748b", transition: "all 0.15s" }}>
              <Icon size={17} />
              {!collapsed && <span style={{ fontSize: 13, fontWeight: 600 }}>{label}</span>}
            </button>
          ))}
        </nav>
        <div style={{ padding: collapsed ? "12px 8px" : "12px 16px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          {!collapsed && <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#1a44f5,#14b8a6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "white" }}>{org.name[0]}</div>
            <div><p style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}>{org.name}</p><p style={{ fontSize: 10, color: "#64748b" }}>Organizer</p></div>
          </div>}
          <button onClick={logout} style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 8, border: "none", background: "none", color: "#64748b", cursor: "pointer", justifyContent: collapsed ? "center" : "flex-start", fontSize: 12 }}>
            <LogOut size={15} /> {!collapsed && "Sign Out"}
          </button>
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div style={{ background: "white", borderBottom: "1px solid #e2e8f0", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 20 }}>
          <div />
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => nav(VIEWS.HOME)} style={{ padding: "5px 12px", borderRadius: 8, border: "1px solid #e2e8f0", background: "white", fontSize: 12, color: "#475569", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}><Globe size={13} />View Site</button>
            <Btn variant="primary" size="sm" icon={Plus} onClick={() => nav(VIEWS.ADMIN_CREATE_EVENT)}>New Event</Btn>
          </div>
        </div>
        <main style={{ flex: 1, padding: 24, maxWidth: 1300 }}>{/* children rendered by App */}</main>
      </div>
    </div>
  )
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ nav }) {
  const analytics = store.getAnalytics()
  const suggested = getLocaleSuggestions(store.getEvents())

  return (
    <div>
      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f2240 100%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 30% 20%, rgba(26,68,245,0.2) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(20,184,166,0.1) 0%, transparent 50%)" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 24px", position: "relative" }}>
          <div style={{ textAlign: "center", maxWidth: 680, margin: "0 auto" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 100, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", marginBottom: 20 }}>
              <MapPinned size={12} color="#94a3b8" />
              <span style={{ fontSize: 11, color: "#94a3b8" }}>{locale.flag} Showing events near {locale.city}</span>
            </div>
            <h1 style={{ fontSize: "clamp(32px,5vw,56px)", fontWeight: 900, color: "white", lineHeight: 1.1, marginBottom: 16 }}>
              Automate Event<br />
              <span style={{ background: "linear-gradient(90deg,#60a5fa,#34d399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Attendance & Feedback</span>
            </h1>
            <p style={{ fontSize: 16, color: "#94a3b8", lineHeight: 1.7, marginBottom: 32 }}>
              Register participants, scan QR codes, collect feedback, and generate post-event reports — all in one seamless platform.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => nav(VIEWS.EVENTS_LIST)} style={{ padding: "12px 28px", borderRadius: 14, background: "#1a44f5", color: "white", fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 8px 24px rgba(26,68,245,0.3)" }}><Calendar size={17} />Browse Events</button>
              <button onClick={() => nav(VIEWS.LOGIN)} style={{ padding: "12px 24px", borderRadius: 14, background: "rgba(255,255,255,0.08)", color: "white", fontWeight: 600, fontSize: 15, border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>Organizer Login<ArrowRight size={16} /></button>
            </div>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginTop: 40, maxWidth: 480, margin: "40px auto 0" }}>
              {[{ v: `${analytics.totalRegistrations}+`, l: "Registrations" }, { v: `${analytics.attendanceRate}%`, l: "Accuracy" }, { v: `${analytics.feedbackRate}%`, l: "Feedback Rate" }, { v: analytics.avgSatisfaction, l: "Satisfaction" }].map((s, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.06)", borderRadius: 14, padding: "12px 8px", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <p style={{ fontSize: 20, fontWeight: 800, color: "white" }}>{s.v}</p>
                  <p style={{ fontSize: 10, color: "#64748b" }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Suggested Events by Locale */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 24px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}><Sparkles size={17} color="#1a44f5" /></div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#1a44f5", textTransform: "uppercase", letterSpacing: "0.1em" }}>Suggested For You</p>
            <p style={{ fontSize: 13, color: "#64748b" }}>Based on your location · {locale.city}, {locale.country}</p>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
          {suggested.map(ev => <EventCard key={ev.id} event={ev} nav={nav} />)}
        </div>
      </section>

      {/* How it Works */}
      <section style={{ maxWidth: 1100, margin: "56px auto 0", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#1a44f5", textTransform: "uppercase", letterSpacing: "0.15em" }}>How It Works</p>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#1e293b", marginTop: 4 }}>Seamless Event Workflow</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: 16 }}>
          {[{ icon: Users, step: "01", title: "Register", desc: "Online form or walk-in quick add", color: "#1a44f5" }, { icon: QrCode, step: "02", title: "Get QR Pass", desc: "Unique scannable credential", color: "#14b8a6" }, { icon: ScanLine, step: "03", title: "Check In", desc: "Scan at venue — instant verify", color: "#f59e0b" }, { icon: MessageSquare, step: "04", title: "Feedback", desc: "Digital form + gamified badges", color: "#8b5cf6" }, { icon: FileText, step: "05", title: "Report", desc: "Download per-event report", color: "#ef4444" }].map((s, i) => (
            <Card key={i} className="p-5" style={{ textAlign: "center" }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: s.color + "15", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}><s.icon size={22} color={s.color} /></div>
              <p style={{ fontSize: 10, fontWeight: 700, color: s.color, letterSpacing: "0.15em" }}>{s.step}</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", marginTop: 2 }}>{s.title}</p>
              <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 4, lineHeight: 1.5 }}>{s.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ margin: "56px 24px 0", borderRadius: 24, background: "linear-gradient(135deg,#1a44f5,#0f172a)", padding: "56px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: "white", marginBottom: 8 }}>Ready to Streamline Your Next Event?</h2>
        <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 28 }}>Create, manage, and report — all in one place.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => nav(VIEWS.EVENTS_LIST)} style={{ padding: "12px 28px", borderRadius: 12, background: "white", color: "#1a44f5", fontWeight: 700, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}><Calendar size={16} />Browse Events</button>
          <button onClick={() => nav(VIEWS.LOGIN)} style={{ padding: "12px 28px", borderRadius: 12, background: "rgba(255,255,255,0.1)", color: "white", fontWeight: 600, border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer" }}>Organizer Login</button>
        </div>
      </section>
      <div style={{ height: 56 }} />
    </div>
  )
}

// ─── EVENT CARD COMPONENT ─────────────────────────────────────────────────────
function EventCard({ event, nav }) {
  return (
    <Card className="animate-slide" style={{ overflow: "hidden", cursor: "pointer", transition: "box-shadow 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }} onClick={() => nav(VIEWS.EVENT_DETAIL, { eventId: event.id })}>
      {event.image && <div style={{ height: 140, overflow: "hidden", position: "relative" }}>
        <img src={event.image} alt={event.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.target.style.display="none" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(15,23,42,0.5))" }} />
        <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 6 }}>
          <StatusBadge status={event.status} />
          {event.isPrivate && <Badge2 color="private"><Lock size={9} />Private</Badge2>}
        </div>
      </div>}
      <div style={{ padding: "16px" }}>
        {!event.image && <div style={{ display: "flex", gap: 6, marginBottom: 8 }}><StatusBadge status={event.status} />{event.isPrivate && <Badge2 color="private"><Lock size={9} />Private</Badge2>}</div>}
        <Badge2 color="gray" size="xs">{event.type}</Badge2>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", margin: "8px 0 6px", lineHeight: 1.3 }} className="line-clamp-2">{event.title}</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <p style={{ fontSize: 11, color: "#94a3b8", display: "flex", alignItems: "center", gap: 6 }}><Calendar size={11} />{fmtDate(event.date)} · {fmtTime(event.startTime)}</p>
          <p style={{ fontSize: 11, color: "#94a3b8", display: "flex", alignItems: "center", gap: 6 }}><MapPin size={11} />{event.location || event.venue}</p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, paddingTop: 12, borderTop: "1px solid #f1f5f9" }}>
          <div style={{ fontSize: 11, color: "#94a3b8", display: "flex", alignItems: "center", gap: 4 }}><Users size={11} />{store.getRegistrations(event.id).length}/{event.capacity}</div>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#1a44f5", display: "flex", alignItems: "center", gap: 4 }}>Register<ArrowRight size={11} /></span>
        </div>
      </div>
    </Card>
  )
}

// ─── EVENTS LIST PAGE ─────────────────────────────────────────────────────────
function EventsListPage({ nav }) {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const events = store.getEvents().filter(e => !e.isPrivate && e.status !== "draft" && (!search || e.title.toLowerCase().includes(search.toLowerCase())) && (!typeFilter || e.type === typeFilter))

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1e293b", marginBottom: 4 }}>Upcoming Events</h1>
      <p style={{ color: "#94a3b8", fontSize: 13, marginBottom: 24 }}>Discover and register for events · {locale.flag} {locale.city}</p>
      <div style={{ display: "flex", gap: 10, marginBottom: 28, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events..." style={{ width: "100%", padding: "9px 10px 9px 32px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 13, outline: "none" }} />
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{ padding: "9px 14px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 13, outline: "none", background: "white" }}>
          <option value="">All Types</option>
          {["Conference","Workshop","Seminar","Training"].map(t => <option key={t}>{t}</option>)}
        </select>
      </div>
      {events.length === 0 ? <div style={{ textAlign: "center", padding: "60px 24px", color: "#94a3b8" }}><Calendar size={40} style={{ margin: "0 auto 12px", opacity: 0.3 }} /><p style={{ fontWeight: 600 }}>No events found</p></div>
        : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px,1fr))", gap: 20 }}>{events.map(ev => <EventCard key={ev.id} event={ev} nav={nav} />)}</div>}
    </div>
  )
}

// ─── EVENT DETAIL PAGE ────────────────────────────────────────────────────────
function EventDetailPage({ nav, params }) {
  const event = store.getEvent(params.eventId)
  if (!event) return <div style={{ textAlign: "center", padding: 60 }}><p>Event not found.</p></div>
  const regs = store.getRegistrations(event.id)
  const isFull = regs.length >= event.capacity

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
      <button onClick={() => nav(VIEWS.EVENTS_LIST)} style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748b", background: "none", border: "none", cursor: "pointer", fontSize: 13, marginBottom: 20 }}><ArrowLeft size={15} />Back to Events</button>
      {event.image && <div style={{ height: 260, borderRadius: 20, overflow: "hidden", marginBottom: 24 }}>
        <img src={event.image} alt={event.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start" }}>
        <div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            <StatusBadge status={event.status} />
            <Badge2 color="gray">{event.type}</Badge2>
            {event.isPrivate && <Badge2 color="private"><Lock size={10} />Private Event</Badge2>}
            {event.requiresCertificate && <Badge2 color="violet"><Award size={10} />Certificate Issued</Badge2>}
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1e293b", marginBottom: 12, lineHeight: 1.2 }}>{event.title}</h1>
          <p style={{ color: "#64748b", lineHeight: 1.7, fontSize: 14, marginBottom: 24 }}>{event.description}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[{ icon: Calendar, l: "Date", v: fmtDate(event.date) }, { icon: Clock, l: "Time", v: `${fmtTime(event.startTime)} – ${fmtTime(event.endTime)}` }, { icon: MapPin, l: "Venue", v: event.venue }, { icon: Building2, l: "Department", v: event.department }, { icon: User, l: "Organizer", v: event.organizer }, { icon: Users, l: "Capacity", v: `${regs.length} / ${event.capacity} registered` }].map((d, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: "10px 14px", borderRadius: 12, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <d.icon size={14} color="#1a44f5" />
                <div><p style={{ fontSize: 9, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>{d.l}</p><p style={{ fontSize: 12, fontWeight: 600, color: "#334155" }}>{d.v}</p></div>
              </div>
            ))}
          </div>
          {event.tags?.length > 0 && <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 16 }}>
            {event.tags.map(t => <Badge2 key={t} color="blue"><Tag size={9} />{t}</Badge2>)}
          </div>}
        </div>

        {/* Register CTA */}
        <div>
          <Card className="p-5" style={{ position: "sticky", top: 80 }}>
            <div style={{ height: 6, borderRadius: "6px 6px 0 0", background: "linear-gradient(90deg,#1a44f5,#14b8a6)", margin: "-20px -20px 16px" }} />
            <p style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 4 }}>Register for this event</p>
            {event.requiresCertificate && <p style={{ fontSize: 11, color: "#8b5cf6", marginBottom: 12, display: "flex", alignItems: "center", gap: 5 }}><Award size={11} />Certificate of attendance available</p>}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: "#64748b" }}>Spots filled</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#1e293b" }}>{regs.length}/{event.capacity}</span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: "#e2e8f0" }}>
                <div style={{ height: "100%", borderRadius: 3, background: isFull ? "#ef4444" : "#1a44f5", width: `${Math.min(100, (regs.length/event.capacity)*100)}%`, transition: "width 0.3s" }} />
              </div>
            </div>
            {event.status === "completed" ? <div style={{ padding: "10px 14px", borderRadius: 10, background: "#f8fafc", color: "#94a3b8", fontSize: 12 }}>This event has ended.</div>
              : isFull ? <div style={{ padding: "10px 14px", borderRadius: 10, background: "#fef3c7", color: "#92400e", fontSize: 12 }}>Event is full.</div>
              : <>
                <button onClick={() => nav(VIEWS.REGISTER, { eventId: event.id })} style={{ width: "100%", padding: "12px", borderRadius: 12, background: "#1a44f5", color: "white", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}><QrCode size={16} />Register Now</button>
                <button onClick={() => nav(VIEWS.REGISTER, { eventId: event.id, walkIn: true })} style={{ width: "100%", padding: "10px", borderRadius: 10, background: "#f1f5f9", color: "#475569", fontWeight: 600, fontSize: 12, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}><UserCheck size={13} />Walk-in (Skip form)</button>
              </>}
            {event.isPrivate && <p style={{ fontSize: 10, color: "#94a3b8", textAlign: "center", marginTop: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}><Lock size={10} />Private event · Access via link only</p>}
          </Card>
        </div>
      </div>
    </div>
  )
}

// ─── REGISTER PAGE ────────────────────────────────────────────────────────────
function RegisterPage({ nav, params, toast, refresh }) {
  const event = store.getEvent(params.eventId)
  const isWalkIn = params.walkIn === true
  const [form, setForm] = useState({ name: isWalkIn ? "Walk-in Guest" : "", email: isWalkIn ? `walkin-${Date.now()}@tmp` : "", phone: "", affiliation: "Visitor", type: "Professional", needsCertificate: false, privacy: isWalkIn })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  if (!event) return null

  // Walk-in: skip form, register immediately
  useEffect(() => {
    if (isWalkIn) {
      const reg = store.addRegistration({ eventId: params.eventId, ...form, isWalkIn: true, needsCertificate: false })
      refresh()
      nav(VIEWS.CONFIRMATION, { regId: reg.id })
    }
  }, [])

  if (isWalkIn) return <div style={{ textAlign: "center", padding: 80 }}><div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid #1a44f5", borderTopColor: "transparent", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} /><p style={{ color: "#64748b" }}>Processing walk-in...</p><style>{"@keyframes spin{to{transform:rotate(360deg)}}"}</style></div>

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = "Required"
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required"
    if (!form.phone.trim()) e.phone = "Required"
    if (!form.affiliation.trim()) e.affiliation = "Required"
    if (!form.privacy) e.privacy = "Required"
    setErrors(e); return Object.keys(e).length === 0
  }

  const submit = () => {
    if (!validate()) return
    setLoading(true)
    setTimeout(() => {
      const reg = store.addRegistration({ ...form, eventId: params.eventId, isWalkIn: false, needsCertificate: form.needsCertificate })
      refresh(); toast("Registered! Your QR pass is ready.", "success")
      nav(VIEWS.CONFIRMATION, { regId: reg.id })
    }, 1000)
  }

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "32px 24px" }}>
      <button onClick={() => nav(VIEWS.EVENT_DETAIL, { eventId: params.eventId })} style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748b", background: "none", border: "none", cursor: "pointer", fontSize: 13, marginBottom: 20 }}><ArrowLeft size={15} />Back</button>
      <Card className="p-6">
        <div style={{ height: 4, borderRadius: 4, background: "linear-gradient(90deg,#1a44f5,#14b8a6)", marginBottom: 20 }} />
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1e293b", marginBottom: 4 }}>Event Registration</h2>
        <p style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>For: <b>{event.title}</b></p>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Input label="Full Name" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="Juan Dela Cruz" icon={User} error={errors.name} required />
          <Input label="Email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} placeholder="juan@email.com" icon={Mail} type="email" error={errors.email} required />
          <Input label="Phone" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} placeholder="+63 912 345 6789" icon={Phone} error={errors.phone} required />
          <Input label="Affiliation / Organization" value={form.affiliation} onChange={e => setForm(f => ({...f, affiliation: e.target.value}))} placeholder="College of Engineering" icon={Building2} error={errors.affiliation} required />
          <Select label="Participant Type" value={form.type} onChange={e => setForm(f => ({...f, type: e.target.value}))} options={["Student","Faculty","Researcher","Professional"].map(v => ({value:v,label:v}))} />
          {event.requiresCertificate && <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "10px 12px", borderRadius: 10, background: "#f5f3ff", border: "1px solid #e9d5ff" }}>
            <input type="checkbox" checked={form.needsCertificate} onChange={e => setForm(f => ({...f, needsCertificate: e.target.checked}))} />
            <div><p style={{ fontSize: 13, fontWeight: 600, color: "#6d28d9", display: "flex", alignItems: "center", gap: 5 }}><Award size={13} />I need a Certificate of Attendance</p><p style={{ fontSize: 11, color: "#7c3aed" }}>Will be prepared for qualifying attendees</p></div>
          </label>}
          <label style={{ display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer" }}>
            <input type="checkbox" checked={form.privacy} onChange={e => setForm(f => ({...f, privacy: e.target.checked}))} style={{ marginTop: 2 }} />
            <span style={{ fontSize: 11, color: "#64748b", lineHeight: 1.6 }}>I consent to collection of my personal data for event management purposes.</span>
          </label>
          {errors.privacy && <p style={{ fontSize: 11, color: "#ef4444", display: "flex", alignItems: "center", gap: 4 }}><AlertCircle size={11} />{errors.privacy}</p>}
          <Btn variant="primary" size="lg" onClick={submit} loading={loading} disabled={!form.privacy} icon={QrCode}>Complete Registration</Btn>
        </div>
      </Card>
    </div>
  )
}

// ─── CONFIRMATION PAGE ────────────────────────────────────────────────────────
function ConfirmationPage({ nav, params }) {
  const reg = store.getRegistration(params.regId)
  const event = reg ? store.getEvent(reg.eventId) : null
  if (!reg || !event) return null
  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "48px 24px", textAlign: "center" }}>
      <Card className="p-8">
        <div style={{ width: 64, height: 64, borderRadius: 20, background: "#d1fae5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}><CheckCircle2 size={32} color="#10b981" /></div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1e293b", marginBottom: 6 }}>Registration Successful!</h2>
        <p style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>{reg.isWalkIn ? "Walk-in registered and checked in." : "Your QR pass has been generated."}</p>
        <div style={{ padding: "14px 16px", borderRadius: 14, background: "#f8fafc", border: "1px solid #e2e8f0", marginBottom: 20, textAlign: "left" }}>
          {[["Name", reg.name], ["Event", event.title], ["Date", fmtDate(event.date)], ["QR Code", reg.qrCode], ...(reg.needsCertificate ? [["Certificate", "✓ Requested"]] : [])].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #f1f5f9", fontSize: 12 }}>
              <span style={{ color: "#94a3b8" }}>{k}</span><span style={{ fontWeight: 600, color: "#334155" }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button onClick={() => nav(VIEWS.QR_PASS, { regId: reg.id })} style={{ padding: "11px", borderRadius: 12, background: "#1a44f5", color: "white", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><QrCode size={16} />View QR Pass</button>
          <button onClick={() => nav(VIEWS.EVENTS_LIST)} style={{ padding: "11px", borderRadius: 12, background: "#f1f5f9", color: "#475569", fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer" }}>Back to Events</button>
        </div>
      </Card>
    </div>
  )
}

// ─── QR PASS PAGE ─────────────────────────────────────────────────────────────
function QRPassPage({ nav, params }) {
  const reg = store.getRegistration(params.regId)
  const event = reg ? store.getEvent(reg.eventId) : null
  if (!reg || !event) return null

  // Simple QR visual
  const QRVisual = ({ code }) => (
    <svg viewBox="0 0 120 120" width={180} height={180} style={{ display: "block", margin: "0 auto" }}>
      <rect width={120} height={120} fill="white" rx={8} />
      {[...Array(11)].map((_, r) => [...Array(11)].map((_, c) => {
        const seed = (code.charCodeAt((r*11+c) % code.length) + r*7 + c*13) % 4
        if (seed === 0) return <rect key={`${r}-${c}`} x={6+c*10} y={6+r*10} width={9} height={9} fill="#1e293b" rx={1} />
        return null
      }))}
      <rect x={6} y={6} width={29} height={29} fill="none" stroke="#1e293b" strokeWidth={3} rx={2} />
      <rect x={11} y={11} width={19} height={19} fill="#1e293b" rx={2} />
      <rect x={81} y={6} width={29} height={29} fill="none" stroke="#1e293b" strokeWidth={3} rx={2} />
      <rect x={86} y={11} width={19} height={19} fill="#1e293b" rx={2} />
      <rect x={6} y={81} width={29} height={29} fill="none" stroke="#1e293b" strokeWidth={3} rx={2} />
      <rect x={11} y={86} width={19} height={19} fill="#1e293b" rx={2} />
    </svg>
  )

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: "32px 24px", textAlign: "center" }}>
      <Card className="p-6">
        <div style={{ height: 5, margin: "-24px -24px 20px", borderRadius: "16px 16px 0 0", background: "linear-gradient(90deg,#1a44f5,#14b8a6)" }} />
        <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 4 }}>QR Event Pass</p>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: "#1e293b", marginBottom: 4 }}>{reg.name}</h3>
        <p style={{ fontSize: 12, color: "#64748b", marginBottom: 20 }}>{event.title}</p>
        <div style={{ padding: 16, borderRadius: 16, background: "#f8fafc", border: "1px solid #e2e8f0", marginBottom: 16 }}>
          <QRVisual code={reg.qrCode} />
          <p style={{ fontSize: 10, fontFamily: "monospace", color: "#94a3b8", marginTop: 10 }}>{reg.qrCode}</p>
        </div>
        <div style={{ padding: "10px 14px", borderRadius: 12, background: "#f0fdf4", border: "1px solid #bbf7d0", marginBottom: 16, textAlign: "left" }}>
          {[["Date", fmtDate(event.date)], ["Venue", event.venue], ["Type", reg.type]].map(([k,v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, padding: "3px 0" }}>
              <span style={{ color: "#94a3b8" }}>{k}</span><span style={{ fontWeight: 600, color: "#166534" }}>{v}</span>
            </div>
          ))}
          {reg.needsCertificate && <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #bbf7d0", display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#6d28d9", fontWeight: 600 }}><Award size={11} />Certificate requested</div>}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => nav(VIEWS.FEEDBACK, { regId: reg.id })} style={{ flex: 1, padding: "10px", borderRadius: 10, background: "#1a44f5", color: "white", fontWeight: 600, fontSize: 12, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}><MessageSquare size={13} />Leave Feedback</button>
          <button onClick={() => nav(VIEWS.EVENTS_LIST)} style={{ flex: 1, padding: "10px", borderRadius: 10, background: "#f1f5f9", color: "#475569", fontWeight: 600, fontSize: 12, border: "none", cursor: "pointer" }}>Browse Events</button>
        </div>
      </Card>
    </div>
  )
}

// ─── FEEDBACK PAGE ────────────────────────────────────────────────────────────
function FeedbackPage({ nav, params, toast, refresh }) {
  const reg = store.getRegistration(params.regId)
  const event = reg ? store.getEvent(reg.eventId) : null
  const [ratings, setRatings] = useState({ q1: 0, q2: 0, q3: 0, q4: 0, q5: 0 })
  const [comment, setComment] = useState("")
  const [important, setImportant] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!reg || !event) return <div style={{ textAlign: "center", padding: 60 }}><p>Not found.</p></div>
  if (reg.feedbackSubmitted) return <div style={{ maxWidth: 400, margin: "60px auto", textAlign: "center", padding: "0 24px" }}><Card className="p-8"><CheckCircle2 size={40} color="#10b981" style={{ margin: "0 auto 12px" }} /><h3 style={{ fontWeight: 800, color: "#1e293b" }}>Already Submitted</h3><p style={{ fontSize: 13, color: "#64748b", margin: "8px 0 20px" }}>You've already submitted feedback for this event.</p><button onClick={() => nav(VIEWS.QR_PASS, { regId: reg.id })} style={{ padding: "10px 20px", borderRadius: 10, background: "#f1f5f9", color: "#475569", fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer" }}>Back to Pass</button></Card></div>

  const avgRating = Object.values(ratings).filter(v => v > 0).length > 0 ? (Object.values(ratings).reduce((a,b) => a+b, 0) / 5).toFixed(1) : 0
  const feedbackCount = store.getFeedback(event.id).length
  const projectedBadge = feedbackCount >= 2 ? "🏆 Super Reviewer" : feedbackCount >= 1 ? "⭐ Top Reviewer" : null

  const submit = () => {
    if (Object.values(ratings).some(v => v === 0)) { toast("Please rate all questions", "error"); return }
    setLoading(true)
    setTimeout(() => {
      store.addFeedback({ registrationId: reg.id, eventId: event.id, ...ratings, comment, isImportant: important })
      refresh(); toast("Feedback submitted! Thank you!", "success")
      nav(VIEWS.FEEDBACK_SUCCESS, { regId: reg.id, badge: projectedBadge, rating: avgRating })
    }, 800)
  }

  const questions = ["Check-in Experience", "Event Organization", "Content Quality", "Venue & Facilities", "Overall Satisfaction"]

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "32px 24px" }}>
      <button onClick={() => nav(VIEWS.QR_PASS, { regId: reg.id })} style={{ display: "flex", alignItems: "center", gap: 6, color: "#64748b", background: "none", border: "none", cursor: "pointer", fontSize: 13, marginBottom: 20 }}><ArrowLeft size={15} />Back to Pass</button>
      <Card className="p-6">
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ width: 48, height: 48, borderRadius: 16, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}><MessageSquare size={22} color="#1a44f5" /></div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1e293b", marginBottom: 4 }}>Event Feedback</h2>
          <p style={{ fontSize: 13, color: "#64748b" }}>{event.title}</p>
          {projectedBadge && <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: 100, background: "#fef3c7", border: "1px solid #fde68a", fontSize: 11, color: "#92400e", fontWeight: 600, marginTop: 8 }}><Trophy size={11} />Complete to earn: {projectedBadge}</div>}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {questions.map((q, i) => (
            <div key={i} style={{ padding: "14px 16px", borderRadius: 12, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 8 }}>{i+1}. {q}</p>
              <StarRating value={ratings[`q${i+1}`]} onChange={v => setRatings(r => ({...r, [`q${i+1}`]: v}))} />
            </div>
          ))}
          <Textarea label="Comments & Suggestions" value={comment} onChange={e => setComment(e.target.value)} placeholder="Share your experience, what could be improved, highlights..." rows={4} />
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "10px 12px", borderRadius: 10, background: "#fff7ed", border: "1px solid #fed7aa" }}>
            <input type="checkbox" checked={important} onChange={e => setImportant(e.target.checked)} />
            <span style={{ fontSize: 12, fontWeight: 600, color: "#c2410c" }}>⚑ Flag this as important feedback for HQ report</span>
          </label>
          {avgRating > 0 && <div style={{ padding: "10px 14px", borderRadius: 10, background: "#f0fdf4", border: "1px solid #bbf7d0", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
            <span style={{ color: "#166534", fontWeight: 600 }}>Your avg rating</span>
            <span style={{ fontWeight: 800, color: "#166534" }}>{avgRating} / 5.0</span>
          </div>}
          <Btn variant="primary" size="lg" onClick={submit} loading={loading} icon={Send}>Submit Feedback</Btn>
        </div>
      </Card>
    </div>
  )
}

// ─── FEEDBACK SUCCESS PAGE ────────────────────────────────────────────────────
function FeedbackSuccessPage({ nav, params }) {
  const { badge, rating } = params
  return (
    <div style={{ maxWidth: 400, margin: "60px auto", padding: "0 24px", textAlign: "center" }}>
      <Card className="p-8">
        {badge ? (
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#fbbf24,#f59e0b)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 36 }}>🏆</div>
        ) : (
          <div style={{ width: 64, height: 64, borderRadius: 20, background: "#d1fae5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}><CheckCircle2 size={32} color="#10b981" /></div>
        )}
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1e293b", marginBottom: 6 }}>Thank You!</h2>
        {badge && <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 16px", borderRadius: 100, background: "linear-gradient(90deg,#fbbf24,#f59e0b)", color: "white", fontWeight: 700, fontSize: 13, marginBottom: 12 }}><Trophy size={14} />{badge}</div>}
        <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>Your feedback helps us improve future events.{badge ? " You've earned a badge for being an active contributor!" : ""}</p>
        {rating > 0 && <div style={{ padding: "12px", borderRadius: 12, background: "#f8fafc", margin: "16px 0", fontSize: 13, color: "#64748b" }}>Your rating: <b style={{ color: "#1e293b" }}>{rating} / 5.0</b></div>}
        <button onClick={() => nav(VIEWS.EVENTS_LIST)} style={{ width: "100%", padding: "11px", borderRadius: 12, background: "#1a44f5", color: "white", fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><Calendar size={15} />Browse More Events</button>
      </Card>
    </div>
  )
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
function LoginPage({ nav, login }) {
  const [form, setForm] = useState({ email: "admin@university.edu.ph", password: "admin123" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const submit = () => {
    setLoading(true)
    setTimeout(() => {
      if (form.email === "admin@university.edu.ph" && form.password === "admin123") {
        login({ name: "Admin User", email: form.email, role: "organizer" })
      } else { setError("Invalid credentials. Try admin@university.edu.ph / admin123"); setLoading(false) }
    }, 800)
  }

  return (
    <div style={{ maxWidth: 420, margin: "60px auto", padding: "0 24px" }}>
      <Card className="p-8">
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ width: 48, height: 48, borderRadius: 16, background: "linear-gradient(135deg,#1a44f5,#1436c4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}><QrCode size={22} color="white" /></div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1e293b" }}>Organizer Login</h2>
          <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>QR-Attend Admin Panel</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Input label="Email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} type="email" icon={Mail} />
          <Input label="Password" value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} type="password" icon={Lock} />
          {error && <div style={{ padding: "10px 14px", borderRadius: 10, background: "#fef2f2", border: "1px solid #fecaca", fontSize: 12, color: "#dc2626" }}>{error}</div>}
          <Btn variant="primary" size="lg" onClick={submit} loading={loading} icon={LogOut}>Sign In</Btn>
          <p style={{ textAlign: "center", fontSize: 11, color: "#94a3b8" }}>Demo: admin@university.edu.ph / admin123</p>
        </div>
      </Card>
    </div>
  )
}

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
function AdminDashboard({ nav }) {
  const analytics = store.getAnalytics()
  const events = store.getEvents()
  const regs = store.getRegistrations()
  const feedback = store.getFeedback()

  const typeData = ["Student","Faculty","Researcher","Professional"].map(t => ({ name: t, value: regs.filter(r => r.type === t).length })).filter(d => d.value > 0)
  const evChartData = events.map(ev => { const r = store.getRegistrations(ev.id); const a = r.filter(x => x.attended).length; return { name: ev.title.slice(0,18)+"…", registered: r.length, attended: a } })
  const recentRegs = [...regs].sort((a,b) => new Date(b.registeredAt)-new Date(a.registeredAt)).slice(0,5)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div><h1 style={{ fontSize: 22, fontWeight: 800, color: "#1e293b" }}>Dashboard</h1><p style={{ fontSize: 13, color: "#94a3b8" }}>Real-time event overview · {locale.flag} {locale.city}</p></div>
        <Btn variant="primary" size="sm" icon={Plus} onClick={() => nav(VIEWS.ADMIN_CREATE_EVENT)}>New Event</Btn>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14 }}>
        <KPICard icon={Calendar} label="Total Events" value={analytics.totalEvents} color="blue" />
        <KPICard icon={Users} label="Registrations" value={analytics.totalRegistrations} trend={12} color="teal" />
        <KPICard icon={CheckCircle2} label="Attendance Rate" value={`${analytics.attendanceRate}%`} sub={`${analytics.totalAttended} checked in`} color="violet" />
        <KPICard icon={Star} label="Avg Satisfaction" value={`${analytics.avgSatisfaction}/5`} sub={`${analytics.totalFeedback} responses`} color="amber" />
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        <Card className="p-5">
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", marginBottom: 16 }}>Registrations & Attendance per Event</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={evChartData} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 11 }} />
              <Bar dataKey="registered" fill="#bfdbfe" radius={[4,4,0,0]} name="Registered" />
              <Bar dataKey="attended" fill="#1a44f5" radius={[4,4,0,0]} name="Attended" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-5">
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", marginBottom: 16 }}>Participant Types</h3>
          {typeData.length > 0 ? <><ResponsiveContainer width="100%" height={150}>
            <RPieChart><Pie data={typeData} dataKey="value" cx="50%" cy="50%" outerRadius={60} paddingAngle={3}>
              {typeData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
            </Pie></RPieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
            {typeData.map((d, i) => <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "#64748b" }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: PIE_COLORS[i], display: "inline-block" }} />{d.name}: {d.value}</div>)}
          </div></> : <div style={{ textAlign: "center", padding: 40, color: "#94a3b8", fontSize: 12 }}>No data yet</div>}
        </Card>
      </div>

      {/* Recent Registrations */}
      <Card className="p-5">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>Recent Registrations</h3>
          <button onClick={() => nav(VIEWS.ADMIN_EVENTS)} style={{ fontSize: 11, color: "#1a44f5", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>View all →</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {recentRegs.length === 0 ? <p style={{ textAlign: "center", color: "#94a3b8", padding: "20px 0", fontSize: 12 }}>No registrations yet</p>
            : recentRegs.map(r => {
              const ev = store.getEvent(r.eventId)
              return <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 12px", borderRadius: 10, background: "#f8fafc" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#1a44f5,#14b8a6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "white", flexShrink: 0 }}>{r.name[0]}</div>
                <div style={{ flex: 1, minWidth: 0 }}><p style={{ fontSize: 12, fontWeight: 600, color: "#1e293b" }}>{r.name} {r.isWalkIn && <Badge2 color="amber" size="xs">Walk-in</Badge2>}</p><p style={{ fontSize: 10, color: "#94a3b8" }}>{ev?.title?.slice(0,30)}…</p></div>
                <Badge2 color="gray" size="xs">{r.type}</Badge2>
                {r.attended && <Badge2 color="green" size="xs"><CheckCircle2 size={9} />In</Badge2>}
              </div>
            })}
        </div>
      </Card>
    </div>
  )
}

// ─── ADMIN EVENTS LIST ────────────────────────────────────────────────────────
function AdminEvents({ nav, toast, refresh }) {
  const events = store.getEvents()
  const [deleteId, setDeleteId] = useState(null)

  const doDelete = () => { store.deleteEvent(deleteId); refresh(); toast("Event deleted."); setDeleteId(null) }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div><h1 style={{ fontSize: 22, fontWeight: 800, color: "#1e293b" }}>Events</h1><p style={{ fontSize: 13, color: "#94a3b8" }}>Manage all events</p></div>
        <Btn variant="primary" size="sm" icon={Plus} onClick={() => nav(VIEWS.ADMIN_CREATE_EVENT)}>New Event</Btn>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {events.map(ev => {
          const regs = store.getRegistrations(ev.id)
          const done = ev.tasks?.filter(t => t.done).length || 0
          const total = ev.tasks?.length || 0
          return (
            <Card key={ev.id} className="p-5" style={{ cursor: "pointer" }} onClick={() => nav(VIEWS.ADMIN_EVENT_VIEW, { eventId: ev.id })}>
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                {ev.image && <img src={ev.image} alt="" style={{ width: 72, height: 56, objectFit: "cover", borderRadius: 10, flexShrink: 0 }} onError={e => { e.target.style.display="none" }} />}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", gap: 6, marginBottom: 5, flexWrap: "wrap" }}>
                    <StatusBadge status={ev.status} />
                    <Badge2 color="gray">{ev.type}</Badge2>
                    {ev.isPrivate && <Badge2 color="private"><Lock size={9} />Private</Badge2>}
                    {ev.requiresCertificate && <Badge2 color="violet"><Award size={9} />Cert</Badge2>}
                    {ev.metaPixelId && <Badge2 color="blue"><Globe size={9} />Meta</Badge2>}
                  </div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", marginBottom: 4 }}>{ev.title}</p>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 11, color: "#94a3b8" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar size={11} />{fmtDate(ev.date)}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Users size={11} />{regs.length}/{ev.capacity}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><CheckSquare size={11} />{done}/{total} tasks</span>
                    {ev.isPrivate && ev.privateLink && <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Link size={11} />/{ev.slug}?access={ev.privateLink}</span>}
                  </div>
                  {total > 0 && <div style={{ marginTop: 8 }}>
                    <div style={{ height: 4, borderRadius: 2, background: "#e2e8f0" }}>
                      <div style={{ height: "100%", borderRadius: 2, background: done === total ? "#10b981" : "#1a44f5", width: `${(done/total)*100}%`, transition: "width 0.3s" }} />
                    </div>
                    <p style={{ fontSize: 9, color: "#94a3b8", marginTop: 2 }}>Task progress: {done}/{total}</p>
                  </div>}
                </div>
                <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                  <button onClick={e => { e.stopPropagation(); nav(VIEWS.ADMIN_SCANNER, { eventId: ev.id }) }} style={{ padding: "6px 8px", borderRadius: 8, background: "#f0fdf4", border: "none", cursor: "pointer", color: "#16a34a" }} title="Scanner"><ScanLine size={14} /></button>
                  <button onClick={e => { e.stopPropagation(); nav(VIEWS.ADMIN_REPORTS, { eventId: ev.id }) }} style={{ padding: "6px 8px", borderRadius: 8, background: "#eff6ff", border: "none", cursor: "pointer", color: "#1d4ed8" }} title="Report"><FileText size={14} /></button>
                  <button onClick={e => { e.stopPropagation(); setDeleteId(ev.id) }} style={{ padding: "6px 8px", borderRadius: 8, background: "#fff5f5", border: "none", cursor: "pointer", color: "#dc2626" }} title="Delete"><Trash2 size={14} /></button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Event" size="sm">
        <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>This will delete the event and all its registrations. This cannot be undone.</p>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Btn variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Btn>
          <Btn variant="danger" onClick={doDelete} icon={Trash2}>Delete</Btn>
        </div>
      </Modal>
    </div>
  )
}

// ─── ADMIN EVENT VIEW (New: expanded event view with tasks + report) ───────────
function AdminEventView({ nav, params, toast, refresh }) {
  const [data, setData] = useState(0)
  const rerender = () => { refresh(); setData(d => d+1) }
  const event = store.getEvent(params.eventId)
  const [newTask, setNewTask] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  if (!event) return null

  const regs = store.getRegistrations(event.id)
  const feedback = store.getFeedback(event.id)
  const attended = regs.filter(r => r.attended)
  const doneTasks = event.tasks?.filter(t => t.done).length || 0
  const totalTasks = event.tasks?.length || 0
  const avgRating = feedback.length > 0 ? (feedback.reduce((s,f) => s+(f.q1+f.q2+f.q3+f.q4+f.q5)/5, 0)/feedback.length).toFixed(2) : "—"
  const highlightedComments = feedback.filter(f => f.isHighlighted || f.isImportant)

  const addTask = () => { if (!newTask.trim()) return; store.addTask(event.id, newTask); setNewTask(""); rerender() }
  const toggleTask = (tid) => { store.toggleTask(event.id, tid); rerender() }

  const exportReport = () => {
    let csv = `POST-EVENT REPORT\n${event.title}\n\nDATE,${fmtDate(event.date)}\nVENUE,${event.venue}\nORGANIZER,${event.organizer}\nLOCATION,${event.location}\nLOCALE_REGION,${locale.region}\n\nKEY METRICS\nTotal Registered,${regs.length}\nTotal Attended,${attended.length}\nAttendance Rate,${regs.length > 0 ? ((attended.length/regs.length)*100).toFixed(1) : 0}%\nFeedback Responses,${feedback.length}\nFeedback Rate,${attended.length > 0 ? ((feedback.length/attended.length)*100).toFixed(1) : 0}%\nAvg Satisfaction,${avgRating}\n\nHIGHLIGHTED COMMENTS\n`
    highlightedComments.forEach(f => { const r = store.getRegistration(f.registrationId); csv += `"${r?.name}","${f.comment}",Rating:${((f.q1+f.q2+f.q3+f.q4+f.q5)/5).toFixed(1)}\n` })
    csv += `\nATTENDANCE LIST\nName,Email,Type,Affiliation,Check-in,Needs Cert\n`
    regs.forEach(r => { csv += `"${r.name}","${r.email}","${r.type}","${r.affiliation}","${r.checkInTime || ''}","${r.needsCertificate ? 'Yes' : 'No'}"\n` })
    const blob = new Blob([csv], { type: "text/csv" })
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `report-${event.slug}-${new Date().toISOString().split("T")[0]}.csv`; a.click()
    toast("Report downloaded!", "success")
  }

  const tabs = ["overview","tasks","registrations","feedback","report"]

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => nav(VIEWS.ADMIN_EVENTS)} style={{ padding: "7px 10px", borderRadius: 10, background: "#f1f5f9", border: "none", cursor: "pointer", color: "#64748b" }}><ArrowLeft size={16} /></button>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
            <StatusBadge status={event.status} />
            {event.isPrivate && <Badge2 color="private"><Lock size={9} />Private</Badge2>}
            {event.requiresCertificate && <Badge2 color="violet"><Award size={9} />Certificate</Badge2>}
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: "#1e293b" }}>{event.title}</h1>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn variant="secondary" size="sm" icon={ScanLine} onClick={() => nav(VIEWS.ADMIN_SCANNER, { eventId: event.id })}>Scan</Btn>
          <Btn variant="primary" size="sm" icon={Download} onClick={exportReport}>Export Report</Btn>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, borderBottom: "1px solid #e2e8f0", paddingBottom: 0 }}>
        {tabs.map(t => <button key={t} onClick={() => setActiveTab(t)} style={{ padding: "8px 16px", borderRadius: "8px 8px 0 0", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, background: activeTab === t ? "white" : "none", color: activeTab === t ? "#1a44f5" : "#94a3b8", borderBottom: activeTab === t ? "2px solid #1a44f5" : "2px solid transparent", transition: "all 0.15s", textTransform: "capitalize" }}>{t}</button>)}
      </div>

      {activeTab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <KPICard icon={Users} label="Registered" value={regs.length} sub={`${regs.length} / ${event.capacity}`} color="blue" />
          <KPICard icon={CheckCircle2} label="Attended" value={attended.length} sub={`${regs.length > 0 ? ((attended.length/regs.length)*100).toFixed(0) : 0}% rate`} color="teal" />
          <KPICard icon={MessageSquare} label="Feedback" value={feedback.length} color="violet" />
          <KPICard icon={Star} label="Avg Rating" value={avgRating} color="amber" />
          {event.metaPixelId && <Card className="p-4" style={{ gridColumn: "1/-1" }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#1e293b", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}><Globe size={14} color="#1877f2" />Meta Pixel Integration</p>
            <p style={{ fontSize: 11, color: "#64748b" }}>Pixel ID: <code style={{ background: "#f1f5f9", padding: "1px 6px", borderRadius: 4 }}>{event.metaPixelId}</code> · Events tracked: Registration, Attendance, Feedback</p>
          </Card>}
          {event.isPrivate && event.privateLink && <Card className="p-4" style={{ gridColumn: "1/-1" }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#1e293b", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}><Lock size={13} color="#e11d48" />Private Event Access Link</p>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <code style={{ flex: 1, fontSize: 11, background: "#f8fafc", padding: "8px 12px", borderRadius: 8, color: "#475569", border: "1px solid #e2e8f0" }}>/events/{event.slug}?access={event.privateLink}</code>
              <button onClick={() => { navigator.clipboard?.writeText(`/events/${event.slug}?access=${event.privateLink}`); toast("Copied!", "success") }} style={{ padding: "8px 10px", borderRadius: 8, background: "#f1f5f9", border: "none", cursor: "pointer" }}><Copy size={13} /></button>
            </div>
          </Card>}
        </div>
      )}

      {activeTab === "tasks" && (
        <Card className="p-5">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>Event Task List</p>
              <p style={{ fontSize: 11, color: "#94a3b8" }}>{doneTasks}/{totalTasks} completed</p>
            </div>
            <div style={{ width: 48, height: 48, position: "relative" }}>
              <svg viewBox="0 0 48 48" width={48} height={48}>
                <circle cx={24} cy={24} r={20} fill="none" stroke="#e2e8f0" strokeWidth={5} />
                <circle cx={24} cy={24} r={20} fill="none" stroke={doneTasks === totalTasks && totalTasks > 0 ? "#10b981" : "#1a44f5"} strokeWidth={5} strokeDasharray={`${(doneTasks/Math.max(totalTasks,1))*125.6} 125.6`} strokeLinecap="round" transform="rotate(-90 24 24)" style={{ transition: "stroke-dasharray 0.3s" }} />
                <text x={24} y={28} textAnchor="middle" fontSize={11} fontWeight={700} fill="#1e293b">{totalTasks > 0 ? Math.round((doneTasks/totalTasks)*100)+"%" : "0%"}</text>
              </svg>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
            {(event.tasks || []).map(task => (
              <div key={task.id} onClick={() => toggleTask(task.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, background: task.done ? "#f0fdf4" : "#f8fafc", border: `1px solid ${task.done ? "#bbf7d0" : "#e2e8f0"}`, cursor: "pointer", transition: "all 0.15s" }}>
                {task.done ? <CheckSquare size={16} color="#16a34a" /> : <Square size={16} color="#94a3b8" />}
                <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: task.done ? "#166534" : "#334155", textDecoration: task.done ? "line-through" : "none" }}>{task.label}</span>
                {task.dueDate && <span style={{ fontSize: 10, color: "#94a3b8" }}>{fmtDate(task.dueDate)}</span>}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => e.key === "Enter" && addTask()} placeholder="Add a task..." style={{ flex: 1, padding: "9px 12px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 13, outline: "none" }} />
            <Btn variant="primary" size="sm" icon={Plus} onClick={addTask}>Add</Btn>
          </div>
        </Card>
      )}

      {activeTab === "registrations" && (
        <Card className="p-5">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>Registrations ({regs.length})</p>
            <Btn variant="secondary" size="sm" icon={ScanLine} onClick={() => nav(VIEWS.ADMIN_SCANNER, { eventId: event.id })}>Scan QR</Btn>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {regs.map(r => <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: r.attended ? "#d1fae5" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: r.attended ? "#166534" : "#94a3b8" }}>{r.name[0]}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{r.name} {r.isWalkIn && <Badge2 color="amber" size="xs">Walk-in</Badge2>}</p>
                <p style={{ fontSize: 10, color: "#94a3b8" }}>{r.affiliation} · {r.type}</p>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                {r.needsCertificate && <Badge2 color="violet" size="xs"><Award size={9} />Cert</Badge2>}
                {r.attended ? <Badge2 color="green" size="xs"><CheckCircle2 size={9} />Attended</Badge2> : <Badge2 color="gray" size="xs">Not in</Badge2>}
                {r.feedbackSubmitted && <Badge2 color="blue" size="xs"><MessageSquare size={9} />FB</Badge2>}
              </div>
            </div>)}
            {regs.length === 0 && <p style={{ textAlign: "center", color: "#94a3b8", padding: "30px 0", fontSize: 12 }}>No registrations yet</p>}
          </div>
        </Card>
      )}

      {activeTab === "feedback" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {highlightedComments.length > 0 && <Card className="p-5" style={{ border: "1px solid #fde68a", background: "#fffbeb" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#92400e", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}><Star size={14} />Important Comments ({highlightedComments.length})</p>
            {highlightedComments.map(f => {
              const r = store.getRegistration(f.registrationId)
              const avg = ((f.q1+f.q2+f.q3+f.q4+f.q5)/5).toFixed(1)
              return <div key={f.id} style={{ padding: "10px 14px", borderRadius: 10, background: "white", border: "1px solid #fde68a", marginBottom: 6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#1e293b" }}>{r?.name} {f.badge && <span>{f.badge}</span>}</span>
                  <span style={{ fontSize: 11, color: "#f59e0b", fontWeight: 700 }}>★ {avg}</span>
                </div>
                <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>{f.comment}</p>
              </div>
            })}
          </Card>}
          {feedback.map(f => {
            const r = store.getRegistration(f.registrationId)
            const avg = ((f.q1+f.q2+f.q3+f.q4+f.q5)/5).toFixed(1)
            return <Card key={f.id} className="p-4">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#1a44f5" }}>{r?.name?.[0]}</div>
                  <div><p style={{ fontSize: 12, fontWeight: 600, color: "#1e293b" }}>{r?.name} {f.badge && <span style={{ fontSize: 10 }}>{f.badge}</span>}</p><p style={{ fontSize: 10, color: "#94a3b8" }}>{new Date(f.submittedAt).toLocaleDateString()}</p></div>
                </div>
                <StarRating value={Math.round(parseFloat(avg))} readonly />
              </div>
              {f.comment && <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6, paddingLeft: 38 }}>{f.comment}</p>}
            </Card>
          })}
          {feedback.length === 0 && <div style={{ textAlign: "center", padding: "40px 0", color: "#94a3b8", fontSize: 12 }}><MessageSquare size={32} style={{ margin: "0 auto 8px", opacity: 0.3 }} /><p>No feedback yet</p></div>}
        </div>
      )}

      {activeTab === "report" && (
        <Card className="p-6">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "#1e293b" }}>Post-Event Report</h3>
              <p style={{ fontSize: 12, color: "#94a3b8" }}>Event summary for HQ reporting</p>
            </div>
            <Btn variant="primary" icon={Download} onClick={exportReport}>Download CSV</Btn>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
            {[["Event", event.title], ["Date", fmtDate(event.date)], ["Venue", event.venue], ["Location/Locale", `${event.location} (${locale.region}, ${locale.country})`], ["Organizer", event.organizer], ["Registered", regs.length], ["Attended", `${attended.length} (${regs.length > 0 ? ((attended.length/regs.length)*100).toFixed(1) : 0}%)`], ["Certificates Needed", regs.filter(r => r.needsCertificate && r.attended).length], ["Feedback Responses", feedback.length], ["Avg Satisfaction", avgRating]].map(([k,v]) => (
              <div key={k} style={{ padding: "10px 14px", borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <p style={{ fontSize: 9, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>{k}</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#334155", marginTop: 2 }}>{String(v)}</p>
              </div>
            ))}
          </div>
          {highlightedComments.length > 0 && <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>🔑 Highlighted Participant Feedback</p>
            {highlightedComments.slice(0, 3).map(f => {
              const r = store.getRegistration(f.registrationId)
              return <div key={f.id} style={{ padding: "8px 12px", borderRadius: 8, background: "#fffbeb", border: "1px solid #fde68a", marginBottom: 6, fontSize: 12, color: "#92400e" }}>
                <b>{r?.name}:</b> "{f.comment}"
              </div>
            })}
          </div>}
          <div style={{ padding: "10px 14px", borderRadius: 10, background: "#eff6ff", border: "1px solid #bfdbfe", fontSize: 12, color: "#1e40af" }}>
            <p style={{ fontWeight: 700, marginBottom: 4 }}>📍 Locale Metrics for HQ</p>
            <p>Location: {locale.city}, {locale.region}, {locale.country} {locale.flag}</p>
            <p>Locale attendance rate: {regs.length > 0 ? ((attended.length/regs.length)*100).toFixed(1) : 0}% · Feedback rate: {attended.length > 0 ? ((feedback.length/attended.length)*100).toFixed(1) : 0}%</p>
          </div>
        </Card>
      )}
    </div>
  )
}

// ─── ADMIN CREATE EVENT ───────────────────────────────────────────────────────
function AdminCreateEvent({ nav, toast, refresh }) {
  const templates = store.getTaskTemplates()
  const [form, setForm] = useState({ title: "", type: "Seminar", description: "", venue: "", location: "", date: "", startTime: "", endTime: "", organizer: "", department: "", capacity: "100", status: "upcoming", feedbackEnabled: true, isPrivate: false, privateLink: "", requiresCertificate: false, metaPixelId: "", image: "", tags: "", taskTemplateId: "" })
  const [loading, setLoading] = useState(false)
  const up = (k, v) => setForm(f => ({...f, [k]: v}))

  const submit = () => {
    if (!form.title || !form.venue || !form.date) { toast("Fill required fields", "error"); return }
    setLoading(true)
    setTimeout(() => {
      const privateLink = form.isPrivate ? Math.random().toString(36).slice(2, 10) : null
      store.addEvent({ ...form, capacity: parseInt(form.capacity), isPrivate: form.isPrivate, privateLink, tags: form.tags.split(",").map(t => t.trim()).filter(Boolean) })
      refresh(); toast("Event created!", "success")
      nav(VIEWS.ADMIN_EVENTS)
    }, 800)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 900 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => nav(VIEWS.ADMIN_EVENTS)} style={{ padding: "7px 10px", borderRadius: 10, background: "#f1f5f9", border: "none", cursor: "pointer", color: "#64748b" }}><ArrowLeft size={16} /></button>
        <div><h1 style={{ fontSize: 22, fontWeight: 800, color: "#1e293b" }}>Create Event</h1><p style={{ fontSize: 13, color: "#94a3b8" }}>Set up a new event</p></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Card className="p-5">
            <p style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 12 }}>Event Details</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Input label="Event Title *" value={form.title} onChange={e => up("title", e.target.value)} placeholder="International Conference on AI" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Select label="Type" value={form.type} onChange={e => up("type", e.target.value)} options={["Seminar","Conference","Workshop","Training"].map(v => ({value:v,label:v}))} />
                <Select label="Status" value={form.status} onChange={e => up("status", e.target.value)} options={["upcoming","active","draft"].map(v => ({value:v,label:v.charAt(0).toUpperCase()+v.slice(1)}))} />
              </div>
              <Textarea label="Description" value={form.description} onChange={e => up("description", e.target.value)} placeholder="Describe the event..." />
              <Input label="Venue *" value={form.venue} onChange={e => up("venue", e.target.value)} icon={MapPin} placeholder="Main Hall, Building A" />
              <Input label="Location / City" value={form.location} onChange={e => up("location", e.target.value)} icon={MapPinned} placeholder="Quezon City, Metro Manila" />
              <Input label="Event Image URL" value={form.image} onChange={e => up("image", e.target.value)} icon={Image} placeholder="https://unsplash.com/..." />
            </div>
          </Card>
          <Card className="p-5">
            <p style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 12 }}>Schedule & Capacity</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Input label="Date *" value={form.date} onChange={e => up("date", e.target.value)} type="date" icon={Calendar} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Input label="Start Time" value={form.startTime} onChange={e => up("startTime", e.target.value)} type="time" icon={Clock} />
                <Input label="End Time" value={form.endTime} onChange={e => up("endTime", e.target.value)} type="time" icon={Clock} />
              </div>
              <Input label="Capacity" value={form.capacity} onChange={e => up("capacity", e.target.value)} type="number" icon={Users} />
              <Input label="Organizer *" value={form.organizer} onChange={e => up("organizer", e.target.value)} icon={User} placeholder="Dr. Juan Cruz" />
              <Input label="Department" value={form.department} onChange={e => up("department", e.target.value)} icon={Building2} placeholder="College of Computing" />
            </div>
          </Card>
        </div>

        {/* Right */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Card className="p-5">
            <p style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 12 }}>Privacy & Access</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "10px 12px", borderRadius: 10, background: form.isPrivate ? "#fff1f2" : "#f8fafc", border: `1px solid ${form.isPrivate ? "#fecdd3" : "#e2e8f0"}` }}>
                <input type="checkbox" checked={form.isPrivate} onChange={e => up("isPrivate", e.target.checked)} />
                <div><p style={{ fontSize: 13, fontWeight: 600, color: form.isPrivate ? "#be123c" : "#1e293b", display: "flex", alignItems: "center", gap: 5 }}><Lock size={13} />Private Event</p><p style={{ fontSize: 11, color: "#94a3b8" }}>Access via custom link only</p></div>
              </label>
              {form.isPrivate && <div style={{ padding: "10px 14px", borderRadius: 10, background: "#fff7ed", border: "1px solid #fed7aa", fontSize: 11, color: "#9a3412" }}><p style={{ fontWeight: 600 }}>Custom link auto-generated on creation</p><p>Share the link with invited participants only</p></div>}
            </div>
          </Card>
          <Card className="p-5">
            <p style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 12 }}>Features</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[{ k: "feedbackEnabled", icon: MessageSquare, l: "Enable Feedback Collection", d: "Participants can submit ratings & comments" }, { k: "requiresCertificate", icon: Award, l: "Certificate of Attendance", d: "Participants can request certificates" }].map(f => (
                <label key={f.k} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "10px 12px", borderRadius: 10, background: form[f.k] ? "#f0fdf4" : "#f8fafc", border: `1px solid ${form[f.k] ? "#bbf7d0" : "#e2e8f0"}` }}>
                  <input type="checkbox" checked={form[f.k]} onChange={e => up(f.k, e.target.checked)} />
                  <div><p style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", display: "flex", alignItems: "center", gap: 5 }}><f.icon size={13} />{f.l}</p><p style={{ fontSize: 11, color: "#94a3b8" }}>{f.d}</p></div>
                </label>
              ))}
              <Input label="Meta Pixel ID (optional)" value={form.metaPixelId} onChange={e => up("metaPixelId", e.target.value)} icon={Globe} placeholder="1234567890" />
            </div>
          </Card>
          <Card className="p-5">
            <p style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 12 }}>Task List Template</p>
            <Select label="Apply Template" value={form.taskTemplateId} onChange={e => up("taskTemplateId", e.target.value)} options={[{value:"",label:"None"}, ...templates.map(t => ({value:t.id,label:t.name}))]} />
            {form.taskTemplateId && <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 6 }}>Tasks from template:</p>
              {(templates.find(t => t.id === form.taskTemplateId)?.tasks || []).map((task, i) => (
                <p key={i} style={{ fontSize: 11, color: "#94a3b8", display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}><Square size={10} />{task}</p>
              ))}
            </div>}
          </Card>
          <Card className="p-5">
            <p style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 12 }}>Tags</p>
            <Input label="Comma-separated tags" value={form.tags} onChange={e => up("tags", e.target.value)} icon={Tag} placeholder="AI, Education, Conference" />
          </Card>
          <Btn variant="primary" size="lg" onClick={submit} loading={loading} icon={Plus}>Create Event</Btn>
        </div>
      </div>
    </div>
  )
}

// ─── ADMIN SCANNER ────────────────────────────────────────────────────────────
function AdminScanner({ nav, params, toast, refresh }) {
  const events = store.getEvents()
  const [eventId, setEventId] = useState(params.eventId || (events[0]?.id || ""))
  const [input, setInput] = useState("")
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])

  const scan = () => {
    if (!input.trim()) return
    const res = store.markAttendance(input.trim())
    if (res.success) { toast(`✓ ${res.registration.name} checked in!`, "success"); refresh() }
    else if (res.type === "duplicate") toast(`Already checked in: ${res.registration.name}`, "error")
    else toast("QR code not found", "error")
    setResult(res)
    setHistory(h => [{ ...res, qr: input.trim(), time: new Date() }, ...h.slice(0,9)])
    setInput("")
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 700 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1e293b" }}>QR Scanner</h1>
        <p style={{ fontSize: 13, color: "#94a3b8" }}>Verify attendance by scanning QR passes</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Card className="p-5">
          <p style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 12 }}>Manual QR Input</p>
          <Select label="Event" value={eventId} onChange={e => setEventId(e.target.value)} options={events.map(ev => ({value:ev.id,label:ev.title}))} />
          <div style={{ marginTop: 12 }}>
            <Input label="QR Code" value={input} onChange={e => setInput(e.target.value)} placeholder="QR-E001-P001-2025" icon={QrCode} />
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <Btn variant="primary" onClick={scan} icon={ScanLine}>Verify</Btn>
              <Btn variant="secondary" onClick={() => { const regs = store.getRegistrations(eventId).filter(r => !r.attended); if (regs[0]) setInput(regs[0].qrCode) }} icon={RefreshCw}>Demo</Btn>
            </div>
          </div>
        </Card>
        {result && <Card className="p-5" style={{ background: result.success ? "#f0fdf4" : result.type === "duplicate" ? "#fff7ed" : "#fff5f5", border: `1px solid ${result.success ? "#bbf7d0" : result.type === "duplicate" ? "#fed7aa" : "#fecaca"}` }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>{result.success ? "✅" : result.type === "duplicate" ? "⚠️" : "❌"}</div>
            <p style={{ fontSize: 15, fontWeight: 800, color: result.success ? "#166534" : result.type === "duplicate" ? "#92400e" : "#dc2626" }}>{result.success ? "Checked In!" : result.type === "duplicate" ? "Already In" : "Not Found"}</p>
            {result.registration && <div style={{ marginTop: 10, textAlign: "left" }}>
              <p style={{ fontSize: 13, fontWeight: 600 }}>{result.registration.name}</p>
              <p style={{ fontSize: 11, color: "#64748b" }}>{result.registration.affiliation}</p>
              <p style={{ fontSize: 11, color: "#64748b" }}>{result.registration.type}</p>
              {result.registration.needsCertificate && <Badge2 color="violet" size="xs"><Award size={9} />Needs Certificate</Badge2>}
            </div>}
          </div>
        </Card>}
      </div>
      {history.length > 0 && <Card className="p-5">
        <p style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 10 }}>Scan History</p>
        {history.map((h, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
          <span style={{ fontSize: 16 }}>{h.success ? "✅" : h.type === "duplicate" ? "⚠️" : "❌"}</span>
          <div style={{ flex: 1 }}><p style={{ fontSize: 12, fontWeight: 600 }}>{h.registration?.name || h.qr}</p><p style={{ fontSize: 10, color: "#94a3b8" }}>{h.time.toLocaleTimeString()}</p></div>
          {h.registration?.needsCertificate && <Badge2 color="violet" size="xs">Cert</Badge2>}
        </div>)}
      </Card>}
    </div>
  )
}

// ─── ADMIN FEEDBACK ───────────────────────────────────────────────────────────
function AdminFeedback({ nav }) {
  const events = store.getEvents()
  const [eventFilter, setEventFilter] = useState("")
  const feedback = store.getFeedback(eventFilter || undefined)
  const attended = store.getRegistrations(eventFilter || undefined).filter(r => r.attended)
  const responseRate = attended.length > 0 ? ((feedback.length/attended.length)*100).toFixed(1) : 0
  const overallAvg = feedback.length > 0 ? (feedback.reduce((s,f) => s+(f.q1+f.q2+f.q3+f.q4+f.q5)/5, 0)/feedback.length).toFixed(2) : "0"
  const highlighted = feedback.filter(f => f.isHighlighted || f.isImportant)

  const qLabels = ["Check-in Experience","Event Organization","Content Quality","Venue & Facilities","Overall"]
  const radData = ["q1","q2","q3","q4","q5"].map((k,i) => ({ name: qLabels[i].split(" ")[0], value: feedback.length > 0 ? parseFloat((feedback.reduce((s,f) => s+(f[k]||0), 0)/feedback.length).toFixed(1)) : 0, fullMark: 5 }))

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div><h1 style={{ fontSize: 22, fontWeight: 800, color: "#1e293b" }}>Feedback Analytics</h1><p style={{ fontSize: 13, color: "#94a3b8" }}>Participant satisfaction insights</p></div>
        <select value={eventFilter} onChange={e => setEventFilter(e.target.value)} style={{ padding: "8px 14px", borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 12, outline: "none" }}>
          <option value="">All Events</option>
          {events.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
        </select>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
        <KPICard icon={MessageSquare} label="Responses" value={feedback.length} />
        <KPICard icon={Percent} label="Response Rate" value={`${responseRate}%`} color="teal" />
        <KPICard icon={Star} label="Avg Rating" value={`${overallAvg}/5`} color="amber" />
        <KPICard icon={ThumbsUp} label="Satisfaction" value={parseFloat(overallAvg) >= 4 ? "Very High" : parseFloat(overallAvg) >= 3 ? "Good" : "Needs Work"} color="violet" />
      </div>
      {highlighted.length > 0 && <Card className="p-5" style={{ border: "1px solid #fde68a", background: "#fffbeb" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#92400e", marginBottom: 10 }}>⭐ Important / Highlighted Comments ({highlighted.length})</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {highlighted.map(f => {
            const r = store.getRegistration(f.registrationId); const ev = store.getEvent(f.eventId)
            return <div key={f.id} style={{ padding: "10px 14px", borderRadius: 10, background: "white", border: "1px solid #fde68a" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{r?.name} {f.badge && <span>{f.badge}</span>}</span>
                <span style={{ fontSize: 10, color: "#94a3b8" }}>{ev?.title?.slice(0,25)}</span>
              </div>
              <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>{f.comment}</p>
            </div>
          })}
        </div>
      </Card>}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card className="p-5">
          <p style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 14 }}>Quality Radar</p>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radData}>
              <PolarGrid /><PolarAngleAxis dataKey="name" tick={{ fontSize: 10 }} />
              <Radar dataKey="value" stroke="#1a44f5" fill="#1a44f5" fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-5">
          <p style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 14 }}>Individual Feedback</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 220, overflowY: "auto" }}>
            {feedback.map(f => { const r = store.getRegistration(f.registrationId); const avg = ((f.q1+f.q2+f.q3+f.q4+f.q5)/5).toFixed(1)
              return <div key={f.id} style={{ padding: "8px 12px", borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{r?.name} {f.badge && <span>{f.badge}</span>}</span>
                  <span style={{ fontSize: 11, color: "#f59e0b", fontWeight: 700 }}>★ {avg}</span>
                </div>
                {f.comment && <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 3 }} className="line-clamp-2">{f.comment}</p>}
              </div>
            })}
            {feedback.length === 0 && <p style={{ textAlign: "center", color: "#94a3b8", fontSize: 12, padding: "20px 0" }}>No feedback yet</p>}
          </div>
        </Card>
      </div>
    </div>
  )
}

// ─── ADMIN REPORTS ────────────────────────────────────────────────────────────
function AdminReports({ nav, toast }) {
  const events = store.getEvents()
  const [eventFilter, setEventFilter] = useState("")
  const analytics = store.getAnalytics()

  const exportCSV = () => {
    const regs = store.getRegistrations(eventFilter || undefined)
    const fb = store.getFeedback(eventFilter || undefined)
    const att = regs.filter(r => r.attended)
    const highlighted = fb.filter(f => f.isHighlighted || f.isImportant)
    const evName = eventFilter ? store.getEvent(eventFilter)?.title : "All Events"
    let csv = `QR-ATTEND PLATFORM — POST-EVENT REPORT\n${evName}\n`
    csv += `Generated,${new Date().toLocaleString()}\nLocale,${locale.city} ${locale.region} ${locale.country}\n\n`
    csv += `SUMMARY METRICS\nTotal Registered,${regs.length}\nTotal Attended,${att.length}\nAttendance Rate,${regs.length > 0 ? ((att.length/regs.length)*100).toFixed(1) : 0}%\nFeedback Responses,${fb.length}\nAvg Satisfaction,${fb.length > 0 ? (fb.reduce((s,f) => s+(f.q1+f.q2+f.q3+f.q4+f.q5)/5, 0)/fb.length).toFixed(2) : "N/A"}\n`
    csv += `\nHIGHLIGHTED COMMENTS\nName,Comment,Rating\n`
    highlighted.forEach(f => { const r = store.getRegistration(f.registrationId); csv += `"${r?.name}","${f.comment}",${((f.q1+f.q2+f.q3+f.q4+f.q5)/5).toFixed(1)}\n` })
    csv += `\nATTENDANCE DETAIL\nName,Email,Type,Affiliation,QR Code,Attended,Check-in,Needs Cert,Feedback\n`
    regs.forEach(r => { csv += `"${r.name}","${r.email}","${r.type}","${r.affiliation}","${r.qrCode}","${r.attended}","${r.checkInTime||""}","${r.needsCertificate}","${r.feedbackSubmitted}"\n` })
    const blob = new Blob([csv], { type: "text/csv" })
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `qr-attend-report-${Date.now()}.csv`; a.click()
    toast("Report exported!", "success")
  }

  const evChartData = events.map(ev => { const r = store.getRegistrations(ev.id); const a = r.filter(x => x.attended); const fb = store.getFeedback(ev.id); return { name: ev.title.slice(0,15)+"…", registered: r.length, attended: a.length, satisfaction: fb.length > 0 ? parseFloat((fb.reduce((s,f) => s+(f.q1+f.q2+f.q3+f.q4+f.q5)/5, 0)/fb.length).toFixed(1)) : 0 } })

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div><h1 style={{ fontSize: 22, fontWeight: 800, color: "#1e293b" }}>Reports</h1><p style={{ fontSize: 13, color: "#94a3b8" }}>Generate and download reports · {locale.flag} {locale.region}</p></div>
        <Btn variant="primary" icon={Download} onClick={exportCSV}>Export Full Report</Btn>
      </div>
      <Card className="p-5" style={{ background: "#eff6ff", border: "1px solid #bfdbfe" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#1e40af" }}>📍 Locale Metrics for HQ</p>
            <p style={{ fontSize: 12, color: "#1d4ed8" }}>{locale.city}, {locale.region}, {locale.country} {locale.flag} · Overall attendance: {analytics.attendanceRate}% · Satisfaction: {analytics.avgSatisfaction}/5</p>
          </div>
          <select value={eventFilter} onChange={e => setEventFilter(e.target.value)} style={{ padding: "8px 14px", borderRadius: 10, border: "1px solid #bfdbfe", fontSize: 12, background: "white" }}>
            <option value="">All Events</option>
            {events.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
          </select>
        </div>
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
        <KPICard icon={Calendar} label="Events" value={analytics.totalEvents} />
        <KPICard icon={Users} label="Registrations" value={analytics.totalRegistrations} color="teal" />
        <KPICard icon={CheckCircle2} label="Attendance Rate" value={`${analytics.attendanceRate}%`} color="violet" />
        <KPICard icon={Star} label="Avg Satisfaction" value={`${analytics.avgSatisfaction}/5`} color="amber" />
      </div>
      <Card className="p-5">
        <p style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 14 }}>Per-Event Performance</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={evChartData} barSize={20}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e2e8f0", fontSize: 11 }} />
            <Bar dataKey="registered" fill="#bfdbfe" radius={[4,4,0,0]} name="Registered" />
            <Bar dataKey="attended" fill="#1a44f5" radius={[4,4,0,0]} name="Attended" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
      {/* Per-event quick download */}
      <Card className="p-5">
        <p style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 14 }}>Quick Report by Event</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {events.map(ev => {
            const r = store.getRegistrations(ev.id); const a = r.filter(x => x.attended); const fb = store.getFeedback(ev.id)
            return <div key={ev.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{ev.title}</p>
                <p style={{ fontSize: 10, color: "#94a3b8" }}>{fmtDate(ev.date)} · {a.length}/{r.length} attended · {fb.length} feedback</p>
              </div>
              <StatusBadge status={ev.status} />
              <button onClick={() => { setEventFilter(ev.id); setTimeout(exportCSV, 0) }} style={{ padding: "6px 12px", borderRadius: 8, background: "#eff6ff", border: "none", cursor: "pointer", color: "#1d4ed8", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}><Download size={12} />Export</button>
            </div>
          })}
        </div>
      </Card>
    </div>
  )
}

// ─── ADMIN TASK TEMPLATES ─────────────────────────────────────────────────────
function AdminTaskTemplates({ nav, toast, refresh }) {
  const [templates, setTemplates] = useState(store.getTaskTemplates())
  const [newName, setNewName] = useState("")
  const [newTasks, setNewTasks] = useState("")
  const [showForm, setShowForm] = useState(false)

  const create = () => {
    if (!newName.trim()) return
    const tmpl = store.addTaskTemplate({ name: newName, tasks: newTasks.split("\n").map(t => t.trim()).filter(Boolean) })
    setTemplates(store.getTaskTemplates()); setNewName(""); setNewTasks(""); setShowForm(false)
    toast("Template created!")
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 700 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div><h1 style={{ fontSize: 22, fontWeight: 800, color: "#1e293b" }}>Task Templates</h1><p style={{ fontSize: 13, color: "#94a3b8" }}>Reusable checklist templates for events</p></div>
        <Btn variant="primary" size="sm" icon={Plus} onClick={() => setShowForm(!showForm)}>New Template</Btn>
      </div>
      {showForm && <Card className="p-5">
        <p style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 12 }}>Create Template</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Input label="Template Name" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Conference Standard" />
          <Textarea label="Tasks (one per line)" value={newTasks} onChange={e => setNewTasks(e.target.value)} placeholder={"Send invitations\nConfirm AV equipment\nPrepare name tags\nPrint certificates"} rows={6} />
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="primary" onClick={create} icon={CheckCircle2}>Create Template</Btn>
            <Btn variant="secondary" onClick={() => setShowForm(false)}>Cancel</Btn>
          </div>
        </div>
      </Card>}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {templates.map(t => (
          <Card key={t.id} className="p-5">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}><ClipboardList size={16} color="#1a44f5" /></div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>{t.name}</p>
                <p style={{ fontSize: 11, color: "#94a3b8" }}>{t.tasks.length} tasks</p>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {t.tasks.map((task, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#64748b", padding: "4px 0", borderBottom: i < t.tasks.length-1 ? "1px solid #f1f5f9" : "none" }}><Square size={11} color="#94a3b8" />{task}</div>)}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── ADMIN SETTINGS ───────────────────────────────────────────────────────────
function AdminSettings({ nav }) {
  const org = store.getOrganizer()
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 600 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1e293b" }}>Settings</h1>
      <Card className="p-6">
        <p style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 14 }}>Organization Profile</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Input label="Name" value={org.name} disabled icon={User} />
          <Input label="Email" value={org.email} disabled icon={Mail} />
          <Input label="Institution" value={org.institution} disabled icon={Building2} />
        </div>
      </Card>
      <Card className="p-6">
        <p style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>Platform Info</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[["Platform", "QR-Attend v2.0"], ["Locale", `${locale.city}, ${locale.region}, ${locale.country} ${locale.flag}`], ["Meta Integration", "Supported (per event)"], ["Certificate Tracking", "Enabled"], ["Task Templates", "Enabled"], ["Walk-in Mode", "Enabled"], ["Gamification Badges", "Enabled"]].map(([k,v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9", fontSize: 12 }}>
              <span style={{ color: "#64748b" }}>{k}</span><span style={{ fontWeight: 600, color: "#1e293b" }}>{v}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
