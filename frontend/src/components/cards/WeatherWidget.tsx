import { useEffect, useState } from 'react'
import { Droplets, Wind, Eye, Thermometer, Sparkles, Calendar, ChevronDown, ChevronUp, AlertTriangle, ThumbsUp, Lightbulb, ArrowRight, Info } from 'lucide-react'
import axios from 'axios'
import type { WeatherData } from '../../types'

interface WeatherAnalysis {
  city: string; score: number; verdict: string; verdictEmoji: string; verdictText: string
  reasons: string[]; warnings: string[]; tips: string[]; bestMonths: string[]
  recommendation: string; forecastNote: string
}

interface Props {
  weather: WeatherData | null
  loading?: boolean
  city?: string
}

const scoreColors = ['', '#EF4444', '#FF9A3C', '#F59E0B', '#4F46E5', '#10B981']
const scoreBg     = ['', 'rgba(255,107,107,0.08)', 'rgba(255,154,60,0.08)', 'rgba(255,209,102,0.08)', 'rgba(79,70,229,0.08)', 'rgba(6,214,160,0.08)']
const scoreBorder = ['', 'rgba(255,107,107,0.2)', 'rgba(255,154,60,0.2)', 'rgba(255,209,102,0.2)', 'rgba(79,70,229,0.2)', 'rgba(6,214,160,0.2)']

