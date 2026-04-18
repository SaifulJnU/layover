import { useState, useEffect } from 'react'
import { DollarSign, Plus, Users, Receipt, ArrowRight, Loader2, X, UserPlus } from 'lucide-react'
import axios from 'axios'
import InviteFriend from '../components/ui/InviteFriend'
import { useTheme } from '../contexts/ThemeContext'

interface Member { id: string; name: string; avatar: string; paid: number }
interface Expense { id: string; description: string; amount: number; paidBy: string; splitWith: string[]; category: string; date: string }
interface Balance { from: string; to: string; amount: number; settled: boolean }
interface SplitGroup { id: string; name: string; currency: string; members: Member[]; expenses: Expense[]; balances: Balance[]; totalSpent: number }

const categoryIcons: Record<string, string> = {
  accommodation: '🏨', food: '🍽️', transport: '🚗', activity: '🎭', shopping: '🛍️', other: '💳'
}
const categoryColors: Record<string, string> = {
  accommodation: '#4F46E5', food: '#F59E0B', transport: '#7C3AED', activity: '#10B981', shopping: '#EF4444', other: '#64748B'
}

export default function Split() {
  const { t } = useTheme()
  const [groups, setGroups] = useState<SplitGroup[]>([])
  const [active, setActive] = useState<SplitGroup | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [settling, setSettling]   = useState<string | null>(null)
  const [showInvite, setShowInvite] = useState(false)
  const [form, setForm] = useState({ description: '', amount: '', paidBy: '', category: 'food', splitWith: [] as string[] })

  useEffect(() => {
    axios.get('/api/splits').then(r => {
      setGroups(r.data.groups || [])
      if (r.data.groups?.length) setActive(r.data.groups[0])
    }).finally(() => setLoading(false))
  }, [])

  const addExpense = async () => {
    if (!active || !form.description || !form.amount || !form.paidBy) return
    const splitWith = form.splitWith.length ? form.splitWith : active.members.map(m => m.name)
    const res = await axios.post(`/api/splits/${active.id}/expenses`, {
      description: form.description, amount: parseFloat(form.amount),
      paidBy: form.paidBy, splitWith, category: form.category
    })
    setActive(res.data)
    setGroups(gs => gs.map(g => g.id === active.id ? res.data : g))
    setForm({ description: '', amount: '', paidBy: '', category: 'food', splitWith: [] })
    setShowAdd(false)
  }

  const settle = async (from: string, to: string, amount: number) => {
    if (!active) return
    setSettling(`${from}-${to}`)
    const res = await axios.post(`/api/splits/${active.id}/settle`, { from, to, amount })
    setActive(res.data)
    setGroups(gs => gs.map(g => g.id === active.id ? res.data : g))
    setSettling(null)
  }

  const memberPaidTotal = (name: string) =>
    active?.expenses.filter(e => e.paidBy === name).reduce((s, e) => s + e.amount, 0) || 0

  const memberOwedTotal = (name: string) =>
    active?.expenses.reduce((s, e) => {
      if (e.splitWith.includes(name)) return s + e.amount / e.splitWith.length
      return s
    }, 0) || 0

  const pendingBalances = active?.balances.filter(b => !b.settled && b.amount > 0) || []
  const settledBalances = active?.balances.filter(b => b.settled || b.amount === 0) || []

  if (loading) return (
    <div style={{ paddingTop: '88px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <Loader2 size={28} color="#4F9CF9" style={{ animation: 'spin 1s linear infinite' }} />
    </div>
  )

  return (
    <div style={{ paddingTop: '88px', minHeight: '100vh', background: t.bg, transition: 'background 0.3s ease' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '800', color: t.text, letterSpacing: '-0.5px', marginBottom: '6px' }}>Split Expenses</h1>
            <p style={{ color: t.textSub, fontSize: '15px' }}>Track and settle costs fairly across your group</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {active && (
              <button onClick={() => setShowInvite(true)} className="btn btn-ghost btn-sm" style={{ gap: '7px' }}>
                <UserPlus size={15} /> Invite Friend
              </button>
            )}
            <button onClick={() => setShowAdd(true)} className="btn btn-primary btn-sm" style={{ gap: '8px' }}>
              <Plus size={16} /> Add Expense
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '24px', alignItems: 'start' }}>
          {/* Groups sidebar */}
          <div>
            <p style={{ color: t.textSub, fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>Trip Groups</p>
            {groups.map(g => (
              <div
                key={g.id}
                onClick={() => setActive(g)}
                className="card card-hover"
                style={{
                  padding: '16px', borderRadius: '14px', cursor: 'pointer', marginBottom: '8px',
                  background: active?.id === g.id ? 'rgba(79,70,229,0.08)' : t.surface,
                  border: active?.id === g.id ? '1px solid rgba(79,70,229,0.3)' : `1px solid ${t.border}`,
                  transition: 'all 0.2s ease'
                }}
              >
                <p style={{ color: t.text, fontSize: '14px', fontWeight: '700', marginBottom: '6px' }}>{g.name}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Users size={11} color={t.textMuted} />
                    <span style={{ color: t.textSub, fontSize: '12px' }}>{g.members.length} people</span>
                  </div>
                  <span style={{ color: '#10B981', fontSize: '13px', fontWeight: '700' }}>{g.currency} {g.totalSpent}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Main content */}
          {active && (
            <div>
              {/* Summary cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                {[
                  { label: 'Total Spent', value: `${active.currency} ${active.totalSpent.toFixed(2)}`, color: '#4F46E5', icon: '💸' },
                  { label: 'Per Person', value: `${active.currency} ${(active.totalSpent / active.members.length).toFixed(2)}`, color: '#F59E0B', icon: '👤' },
                  { label: 'Pending Settlements', value: `${pendingBalances.length} remaining`, color: pendingBalances.length > 0 ? '#EF4444' : '#10B981', icon: pendingBalances.length > 0 ? '⏳' : '✅' },
                ].map(card => (
                  <div key={card.label} className="card" style={{ borderRadius: '14px', padding: '18px' }}>
                    <div style={{ fontSize: '22px', marginBottom: '8px' }}>{card.icon}</div>
                    <p style={{ color: '#64748B', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{card.label}</p>
                    <p style={{ color: card.color, fontSize: '18px', fontWeight: '800' }}>{card.value}</p>
                  </div>
                ))}
              </div>

              {/* Member balances */}
              <div className="card" style={{ borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
                <p style={{ color: '#0F172A', fontSize: '15px', fontWeight: '700', marginBottom: '16px' }}>Member Summary</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {active.members.map(m => {
                    const paid = memberPaidTotal(m.name)
                    const owed = memberOwedTotal(m.name)
                    const net = paid - owed
                    return (
                      <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.03)' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', color: 'white', flexShrink: 0 }}>
                          {m.avatar}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ color: '#0F172A', fontSize: '14px', fontWeight: '600' }}>{m.name}</p>
                          <p style={{ color: '#64748B', fontSize: '12px' }}>Paid {active.currency} {paid.toFixed(2)} · Owes {active.currency} {owed.toFixed(2)}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ color: net >= 0 ? '#10B981' : '#EF4444', fontSize: '15px', fontWeight: '800' }}>
                            {net >= 0 ? '+' : ''}{active.currency} {net.toFixed(2)}
                          </p>
                          <p style={{ color: '#64748B', fontSize: '11px' }}>{net >= 0 ? 'gets back' : 'owes'}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Balances — who owes who */}
              {pendingBalances.length > 0 && (
                <div className="card" style={{ borderRadius: '16px', padding: '20px', marginBottom: '20px', border: '1px solid rgba(255,107,107,0.15)' }}>
                  <p style={{ color: '#0F172A', fontSize: '15px', fontWeight: '700', marginBottom: '16px' }}>💸 Pending Settlements</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {pendingBalances.map((b, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '10px', background: 'rgba(255,107,107,0.05)', border: '1px solid rgba(255,107,107,0.1)' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,107,107,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', color: '#EF4444' }}>
                          {b.from[0]}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ color: '#0F172A', fontSize: '14px', fontWeight: '600' }}>{b.from}</span>
                            <ArrowRight size={14} color="#8892A4" />
                            <span style={{ color: '#0F172A', fontSize: '14px', fontWeight: '600' }}>{b.to}</span>
                          </div>
                          <p style={{ color: '#64748B', fontSize: '12px' }}>needs to pay</p>
                        </div>
                        <span style={{ color: '#EF4444', fontSize: '16px', fontWeight: '800' }}>{active.currency} {b.amount.toFixed(2)}</span>
                        <button
                          onClick={() => settle(b.from, b.to, b.amount)}
                          disabled={settling === `${b.from}-${b.to}`}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px',
                            background: 'rgba(6,214,160,0.12)', border: '1px solid rgba(6,214,160,0.25)',
                            color: '#10B981', fontSize: '12px', fontWeight: '700', cursor: 'pointer',
                            transition: 'all 0.2s ease', whiteSpace: 'nowrap'
                          }}
                        >
                          {settling === `${b.from}-${b.to}` ? <Loader2 size={12} style={{ animation: 'spin 0.8s linear infinite' }} /> : <ArrowRight size={12} />}
                          Settle Up
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {settledBalances.length > 0 && (
                <div className="card" style={{ borderRadius: '16px', padding: '20px', marginBottom: '20px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} />
                    <p style={{ color: '#0F172A', fontSize: '14px', fontWeight: '700' }}>Settled</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {settledBalances.map((b, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', flexShrink: 0 }} />
                        <span style={{ color: '#94A3B8', fontSize: '13px' }}>{b.from}</span>
                        <ArrowRight size={12} color="#CBD5E1" />
                        <span style={{ color: '#94A3B8', fontSize: '13px' }}>{b.to}</span>
                        <span style={{ color: '#CBD5E1', fontSize: '13px', marginLeft: 'auto', textDecoration: 'line-through' }}>{active.currency} {b.amount.toFixed(2)}</span>
                        <span style={{ fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '6px', background: '#ECFDF5', color: '#10B981', letterSpacing: '0.3px' }}>Paid</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Expense list */}
              <div className="card" style={{ borderRadius: '16px', padding: '20px' }}>
                <p style={{ color: '#0F172A', fontSize: '15px', fontWeight: '700', marginBottom: '16px' }}>
                  <Receipt size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
                  All Expenses ({active.expenses.length})
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {active.expenses.map(e => (
                    <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.03)' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${categoryColors[e.category] || '#64748B'}12`, border: `1px solid ${categoryColors[e.category] || '#64748B'}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                        {categoryIcons[e.category] || '💳'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ color: '#0F172A', fontSize: '13px', fontWeight: '600' }}>{e.description}</p>
                        <p style={{ color: '#64748B', fontSize: '11px' }}>Paid by {e.paidBy} · Split {e.splitWith.length} ways · {e.date}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ color: '#0F172A', fontSize: '14px', fontWeight: '700' }}>{active.currency} {e.amount.toFixed(2)}</p>
                        <p style={{ color: '#64748B', fontSize: '11px' }}>{active.currency} {(e.amount / e.splitWith.length).toFixed(2)}/person</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add expense modal */}
      {showAdd && active && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
          onClick={e => { if (e.target === e.currentTarget) setShowAdd(false) }}
        >
          <div style={{ width: '100%', maxWidth: '460px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '20px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ color: '#0F172A', fontSize: '18px', fontWeight: '700' }}>Add Expense</h3>
              <button onClick={() => setShowAdd(false)} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Description</label>
                <input className="input-glass" placeholder="e.g. Dinner at beach restaurant" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Amount ({active.currency})</label>
                  <div style={{ position: 'relative' }}>
                    <DollarSign size={14} color="#8892A4" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input className="input-glass" type="number" placeholder="0.00" style={{ paddingLeft: '36px' }} value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label style={{ color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Category</label>
                  <select className="input-glass" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    {['food', 'accommodation', 'transport', 'activity', 'shopping', 'other'].map(c => (
                      <option key={c} value={c} style={{ background: '#F8FAFC', textTransform: 'capitalize' }}>{categoryIcons[c]} {c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Paid By</label>
                <select className="input-glass" value={form.paidBy} onChange={e => setForm(f => ({ ...f, paidBy: e.target.value }))}>
                  <option value="" style={{ background: '#F8FAFC' }}>Select member...</option>
                  {active.members.map(m => <option key={m.id} value={m.name} style={{ background: '#F8FAFC' }}>{m.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>Split With</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {active.members.map(m => {
                    const sel = form.splitWith.includes(m.name)
                    return (
                      <button key={m.id} onClick={() => setForm(f => ({ ...f, splitWith: sel ? f.splitWith.filter(n => n !== m.name) : [...f.splitWith, m.name] }))}
                        style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s ease', border: sel ? '1px solid rgba(79,70,229,0.4)' : '1px solid rgba(255,255,255,0.1)', background: sel ? 'rgba(79,70,229,0.15)' : 'rgba(0,0,0,0.03)', color: sel ? '#4F46E5' : '#64748B' }}>
                        {m.name}
                      </button>
                    )
                  })}
                  <span style={{ color: '#64748B', fontSize: '12px', alignSelf: 'center' }}>
                    {form.splitWith.length === 0 ? '(all members)' : `${form.splitWith.length} selected`}
                  </span>
                </div>
              </div>
              <button onClick={addExpense} className="btn btn-primary" style={{ marginTop: '8px', width: '100%', gap: '8px' }}>
                <Plus size={16} /> Add Expense
              </button>
            </div>
          </div>
        </div>
      )}

      {showInvite && active && (
        <InviteFriend tripId={active.id} tripName={active.name} onClose={() => setShowInvite(false)} />
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}