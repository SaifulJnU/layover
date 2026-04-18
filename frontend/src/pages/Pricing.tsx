import { useState, useEffect } from 'react'
import { Check, Zap, Star, Building2, Gift, Crown, ChevronRight, X } from 'lucide-react'
import axios from 'axios'
import { useTheme } from '../contexts/ThemeContext'

interface Plan {
  id: string; name: string; monthlyPrice: number; yearlyPrice: number
  description: string; features: string[]; color: string; popular: boolean; bonusPoints: number
}

interface Subscription {
  planId: string; planName: string; billing: string; price: number
  status: string; startDate: string; nextBill: string; cancelDate?: string; cardLast: string
}

const planIcons: Record<string, React.ElementType> = {
  free: Gift, explorer: Zap, pro: Star, business: Building2
}

export default function Pricing() {
  const { t, isDark } = useTheme()
  const [plans, setPlans] = useState<Plan[]>([])
  const [current, setCurrent] = useState<Subscription | null>(null)
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<Plan | null>(null)
  const [cardLast, setCardLast] = useState('')
  const [subscribing, setSubscribing] = useState(false)
  const [success, setSuccess] = useState('')
  const [cancelConfirm, setCancelConfirm] = useState(false)

  useEffect(() => {
    Promise.all([
      axios.get('/api/subscriptions/plans'),
      axios.get('/api/subscriptions/current'),
    ]).then(([p, c]) => {
      setPlans(p.data.plans)
      setCurrent(c.data)
    }).finally(() => setLoading(false))
  }, [])

  const subscribe = async () => {
    if (!modal) return
    setSubscribing(true)
    try {
      const res = await axios.post('/api/subscriptions/subscribe', {
        planId: modal.id, billing, cardLast: cardLast || '4242'
      })
      setCurrent(res.data.subscription)
      setSuccess(`You're now on ${modal.name}! ${modal.bonusPoints > 0 ? `+${modal.bonusPoints} bonus points added.` : ''}`)
      setModal(null)
      setCardLast('')
    } finally {
      setSubscribing(false)
    }
  }

  const cancel = async () => {
    await axios.delete('/api/subscriptions/cancel')
    setCurrent(prev => prev ? { ...prev, status: 'cancelled' } : prev)
    setCancelConfirm(false)
  }

  const price = (plan: Plan) => billing === 'yearly' ? plan.yearlyPrice / 12 : plan.monthlyPrice
  const savings = (plan: Plan) => Math.round(100 - (plan.yearlyPrice / (plan.monthlyPrice * 12)) * 100)

  if (loading) return (
    <div style={{ minHeight: '100vh', background: t.bg, paddingTop: '88px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '3px solid rgba(79,156,249,0.2)', borderTopColor: '#4F46E5', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: t.bg, paddingTop: '88px', paddingBottom: '80px', transition: 'background 0.3s ease' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '20px', background: '#EEF2FF', border: '1px solid rgba(79,70,229,0.2)', marginBottom: '20px' }}>
            <Crown size={14} color="#4F46E5" />
            <span style={{ color: '#7C3AED', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Subscription Plans</span>
          </div>
          <h1 style={{ color: '#0F172A', fontSize: '42px', fontWeight: '800', lineHeight: 1.1, letterSpacing: '-1px', marginBottom: '14px' }}>
            Travel smarter with{' '}
            <span style={{ background: 'linear-gradient(135deg,#4F9CF9,#9B7FFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Layover Pro</span>
          </h1>
          <p style={{ color: '#64748B', fontSize: '16px', maxWidth: '520px', margin: '0 auto 32px', lineHeight: 1.6 }}>
            Unlock AI-powered tools, earn more rewards, and plan unforgettable trips with your crew.
          </p>

          {/* Billing toggle */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0', background: 'rgba(0,0,0,0.025)', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '4px' }}>
            {(['monthly', 'yearly'] as const).map(b => (
              <button key={b} onClick={() => setBilling(b)}
                style={{ padding: '8px 22px', borderRadius: '9px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: 'all 0.2s',
                  background: billing === b ? 'linear-gradient(135deg,#4F46E5,#7C3AED)' : 'transparent',
                  color: billing === b ? '#fff' : '#64748B' }}>
                {b.charAt(0).toUpperCase() + b.slice(1)}
                {b === 'yearly' && <span style={{ marginLeft: '6px', fontSize: '10px', background: 'rgba(6,214,160,0.15)', color: '#10B981', padding: '2px 6px', borderRadius: '6px', fontWeight: '700' }}>Save up to 20%</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Success banner */}
        {success && (
          <div style={{ marginBottom: '24px', padding: '14px 20px', borderRadius: '14px', background: 'rgba(6,214,160,0.1)', border: '1px solid rgba(6,214,160,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Check size={16} color="#06D6A0" />
              <span style={{ color: '#10B981', fontSize: '14px', fontWeight: '600' }}>{success}</span>
            </div>
            <button onClick={() => setSuccess('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}><X size={14} /></button>
          </div>
        )}

        {/* Current plan banner */}
        {current && current.planId !== 'free' && (
          <div style={{ marginBottom: '32px', padding: '16px 20px', borderRadius: '16px', background: 'rgba(79,156,249,0.06)', border: '1px solid rgba(79,156,249,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <p style={{ color: '#0F172A', fontSize: '14px', fontWeight: '700' }}>Current plan: <span style={{ color: '#4F46E5' }}>{current.planName}</span></p>
              <p style={{ color: '#64748B', fontSize: '12px', marginTop: '2px' }}>
                {current.status === 'cancelled'
                  ? `Cancelled — access until end of billing period`
                  : `€${current.price.toFixed(2)}/mo · Next bill: ${current.nextBill} · Card ending in ${current.cardLast}`}
              </p>
            </div>
            {current.status !== 'cancelled' && (
              <button onClick={() => setCancelConfirm(true)}
                style={{ padding: '7px 16px', borderRadius: '8px', background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.2)', color: '#EF4444', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                Cancel Plan
              </button>
            )}
          </div>
        )}

        {/* Plan cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '16px', marginBottom: '64px' }}>
          {plans.map(plan => {
            const Icon = planIcons[plan.id] || Gift
            const isCurrent = current?.planId === plan.id
            const monthlyEquiv = price(plan)
            const savePct = savings(plan)
            return (
              <div key={plan.id}
                style={{ borderRadius: '20px', padding: '28px 24px', position: 'relative', overflow: 'hidden',
                  background: plan.popular ? (isDark ? 'linear-gradient(160deg,#1E1B4B 0%,#2E1B4B 100%)' : 'linear-gradient(160deg,#F5F3FF 0%,#EDE9FE 100%)') : t.card,
                  border: isCurrent ? `2px solid ${plan.color}` : plan.popular ? `1px solid rgba(79,70,229,0.2)` : `1px solid ${t.border}`,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}>
                {plan.popular && (
                  <div style={{ position: 'absolute', top: '14px', right: '14px', padding: '3px 10px', borderRadius: '20px', background: 'linear-gradient(135deg,#9B7FFF,#6B4FD8)', fontSize: '10px', fontWeight: '800', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Most Popular
                  </div>
                )}
                {isCurrent && (
                  <div style={{ position: 'absolute', top: '14px', left: '14px', padding: '3px 10px', borderRadius: '20px', background: `rgba(${plan.color.slice(1).match(/.{2}/g)!.map(x => parseInt(x,16)).join(',')},0.2)`, fontSize: '10px', fontWeight: '800', color: plan.color, border: `1px solid ${plan.color}40` }}>
                    Active
                  </div>
                )}

                {/* Icon */}
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${plan.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', marginTop: plan.popular || isCurrent ? '24px' : '0' }}>
                  <Icon size={20} color={plan.color} />
                </div>

                <h3 style={{ color: t.text, fontSize: '20px', fontWeight: '800', marginBottom: '4px' }}>{plan.name}</h3>
                <p style={{ color: t.textSub, fontSize: '12px', marginBottom: '20px' }}>{plan.description}</p>

                {/* Price */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
                    <span style={{ color: plan.color, fontSize: '38px', fontWeight: '800', lineHeight: 1 }}>
                      {monthlyEquiv === 0 ? '€0' : `€${monthlyEquiv.toFixed(2)}`}
                    </span>
                    <span style={{ color: '#64748B', fontSize: '13px', paddingBottom: '6px' }}>/mo</span>
                  </div>
                  {billing === 'yearly' && plan.monthlyPrice > 0 && (
                    <p style={{ color: '#10B981', fontSize: '11px', marginTop: '4px', fontWeight: '600' }}>
                      Save {savePct}% — €{plan.yearlyPrice.toFixed(2)} billed yearly
                    </p>
                  )}
                  {plan.bonusPoints > 0 && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', marginTop: '8px', padding: '3px 10px', borderRadius: '20px', background: 'rgba(255,209,102,0.1)', border: '1px solid rgba(255,209,102,0.2)' }}>
                      <span style={{ fontSize: '11px', color: '#F59E0B', fontWeight: '700' }}>+{plan.bonusPoints.toLocaleString()} bonus pts on subscribe</span>
                    </div>
                  )}
                </div>

                {/* CTA */}
                <button
                  onClick={() => { if (!isCurrent) setModal(plan) }}
                  disabled={isCurrent}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', cursor: isCurrent ? 'default' : 'pointer', fontSize: '13px', fontWeight: '700', marginBottom: '20px', transition: 'all 0.2s',
                    background: isCurrent ? 'rgba(0,0,0,0.03)' : plan.popular ? 'linear-gradient(135deg,#9B7FFF,#6B4FD8)' : `${plan.color}22`,
                    color: isCurrent ? '#64748B' : plan.popular ? '#fff' : plan.color,
                    border: isCurrent ? '1px solid #E2E8F0' : plan.popular ? 'none' : `1px solid ${plan.color}44`,
                  }}>
                  {isCurrent ? 'Current Plan' : plan.monthlyPrice === 0 ? 'Get Started Free' : `Subscribe to ${plan.name}`}
                </button>

                {/* Features */}
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '9px' }}>
                  {plan.features.map((f, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <Check size={13} color={plan.color} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ color: '#64748B', fontSize: '12px', lineHeight: 1.5 }}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* FAQ */}
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <h2 style={{ color: '#0F172A', fontSize: '24px', fontWeight: '700', textAlign: 'center', marginBottom: '32px' }}>Frequently Asked Questions</h2>
          {[
            { q: 'Can I upgrade or downgrade my plan?', a: 'Yes, you can change your plan at any time. Upgrades take effect immediately; downgrades apply at the start of your next billing cycle.' },
            { q: 'What happens to my data if I cancel?', a: 'Your trips, budgets, and data remain accessible. You keep your Free-tier features indefinitely.' },
            { q: 'Do bonus points expire?', a: 'No! Reward points never expire as long as your account is active.' },
            { q: 'Is there a free trial for paid plans?', a: 'Every new user starts on our Free plan with full access to core features. Paid plans can be cancelled anytime.' },
            { q: 'How is the yearly billing handled?', a: 'You are charged the full yearly amount upfront and save 15–20% compared to paying monthly.' },
          ].map(({ q, a }) => (
            <div key={q} style={{ marginBottom: '12px', padding: '16px 20px', borderRadius: '14px', background: 'rgba(0,0,0,0.015)', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <ChevronRight size={14} color="#4F46E5" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <p style={{ color: '#0F172A', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>{q}</p>
                  <p style={{ color: '#64748B', fontSize: '12px', lineHeight: 1.6 }}>{a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subscribe modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}>
          <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: '24px', padding: '32px', maxWidth: '420px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <h3 style={{ color: '#0F172A', fontSize: '20px', fontWeight: '800' }}>Subscribe to {modal.name}</h3>
                <p style={{ color: '#64748B', fontSize: '13px', marginTop: '4px' }}>{billing === 'yearly' ? `€${modal.yearlyPrice.toFixed(2)}/year` : `€${modal.monthlyPrice.toFixed(2)}/month`}</p>
              </div>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}><X size={20} /></button>
            </div>

            {modal.bonusPoints > 0 && (
              <div style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,209,102,0.08)', border: '1px solid rgba(255,209,102,0.2)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>🎁</span>
                <div>
                  <p style={{ color: '#F59E0B', fontSize: '13px', fontWeight: '700' }}>+{modal.bonusPoints.toLocaleString()} bonus reward points</p>
                  <p style={{ color: '#64748B', fontSize: '11px', marginTop: '2px' }}>Credited instantly to your Rewards account</p>
                </div>
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#64748B', fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Card Last 4 Digits (demo)</label>
              <input
                className="input-glass"
                value={cardLast}
                onChange={e => setCardLast(e.target.value.replace(/\D/g,'').slice(0,4))}
                placeholder="e.g. 4242"
                maxLength={4}
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setModal(null)}
                style={{ flex: 1, padding: '11px', borderRadius: '10px', background: 'rgba(0,0,0,0.03)', border: '1px solid #E2E8F0', color: '#64748B', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={subscribe} disabled={subscribing}
                style={{ flex: 2, padding: '11px', borderRadius: '10px', background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', border: 'none', color: '#fff', fontSize: '13px', fontWeight: '700', cursor: 'pointer', opacity: subscribing ? 0.7 : 1 }}>
                {subscribing ? 'Processing...' : `Confirm Subscription`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel confirm modal */}
      {cancelConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}>
          <div style={{ background: t.card, border: '1px solid rgba(255,107,107,0.2)', borderRadius: '24px', padding: '32px', maxWidth: '380px', width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>⚠️</div>
            <h3 style={{ color: '#0F172A', fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>Cancel your plan?</h3>
            <p style={{ color: '#64748B', fontSize: '13px', lineHeight: 1.6, marginBottom: '24px' }}>You'll retain access until the end of your current billing period. Your data won't be deleted.</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setCancelConfirm(false)}
                style={{ flex: 1, padding: '11px', borderRadius: '10px', background: 'rgba(0,0,0,0.03)', border: '1px solid #E2E8F0', color: '#0F172A', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                Keep Plan
              </button>
              <button onClick={cancel}
                style={{ flex: 1, padding: '11px', borderRadius: '10px', background: 'rgba(255,107,107,0.15)', border: '1px solid rgba(255,107,107,0.3)', color: '#EF4444', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  )
}