export default function WeatherWidget({ weather, loading, city }: Props) {
  const [analysis, setAnalysis]       = useState<WeatherAnalysis | null>(null)
  const [analysisLoading, setAL]      = useState(false)
  const [showAnalysis, setShowA]      = useState(true)

  useEffect(() => {
    const target = city || weather?.city
    if (!target) return
    setAL(true)
    axios.get(`/api/weather/analysis?city=${encodeURIComponent(target)}`)
      .then(r => setAnalysis(r.data))
      .catch(() => setAnalysis(null))
      .finally(() => setAL(false))
  }, [city, weather?.city])

  if (loading) {
    return (
      <div className="card" style={{ borderRadius: '16px', padding: '20px' }}>
        <div className="skeleton" style={{ height: '24px', width: '60%', marginBottom: '12px' }} />
        <div className="skeleton" style={{ height: '48px', width: '40%', marginBottom: '16px' }} />
        <div style={{ display: 'flex', gap: '12px' }}>
          {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: '60px', flex: 1 }} />)}
        </div>
      </div>
    )
  }

  if (!weather) return null

  const uvLevel = weather.uvIndex <= 2 ? 'Low' : weather.uvIndex <= 5 ? 'Moderate' : weather.uvIndex <= 7 ? 'High' : 'Very High'
  const uvColor = weather.uvIndex <= 2 ? '#10B981' : weather.uvIndex <= 5 ? '#F59E0B' : weather.uvIndex <= 7 ? '#EF4444' : '#FF3366'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Main weather card */}
      <div className="card" style={{ borderRadius: '20px', padding: '24px', background: 'linear-gradient(135deg,#EEF2FF 0%,#F8FAFC 100%)', border: '1px solid #E2E8F0' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <p style={{ color: '#64748B', fontSize: '12px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Weather in</p>
            <h3 style={{ color: '#0F172A', fontSize: '18px', fontWeight: '700', marginTop: '2px' }}>
              {weather.city}
              {weather.country && <span style={{ color: '#64748B', fontSize: '14px', fontWeight: '400' }}>, {weather.country}</span>}
            </h3>
          </div>
          <div style={{ fontSize: '42px', lineHeight: 1 }}>{weather.icon}</div>
        </div>

        {/* Temp */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', marginBottom: '20px' }}>
          <div style={{ fontSize: '56px', fontWeight: '800', lineHeight: 1, background: 'linear-gradient(135deg,#4F46E5,#7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            {weather.temperature}°
          </div>
          <div style={{ paddingBottom: '8px' }}>
            <p style={{ color: '#0F172A', fontSize: '15px', fontWeight: '500' }}>{weather.condition}</p>
            <p style={{ color: '#64748B', fontSize: '12px' }}>Feels like {weather.feelsLike}°C</p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', padding: '14px', background: 'rgba(0,0,0,0.02)', borderRadius: '12px', marginBottom: '20px', border: '1px solid #E2E8F0' }}>
          {[
            { icon: Droplets,    label: 'Humidity',  value: `${weather.humidity}%`,       color: '#4F46E5' },
            { icon: Wind,        label: 'Wind',      value: `${weather.windSpeed} km/h`,   color: '#7C3AED' },
            { icon: Thermometer, label: 'UV Index',  value: uvLevel,                       color: uvColor   },
            { icon: Eye,         label: 'Feels',     value: `${weather.feelsLike}°`,       color: '#10B981' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <Icon size={15} color={color} style={{ margin: '0 auto 4px' }} />
              <p style={{ color: '#64748B', fontSize: '10px', marginBottom: '2px' }}>{label}</p>
              <p style={{ color: '#0F172A', fontSize: '12px', fontWeight: '600' }}>{value}</p>
            </div>
          ))}
        </div>

        {/* 5-day forecast */}
        <div>
          <p style={{ color: '#64748B', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>5-Day Forecast</p>
          <div style={{ display: 'flex', gap: '6px' }}>
            {weather.forecast.map((day, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center', padding: '8px 4px', borderRadius: '10px', background: i === 0 ? 'rgba(79,70,229,0.12)' : 'rgba(0,0,0,0.02)', border: i === 0 ? '1px solid rgba(79,70,229,0.2)' : '1px solid rgba(0,0,0,0.03)' }}>
                <p style={{ color: i === 0 ? '#4F46E5' : '#64748B', fontSize: '10px', fontWeight: '600', marginBottom: '5px' }}>{day.day}</p>
                <div style={{ fontSize: '16px', marginBottom: '5px' }}>{day.icon}</div>
                <p style={{ color: '#0F172A', fontSize: '11px', fontWeight: '700' }}>{day.high}°</p>
                <p style={{ color: '#64748B', fontSize: '10px' }}>{day.low}°</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Analysis card */}
      <div className="card" style={{ borderRadius: '20px', overflow: 'hidden', border: analysis ? `1px solid ${scoreBorder[analysis.score] || '#E2E8F0'}` : '1px solid #E2E8F0' }}>
        {/* Toggle header */}
        <button
          onClick={() => setShowA(s => !s)}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={15} color="#7C3AED" />
            <span style={{ color: '#0F172A', fontSize: '13px', fontWeight: '700' }}>AI Travel Analysis</span>
            {analysis && !analysisLoading && (
              <span style={{ fontSize: '12px', fontWeight: '700', padding: '2px 10px', borderRadius: '20px', background: scoreBg[analysis.score], color: scoreColors[analysis.score], border: `1px solid ${scoreBorder[analysis.score]}` }}>
                {analysis.verdict}
              </span>
            )}
          </div>
          {showAnalysis ? <ChevronUp size={15} color="#8892A4" /> : <ChevronDown size={15} color="#8892A4" />}
        </button>

        {showAnalysis && (
          <div style={{ padding: '0 18px 18px' }}>
            {analysisLoading ? (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '12px 0' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid rgba(79,70,229,0.2)', borderTopColor: '#7C3AED', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />
                <span style={{ color: '#64748B', fontSize: '13px' }}>Analysing weather conditions...</span>
              </div>
            ) : analysis ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                {/* Score bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: '#64748B', fontSize: '11px', fontWeight: '600' }}>Visit Score</span>
                    <span style={{ color: scoreColors[analysis.score], fontSize: '12px', fontWeight: '800' }}>{analysis.score}/5</span>
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[1,2,3,4,5].map(i => (
                      <div key={i} style={{ flex: 1, height: '5px', borderRadius: '3px', background: i <= analysis.score ? scoreColors[analysis.score] : '#E2E8F0', transition: 'background 0.3s' }} />
                    ))}
                  </div>
                </div>

                {/* Verdict box */}
                <div style={{ padding: '12px 14px', borderRadius: '12px', background: scoreBg[analysis.score], border: `1px solid ${scoreBorder[analysis.score]}` }}>
                  <p style={{ color: scoreColors[analysis.score], fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>{analysis.verdictText}</p>
                  <p style={{ color: '#64748B', fontSize: '12px', lineHeight: '1.6' }}>{analysis.recommendation}</p>
                </div>

                {/* Forecast note */}
                <div style={{ display: 'flex', gap: '8px', padding: '10px 12px', borderRadius: '10px', background: 'rgba(0,0,0,0.02)', border: '1px solid #E2E8F0' }}>
                  <Info size={14} color="#4F9CF9" style={{ flexShrink: 0, marginTop: '1px' }} />
                  <p style={{ color: '#64748B', fontSize: '12px', lineHeight: '1.6' }}>{analysis.forecastNote}</p>
                </div>

                {/* Reasons */}
                {analysis.reasons.length > 0 && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '6px', background: 'rgba(6,214,160,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ThumbsUp size={11} color="#06D6A0" />
                      </div>
                      <p style={{ color: '#64748B', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Positives</p>
                    </div>
                    {analysis.reasons.map((r, i) => (
                      <div key={i} style={{ display: 'flex', gap: '7px', marginBottom: '5px', alignItems: 'flex-start' }}>
                        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#06D6A0', flexShrink: 0, marginTop: '5px' }} />
                        <p style={{ color: '#64748B', fontSize: '12px', lineHeight: '1.5' }}>{r}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Warnings */}
                {analysis.warnings.length > 0 && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '6px', background: 'rgba(255,209,102,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <AlertTriangle size={11} color="#F59E0B" />
                      </div>
                      <p style={{ color: '#64748B', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Watch Out</p>
                    </div>
                    {analysis.warnings.map((w, i) => (
                      <div key={i} style={{ display: 'flex', gap: '7px', marginBottom: '5px', alignItems: 'flex-start' }}>
                        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#F59E0B', flexShrink: 0, marginTop: '5px' }} />
                        <p style={{ color: '#64748B', fontSize: '12px', lineHeight: '1.5' }}>{w}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tips */}
                {analysis.tips.length > 0 && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '6px', background: 'rgba(79,70,229,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Lightbulb size={11} color="#7C3AED" />
                      </div>
                      <p style={{ color: '#64748B', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Packing Tips</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {analysis.tips.map((t, i) => (
                        <div key={i} style={{ display: 'flex', gap: '7px', padding: '6px 10px', borderRadius: '7px', background: 'rgba(79,70,229,0.04)', border: '1px solid rgba(79,70,229,0.08)', alignItems: 'flex-start' }}>
                          <ArrowRight size={11} color="#7C3AED" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <p style={{ color: '#64748B', fontSize: '12px', lineHeight: '1.5' }}>{t}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Best months */}
                {analysis.bestMonths.length > 0 && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                      <Calendar size={13} color="#FFD166" />
                      <p style={{ color: '#64748B', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Best Months to Visit</p>
                    </div>
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                      {analysis.bestMonths.map(m => (
                        <span key={m} style={{ fontSize: '11px', fontWeight: '600', padding: '3px 10px', borderRadius: '20px', background: 'rgba(255,209,102,0.1)', color: '#F59E0B', border: '1px solid rgba(255,209,102,0.2)' }}>
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p style={{ color: '#4A5568', fontSize: '13px', padding: '8px 0' }}>Analysis unavailable</p>
            )}
          </div>
        )}
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  )
}
