import { cn, getInitials } from '../../lib/utils'
import { TrendingUp, TrendingDown, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { useEffect, useRef, useState, useCallback } from 'react'
import QRCode from 'qrcode'

// ─── KPI CARD ───
export function KPICard({ icon: Icon, label, value, sub, trend, className }) {
  return (
    <div className={cn('bg-white rounded-2xl border border-surface-200 shadow-card p-5', className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold text-slate-800">{value}</p>
          {sub && <p className="text-xs text-slate-400">{sub}</p>}
        </div>
        <div className="flex flex-col items-end gap-2">
          {Icon && <div className="p-2.5 rounded-xl bg-brand-50"><Icon size={20} className="text-brand-600" /></div>}
          {trend !== undefined && (
            <span className={cn('text-xs font-semibold flex items-center gap-0.5', trend >= 0 ? 'text-emerald-600' : 'text-red-500')}>
              {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {Math.abs(trend)}%
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── DATA TABLE ───
export function DataTable({ columns, data, onRowClick, searchable, searchPlaceholder = 'Search...', emptyMessage = 'No data available' }) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const perPage = 10

  const filtered = searchable && search
    ? data.filter(row => columns.some(c => {
        const val = row[c.key]
        return val && String(val).toLowerCase().includes(search.toLowerCase())
      }))
    : data

  const paged = filtered.slice(page * perPage, (page + 1) * perPage)
  const totalPages = Math.ceil(filtered.length / perPage)

  return (
    <div>
      {searchable && (
        <div className="p-4 border-b border-surface-200">
          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="input-field pl-10" placeholder={searchPlaceholder} value={search} onChange={e => { setSearch(e.target.value); setPage(0) }} />
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-200 bg-surface-50/50">
              {columns.map(c => (
                <th key={c.key} className="px-5 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100">
            {paged.length > 0 ? paged.map((row, i) => (
              <tr key={i} className={cn('transition-colors', onRowClick && 'cursor-pointer hover:bg-brand-50/30')} onClick={() => onRowClick?.(row)}>
                {columns.map(c => (
                  <td key={c.key} className="px-5 py-3.5 text-slate-700">{c.render ? c.render(row) : row[c.key]}</td>
                ))}
              </tr>
            )) : (
              <tr><td colSpan={columns.length} className="px-5 py-12 text-center text-sm text-slate-400">{emptyMessage}</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-surface-200">
          <span className="text-xs text-slate-400">Showing {page * perPage + 1}–{Math.min((page + 1) * perPage, filtered.length)} of {filtered.length}</span>
          <div className="flex gap-1">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="p-1.5 rounded-lg hover:bg-surface-100 disabled:opacity-30"><ChevronLeft size={16} /></button>
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="p-1.5 rounded-lg hover:bg-surface-100 disabled:opacity-30"><ChevronRight size={16} /></button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── QR CODE GENERATOR (Real) ───
export function QRCodeDisplay({ value, size = 200, className }) {
  const canvasRef = useRef(null)
  const [dataUrl, setDataUrl] = useState(null)

  useEffect(() => {
    if (!value) return
    QRCode.toDataURL(value, {
      width: size,
      margin: 2,
      color: { dark: '#0a1128', light: '#ffffff' },
      errorCorrectionLevel: 'H',
    }).then(url => setDataUrl(url))
      .catch(err => console.error('QR generation error:', err))
  }, [value, size])

  if (!dataUrl) return <div className={cn('bg-surface-100 rounded-xl animate-pulse', className)} style={{ width: size, height: size }} />

  return (
    <div className={cn('inline-block', className)}>
      <img src={dataUrl} alt={`QR Code: ${value}`} width={size} height={size} className="rounded-xl" />
    </div>
  )
}

// ─── PROGRESS RING ───
export function ProgressRing({ value, size = 80, strokeWidth = 7, color = '#1a44f5', label }) {
  const r = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (Math.min(value, 100) / 100) * circ

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size/2} cy={size/2} r={r} stroke="#e2e8f0" strokeWidth={strokeWidth} fill="none" />
        <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={strokeWidth} fill="none"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          className="transition-all duration-1000 ease-out" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-bold text-slate-800">{Math.round(value)}%</span>
        {label && <span className="text-[9px] text-slate-400">{label}</span>}
      </div>
    </div>
  )
}

// ─── PASSWORD STRENGTH ───
export function PasswordStrength({ password }) {
  if (!password) return null
  const checks = [
    { label: '8+ characters', met: password.length >= 8 },
    { label: 'Uppercase', met: /[A-Z]/.test(password) },
    { label: 'Lowercase', met: /[a-z]/.test(password) },
    { label: 'Number', met: /\d/.test(password) },
    { label: 'Special char', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ]
  const strength = checks.filter(c => c.met).length
  const colors = ['#ef4444', '#ef4444', '#f59e0b', '#22c55e', '#16a34a']
  const labels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong']

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[0,1,2,3,4].map(i => (
          <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300" style={{ backgroundColor: i < strength ? colors[strength-1] : '#e2e8f0' }} />
        ))}
      </div>
      <p className="text-xs font-medium" style={{ color: colors[strength-1] || '#94a3b8' }}>{labels[strength-1] || ''}</p>
      <div className="grid grid-cols-2 gap-1">
        {checks.map((c, i) => (
          <span key={i} className={cn('text-[11px] flex items-center gap-1', c.met ? 'text-emerald-600' : 'text-slate-300')}>
            <span className={cn('w-1 h-1 rounded-full', c.met ? 'bg-emerald-500' : 'bg-slate-300')} />{c.label}
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── AVATAR ───
export function Avatar({ name, size = 'md', className }) {
  const sizes = { sm: 'w-7 h-7 text-[10px]', md: 'w-9 h-9 text-xs', lg: 'w-12 h-12 text-sm' }
  const colors = ['bg-brand-500', 'bg-accent-500', 'bg-amber-500', 'bg-rose-500', 'bg-violet-500', 'bg-emerald-500']
  const colorIdx = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length
  
  return (
    <div className={cn('rounded-full flex items-center justify-center text-white font-bold', sizes[size], colors[colorIdx], className)}>
      {getInitials(name)}
    </div>
  )
}
