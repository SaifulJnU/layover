import { useState } from 'react'
import { Shirt, Sun, Snowflake, Wind, Leaf, Search, Thermometer, Package, Sparkles, Check } from 'lucide-react'
import { fetchOutfits } from '../services/api'
import type { Outfit } from '../types'
import { useTheme } from '../contexts/ThemeContext'

const seasonConfig: Record<string, { icon: React.ElementType; color: string; bg: string; border: string; label: string; emoji: string }> = {
  all:    { icon: Shirt,     color: '#4F46E5', bg: '#EEF2FF', border: 'rgba(79,70,229,0.2)',   label: 'All Seasons', emoji: '🌍' },
  summer: { icon: Sun,       color: '#F59E0B', bg: '#FFFBEB', border: 'rgba(245,158,11,0.2)',  label: 'Summer',      emoji: '☀️' },
  winter: { icon: Snowflake, color: '#3B82F6', bg: '#EFF6FF', border: 'rgba(59,130,246,0.2)',  label: 'Winter',      emoji: '❄️' },
  spring: { icon: Wind,      color: '#10B981', bg: '#ECFDF5', border: 'rgba(16,185,129,0.2)',  label: 'Spring',      emoji: '🌸' },
  fall:   { icon: Leaf,      color: '#D97706', bg: '#FFFBEB', border: 'rgba(217,119,6,0.2)',   label: 'Autumn',      emoji: '🍂' },
}

const POPULAR = ['Bali', 'Paris', 'Iceland', 'Tokyo', 'Dubai', 'New York', 'Santorini', 'Kyoto']

