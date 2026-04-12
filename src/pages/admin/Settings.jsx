import { useState } from 'react'
import { User, Mail, Building2, Lock, Shield, Clock, QrCode, FileCheck, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react'
import { Card, Button, Input, Badge, Modal } from '../../components/ui'
import { useStore } from '../../hooks/useStore'
import { useApp } from '../../context/AppContext'

export default function AdminSettingsPage() {
  const { user, addToast } = useApp()
  const store = useStore()
  const [resetModal, setResetModal] = useState(false)

  const handleReset = () => {
    store.resetData()
    addToast('All data has been reset to defaults.', 'success')
    setResetModal(false)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-extrabold text-slate-800">Settings</h1>
        <p className="text-sm text-slate-400 mt-0.5">Platform configuration and account management</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Profile */}
        <Card className="p-6">
          <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2"><User size={16} className="text-brand-600" /> Organizer Profile</h3>
          <div className="space-y-4">
            <Input label="Full Name" value={user?.name || 'Admin User'} readOnly />
            <Input label="Email Address" value={user?.email || 'admin@university.edu.ph'} readOnly />
            <Input label="Institution" value="College of Computing" readOnly />
            <div className="flex items-center gap-2 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">Email Verified</span>
            </div>
          </div>
        </Card>

        {/* Security */}
        <Card className="p-6">
          <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2"><Shield size={16} className="text-brand-600" /> Security Settings</h3>
          <div className="space-y-3">
            {[
              { icon: Lock, title: 'Password', desc: 'Password strength validation enforced', status: 'Configured', ok: true },
              { icon: Shield, title: 'Role-Based Access', desc: 'Organizer role with full admin privileges', status: 'Active', ok: true },
              { icon: Clock, title: 'Session Management', desc: 'Secure session tokens with expiration', status: 'Active', ok: true },
              { icon: QrCode, title: 'QR Validation', desc: 'Hash-based duplicate prevention enabled', status: 'Enabled', ok: true },
              { icon: FileCheck, title: 'Privacy Consent', desc: 'Data consent required for registration', status: 'Enforced', ok: true },
              { icon: Mail, title: 'Email Verification', desc: 'New organizers must verify email', status: 'Required', ok: true },
            ].map((s, i) => (
              <div key={i} className="flex items-center justify-between p-3.5 rounded-xl border border-surface-200 hover:border-surface-300 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-brand-50"><s.icon size={16} className="text-brand-600" /></div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{s.title}</p>
                    <p className="text-[11px] text-slate-400">{s.desc}</p>
                  </div>
                </div>
                <Badge variant={s.ok ? 'success' : 'warning'}>{s.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Data Management */}
      <Card className="p-6">
        <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2"><RefreshCw size={16} className="text-brand-600" /> Data Management</h3>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-red-50 border border-red-200">
          <div>
            <p className="text-sm font-semibold text-red-800">Reset All Data</p>
            <p className="text-xs text-red-600 mt-0.5">Restore all events, registrations, and feedback to default sample data. This cannot be undone.</p>
          </div>
          <Button variant="danger" size="sm" icon={AlertTriangle} onClick={() => setResetModal(true)}>Reset Data</Button>
        </div>
      </Card>

      {/* Platform Info */}
      <Card className="p-6">
        <h3 className="text-sm font-bold text-slate-700 mb-4">Platform Information</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { l: 'Platform', v: 'QR-Attend Event Platform' },
            { l: 'Version', v: '1.0.0' },
            { l: 'Framework', v: 'React + Vite' },
            { l: 'Database', v: 'localStorage (Frontend Demo)' },
            { l: 'QR Generation', v: 'qrcode.js library' },
            { l: 'QR Scanning', v: 'html5-qrcode library' },
          ].map((info, i) => (
            <div key={i} className="flex justify-between items-center py-2 px-3 rounded-lg bg-surface-50">
              <span className="text-xs text-slate-400">{info.l}</span>
              <span className="text-xs font-semibold text-slate-700">{info.v}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Reset Confirmation */}
      <Modal open={resetModal} onClose={() => setResetModal(false)} title="Reset All Data" size="sm">
        <div className="text-center mb-4">
          <AlertTriangle size={40} className="text-red-500 mx-auto mb-3" />
          <p className="text-sm text-slate-600">This will delete all current data and restore the default sample data. Are you sure?</p>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setResetModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleReset}>Reset Everything</Button>
        </div>
      </Modal>
    </div>
  )
}
