import { Link } from 'react-router-dom'
import { QrCode, ScanLine, Users, MessageSquare, BarChart3, Shield, Calendar, ArrowRight, CheckCircle2, Clock, Zap, Smartphone } from 'lucide-react'
import { useStore } from '../../hooks/useStore'

export default function HomePage() {
  const store = useStore()
  const analytics = store.getAnalytics()

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-navy-950" />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(ellipse at 30% 20%, rgba(26,68,245,0.15) 0%, transparent 50%), 
                           radial-gradient(ellipse at 70% 80%, rgba(20,184,166,0.1) 0%, transparent 50%),
                           radial-gradient(ellipse at 50% 50%, rgba(26,68,245,0.05) 0%, transparent 70%)`,
        }} />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-slate-300">Academic Event Management Platform</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight mb-6 animate-fade-in">
              Automate Event
              <span className="block text-gradient bg-gradient-to-r from-brand-400 to-accent-400 bg-clip-text text-transparent"> Attendance & Feedback</span>
            </h1>
            
            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8 animate-fade-in animate-stagger-1 leading-relaxed">
              Register participants, generate QR codes, verify attendance in real-time, 
              collect digital feedback, and access analytics — all in one platform built for academic events.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-12 animate-fade-in animate-stagger-2">
              <Link to="/events" className="btn-primary !px-8 !py-3.5 !text-base !rounded-2xl shadow-lg shadow-brand-600/20">
                <Calendar size={18} /> Browse Events
              </Link>
              <Link to="/login" className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold rounded-2xl bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-all">
                Organizer Login <ArrowRight size={18} />
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-2xl mx-auto animate-fade-in animate-stagger-3">
              {[
                { value: `${analytics.totalRegistrations}+`, label: 'Registrations' },
                { value: `${analytics.attendanceRate}%`, label: 'Accuracy' },
                { value: `${analytics.feedbackRate}%`, label: 'Feedback Rate' },
                { value: analytics.avgSatisfaction, label: 'Satisfaction' },
              ].map((s, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/5 px-4 py-3">
                  <p className="text-xl font-bold text-white">{s.value}</p>
                  <p className="text-[11px] text-slate-400">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white gradient-mesh">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold text-brand-600 uppercase tracking-[0.2em] mb-2">How It Works</p>
            <h2 className="text-3xl font-extrabold text-slate-800">Seamless Event Workflow</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { icon: Users, step: '01', title: 'Register', desc: 'Participants fill out an online registration form' },
              { icon: QrCode, step: '02', title: 'Get QR Pass', desc: 'System generates a unique QR code credential' },
              { icon: ScanLine, step: '03', title: 'Check In', desc: 'Organizer scans QR code at the venue' },
              { icon: MessageSquare, step: '04', title: 'Give Feedback', desc: 'Verified attendees submit digital evaluations' },
              { icon: BarChart3, step: '05', title: 'View Analytics', desc: 'Organizers access real-time reports and insights' },
            ].map((s, i) => (
              <div key={i} className="text-center group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-500/20 group-hover:shadow-brand-500/40 transition-shadow">
                  <s.icon size={26} className="text-white" />
                </div>
                <span className="text-[10px] font-bold text-brand-400 tracking-[0.2em]">{s.step}</span>
                <h3 className="text-sm font-bold text-slate-800 mt-1 mb-1">{s.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold text-accent-500 uppercase tracking-[0.2em] mb-2">Features</p>
            <h2 className="text-3xl font-extrabold text-slate-800">Everything You Need</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Users, title: 'Online Registration', desc: 'Web-based enrollment with automatic data validation and instant confirmation', color: 'from-blue-500 to-blue-700' },
              { icon: QrCode, title: 'QR Code Generation', desc: 'Unique scannable digital credentials generated automatically upon registration', color: 'from-teal-500 to-teal-700' },
              { icon: ScanLine, title: 'Real-time Verification', desc: 'Instant QR scanning with duplicate detection and timestamp logging', color: 'from-emerald-500 to-emerald-700' },
              { icon: MessageSquare, title: 'Digital Feedback', desc: 'Structured evaluation forms with Likert ratings and open responses', color: 'from-amber-500 to-amber-700' },
              { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Centralized metrics, visualizations, and real-time event monitoring', color: 'from-violet-500 to-violet-700' },
              { icon: Shield, title: 'Secure & Private', desc: 'Role-based access, session management, and data privacy controls', color: 'from-rose-500 to-rose-700' },
            ].map((f, i) => (
              <div key={i} className="card-interactive p-6 group">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-sm`}>
                  <f.icon size={20} className="text-white" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-1.5">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold text-brand-600 uppercase tracking-[0.2em] mb-2">Why QR-Attend</p>
            <h2 className="text-3xl font-extrabold text-slate-800">Built for Academic Institutions</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: Zap, title: '73% Faster Processing', desc: 'Attendance logging reduced from 45 minutes to just 12 minutes' },
              { icon: CheckCircle2, title: '98% Accuracy', desc: 'Eliminates illegible handwriting, missing entries, and duplicate records' },
              { icon: MessageSquare, title: '85% Feedback Rate', desc: 'Digital forms increase participation compared to 53% with paper forms' },
              { icon: Smartphone, title: 'Works on Any Device', desc: 'Fully responsive — register and check in from phones, tablets, or laptops' },
              { icon: Clock, title: 'Real-time Monitoring', desc: 'Live attendance tracking and instant feedback aggregation' },
              { icon: Shield, title: 'Data Security', desc: 'Password validation, email verification, role-based access control' },
            ].map((b, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-surface-50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                  <b.icon size={18} className="text-brand-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 mb-0.5">{b.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-brand-600 via-brand-700 to-navy-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }} />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-white/60 mb-8 text-lg">Streamline your next academic event with automated attendance and feedback.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/events" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-brand-700 font-bold rounded-2xl hover:bg-white/90 transition-all shadow-lg">
              Register for an Event <ArrowRight size={18} />
            </Link>
            <Link to="/register-organizer" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/10 text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/15 transition-all">
              Become an Organizer
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
