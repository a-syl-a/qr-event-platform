import { useState } from 'react'
import { MessageSquare, Star, ThumbsUp, Percent, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { Card, Badge, Button } from '../../components/ui'
import { KPICard, Avatar } from '../../components/shared'
import { useStore } from '../../hooks/useStore'
import { formatDateTime } from '../../lib/utils'

const QUESTION_LABELS = ['Ease of Use', 'Scanning Speed', 'Convenience', 'Dashboard Clarity', 'Overall Experience']
const QUESTION_KEYS = ['q1', 'q2', 'q3', 'q4', 'q5']

export default function AdminFeedbackPage() {
  const store = useStore()
  const [eventFilter, setEventFilter] = useState('')
  const events = store.getEvents()
  const feedback = store.getFeedback(eventFilter || undefined)
  
  const totalAttended = store.getRegistrations(eventFilter || undefined).filter(r => r.attended).length
  const responseRate = totalAttended > 0 ? ((feedback.length / totalAttended) * 100).toFixed(1) : 0

  // Per-question averages
  const questionAverages = QUESTION_KEYS.map((key, i) => {
    const avg = feedback.length > 0
      ? (feedback.reduce((sum, f) => sum + (f[key] || 0), 0) / feedback.length).toFixed(2)
      : 0
    return { name: QUESTION_LABELS[i], shortName: `Q${i + 1}`, value: parseFloat(avg), fullMark: 5 }
  })

  const overallAvg = feedback.length > 0
    ? (feedback.reduce((sum, f) => sum + (f.q1 + f.q2 + f.q3 + f.q4 + f.q5) / 5, 0) / feedback.length).toFixed(2)
    : '0.00'

  // Rating distribution
  const ratingDist = [1, 2, 3, 4, 5].map(rating => ({
    rating: `${rating} Star`,
    count: feedback.reduce((sum, f) => {
      return sum + QUESTION_KEYS.filter(k => f[k] === rating).length
    }, 0)
  }))

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800">Feedback Analytics</h1>
          <p className="text-sm text-slate-400 mt-0.5">Review participant satisfaction and feedback data</p>
        </div>
        <select className="input-field !py-2 !text-xs max-w-[220px]" value={eventFilter} onChange={e => setEventFilter(e.target.value)}>
          <option value="">All Events</option>
          {events.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
        </select>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard icon={MessageSquare} label="Total Responses" value={feedback.length} />
        <KPICard icon={Percent} label="Response Rate" value={`${responseRate}%`} sub={`${feedback.length} of ${totalAttended} attendees`} />
        <KPICard icon={Star} label="Average Rating" value={`${overallAvg}/5`} />
        <KPICard icon={ThumbsUp} label="Satisfaction" value={parseFloat(overallAvg) >= 4 ? 'Very High' : parseFloat(overallAvg) >= 3 ? 'Good' : 'Needs Work'} />
      </div>

      {feedback.length > 0 ? (
        <>
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Per-question bar chart */}
            <Card className="p-5">
              <h3 className="text-sm font-bold text-slate-700 mb-1">Per-Question Averages</h3>
              <p className="text-xs text-slate-400 mb-4">Mean Likert scale ratings (1–5)</p>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={questionAverages} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis dataKey="shortName" type="category" tick={{ fontSize: 11, fill: '#64748b' }} width={30} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
                    formatter={(val, name, props) => [`${val} / 5.0`, props.payload.name]}
                  />
                  <Bar dataKey="value" fill="#1a44f5" radius={[0, 8, 8, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Radar chart */}
            <Card className="p-5">
              <h3 className="text-sm font-bold text-slate-700 mb-1">Satisfaction Radar</h3>
              <p className="text-xs text-slate-400 mb-4">Multi-dimensional view</p>
              <ResponsiveContainer width="100%" height={240}>
                <RadarChart data={questionAverages} cx="50%" cy="50%" outerRadius="70%">
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="shortName" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <PolarRadiusAxis domain={[0, 5]} tick={{ fontSize: 9, fill: '#94a3b8' }} />
                  <Radar name="Rating" dataKey="value" stroke="#1a44f5" fill="#1a44f5" fillOpacity={0.15} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Question Details */}
          <Card className="p-5">
            <h3 className="text-sm font-bold text-slate-700 mb-4">Question Breakdown</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {questionAverages.map((q, i) => (
                <div key={i} className="p-4 rounded-xl bg-surface-50 border border-surface-200 text-center">
                  <p className="text-2xl font-extrabold text-brand-600">{q.value}</p>
                  <p className="text-[10px] text-slate-400 mt-1 leading-tight">{q.name}</p>
                  <div className="mt-2 h-1.5 bg-surface-200 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${(q.value / 5) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Comments */}
          <Card className="p-5">
            <h3 className="text-sm font-bold text-slate-700 mb-4">Participant Comments</h3>
            <div className="space-y-3">
              {feedback.filter(f => f.comment).map(f => {
                const reg = store.getRegistration(f.registrationId)
                const avgRating = ((f.q1 + f.q2 + f.q3 + f.q4 + f.q5) / 5).toFixed(1)
                return (
                  <div key={f.id} className="p-4 rounded-xl bg-surface-50 border border-surface-200">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5">
                        {reg && <Avatar name={reg.name} size="sm" />}
                        <div>
                          <p className="text-sm font-semibold text-slate-700">{reg?.name || 'Anonymous'}</p>
                          <p className="text-[10px] text-slate-400">{formatDateTime(f.submittedAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                        <Star size={12} className="text-amber-500 fill-amber-500" />
                        <span className="text-xs font-bold text-amber-700">{avgRating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 italic leading-relaxed">"{f.comment}"</p>
                  </div>
                )
              })}
              {feedback.filter(f => f.comment).length === 0 && (
                <p className="text-sm text-slate-400 text-center py-6">No comments submitted yet.</p>
              )}
            </div>
          </Card>
        </>
      ) : (
        <Card className="p-12 text-center">
          <MessageSquare size={40} className="text-slate-200 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-600 mb-1">No Feedback Yet</h3>
          <p className="text-sm text-slate-400">Feedback data will appear here once participants submit evaluations.</p>
        </Card>
      )}
    </div>
  )
}
