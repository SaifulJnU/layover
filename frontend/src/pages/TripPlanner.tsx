import { useState, useEffect } from 'react'
import { Calendar, Users, DollarSign, MapPin, Clock, Star, Plus, ChevronDown, ChevronUp, Coffee, Utensils, Camera, Car, BedDouble, UserPlus, Sparkles, X, Loader2, Plane, CheckCircle } from 'lucide-react'
import { fetchTrips, createTrip, generateItinerary } from '../services/api'
import type { Trip, DayPlan, Activity } from '../types'
import InviteFriend from '../components/ui/InviteFriend'
import { useTheme } from '../contexts/ThemeContext'

const typeIcons: Record<string, React.ElementType> = {
  food: Utensils, attraction: Camera, transport: Car, accommodation: BedDouble, default: Coffee,
}
const typeColors: Record<string, string> = {
  food: '#F59E0B', attraction: '#4F46E5', transport: '#7C3AED', accommodation: '#10B981', default: '#EF4444',
}

function ActivityItem({ activity }: { activity: Activity }) {
  const { t } = useTheme()
  const Icon = typeIcons[activity.type] || typeIcons.default
  const color = typeColors[activity.type] || typeColors.default
  return (
    <div style={{ display: 'flex', gap: '12px', padding: '14px', borderRadius: '12px', background: t.surface, border: `1px solid ${t.border}`, marginBottom: '8px', transition: 'border-color 0.2s' }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = '#4F46E5'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = t.border}
    >
      <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: `${color}15`, border: `1px solid ${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={15} color={color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
          <div>
            <p style={{ color: t.text, fontSize: '14px', fontWeight: '700', marginBottom: '2px', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{activity.name}</p>
            <p style={{ color: t.textMuted, fontSize: '12px' }}>{activity.address}</p>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <p style={{ color: '#10B981', fontSize: '13px', fontWeight: '700' }}>€{activity.cost}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', justifyContent: 'flex-end', marginTop: '2px' }}>
              <Star size={10} fill="#F59E0B" color="#F59E0B" />
              <span style={{ color: '#F59E0B', fontSize: '11px', fontWeight: '600' }}>{activity.rating}</span>
            </div>
          </div>
        </div>
        <p style={{ color: t.textSub, fontSize: '12px', lineHeight: 1.6, margin: '6px 0 8px' }}>{activity.description}</p>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={11} color={t.textMuted} />
            <span style={{ color: t.textSub, fontSize: '11px' }}>{activity.time}</span>
          </div>
          <span style={{ color: t.textMuted, fontSize: '11px' }}>⏱ {activity.duration}</span>
          <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '10px', background: `${color}12`, color, border: `1px solid ${color}20`, textTransform: 'capitalize', fontWeight: '600' }}>{activity.type}</span>
        </div>
      </div>
    </div>
  )
}

function DayCard({ dayPlan }: { dayPlan: DayPlan }) {
  const { t } = useTheme()
  const [open, setOpen] = useState(true)
  const total = dayPlan.activities.reduce((s, a) => s + a.cost, 0)
  return (
    <div className="card" style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '14px' }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 18px', background: 'none', border: 'none', cursor: 'pointer', borderBottom: open ? `1px solid ${t.border}` : 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '800', color: 'white' }}>
            {dayPlan.day}
          </div>
          <div style={{ textAlign: 'left' }}>
            <p style={{ color: t.text, fontSize: '14px', fontWeight: '700', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Day {dayPlan.day}</p>
            <p style={{ color: t.textMuted, fontSize: '12px' }}>{dayPlan.date} · {dayPlan.activities.length} activities</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: '#10B981', fontSize: '13px', fontWeight: '700' }}>€{total}</span>
          {open ? <ChevronUp size={15} color={t.textMuted} /> : <ChevronDown size={15} color={t.textMuted} />}
        </div>
      </button>
      {open && (
        <div style={{ padding: '14px' }}>
          {dayPlan.activities.map((a, i) => <ActivityItem key={i} activity={a} />)}
        </div>
      )}
    </div>
  )
}

function NewTripModal({ onClose, onCreate }: { onClose: () => void; onCreate: (trip: Trip) => void }) {
  const { t } = useTheme()
  const [form, setForm] = useState({ name: '', destination: '', startDate: '', endDate: '', budget: '' })
  const [saving, setSaving] = useState(false)
  const valid = form.name && form.destination && form.startDate && form.endDate && form.budget

  const handleSubmit = async () => {
    if (!valid) return
    setSaving(true)
    try {
      const trip = await createTrip({
        name: form.name, destination: form.destination,
        startDate: form.startDate, endDate: form.endDate,
        budget: parseFloat(form.budget),
        image: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=80',
        members: [], itinerary: [],
      })
      onCreate(trip)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{ width: '100%', maxWidth: '500px', background: t.card, borderRadius: '24px', padding: '32px', border: `1px solid ${t.border}`, boxShadow: '0 32px 80px rgba(0,0,0,0.18)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <h3 style={{ color: t.text, fontSize: '22px', fontWeight: '900', fontFamily: "'Plus Jakarta Sans',sans-serif", marginBottom: '4px' }}>Plan a New Trip</h3>
            <p style={{ color: t.textSub, fontSize: '13px' }}>Fill in the details — we'll help build your itinerary</p>
          </div>
          <button onClick={onClose} style={{ background: t.surface, border: 'none', borderRadius: '50%', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={16} color={t.textSub} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ color: t.textSub, fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Trip Name *</label>
            <input className="input-glass" placeholder="e.g. Bali with the crew" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label style={{ color: t.textSub, fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Destination *</label>
            <div style={{ position: 'relative' }}>
              <MapPin size={15} color="#4F46E5" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input className="input-glass" placeholder="e.g. Bali, Indonesia" value={form.destination} onChange={e => setForm(f => ({ ...f, destination: e.target.value }))} style={{ paddingLeft: '40px' }} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ color: t.textSub, fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Start Date *</label>
              <input className="input-glass" type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
            </div>
            <div>
              <label style={{ color: t.textSub, fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>End Date *</label>
              <input className="input-glass" type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
            </div>
          </div>
          <div>
            <label style={{ color: t.textSub, fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Total Budget (€) *</label>
            <div style={{ position: 'relative' }}>
              <DollarSign size={15} color="#10B981" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input className="input-glass" type="number" placeholder="e.g. 2500" value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} style={{ paddingLeft: '40px' }} />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!valid || saving}
            style={{
              padding: '15px', borderRadius: '14px', border: 'none', marginTop: '4px',
              background: valid ? 'linear-gradient(135deg,#4F46E5,#7C3AED)' : '#F1F5F9',
              color: valid ? '#fff' : '#94A3B8', fontSize: '15px', fontWeight: '700',
              cursor: valid ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '9px',
              fontFamily: "'Plus Jakarta Sans',sans-serif", boxShadow: valid ? '0 8px 24px rgba(79,70,229,0.28)' : 'none', transition: 'all 0.2s',
            }}
          >
            {saving ? <><Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> Creating...</> : <><Plane size={16} /> Create Trip</>}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function TripPlanner() {
  const { t } = useTheme()
  const [trips, setTrips]         = useState<Trip[]>([])
  const [selected, setSelected]   = useState<Trip | null>(null)
  const [loading, setLoading]     = useState(true)
  const [showNew, setShowNew]     = useState(false)
  const [showInvite, setShowInvite] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [genDone, setGenDone]     = useState(false)

  useEffect(() => {
    fetchTrips().then(data => {
      setTrips(data.trips || [])
      if (data.trips?.length) setSelected(data.trips[0])
    }).finally(() => setLoading(false))
  }, [])

  const handleCreate = (trip: Trip) => {
    setTrips(ts => [trip, ...ts])
    setSelected(trip)
    setGenDone(false)
  }

  const handleGenerate = async () => {
    if (!selected) return
    setGenerating(true)
    try {
      const data = await generateItinerary(selected.id)
      const updated = { ...selected, itinerary: data.itinerary }
      setSelected(updated)
      setTrips(ts => ts.map(t => t.id === selected.id ? updated : t))
      setGenDone(true)
    } finally {
      setGenerating(false)
    }
  }

  const spent = selected ? selected.totalSpent : 0
  const budget = selected ? selected.budget : 0
  const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0
  const itineraryCost = selected?.itinerary.reduce((s, d) => s + d.activities.reduce((a, act) => a + act.cost, 0), 0) || 0
  const daysCount = selected ? (new Date(selected.endDate).getTime() - new Date(selected.startDate).getTime()) / 86400000 + 1 : 0

  return (
    <div style={{ paddingTop: '88px', minHeight: '100vh', background: t.surface, transition: 'background 0.3s ease' }}>
      <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Page header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '900', color: t.text, letterSpacing: '-0.5px', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Trip Planner</h1>
            <p style={{ color: t.textSub, fontSize: '14px', marginTop: '3px' }}>Manage your itineraries, track budget & coordinate with your group</p>
          </div>
          <button onClick={() => setShowNew(true)} className="btn btn-primary" style={{ gap: '8px' }}>
            <Plus size={16} /> New Trip
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px', gap: '12px', alignItems: 'center' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: '2.5px solid rgba(79,70,229,0.2)', borderTopColor: '#4F46E5', animation: 'spin 0.8s linear infinite' }} />
            <span style={{ color: t.textSub, fontSize: '14px' }}>Loading your trips...</span>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '290px 1fr', gap: '24px', alignItems: 'start' }}>

            {/* Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <p style={{ color: t.textMuted, fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '2px' }}>
                My Trips ({trips.length})
              </p>
              {trips.map(trip => (
                <div
                  key={trip.id}
                  onClick={() => { setSelected(trip); setGenDone(false) }}
                  style={{
                    borderRadius: '16px', overflow: 'hidden', cursor: 'pointer',
                    border: selected?.id === trip.id ? '2px solid #4F46E5' : `1px solid ${t.border}`,
                    background: t.card,
                    boxShadow: selected?.id === trip.id ? '0 4px 20px rgba(79,70,229,0.14)' : '0 1px 6px rgba(0,0,0,0.04)',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ position: 'relative', height: '90px' }}>
                    <img src={trip.image} alt={trip.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,0.6) 0%,transparent 60%)' }} />
                    <span style={{
                      position: 'absolute', bottom: '8px', right: '8px', fontSize: '10px', fontWeight: '700', padding: '2px 9px', borderRadius: '10px', textTransform: 'capitalize',
                      background: trip.status === 'completed' ? 'rgba(16,185,129,0.9)' : 'rgba(79,70,229,0.9)', color: '#fff',
                    }}>{trip.status}</span>
                  </div>
                  <div style={{ padding: '12px' }}>
                    <p style={{ color: t.text, fontSize: '14px', fontWeight: '700', marginBottom: '5px', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{trip.name}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                      <MapPin size={11} color="#4F46E5" />
                      <span style={{ color: '#4F46E5', fontSize: '12px', fontWeight: '500' }}>{trip.destination}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={11} color="#94A3B8" />
                      <span style={{ color: '#94A3B8', fontSize: '11px' }}>{trip.startDate} → {trip.endDate}</span>
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={() => setShowNew(true)}
                style={{ width: '100%', padding: '13px', borderRadius: '14px', background: 'rgba(79,70,229,0.04)', border: '1.5px dashed rgba(79,70,229,0.25)', color: '#4F46E5', fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', transition: 'all 0.2s', fontFamily: "'Plus Jakarta Sans',sans-serif" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(79,70,229,0.08)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(79,70,229,0.04)'}
              >
                <Plus size={15} /> Plan a New Trip
              </button>
            </div>

            {/* Main panel */}
            {selected ? (
              <div>
                {/* Hero image + title */}
                <div style={{ borderRadius: '20px', overflow: 'hidden', marginBottom: '20px', position: 'relative', height: '200px' }}>
                  <img src={selected.image} alt={selected.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,0.75) 0%,rgba(0,0,0,0.1) 60%,transparent 100%)' }} />
                  <div style={{ position: 'absolute', bottom: '20px', left: '24px', right: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <h2 style={{ color: '#fff', fontSize: '26px', fontWeight: '900', fontFamily: "'Plus Jakarta Sans',sans-serif", letterSpacing: '-0.5px', marginBottom: '5px' }}>{selected.name}</h2>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <MapPin size={13} color="rgba(255,255,255,0.8)" />
                          <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '14px', fontWeight: '500' }}>{selected.destination}</span>
                        </div>
                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>·</span>
                        <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px' }}>{selected.startDate} → {selected.endDate}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => setShowInvite(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
                        <UserPlus size={14} /> Invite
                      </button>
                      <span style={{ padding: '8px 14px', borderRadius: '10px', background: selected.status === 'completed' ? 'rgba(16,185,129,0.85)' : 'rgba(79,70,229,0.85)', color: '#fff', fontSize: '12px', fontWeight: '700', textTransform: 'capitalize', backdropFilter: 'blur(8px)' }}>
                        {selected.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '20px' }}>
                  {[
                    { icon: DollarSign, label: 'Budget', value: `€${selected.budget.toLocaleString()}`, color: '#4F46E5', bg: '#EEF2FF' },
                    { icon: DollarSign, label: 'Est. Cost', value: `€${itineraryCost}`, color: itineraryCost > selected.budget ? '#EF4444' : '#10B981', bg: itineraryCost > selected.budget ? '#FEF2F2' : '#ECFDF5' },
                    { icon: Users,      label: 'Travellers', value: `${selected.members.length || 1} people`, color: '#F97316', bg: '#FFF7ED' },
                    { icon: Calendar,   label: 'Duration', value: `${Math.max(1, daysCount)} days`, color: '#7C3AED', bg: '#F5F3FF' },
                  ].map(({ icon: Icon, label, value, color, bg }) => (
                    <div key={label} className="card" style={{ padding: '16px', borderRadius: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon size={13} color={color} />
                        </div>
                        <span style={{ color: '#94A3B8', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{label}</span>
                      </div>
                      <p style={{ color: t.text, fontSize: '18px', fontWeight: '800', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{value}</p>
                    </div>
                  ))}
                </div>

                {/* Budget bar */}
                <div className="card" style={{ padding: '18px', borderRadius: '14px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: t.textSub, fontSize: '13px', fontWeight: '600' }}>Budget tracker</span>
                    <span style={{ color: pct > 80 ? '#EF4444' : '#10B981', fontSize: '13px', fontWeight: '700' }}>{pct.toFixed(0)}% used · €{spent} of €{budget}</span>
                  </div>
                  <div style={{ height: '8px', background: t.surface2, borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: pct > 80 ? 'linear-gradient(90deg,#EF4444,#DC2626)' : 'linear-gradient(90deg,#4F46E5,#7C3AED)', borderRadius: '6px', transition: 'width 0.4s ease' }} />
                  </div>

                  {/* Members */}
                  {selected.members.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px', paddingTop: '14px', borderTop: `1px solid ${t.border}` }}>
                      <span style={{ color: t.textMuted, fontSize: '12px', fontWeight: '600' }}>Group:</span>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {selected.members.map(m => (
                          <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '20px', background: t.surface, border: `1px solid ${t.border}` }}>
                            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '800', color: 'white' }}>
                              {m.avatar}
                            </div>
                            <span style={{ color: t.textSub, fontSize: '12px', fontWeight: '500' }}>{m.name}</span>
                            <span style={{ color: '#10B981', fontSize: '11px', fontWeight: '600' }}>€{m.paid}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Itinerary section */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ color: t.text, fontSize: '18px', fontWeight: '800', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                    Itinerary {selected.itinerary.length > 0 && <span style={{ color: '#94A3B8', fontSize: '14px', fontWeight: '500' }}>· {selected.itinerary.length} days planned</span>}
                  </h3>
                  {!genDone && (
                    <button
                      onClick={handleGenerate}
                      disabled={generating}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 18px', borderRadius: '12px', border: 'none', cursor: generating ? 'not-allowed' : 'pointer',
                        background: 'linear-gradient(135deg,#7C3AED,#4F46E5)', color: '#fff', fontSize: '13px', fontWeight: '700',
                        fontFamily: "'Plus Jakarta Sans',sans-serif", opacity: generating ? 0.75 : 1, transition: 'all 0.2s',
                        boxShadow: '0 4px 16px rgba(124,58,237,0.3)',
                      }}
                    >
                      {generating ? <><Loader2 size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> Generating...</> : <><Sparkles size={14} /> AI Generate Itinerary</>}
                    </button>
                  )}
                  {genDone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '12px', background: '#ECFDF5', border: '1px solid rgba(16,185,129,0.2)' }}>
                      <CheckCircle size={14} color="#10B981" />
                      <span style={{ color: '#10B981', fontSize: '13px', fontWeight: '700' }}>Itinerary generated!</span>
                    </div>
                  )}
                </div>

                {selected.itinerary.length === 0 ? (
                  <div className="card" style={{ borderRadius: '20px', padding: '56px 32px', textAlign: 'center' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'linear-gradient(135deg,#EEF2FF,#F5F3FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', border: '1px solid rgba(79,70,229,0.1)' }}>
                      <Sparkles size={28} color="#4F46E5" />
                    </div>
                    <h4 style={{ color: t.text, fontSize: '18px', fontWeight: '800', marginBottom: '8px', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>No itinerary yet</h4>
                    <p style={{ color: t.textSub, fontSize: '14px', maxWidth: '320px', margin: '0 auto 24px', lineHeight: 1.65 }}>
                      Click "AI Generate Itinerary" above and we'll build a full day-by-day plan for {selected.destination}.
                    </p>
                    <button
                      onClick={handleGenerate}
                      disabled={generating}
                      style={{ padding: '12px 28px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', color: '#fff', fontSize: '14px', fontWeight: '700', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: "'Plus Jakarta Sans',sans-serif", boxShadow: '0 4px 16px rgba(79,70,229,0.3)' }}
                    >
                      {generating ? <><Loader2 size={15} style={{ animation: 'spin 0.8s linear infinite' }} /> Generating...</> : <><Sparkles size={15} /> Generate My Itinerary</>}
                    </button>
                  </div>
                ) : (
                  selected.itinerary.map(day => <DayCard key={day.day} dayPlan={day} />)
                )}
              </div>
            ) : (
              <div className="card" style={{ borderRadius: '20px', padding: '80px', textAlign: 'center' }}>
                <Plane size={40} color="#94A3B8" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ color: t.text, fontSize: '20px', fontWeight: '800', marginBottom: '8px', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>No trip selected</h3>
                <p style={{ color: t.textSub, fontSize: '14px', marginBottom: '24px' }}>Pick a trip from the sidebar or create a new one</p>
                <button onClick={() => setShowNew(true)} className="btn btn-primary" style={{ gap: '8px' }}>
                  <Plus size={15} /> Plan a Trip
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {showNew && <NewTripModal onClose={() => setShowNew(false)} onCreate={handleCreate} />}
      {showInvite && selected && <InviteFriend tripId={selected.id} tripName={selected.name} onClose={() => setShowInvite(false)} />}
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  )
}