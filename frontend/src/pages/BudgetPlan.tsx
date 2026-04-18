import { useState, useEffect } from 'react'
import { Plus, X, Loader2, TrendingUp, AlertTriangle, PieChart, List, Edit3, Wallet, ArrowDownCircle, CalendarDays, Save } from 'lucide-react'
import axios from 'axios'
import { useTheme } from '../contexts/ThemeContext'

interface BudgetCategory { label: string; allocated: number; spent: number; color: string; icon: string }
interface BudgetExpense  { id: string; description: string; amount: number; category: string; date: string }
interface BudgetPlan    { id: string; tripName: string; destination: string; totalBudget: number; currency: string; duration: number; categories: Record<string, BudgetCategory>; expenses: BudgetExpense[]; createdAt: string }

const DEFAULT_CATEGORIES: Record<string, Omit<BudgetCategory, 'allocated' | 'spent'>> = {
  accommodation: { label: 'Accommodation', color: '#4F46E5', icon: '🏨' },
  food:          { label: 'Food & Drinks',  color: '#F59E0B', icon: '🍽️' },
  transport:     { label: 'Transport',      color: '#7C3AED', icon: '🚗' },
  activities:    { label: 'Activities',     color: '#10B981', icon: '🎭' },
  shopping:      { label: 'Shopping',       color: '#FF9A3C', icon: '🛍️' },
  emergency:     { label: 'Emergency',      color: '#EF4444', icon: '🛡️' },
}

function PieChartSVG({ categories }: { categories: Record<string, BudgetCategory> }) {
  const total = Object.values(categories).reduce((s, c) => s + c.allocated, 0)
  if (total === 0) return null
  let cumulative = 0
  const slices = Object.entries(categories).map(([key, cat]) => {
    const pct = cat.allocated / total
    const startAngle = cumulative * 2 * Math.PI - Math.PI / 2
    cumulative += pct
    const endAngle = cumulative * 2 * Math.PI - Math.PI / 2
    const r = 80
    const x1 = 100 + r * Math.cos(startAngle)
    const y1 = 100 + r * Math.sin(startAngle)
    const x2 = 100 + r * Math.cos(endAngle)
    const y2 = 100 + r * Math.sin(endAngle)
    const largeArc = pct > 0.5 ? 1 : 0
    return { key, cat, path: `M100,100 L${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2} Z`, pct }
  })

  return (
    <svg viewBox="0 0 200 200" style={{ width: '100%', maxWidth: '200px' }}>
      {slices.map(s => (
        <path key={s.key} d={s.path} fill={s.cat.color} opacity="0.85" stroke="white" strokeWidth="2" />
      ))}
      <circle cx="100" cy="100" r="45" fill="#F8FAFC" />
      <text x="100" y="96" textAnchor="middle" fill="#0F172A" fontSize="13" fontWeight="800">
        {Object.values(categories).reduce((s, c) => s + c.spent, 0).toFixed(0)}
      </text>
      <text x="100" y="110" textAnchor="middle" fill="#64748B" fontSize="9">spent</text>
    </svg>
  )
}

