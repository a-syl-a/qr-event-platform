import { cn } from '../../lib/utils'
import { X, AlertCircle, Eye, EyeOff, ChevronDown } from 'lucide-react'
import { useState } from 'react'

// ─── BUTTON ───
export function Button({ children, variant = 'primary', size = 'md', icon: Icon, iconRight: IconR, className, disabled, loading, ...props }) {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger: 'inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-red-600 text-white font-semibold text-sm rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50',
    success: 'inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-semibold text-sm rounded-xl hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50',
    accent: 'inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-accent-500 text-white font-semibold text-sm rounded-xl hover:bg-accent-600 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50',
  }
  const sizes = {
    xs: '!px-2.5 !py-1.5 !text-xs !gap-1',
    sm: '!px-3.5 !py-2 !text-xs !gap-1.5',
    md: '',
    lg: '!px-6 !py-3 !text-base !gap-2.5',
  }
  const iconSize = { xs: 12, sm: 14, md: 16, lg: 18 }[size]

  return (
    <button className={cn(variants[variant], sizes[size], className)} disabled={disabled || loading} {...props}>
      {loading ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : Icon && <Icon size={iconSize} />}
      {children}
      {IconR && <IconR size={iconSize} />}
    </button>
  )
}

// ─── INPUT ───
export function Input({ label, error, helperText, icon: Icon, className, type = 'text', ...props }) {
  const [showPw, setShowPw] = useState(false)
  const isPassword = type === 'password'

  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-slate-700">{label}</label>}
      <div className="relative">
        {Icon && <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />}
        <input
          type={isPassword ? (showPw ? 'text' : 'password') : type}
          className={cn('input-field', Icon && 'pl-10', isPassword && 'pr-10', error && '!border-red-400 !ring-red-500', className)}
          {...props}
        />
        {isPassword && (
          <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle size={12} />{error}</p>}
      {helperText && !error && <p className="text-xs text-slate-400">{helperText}</p>}
    </div>
  )
}

// ─── SELECT ───
export function Select({ label, options, error, className, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-slate-700">{label}</label>}
      <div className="relative">
        <select className={cn('input-field appearance-none pr-10 cursor-pointer', error && '!border-red-400', className)} {...props}>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}

// ─── TEXTAREA ───
export function Textarea({ label, error, className, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-slate-700">{label}</label>}
      <textarea className={cn('input-field min-h-[100px] resize-y', error && '!border-red-400', className)} {...props} />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}

// ─── BADGE ───
export function Badge({ children, variant = 'default', className }) {
  const variants = {
    default: 'bg-slate-100 text-slate-600',
    primary: 'bg-brand-50 text-brand-700',
    success: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amber-50 text-amber-700',
    danger: 'bg-red-50 text-red-700',
    accent: 'bg-teal-50 text-teal-700',
  }
  return <span className={cn('badge', variants[variant], className)}>{children}</span>
}

// ─── STATUS BADGE ───
export function StatusBadge({ status }) {
  const map = {
    completed: { v: 'success', l: 'Completed' },
    active: { v: 'primary', l: 'Active' },
    upcoming: { v: 'warning', l: 'Upcoming' },
    draft: { v: 'default', l: 'Draft' },
  }
  const { v, l } = map[status] || map.draft
  return <Badge variant={v}>{l}</Badge>
}

// ─── MODAL ───
export function Modal({ open, onClose, title, children, size = 'md', className }) {
  if (!open) return null
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl', full: 'max-w-6xl' }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className={cn('relative bg-white rounded-2xl shadow-elevated w-full animate-slide-up', sizes[size], className)}>
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200">
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-100 text-slate-400 hover:text-slate-600 transition-colors"><X size={18} /></button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

// ─── TABS ───
export function Tabs({ tabs, active, onChange, className }) {
  return (
    <div className={cn('flex gap-1 p-1 bg-surface-100 rounded-xl overflow-x-auto', className)}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} className={cn(
          'px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all duration-200',
          active === t.id ? 'bg-white text-brand-600 shadow-sm font-semibold' : 'text-slate-500 hover:text-slate-700'
        )}>{t.label}</button>
      ))}
    </div>
  )
}

// ─── CARD ───
export function Card({ children, className, interactive, ...props }) {
  return (
    <div className={cn(interactive ? 'card-interactive' : 'bg-white rounded-2xl border border-surface-200 shadow-card', className)} {...props}>
      {children}
    </div>
  )
}

// ─── EMPTY STATE ───
export function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {Icon && <div className="p-4 rounded-2xl bg-surface-100 mb-4"><Icon size={36} className="text-slate-300" /></div>}
      <h3 className="text-base font-semibold text-slate-700 mb-1">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mb-5">{message}</p>
      {action}
    </div>
  )
}

// ─── TOAST CONTAINER ───
export function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-2 max-w-sm">
      {toasts.map(t => (
        <div key={t.id} className={cn(
          'flex items-center gap-3 px-4 py-3 rounded-xl shadow-elevated text-sm font-medium animate-slide-in-right',
          t.type === 'success' && 'bg-emerald-600 text-white',
          t.type === 'error' && 'bg-red-600 text-white',
          t.type === 'warning' && 'bg-amber-500 text-white',
          t.type === 'info' && 'bg-brand-600 text-white',
        )}>
          <span className="flex-1">{t.message}</span>
          <button onClick={() => onRemove(t.id)} className="opacity-70 hover:opacity-100"><X size={14} /></button>
        </div>
      ))}
    </div>
  )
}
