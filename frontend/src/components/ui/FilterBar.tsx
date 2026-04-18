import { SlidersHorizontal, Search, X } from 'lucide-react'
import { useState } from 'react'
import type { Season } from '../../types'

interface Filters {
  query: string
  season: Season
  minRating: number
  maxPrice: number
  continent: string
}

interface Props {
  filters: Filters
  onChange: (filters: Filters) => void
}

const seasons: { value: Season; label: string; icon: string }[] = [
  { value: 'all',    label: 'All Seasons', icon: '🌍' },
  { value: 'spring', label: 'Spring',      icon: '🌸' },
  { value: 'summer', label: 'Summer',      icon: '☀️' },
  { value: 'fall',   label: 'Autumn',      icon: '🍂' },
  { value: 'winter', label: 'Winter',      icon: '❄️' },
]

const continents = ['All', 'Europe', 'Asia', 'Africa', 'North America', 'South America', 'Oceania']

export default function FilterBar({ filters, onChange }: Props) {
  const [expanded, setExpanded] = useState(false)

  const update = (key: keyof Filters, value: unknown) =>
    onChange({ ...filters, [key]: value })

  const hasActiveFilters =
    filters.season !== 'all' || filters.minRating > 0 || filters.maxPrice > 0 || filters.continent !== 'all'

  const activeCount = [
    filters.season !== 'all',
    filters.minRating > 0,
    filters.maxPrice > 0,
    filters.continent !== 'all',
  ].filter(Boolean).length

  return (
    <div style={{ marginBottom: '28px' }}>
      {/* Search + toggle */}
      <div style={{ display:'flex', gap:'10px', marginBottom:'14px' }}>
        <div style={{ flex:1, position:'relative' }}>
          <Search size={16} color="#94A3B8" style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)' }} />
          <input
            className="input"
            value={filters.query}
            onChange={e => update('query', e.target.value)}
            placeholder="Search destinations, countries, tags..."
            style={{ paddingLeft:'44px' }}
          />
          {filters.query && (
            <button onClick={() => update('query', '')} style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#94A3B8', display:'flex' }}>
              <X size={14} />
            </button>
          )}
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          style={{ display:'flex', alignItems:'center', gap:'8px', padding:'11px 18px', borderRadius:'12px', background: expanded || hasActiveFilters ? '#EEF2FF' : 'white', border:`1.5px solid ${expanded || hasActiveFilters ? '#4F46E5' : '#E2E8F0'}`, color: expanded || hasActiveFilters ? '#4F46E5' : '#64748B', cursor:'pointer', fontSize:'13px', fontWeight:'700', transition:'all 0.18s ease', whiteSpace:'nowrap', fontFamily:"'Plus Jakarta Sans',sans-serif" }}
        >
          <SlidersHorizontal size={15} />
          Filters
          {activeCount > 0 && (
            <span style={{ width:'18px', height:'18px', borderRadius:'50%', background:'#4F46E5', color:'white', fontSize:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'800' }}>
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Season pills */}
      <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom: expanded ? '14px' : '0' }}>
        {seasons.map(s => (
          <button
            key={s.value}
            onClick={() => update('season', s.value)}
            style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 16px', borderRadius:'24px', fontSize:'13px', fontWeight:'600', cursor:'pointer', transition:'all 0.18s ease', fontFamily:"'Plus Jakarta Sans',sans-serif",
              border: filters.season===s.value ? '1.5px solid #4F46E5' : '1.5px solid #E2E8F0',
              background: filters.season===s.value ? '#EEF2FF' : 'white',
              color: filters.season===s.value ? '#4F46E5' : '#64748B',
            }}
          >
            <span>{s.icon}</span>{s.label}
          </button>
        ))}
      </div>

      {/* Expanded filters */}
      {expanded && (
        <div className="card" style={{ borderRadius:'16px', padding:'20px', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'20px', animation:'fadeIn 0.25s ease', marginTop:'14px' }}>
          {/* Min rating */}
          <div>
            <label style={{ color:'#64748B', fontSize:'11px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.6px', display:'block', marginBottom:'10px', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
              Min Rating
            </label>
            <div style={{ display:'flex', gap:'6px' }}>
              {[0, 3.5, 4.0, 4.5, 4.8].map(r => (
                <button key={r} onClick={() => update('minRating', r)}
                  style={{ flex:1, padding:'7px 0', borderRadius:'8px', fontSize:'12px', fontWeight:'700', cursor:'pointer', transition:'all 0.18s', fontFamily:"'Plus Jakarta Sans',sans-serif",
                    border: filters.minRating===r ? '1.5px solid #F97316' : '1.5px solid #E2E8F0',
                    background: filters.minRating===r ? '#FFF7ED' : 'white',
                    color: filters.minRating===r ? '#F97316' : '#64748B',
                  }}
                >
                  {r === 0 ? 'All' : `${r}+`}
                </button>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div>
            <label style={{ color:'#64748B', fontSize:'11px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.6px', display:'block', marginBottom:'10px', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
              Budget
            </label>
            <div style={{ display:'flex', gap:'6px' }}>
              {[{l:'All',v:0},{l:'$',v:1},{l:'$$',v:2},{l:'$$$',v:3},{l:'$$$$',v:4}].map(p => (
                <button key={p.v} onClick={() => update('maxPrice', p.v)}
                  style={{ flex:1, padding:'7px 0', borderRadius:'8px', fontSize:'12px', fontWeight:'700', cursor:'pointer', transition:'all 0.18s', fontFamily:"'Plus Jakarta Sans',sans-serif",
                    border: filters.maxPrice===p.v ? '1.5px solid #4F46E5' : '1.5px solid #E2E8F0',
                    background: filters.maxPrice===p.v ? '#EEF2FF' : 'white',
                    color: filters.maxPrice===p.v ? '#4F46E5' : '#64748B',
                  }}
                >
                  {p.l}
                </button>
              ))}
            </div>
          </div>

          {/* Continent */}
          <div>
            <label style={{ color:'#64748B', fontSize:'11px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.6px', display:'block', marginBottom:'10px', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
              Continent
            </label>
            <select className="input" value={filters.continent} onChange={e => update('continent', e.target.value)} style={{ padding:'9px 12px', fontSize:'13px' }}>
              {continents.map(c => (
                <option key={c} value={c.toLowerCase() === 'all' ? 'all' : c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Reset */}
          <div style={{ display:'flex', alignItems:'flex-end' }}>
            <button
              onClick={() => onChange({ query: filters.query, season:'all', minRating:0, maxPrice:0, continent:'all' })}
              style={{ width:'100%', padding:'9px', borderRadius:'8px', fontSize:'13px', fontWeight:'700', cursor:'pointer', background:'transparent', border:'1.5px solid #FCA5A5', color:'#EF4444', transition:'all 0.18s', fontFamily:"'Plus Jakarta Sans',sans-serif" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background='#FEF2F2' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background='transparent' }}
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  )
}