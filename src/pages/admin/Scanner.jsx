import { useState, useEffect, useRef, useCallback } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { Camera, CameraOff, Hash, CheckCircle2, XCircle, AlertTriangle, RefreshCw, Search, Activity, ScanLine, Volume2 } from 'lucide-react'
import { Card, Button, Input, Badge } from '../../components/ui'
import { KPICard, Avatar, ProgressRing } from '../../components/shared'
import { useStore } from '../../hooks/useStore'
import { useApp } from '../../context/AppContext'
import { cn, formatDateTime } from '../../lib/utils'

export default function AdminScannerPage() {
  const store = useStore()
  const { addToast } = useApp()
  const [scanning, setScanning] = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [manualCode, setManualCode] = useState('')
  const [recentScans, setRecentScans] = useState([])
  const [selectedEvent, setSelectedEvent] = useState('')
  const scannerRef = useRef(null)
  const html5QrRef = useRef(null)
  const audioRef = useRef(null)

  const events = store.getEvents().filter(e => e.status !== 'draft')
  const allRegs = store.getRegistrations(selectedEvent || undefined)
  const attendedCount = allRegs.filter(r => r.attended).length

  // Play beep sound on scan
  const playBeep = useCallback((success) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = success ? 800 : 300
      gain.gain.value = 0.1
      osc.start()
      osc.stop(ctx.currentTime + (success ? 0.15 : 0.3))
    } catch (e) { /* silent fallback */ }
  }, [])

  // Process QR code
  const processQRCode = useCallback((qrCode) => {
    const result = store.markAttendance(qrCode)
    
    const scanEntry = {
      code: qrCode,
      time: new Date().toISOString(),
      ...result,
    }
    
    setScanResult(result)
    setRecentScans(prev => [scanEntry, ...prev].slice(0, 20))
    playBeep(result.success)

    if (result.success) {
      addToast(`${result.registration.name} checked in successfully!`, 'success')
    } else if (result.type === 'duplicate') {
      addToast(`${result.registration?.name || 'Participant'} already checked in.`, 'warning')
    } else {
      addToast(result.message, 'error')
    }

    // Clear result after 5 seconds
    setTimeout(() => setScanResult(null), 5000)
  }, [store, addToast, playBeep])

  // Start camera scanner
  const startScanner = useCallback(async () => {
    if (!scannerRef.current) return
    
    try {
      const html5Qr = new Html5Qrcode('qr-reader')
      html5QrRef.current = html5Qr

      await html5Qr.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          processQRCode(decodedText)
          // Brief pause to prevent rapid re-scans
          html5Qr.pause(true)
          setTimeout(() => {
            try { html5Qr.resume() } catch (e) {}
          }, 2000)
        },
        (errorMessage) => {
          // Scan errors are expected while searching, ignore silently
        }
      )
      setScanning(true)
    } catch (err) {
      console.error('Scanner error:', err)
      addToast('Could not access camera. Please check permissions.', 'error')
    }
  }, [processQRCode, addToast])

  // Stop camera scanner
  const stopScanner = useCallback(async () => {
    if (html5QrRef.current) {
      try {
        await html5QrRef.current.stop()
        html5QrRef.current.clear()
      } catch (e) {}
      html5QrRef.current = null
    }
    setScanning(false)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => { stopScanner() }
  }, [stopScanner])

  // Manual code submission
  const handleManualSubmit = (e) => {
    e.preventDefault()
    if (!manualCode.trim()) return
    processQRCode(manualCode.trim())
    setManualCode('')
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800">QR Scanner</h1>
          <p className="text-sm text-slate-400 mt-0.5">Scan participant QR codes for attendance verification</p>
        </div>
        <div className="flex gap-2">
          <select
            className="input-field !py-2 !text-xs max-w-[200px]"
            value={selectedEvent}
            onChange={e => setSelectedEvent(e.target.value)}
          >
            <option value="">All Events</option>
            {events.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Scanner Area */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="overflow-hidden">
            {/* Camera View */}
            <div className="relative bg-navy-950 min-h-[350px]">
              <div id="qr-reader" ref={scannerRef} className="w-full" />
              
              {!scanning && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {/* Scan overlay graphic */}
                  <div className="relative w-56 h-56 mb-6">
                    <div className="absolute inset-0 border-2 border-white/10 rounded-3xl" />
                    <div className="absolute top-0 left-0 w-10 h-10 border-t-3 border-l-3 border-accent-400 rounded-tl-2xl" />
                    <div className="absolute top-0 right-0 w-10 h-10 border-t-3 border-r-3 border-accent-400 rounded-tr-2xl" />
                    <div className="absolute bottom-0 left-0 w-10 h-10 border-b-3 border-l-3 border-accent-400 rounded-bl-2xl" />
                    <div className="absolute bottom-0 right-0 w-10 h-10 border-b-3 border-r-3 border-accent-400 rounded-br-2xl" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ScanLine size={48} className="text-white/20" />
                    </div>
                  </div>
                  <Button onClick={startScanner} icon={Camera} variant="accent" size="lg">
                    Start Camera Scanner
                  </Button>
                  <p className="text-xs text-slate-400 mt-3">Camera permission required</p>
                </div>
              )}

              {scanning && (
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-xl px-3.5 py-2">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-xs text-white font-medium">Camera Active</span>
                  </div>
                  <Button size="xs" variant="danger" icon={CameraOff} onClick={stopScanner}>Stop</Button>
                </div>
              )}
            </div>
          </Card>

          {/* Scan Result Banner */}
          {scanResult && (
            <div className={cn(
              'p-4 rounded-2xl border-2 flex items-center gap-4 animate-slide-up',
              scanResult.success ? 'border-emerald-300 bg-emerald-50' :
              scanResult.type === 'duplicate' ? 'border-amber-300 bg-amber-50' :
              'border-red-300 bg-red-50'
            )}>
              {scanResult.success ? <CheckCircle2 size={28} className="text-emerald-600 flex-shrink-0" /> :
               scanResult.type === 'duplicate' ? <AlertTriangle size={28} className="text-amber-600 flex-shrink-0" /> :
               <XCircle size={28} className="text-red-600 flex-shrink-0" />}
              <div className="flex-1">
                <h4 className={cn('font-bold text-sm',
                  scanResult.success ? 'text-emerald-800' :
                  scanResult.type === 'duplicate' ? 'text-amber-800' :
                  'text-red-800'
                )}>
                  {scanResult.success ? 'Attendance Confirmed' :
                   scanResult.type === 'duplicate' ? 'Duplicate Scan' :
                   scanResult.type === 'not_found' ? 'Not Registered' : 'Invalid Code'}
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">{scanResult.message}</p>
                {scanResult.registration && (
                  <p className="text-xs font-semibold text-slate-700 mt-1">{scanResult.registration.name} • {scanResult.registration.type}</p>
                )}
              </div>
            </div>
          )}

          {/* Manual Code Entry */}
          <Card className="p-5">
            <h3 className="text-sm font-bold text-slate-700 mb-3">Manual Code Entry</h3>
            <p className="text-xs text-slate-400 mb-3">Enter or paste a QR reference code to verify attendance</p>
            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <Input
                icon={Hash}
                placeholder="e.g. QR-E001-P001-2025"
                value={manualCode}
                onChange={e => setManualCode(e.target.value)}
                className="flex-1 !font-mono"
              />
              <Button type="submit" icon={Search}>Verify</Button>
            </form>
          </Card>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-4">
          {/* Live Counter */}
          <Card className="p-5 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">Live Attendance</p>
            <ProgressRing
              value={allRegs.length > 0 ? (attendedCount / allRegs.length) * 100 : 0}
              size={100}
              strokeWidth={8}
              color="#14b8a6"
            />
            <div className="mt-3">
              <p className="text-2xl font-extrabold text-slate-800">{attendedCount}</p>
              <p className="text-xs text-slate-400">of {allRegs.length} registered</p>
            </div>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-3.5 text-center">
              <p className="text-lg font-bold text-brand-600">{recentScans.filter(s => s.success).length}</p>
              <p className="text-[10px] text-slate-400">Valid Scans</p>
            </Card>
            <Card className="p-3.5 text-center">
              <p className="text-lg font-bold text-amber-500">{recentScans.filter(s => s.type === 'duplicate').length}</p>
              <p className="text-[10px] text-slate-400">Duplicates</p>
            </Card>
          </div>

          {/* Recent Scans */}
          <Card className="p-5">
            <h3 className="text-sm font-bold text-slate-700 mb-3">Recent Scans</h3>
            <div className="space-y-2 max-h-[360px] overflow-y-auto">
              {recentScans.length > 0 ? recentScans.map((scan, i) => (
                <div key={i} className={cn(
                  'flex items-center gap-2.5 p-2.5 rounded-xl text-xs',
                  scan.success ? 'bg-emerald-50' : scan.type === 'duplicate' ? 'bg-amber-50' : 'bg-red-50'
                )}>
                  {scan.success ? <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" /> :
                   scan.type === 'duplicate' ? <AlertTriangle size={14} className="text-amber-500 flex-shrink-0" /> :
                   <XCircle size={14} className="text-red-500 flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-700 truncate">{scan.registration?.name || scan.code}</p>
                    <p className="text-[10px] text-slate-400">{new Date(scan.time).toLocaleTimeString()}</p>
                  </div>
                </div>
              )) : (
                <p className="text-xs text-slate-400 text-center py-6">No scans yet. Start scanning to see results here.</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