export default function Outfits() {
  const { t } = useTheme()
  const [outfits, setOutfits]           = useState<Outfit[]>([])
  const [loading, setLoading]           = useState(false)
  const [searched, setSearched]         = useState(false)
  const [season, setSeason]             = useState('all')
  const [destination, setDestination]   = useState('')
  const [input, setInput]               = useState('')
  const [detectedSeason, setDetected]   = useState('')

  const search = async (dest: string, s: string) => {
    if (!dest.trim()) return
    setLoading(true)
    setSearched(true)
    setDestination(dest)
    try {
      const data = await fetchOutfits(s === 'all' ? undefined : s, dest)
      setOutfits(data.outfits || [])
      if (data.detectedSeason) {
        setDetected(data.detectedSeason)
        setSeason(data.detectedSeason)
      }
    } catch {
      setOutfits([])
    } finally {
      setLoading(false)
    }
  }

  const handleSeasonChange = (s: string) => {
    setSeason(s)
    setDetected('')
    if (destination) search(destination, s)
  }

  return (
    <div style={{ paddingTop: '88px', minHeight: '100vh', background: t.bg, transition: 'background 0.3s ease' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 80px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', padding: '48px 0 40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '30px', background: '#FFF7ED', border: '1px solid rgba(249,115,22,0.2)', marginBottom: '20px' }}>
            <Sparkles size={13} color="#F97316" />
            <span style={{ color: '#F97316', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>AI Outfit Planner</span>
          </div>
          <h1 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: '900', color: '#0F172A', letterSpacing: '-1px', marginBottom: '12px', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
            What should I pack?
          </h1>
          <p style={{ color: '#64748B', fontSize: '16px', maxWidth: '480px', margin: '0 auto', lineHeight: 1.65 }}>
            Enter your destination and get AI-curated outfit suggestions tailored to the local climate and season.
          </p>
        </div>

        {/* Search bar */}
        <div style={{ maxWidth: '620px', margin: '0 auto 32px' }}>
          <div style={{ display: 'flex', background: '#fff', borderRadius: '16px', border: '1.5px solid #E2E8F0', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 18px', flex: 1 }}>
              <Search size={17} color="#4F46E5" style={{ flexShrink: 0 }} />
              <input
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: '15px', color: '#0F172A', padding: '16px 0', background: 'transparent', fontFamily: "'Inter',sans-serif" }}
                placeholder="e.g. Bali, Iceland, Paris..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && search(input, season)}
              />
            </div>
            <button
              onClick={() => search(input, season)}
              disabled={!input.trim() || loading}
              style={{
                margin: '8px', padding: '11px 24px', borderRadius: '10px', flexShrink: 0, border: 'none',
                background: input.trim() ? 'linear-gradient(135deg,#4F46E5,#7C3AED)' : '#F1F5F9',
                color: input.trim() ? '#fff' : '#94A3B8',
                fontSize: '14px', fontWeight: '700', cursor: input.trim() ? 'pointer' : 'not-allowed',
                fontFamily: "'Plus Jakarta Sans',sans-serif", display: 'flex', alignItems: 'center', gap: '7px',
                transition: 'all 0.2s',
              }}
            >
              <Shirt size={15} /> Get Outfits
            </button>
          </div>

          {/* Popular destinations */}
          <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', marginTop: '14px', justifyContent: 'center' }}>
            {POPULAR.map(p => (
              <button
                key={p}
                onClick={() => { setInput(p); search(p, season) }}
                style={{
                  padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                  background: destination === p ? '#EEF2FF' : '#F8FAFC',
                  border: destination === p ? '1px solid rgba(79,70,229,0.3)' : '1px solid #E2E8F0',
                  color: destination === p ? '#4F46E5' : '#64748B',
                  cursor: 'pointer', transition: 'all 0.18s', fontFamily: "'Plus Jakarta Sans',sans-serif",
                }}
                onMouseEnter={e => { if (destination !== p) { (e.currentTarget as HTMLElement).style.borderColor = '#4F46E5'; (e.currentTarget as HTMLElement).style.color = '#4F46E5' } }}
                onMouseLeave={e => { if (destination !== p) { (e.currentTarget as HTMLElement).style.borderColor = '#E2E8F0'; (e.currentTarget as HTMLElement).style.color = '#64748B' } }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Season filter */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '36px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {Object.entries(seasonConfig).map(([key, cfg]) => {
            const Icon = cfg.icon
            const active = season === key
            return (
              <button
                key={key}
                onClick={() => handleSeasonChange(key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '7px',
                  padding: '9px 18px', borderRadius: '30px', fontSize: '13px', fontWeight: '600',
                  cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'Plus Jakarta Sans',sans-serif",
                  border: active ? `1.5px solid ${cfg.border}` : '1.5px solid #E2E8F0',
                  background: active ? cfg.bg : 'transparent',
                  color: active ? cfg.color : '#64748B',
                  boxShadow: active ? `0 2px 12px ${cfg.border}` : 'none',
                }}
              >
                <Icon size={14} /> {cfg.label}
                {detectedSeason === key && (
                  <span style={{ fontSize: '10px', background: cfg.color, color: '#fff', padding: '1px 6px', borderRadius: '8px', fontWeight: '700' }}>Auto</span>
                )}
              </button>
            )
          })}
        </div>

        {/* Detected season notice */}
        {detectedSeason && destination && (
          <div style={{ maxWidth: '620px', margin: '-20px auto 28px', padding: '12px 16px', borderRadius: '12px', background: '#EEF2FF', border: '1px solid rgba(79,70,229,0.15)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={15} color="#4F46E5" />
            <p style={{ color: '#4F46E5', fontSize: '13px', fontWeight: '600' }}>
              {destination} typically experiences <strong>{detectedSeason}</strong> weather — outfits auto-matched to the climate.
            </p>
          </div>
        )}

        {/* Empty state */}
        {!searched && !loading && (
          <div style={{ textAlign: 'center', padding: '60px 24px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'linear-gradient(135deg,#EEF2FF,#F5F3FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '1px solid rgba(79,70,229,0.12)' }}>
              <Shirt size={36} color="#4F46E5" />
            </div>
            <h3 style={{ color: '#0F172A', fontSize: '20px', fontWeight: '800', marginBottom: '8px', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Search a destination to start</h3>
            <p style={{ color: '#94A3B8', fontSize: '14px', maxWidth: '340px', margin: '0 auto', lineHeight: 1.65 }}>
              Type any city or country above and we'll suggest outfits based on the local climate and season.
            </p>

            {/* How it works */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', maxWidth: '700px', margin: '48px auto 0' }}>
              {[
                { icon: Search,      color: '#4F46E5', bg: '#EEF2FF', title: 'Enter Destination',    desc: 'Type any city — Bali, Paris, Reykjavik, anything.' },
                { icon: Sparkles,    color: '#7C3AED', bg: '#F5F3FF', title: 'AI Detects Climate',   desc: 'We match the climate and suggest the right season.' },
                { icon: Package,     color: '#F97316', bg: '#FFF7ED', title: 'Pack with Confidence', desc: 'Get curated outfit lists so you never overpack again.' },
              ].map(({ icon: Icon, color, bg, title, desc }) => (
                <div key={title} className="card" style={{ padding: '24px', borderRadius: '18px', textAlign: 'left' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                    <Icon size={18} color={color} />
                  </div>
                  <p style={{ color: '#0F172A', fontSize: '14px', fontWeight: '700', marginBottom: '6px', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{title}</p>
                  <p style={{ color: '#64748B', fontSize: '12px', lineHeight: 1.65 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px', gap: '12px', alignItems: 'center' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2.5px solid rgba(79,70,229,0.2)', borderTopColor: '#4F46E5', animation: 'spin 0.8s linear infinite' }} />
            <span style={{ color: '#64748B', fontSize: '14px' }}>Finding outfits for {destination}...</span>
          </div>
        )}

        {/* Results */}
        {searched && !loading && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 style={{ color: '#0F172A', fontSize: '20px', fontWeight: '800', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                  {outfits.length} outfit{outfits.length !== 1 ? 's' : ''} for <span style={{ color: '#4F46E5' }}>{destination}</span>
                </h2>
                <p style={{ color: '#94A3B8', fontSize: '13px', marginTop: '2px' }}>
                  {seasonConfig[season]?.label} collection
                </p>
              </div>
            </div>

            {outfits.length === 0 ? (
              <div className="card" style={{ borderRadius: '20px', padding: '60px', textAlign: 'center' }}>
                <Shirt size={40} color="#94A3B8" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ color: '#0F172A', fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>No outfits found</h3>
                <p style={{ color: '#64748B', fontSize: '14px' }}>Try selecting a different season or destination</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(310px,1fr))', gap: '20px' }}>
                {outfits.map((outfit, i) => {
                  const cfg = seasonConfig[outfit.season] || seasonConfig.all
                  const Icon = cfg.icon
                  return (
                    <div
                      key={outfit.id}
                      className="card"
                      style={{ borderRadius: '20px', overflow: 'hidden', animation: `fadeIn 0.4s ease ${i * 0.07}s both` }}
                    >
                      {/* Card header strip */}
                      <div style={{ padding: '20px 20px 16px', borderBottom: `1px solid ${cfg.border}`, background: cfg.bg }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                              <Icon size={16} color={cfg.color} />
                            </div>
                            <div>
                              <p style={{ color: cfg.color, fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{outfit.season}</p>
                              <h3 style={{ color: '#0F172A', fontSize: '17px', fontWeight: '800', fontFamily: "'Plus Jakarta Sans',sans-serif", lineHeight: 1.1 }}>{outfit.style}</h3>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#fff', padding: '5px 10px', borderRadius: '10px', boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}>
                            <Thermometer size={12} color={cfg.color} />
                            <span style={{ color: '#0F172A', fontSize: '12px', fontWeight: '700' }}>{outfit.tempRange}</span>
                          </div>
                        </div>

                        <p style={{ color: '#475569', fontSize: '13px', lineHeight: 1.6 }}>{outfit.description}</p>

                        {/* Colour palette */}
                        <div style={{ display: 'flex', gap: '6px', marginTop: '14px', alignItems: 'center' }}>
                          <span style={{ color: '#94A3B8', fontSize: '11px', fontWeight: '600', marginRight: '4px' }}>Palette</span>
                          {outfit.colors.map((c, ci) => (
                            <div key={ci} title={c} style={{ width: '24px', height: '24px', borderRadius: '6px', background: c, border: '2px solid rgba(255,255,255,0.9)', boxShadow: '0 1px 4px rgba(0,0,0,0.12)' }} />
                          ))}
                        </div>
                      </div>

                      {/* Pack list */}
                      <div style={{ padding: '16px 20px 20px' }}>
                        <p style={{ color: '#94A3B8', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Package size={12} /> Pack List · {outfit.items.length} items
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          {outfit.items.map((item, ii) => (
                            <div key={ii} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: '9px', background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                              <div style={{ width: '18px', height: '18px', borderRadius: '5px', background: cfg.bg, border: `1.5px solid ${cfg.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Check size={10} color={cfg.color} strokeWidth={3} />
                              </div>
                              <span style={{ color: '#374151', fontSize: '13px', fontWeight: '500' }}>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}