export default function BudgetPlan() {
  const { t } = useTheme()
  const [plans, setPlans]       = useState<BudgetPlan[]>([])
  const [active, setActive]     = useState<BudgetPlan | null>(null)
  const [loading, setLoading]   = useState(true)
  const [view, setView]         = useState<'chart' | 'list'>('chart')
  const [showNew, setShowNew]   = useState(false)
  const [showExp, setShowExp]   = useState(false)
  const [editCat, setEditCat]   = useState<string | null>(null)
  const [editVal, setEditVal]   = useState('')

  // new plan form
  const [form, setForm] = useState({ tripName: '', destination: '', totalBudget: '', currency: 'EUR', duration: '7' })
  // new expense form
  const [expForm, setExpForm] = useState({ description: '', amount: '', category: 'food' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    axios.get('/api/budget/plans').then(r => {
      setPlans(r.data.plans || [])
      if (r.data.plans?.length) setActive(r.data.plans[0])
    }).finally(() => setLoading(false))
  }, [])

  const createPlan = async () => {
    if (!form.tripName || !form.totalBudget) return
    setSubmitting(true)
    const budget = parseFloat(form.totalBudget)
    const splits: Record<string, BudgetCategory> = {}
    const keys = Object.keys(DEFAULT_CATEGORIES)
    const base = [0.35, 0.20, 0.15, 0.18, 0.07, 0.05]
    keys.forEach((k, i) => {
      splits[k] = { ...DEFAULT_CATEGORIES[k], allocated: parseFloat((budget * base[i]).toFixed(2)), spent: 0 }
    })
    const res = await axios.post('/api/budget/plans', { ...form, totalBudget: budget, duration: parseInt(form.duration), categories: splits, expenses: [] })
    setPlans(prev => [...prev, res.data])
    setActive(res.data)
    setForm({ tripName: '', destination: '', totalBudget: '', currency: 'EUR', duration: '7' })
    setShowNew(false)
    setSubmitting(false)
  }

  const addExpense = async () => {
    if (!active || !expForm.description || !expForm.amount) return
    setSubmitting(true)
    const res = await axios.post(`/api/budget/plans/${active.id}/expenses`, { description: expForm.description, amount: parseFloat(expForm.amount), category: expForm.category })
    setActive(res.data)
    setPlans(ps => ps.map(p => p.id === active.id ? res.data : p))
    setExpForm({ description: '', amount: '', category: 'food' })
    setShowExp(false)
    setSubmitting(false)
  }

  const saveAllocation = async (catKey: string) => {
    if (!active || !editVal) return
    const val = parseFloat(editVal)
    const res = await axios.put(`/api/budget/plans/${active.id}/categories/${catKey}`, { allocated: val })
    setActive(res.data)
    setPlans(ps => ps.map(p => p.id === active.id ? res.data : p))
    setEditCat(null)
    setEditVal('')
  }

  const totalAllocated = active ? Object.values(active.categories).reduce((s, c) => s + c.allocated, 0) : 0
  const totalSpent     = active ? Object.values(active.categories).reduce((s, c) => s + c.spent, 0) : 0
  const remaining      = active ? active.totalBudget - totalSpent : 0
  const overBudget     = remaining < 0

  if (loading) return (
    <div style={{ paddingTop: '88px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <Loader2 size={28} color="#10B981" style={{ animation: 'spin 1s linear infinite' }} />
    </div>
  )

  return (
    <div style={{ paddingTop: '88px', minHeight: '100vh', background: t.bg, transition: 'background 0.3s ease' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '800', color: t.text, letterSpacing: '-0.5px', marginBottom: '6px' }}>Budget Planner</h1>
            <p style={{ color: t.textSub, fontSize: '15px' }}>Plan every euro before you leave — track by category in real time</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {active && (
              <button onClick={() => setShowExp(true)} className="btn btn-ghost btn-sm" style={{ gap: '7px' }}>
                <Plus size={15} /> Add Expense
              </button>
            )}
            <button onClick={() => setShowNew(true)} className="btn btn-primary btn-sm" style={{ gap: '7px' }}>
              <Plus size={15} /> New Budget
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px', alignItems: 'start' }}>
          {/* Plans sidebar */}
          <div>
            <p style={{ color: t.textSub, fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>My Budgets</p>
            {plans.map(p => {
              const spent = Object.values(p.categories).reduce((s, c) => s + c.spent, 0)
              const pct   = p.totalBudget > 0 ? (spent / p.totalBudget) * 100 : 0
              return (
                <div key={p.id} onClick={() => setActive(p)}
                  style={{ padding: '14px', borderRadius: '12px', cursor: 'pointer', marginBottom: '8px', border: active?.id === p.id ? '1px solid rgba(79,70,229,0.3)' : `1px solid ${t.border}`, background: active?.id === p.id ? 'rgba(79,70,229,0.07)' : t.surface, transition: 'all 0.2s ease' }}>
                  <p style={{ color: t.text, fontSize: '13px', fontWeight: '700', marginBottom: '3px' }}>{p.tripName}</p>
                  <p style={{ color: t.textSub, fontSize: '11px', marginBottom: '8px' }}>{p.destination || 'No destination'}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ color: pct > 90 ? '#EF4444' : '#10B981', fontSize: '12px', fontWeight: '700' }}>{p.currency} {spent.toFixed(0)}</span>
                    <span style={{ color: t.textSub, fontSize: '11px' }}>of {p.currency} {p.totalBudget}</span>
                  </div>
                  <div style={{ height: '4px', borderRadius: '2px', background: t.border, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(pct, 100)}%`, borderRadius: '2px', background: pct > 90 ? 'linear-gradient(90deg,#EF4444,#DC2626)' : 'linear-gradient(90deg,#10B981,#4F46E5)', transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              )
            })}
            <button onClick={() => setShowNew(true)}
              style={{ width: '100%', padding: '11px', borderRadius: '10px', background: 'rgba(79,70,229,0.05)', border: '1px dashed rgba(79,70,229,0.2)', color: '#4F46E5', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <Plus size={14} /> New Budget Plan
            </button>
          </div>

          {/* Main content */}
          {active ? (
            <div>
              {/* Summary bar */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }}>
                {[
                  { label: 'Total Budget', value: `${active.currency} ${active.totalBudget.toFixed(0)}`, color: '#4F46E5', bg: '#EEF2FF', Icon: Wallet,          sub: `${active.duration || 1}-day trip` },
                  { label: 'Total Spent',  value: `${active.currency} ${totalSpent.toFixed(0)}`,          color: '#F59E0B', bg: '#FFFBEB', Icon: ArrowDownCircle, sub: `of ${active.currency} ${active.totalBudget.toFixed(0)}` },
                  { label: 'Remaining',    value: `${active.currency} ${Math.abs(remaining).toFixed(0)}`, color: overBudget ? '#EF4444' : '#10B981', bg: overBudget ? '#FEF2F2' : '#ECFDF5', Icon: TrendingUp, sub: overBudget ? 'over budget' : 'left to spend' },
                  { label: 'Per Day',      value: `${active.currency} ${(totalSpent / (active.duration || 1)).toFixed(0)}`,  color: '#7C3AED', bg: '#F5F3FF', Icon: CalendarDays, sub: 'avg daily spend' },
                ].map(({ label, value, color, bg, Icon, sub }) => (
                  <div key={label} className="card" style={{ borderRadius: '12px', padding: '16px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                      <Icon size={15} color={color} />
                    </div>
                    <p style={{ color: '#94A3B8', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '4px' }}>{label}</p>
                    <p style={{ color, fontSize: '17px', fontWeight: '800', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{value}</p>
                    <p style={{ color: '#94A3B8', fontSize: '10px', marginTop: '2px' }}>{sub}</p>
                  </div>
                ))}
              </div>

              {/* Over budget warning */}
              {overBudget && (
                <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <AlertTriangle size={16} color="#FF6B6B" />
                  <p style={{ color: '#EF4444', fontSize: '13px', fontWeight: '600' }}>You're {active.currency} {Math.abs(remaining).toFixed(2)} over budget. Consider cutting down on spending.</p>
                </div>
              )}

              {/* View toggle */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <p style={{ color: t.text, fontSize: '16px', fontWeight: '700' }}>Category Breakdown</p>
                <div style={{ display: 'flex', gap: '4px', background: t.surface, borderRadius: '8px', padding: '3px', border: `1px solid ${t.border}` }}>
                  {([['chart', PieChart], ['list', List]] as const).map(([v, Icon]) => (
                    <button key={v} onClick={() => setView(v as 'chart' | 'list')}
                      style={{ padding: '5px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: view === v ? 'rgba(79,70,229,0.15)' : 'transparent', color: view === v ? '#4F46E5' : '#64748B', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600' }}>
                      <Icon size={13} />{v === 'chart' ? 'Chart' : 'List'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart + categories */}
              <div className="card" style={{ borderRadius: '18px', padding: '20px', marginBottom: '20px' }}>
                {view === 'chart' && (
                  <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
                    <div style={{ flexShrink: 0 }}>
                      <PieChartSVG categories={active.categories} />
                    </div>
                    <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {Object.entries(active.categories).map(([key, cat]) => {
                        const pct = cat.allocated > 0 ? (cat.allocated / active.totalBudget) * 100 : 0
                        return (
                          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: cat.color, flexShrink: 0 }} />
                            <span style={{ color: '#64748B', fontSize: '12px', flex: 1 }}>{cat.icon} {cat.label}</span>
                            <span style={{ color: '#0F172A', fontSize: '12px', fontWeight: '700' }}>{active.currency} {cat.allocated.toFixed(0)}</span>
                            <span style={{ color: '#94A3B8', fontSize: '11px' }}>{pct.toFixed(0)}%</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Category bars */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {Object.entries(active.categories).map(([key, cat]) => {
                    const spentPct = cat.allocated > 0 ? Math.min((cat.spent / cat.allocated) * 100, 100) : 0
                    const isOver   = cat.spent > cat.allocated
                    const isEditing = editCat === key
                    return (
                      <div key={key}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '16px' }}>{cat.icon}</span>
                            <span style={{ color: '#0F172A', fontSize: '13px', fontWeight: '600' }}>{cat.label}</span>
                            {isOver && <AlertTriangle size={12} color="#FF6B6B" />}
                            {!isOver && cat.spent > 0 && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: isOver ? '#EF4444' : '#64748B', fontSize: '12px' }}>
                              {active.currency} {cat.spent.toFixed(0)} / {isEditing ? (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <input
                                    autoFocus
                                    type="number"
                                    value={editVal}
                                    onChange={e => setEditVal(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter') saveAllocation(key); if (e.key === 'Escape') setEditCat(null) }}
                                    style={{ width: '70px', background: '#E2E8F0', border: '1px solid rgba(79,70,229,0.4)', borderRadius: '6px', color: '#0F172A', fontSize: '12px', padding: '2px 6px', outline: 'none' }}
                                  />
                                  <button onClick={() => saveAllocation(key)} style={{ background: 'none', border: 'none', color: '#4F46E5', cursor: 'pointer', padding: '0', display: 'flex', alignItems: 'center' }}><Save size={12} /></button>
                                </span>
                              ) : (
                                <span>{cat.allocated.toFixed(0)}</span>
                              )}
                            </span>
                            {!isEditing && (
                              <button onClick={() => { setEditCat(key); setEditVal(String(cat.allocated)) }}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '2px' }}
                                title="Edit allocation">
                                <Edit3 size={12} />
                              </button>
                            )}
                          </div>
                        </div>
                        <div style={{ height: '6px', borderRadius: '3px', background: '#E2E8F0', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${spentPct}%`, borderRadius: '3px', background: isOver ? 'linear-gradient(90deg,#EF4444,#DC2626)' : `linear-gradient(90deg,${cat.color}99,${cat.color})`, transition: 'width 0.5s ease' }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Expense log */}
              <div className="card" style={{ borderRadius: '18px', overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ color: '#0F172A', fontSize: '15px', fontWeight: '700' }}>Expense Log ({active.expenses.length})</p>
                  <button onClick={() => setShowExp(true)} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(79,70,229,0.1)', border: '1px solid rgba(79,70,229,0.2)', borderRadius: '8px', color: '#4F46E5', fontSize: '12px', fontWeight: '700', padding: '6px 12px', cursor: 'pointer' }}>
                    <Plus size={13} /> Add
                  </button>
                </div>
                {active.expenses.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center' }}>
                    <TrendingUp size={32} color="#94A3B8" style={{ margin: '0 auto 10px' }} />
                    <p style={{ color: '#64748B', fontSize: '13px' }}>No expenses logged yet</p>
                  </div>
                ) : (
                  [...active.expenses].reverse().map(exp => {
                    const cat = active.categories[exp.category]
                    return (
                      <div key={exp.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', borderBottom: '1px solid rgba(0,0,0,0.02)' }}>
                        <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: `${cat?.color || '#64748B'}12`, border: `1px solid ${cat?.color || '#64748B'}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0 }}>
                          {cat?.icon || '💳'}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ color: '#0F172A', fontSize: '13px', fontWeight: '600' }}>{exp.description}</p>
                          <p style={{ color: '#64748B', fontSize: '11px' }}>{cat?.label || exp.category} · {exp.date}</p>
                        </div>
                        <p style={{ color: '#0F172A', fontSize: '14px', fontWeight: '700' }}>{active.currency} {exp.amount.toFixed(2)}</p>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          ) : (
            <div className="card" style={{ borderRadius: '20px', padding: '80px 40px', textAlign: 'center' }}>
              <TrendingUp size={48} color="#94A3B8" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ color: '#0F172A', fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>No budget plan yet</h3>
              <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '24px' }}>Create a plan to track spending by category</p>
              <button onClick={() => setShowNew(true)} className="btn btn-primary" style={{ gap: '8px' }}>
                <Plus size={16} /> Create Budget Plan
              </button>
            </div>
          )}
        </div>
      </div>

      {/* New Plan Modal */}
      {showNew && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
          onClick={e => { if (e.target === e.currentTarget) setShowNew(false) }}>
          <div style={{ width: '100%', maxWidth: '460px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '22px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
              <h3 style={{ color: '#0F172A', fontSize: '18px', fontWeight: '800' }}>New Budget Plan</h3>
              <button onClick={() => setShowNew(false)} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ color: '#64748B', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Trip Name *</label>
                <input className="input-glass" placeholder="e.g. Bali Adventure" value={form.tripName} onChange={e => setForm(f => ({ ...f, tripName: e.target.value }))} />
              </div>
              <div>
                <label style={{ color: '#64748B', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Destination</label>
                <input className="input-glass" placeholder="e.g. Bali, Indonesia" value={form.destination} onChange={e => setForm(f => ({ ...f, destination: e.target.value }))} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ color: '#64748B', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Total Budget *</label>
                  <input className="input-glass" type="number" placeholder="e.g. 2000" value={form.totalBudget} onChange={e => setForm(f => ({ ...f, totalBudget: e.target.value }))} />
                </div>
                <div>
                  <label style={{ color: '#64748B', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Currency</label>
                  <select className="input-glass" value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}>
                    {['EUR','USD','GBP','JPY','AUD'].map(c => <option key={c} value={c} style={{ background: '#F8FAFC' }}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ color: '#64748B', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Duration</label>
                <select className="input-glass" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}>
                  {[3,5,7,10,14,21,30].map(d => <option key={d} value={d} style={{ background: '#F8FAFC' }}>{d} days</option>)}
                </select>
              </div>
              {form.totalBudget && (
                <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(79,70,229,0.06)', border: '1px solid rgba(79,70,229,0.1)' }}>
                  <p style={{ color: '#64748B', fontSize: '11px', fontWeight: '600', marginBottom: '6px' }}>Auto-allocation preview</p>
                  {Object.entries(DEFAULT_CATEGORIES).map(([k, c], i) => {
                    const pcts = [35, 20, 15, 18, 7, 5]
                    const amt  = (parseFloat(form.totalBudget || '0') * pcts[i] / 100).toFixed(0)
                    return (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                        <span style={{ color: '#64748B', fontSize: '11px' }}>{c.icon} {c.label}</span>
                        <span style={{ color: c.color, fontSize: '11px', fontWeight: '700' }}>{form.currency} {amt} ({pcts[i]}%)</span>
                      </div>
                    )
                  })}
                </div>
              )}
              <button onClick={createPlan} disabled={!form.tripName || !form.totalBudget || submitting} className="btn btn-primary"
                style={{ width: '100%', gap: '8px', opacity: !form.tripName || !form.totalBudget ? 0.5 : 1 }}>
                {submitting ? <Loader2 size={15} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Plus size={15} />}
                Create Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showExp && active && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
          onClick={e => { if (e.target === e.currentTarget) setShowExp(false) }}>
          <div style={{ width: '100%', maxWidth: '400px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '20px', padding: '26px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: '#0F172A', fontSize: '17px', fontWeight: '800' }}>Log Expense</h3>
              <button onClick={() => setShowExp(false)} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ color: '#64748B', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Description *</label>
                <input className="input-glass" placeholder="What did you spend on?" value={expForm.description} onChange={e => setExpForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ color: '#64748B', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Amount ({active.currency})</label>
                  <input className="input-glass" type="number" placeholder="0.00" value={expForm.amount} onChange={e => setExpForm(f => ({ ...f, amount: e.target.value }))} />
                </div>
                <div>
                  <label style={{ color: '#64748B', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Category</label>
                  <select className="input-glass" value={expForm.category} onChange={e => setExpForm(f => ({ ...f, category: e.target.value }))}>
                    {Object.entries(DEFAULT_CATEGORIES).map(([k, c]) => (
                      <option key={k} value={k} style={{ background: '#F8FAFC' }}>{c.icon} {c.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Remaining in category */}
              {expForm.category && active.categories[expForm.category] && (
                <div style={{ padding: '10px 12px', borderRadius: '8px', background: 'rgba(0,0,0,0.02)', border: '1px solid #E2E8F0' }}>
                  {(() => {
                    const cat = active.categories[expForm.category]
                    const rem = cat.allocated - cat.spent
                    return (
                      <p style={{ color: rem > 0 ? '#10B981' : '#EF4444', fontSize: '12px', fontWeight: '600' }}>
                        {rem > 0 ? `${active.currency} ${rem.toFixed(2)} remaining in ${cat.label}` : `⚠️ Over ${cat.label} budget by ${active.currency} ${Math.abs(rem).toFixed(2)}`}
                      </p>
                    )
                  })()}
                </div>
              )}
              <button onClick={addExpense} disabled={!expForm.description || !expForm.amount || submitting} className="btn btn-primary"
                style={{ width: '100%', gap: '8px', opacity: !expForm.description || !expForm.amount ? 0.5 : 1 }}>
                {submitting ? <Loader2 size={15} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Plus size={15} />}
                Log Expense
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
