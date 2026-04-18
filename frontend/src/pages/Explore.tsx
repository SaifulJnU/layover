import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Map, Loader2, X, Plane, MapPin, ChevronRight } from 'lucide-react'
import FilterBar from '../components/ui/FilterBar'
import DestinationCard from '../components/cards/DestinationCard'
import WeatherWidget from '../components/cards/WeatherWidget'
import { fetchDestinations, fetchWeather } from '../services/api'
import type { Destination, WeatherData, Season } from '../types'
import { useTheme } from '../contexts/ThemeContext'

interface Filters {
  query: string
  season: Season
  minRating: number
  maxPrice: number
  continent: string
}

export default function Explore() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { t } = useTheme()

  const [filters, setFilters] = useState<Filters>({
    query: searchParams.get('q') || '',
    season: 'all',
    minRating: 0,
    maxPrice: 0,
    continent: 'all',
  })

  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading]           = useState(false)
  const [selected, setSelected]         = useState<Destination | null>(null)
  const [weather, setWeather]           = useState<WeatherData | null>(null)
  const [weatherLoading, setWeatherLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, string> = {}
      if (filters.query)              params.q          = filters.query
      if (filters.season !== 'all')   params.season     = filters.season
      if (filters.minRating > 0)      params.minRating  = String(filters.minRating)
      if (filters.maxPrice > 0)       params.maxPrice   = String(filters.maxPrice)
      if (filters.continent !== 'all') params.continent = filters.continent
      const data = await fetchDestinations(params)
      setDestinations(data.destinations || [])
    } catch {
      setDestinations([])
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => { load() }, [load])

  const handleSelect = async (dest: Destination) => {
    setSelected(dest)
    setWeatherLoading(true)
    try {
      const w = await fetchWeather(dest.name)
      setWeather(w)
    } catch {
      setWeather(null)
    } finally {
      setWeatherLoading(false)
    }
  }

  return (
    <div style={{ paddingTop: '88px', minHeight: '100vh', background: t.bg, transition: 'background 0.3s ease' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px', paddingTop: '8px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '900', color: t.text, letterSpacing: '-0.6px', marginBottom: '5px', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
            Explore Destinations
          </h1>
          <p style={{ color: t.textSub, fontSize: '14px' }}>
            {loading ? 'Searching...' : `${destinations.length} destinations found`} · Filter by season, rating & budget
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: '28px', alignItems: 'start' }}>
          {/* Left */}
          <div>
            <FilterBar filters={filters} onChange={setFilters} />

            {loading ? (
              <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'280px', gap:'12px' }}>
                <Loader2 size={22} color="#4F46E5" style={{ animation:'spin 0.8s linear infinite' }} />
                <span style={{ color: t.textSub, fontSize:'14px' }}>Finding destinations...</span>
              </div>
            ) : destinations.length === 0 ? (
              <div style={{ textAlign:'center', padding:'80px 24px' }}>
                <div style={{ width:'64px', height:'64px', borderRadius:'16px', background:'#EEF2FF', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
                  <Map size={28} color="#4F46E5" />
                </div>
                <h3 style={{ color: t.text, fontSize:'18px', fontWeight:'700', marginBottom:'8px', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>No destinations found</h3>
                <p style={{ color: t.textMuted, fontSize:'14px' }}>Try adjusting your filters or search query</p>
              </div>
            ) : (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'18px' }}>
                {destinations.map(dest => (
                  <div
                    key={dest.id}
                    style={{ outline: selected?.id===dest.id ? '2.5px solid #4F46E5' : 'none', outlineOffset:'3px', borderRadius:'22px' }}
                  >
                    <DestinationCard destination={dest} onClick={() => handleSelect(dest)} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Detail panel */}
          {selected && (
            <div style={{ position:'sticky', top:'88px', maxHeight:'calc(100vh - 108px)', overflowY:'auto', scrollbarWidth:'none' }} className="animate-slide-right">
              <div className="card" style={{ borderRadius:'20px', overflow:'hidden', marginBottom:'16px' }}>
                <div style={{ position:'relative', height:'200px' }}>
                  <img src={selected.image} alt={selected.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(0,0,0,0.80) 0%,transparent 60%)' }} />
                  <button
                    onClick={() => setSelected(null)}
                    style={{ position:'absolute', top:'12px', right:'12px', width:'32px', height:'32px', borderRadius:'50%', background:'rgba(255,255,255,0.92)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.12)' }}
                  >
                    <X size={14} color="#64748B" />
                  </button>
                  <div style={{ position:'absolute', bottom:'16px', left:'16px' }}>
                    <h2 style={{ color:'#fff', fontSize:'20px', fontWeight:'800', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{selected.name}</h2>
                    <div style={{ display:'flex', alignItems:'center', gap:'4px', marginTop:'3px' }}>
                      <MapPin size={11} color="rgba(255,255,255,0.65)" />
                      <span style={{ color:'rgba(255,255,255,0.65)', fontSize:'12px' }}>{selected.country} · {selected.continent}</span>
                    </div>
                  </div>
                </div>

                <div style={{ padding:'18px' }}>
                  <p style={{ color: t.textSub, fontSize:'13px', lineHeight:1.7, marginBottom:'16px' }}>
                    {selected.description}
                  </p>

                  <div style={{ marginBottom:'16px' }}>
                    <p style={{ color:'#0F172A', fontSize:'11px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:'8px', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                      Top Activities
                    </p>
                    <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                      {selected.activities.map(a => (
                        <span key={a} style={{ fontSize:'11px', padding:'4px 10px', borderRadius:'20px', background:'#ECFDF5', color:'#059669', fontWeight:'600', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div
                    onClick={() => navigate('/planner')}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '14px 18px', borderRadius: '14px', cursor: 'pointer',
                      background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                      boxShadow: '0 8px 24px rgba(79,70,229,0.30)',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform='translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow='0 14px 32px rgba(79,70,229,0.38)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform='translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow='0 8px 24px rgba(79,70,229,0.30)' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Plane size={14} color="#fff" />
                      </div>
                      <div>
                        <p style={{ color: '#fff', fontSize: '14px', fontWeight: '700', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Plan Trip to {selected.name}</p>
                        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '11px' }}>Build your full itinerary →</p>
                      </div>
                    </div>
                    <ChevronRight size={18} color="rgba(255,255,255,0.75)" />
                  </div>
                </div>
              </div>

              <WeatherWidget weather={weather} loading={weatherLoading} />
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin{to{transform:rotate(360deg);}}
        .animate-slide-right::-webkit-scrollbar{display:none;}
      `}</style>
    </div>
  )
}