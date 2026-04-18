import { useState } from 'react'
import { DollarSign, Calendar, Search, Star, MapPin, TrendingUp, Loader2 } from 'lucide-react'
import { fetchBudgetSuggestions } from '../services/api'
import type { BudgetSuggestion } from '../types'
import { useTheme } from '../contexts/ThemeContext'

const priceLevelLabel = (l: number) => ['', '$', '$$', '$$$', '$$$$'][l] || '$'

export default function Budget() {
  const { t } = useTheme()
  const [amount, setAmount] = useState('')
  const [duration, setDuration] = useState('7')
  const [currency, setCurrency] = useState('EUR')
  const [suggestions, setSuggestions] = useState<BudgetSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async () => {
    if (!amount) return
    setLoading(true)
    setSearched(true)
    try {
      const data = await fetchBudgetSuggestions(parseFloat(amount), parseInt(duration))
      setSuggestions(data.suggestions || [])
    } catch {
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }

  const breakdownColors: Record<string, string> = {
    accommodation: '#4F46E5',
    food: '#F59E0B',
    activities: '#10B981',
    transport: '#7C3AED',
  }

  return (
    <div style={{ paddingTop: '88px', minHeight: '100vh', background: t.bg, transition: 'background 0.3s ease' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              borderRadius: '30px',
              background: '#EEF2FF',
              border: '1px solid rgba(6,214,160,0.2)',
              marginBottom: '20px',
            }}
          >
            <TrendingUp size={14} color="#4F46E5" />
            <span style={{ color: '#10B981', fontSize: '13px', fontWeight: '600' }}>Budget-First Planning</span>
          </div>
          <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#0F172A', letterSpacing: '-1px', marginBottom: '10px' }}>
            Where can I go with my budget?
          </h1>
          <p style={{ color: '#64748B', fontSize: '16px', maxWidth: '520px', margin: '0 auto' }}>
            Enter your budget and trip duration — our AI finds the best destinations you can actually afford.
          </p>
        </div>

        {/* Budget input card */}
        <div
          className="card"
          style={{
            borderRadius: '24px',
            padding: '32px',
            marginBottom: '48px',
            background: t.surface,
            border: `1px solid ${t.border}`,
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {/* Amount */}
            <div>
              <label style={{ color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '10px' }}>
                Total Budget
              </label>
              <div style={{ position: 'relative' }}>
                <DollarSign size={16} color="#4F46E5" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  className="input-glass"
                  type="number"
                  placeholder="e.g. 1500"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  style={{ paddingLeft: '42px', fontSize: '18px', fontWeight: '700' }}
                />
              </div>
            </div>

            {/* Currency */}
            <div>
              <label style={{ color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '10px' }}>
                Currency
              </label>
              <select
                className="input-glass"
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                style={{ fontSize: '15px' }}
              >
                {['EUR', 'USD', 'GBP', 'JPY', 'AUD'].map(c => (
                  <option key={c} value={c} style={{ background: '#F8FAFC' }}>{c}</option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div>
              <label style={{ color: '#64748B', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '10px' }}>
                Trip Duration
              </label>
              <div style={{ position: 'relative' }}>
                <Calendar size={16} color="#4F9CF9" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <select
                  className="input-glass"
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  style={{ paddingLeft: '42px', fontSize: '15px' }}
                >
                  {[3, 5, 7, 10, 14, 21, 30].map(d => (
                    <option key={d} value={d} style={{ background: '#F8FAFC' }}>{d} days</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={handleSearch}
            disabled={!amount || loading}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '14px',
              background: amount ? 'linear-gradient(135deg, #4F46E5, #7C3AED)' : 'rgba(0,0,0,0.03)',
              border: 'none',
              color: amount ? 'white' : '#4A5568',
              fontSize: '16px',
              fontWeight: '700',
              cursor: amount ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
            }}
          >
            {loading ? (
              <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Finding destinations...</>
            ) : (
              <><Search size={18} /> Find Destinations for {currency} {amount || '0'}</>
            )}
          </button>
        </div>

        {/* Results */}
        {searched && !loading && (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ color: '#0F172A', fontSize: '22px', fontWeight: '800' }}>
                {suggestions.length} destinations within {currency} {amount}
              </h2>
              <span style={{ color: '#64748B', fontSize: '13px' }}>for {duration} days</span>
            </div>

            {suggestions.length === 0 ? (
              <div
                className="card"
                style={{ borderRadius: '20px', padding: '60px', textAlign: 'center' }}
              >
                <DollarSign size={48} color="#4A5568" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ color: '#0F172A', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Budget too low</h3>
                <p style={{ color: '#64748B', fontSize: '14px' }}>Try increasing your budget or reducing trip duration</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {suggestions.map((s, i) => (
                  <div
                    key={s.destination.id}
                    className="glass glass-hover"
                    style={{
                      borderRadius: '20px',
                      overflow: 'hidden',
                      animation: `fadeIn 0.4s ease ${i * 0.07}s both`,
                    }}
                  >
                    <div style={{ position: 'relative', height: '160px' }}>
                      <img src={s.destination.image} alt={s.destination.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,12,20,0.9) 0%, transparent 60%)' }} />
                      <div style={{ position: 'absolute', bottom: '12px', left: '14px', right: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div>
                          <p style={{ color: '#fff', fontSize: '18px', fontWeight: '800' }}>{s.destination.name}</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={11} color="rgba(255,255,255,0.65)" />
                            <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '12px' }}>{s.destination.country}</span>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ color: '#10B981', fontSize: '16px', fontWeight: '800' }}>{currency} {s.estimatedCost.toFixed(0)}</p>
                          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '11px' }}>total est.</p>
                        </div>
                      </div>
                    </div>

                    <div style={{ padding: '16px' }}>
                      {/* Per day */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Star size={12} fill="#FFD166" color="#FFD166" />
                          <span style={{ color: '#F59E0B', fontSize: '13px', fontWeight: '700' }}>{s.destination.rating}</span>
                          <span style={{ color: '#64748B', fontSize: '12px' }}>({s.destination.reviews.toLocaleString()} reviews)</span>
                        </div>
                        <span style={{ color: '#64748B', fontSize: '13px' }}>
                          {currency} {(s.estimatedCost / s.duration).toFixed(0)}/day · {priceLevelLabel(s.destination.priceLevel)}
                        </span>
                      </div>

                      {/* Cost breakdown */}
                      <div style={{ marginBottom: '12px' }}>
                        <p style={{ color: '#64748B', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                          Cost Breakdown
                        </p>
                        {Object.entries(s.breakdown).map(([key, val]) => (
                          <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: breakdownColors[key] || '#64748B' }} />
                              <span style={{ color: '#64748B', fontSize: '12px', textTransform: 'capitalize' }}>{key}</span>
                            </div>
                            <span style={{ color: '#0F172A', fontSize: '12px', fontWeight: '600' }}>{currency} {val.toFixed(0)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Season tags */}
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {s.destination.seasons.map(season => (
                          <span
                            key={season}
                            style={{
                              fontSize: '10px',
                              fontWeight: '600',
                              padding: '3px 8px',
                              borderRadius: '10px',
                              background: 'rgba(79,70,229,0.08)',
                              color: '#4F46E5',
                              border: '1px solid rgba(79,70,229,0.15)',
                              textTransform: 'capitalize',
                            }}
                          >
                            {season}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}