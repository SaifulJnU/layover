import { useState, useEffect } from 'react'
import { Star, Zap, Loader2, Crown, Users, Globe, MapPin } from 'lucide-react'
import axios from 'axios'
import { useTheme } from '../contexts/ThemeContext'

interface Badge { id: string; name: string; icon: string; description: string; earned: boolean; earnedDate?: string }
interface Reward { id: string; title: string; description: string; pointsCost: number; category: string; claimed: boolean; icon: string }
interface PointEvent { description: string; points: number; date: string; type: string }
interface RewardsProfile { userId: string; userName: string; points: number; level: string; levelProgress: number; nextLevelPoints: number; totalTrips: number; totalCountries: number; badges: Badge[]; availableRewards: Reward[]; history: PointEvent[] }
interface LeaderboardEntry { rank: number; userName: string; points: number; level: string; trips: number; avatar: string; country: string; city: string; isConnection: boolean }

const levelColors: Record<string, string> = {
  Traveler: '#64748B', Explorer: '#4F46E5', Adventurer: '#10B981',
  Globetrotter: '#F59E0B', Legend: '#EF4444'
}

export default function Rewards() {
  const { t } = useTheme()
  const [profile, setProfile]       = useState<RewardsProfile | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [countries, setCountries]   = useState<string[]>([])
  const [cities, setCities]         = useState<string[]>([])
  const [loading, setLoading]       = useState(true)
  const [lbLoading, setLbLoading]   = useState(false)
  const [claiming, setClaiming]     = useState<string | null>(null)
  const [tab, setTab]               = useState<'rewards' | 'badges' | 'leaderboard' | 'history' | 'guide'>('rewards')
  const [lbFilter, setLbFilter]     = useState<'global' | 'connections' | 'country' | 'city'>('global')
  const [selCountry, setSelCountry] = useState('')
  const [selCity, setSelCity]       = useState('')

  useEffect(() => {
    Promise.all([
      axios.get('/api/rewards'),
      axios.get('/api/rewards/leaderboard')
    ]).then(([r, l]) => {
      setProfile(r.data)
      setLeaderboard(l.data.leaderboard || [])
      setCountries(l.data.countries || [])
      setCities(l.data.cities || [])
    }).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (tab !== 'leaderboard') return
    setLbLoading(true)
    const params = new URLSearchParams({ filter: lbFilter })
    if (lbFilter === 'country' && selCountry) params.set('country', selCountry)
    if (lbFilter === 'city' && selCity) params.set('city', selCity)
    axios.get(`/api/rewards/leaderboard?${params}`)
      .then(r => setLeaderboard(r.data.leaderboard || []))
      .finally(() => setLbLoading(false))
  }, [lbFilter, selCountry, selCity, tab])

  const claimReward = async (rewardId: string) => {
    if (!profile) return
    const reward = profile.availableRewards.find(r => r.id === rewardId)
    if (!reward || profile.points < reward.pointsCost) return
    setClaiming(rewardId)
    try {
      await axios.post(`/api/rewards/${rewardId}/claim`)
      setProfile(p => p ? {
        ...p,
        points: p.points - reward.pointsCost,
        availableRewards: p.availableRewards.map(r => r.id === rewardId ? { ...r, claimed: true } : r)
      } : p)
    } finally {
      setClaiming(null)
    }
  }

  if (loading) return (
    <div style={{ paddingTop: '88px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', background: t.bg }}>
      <Loader2 size={28} color="#FFD166" style={{ animation: 'spin 1s linear infinite' }} />
    </div>
  )

  if (!profile) return null

  const earnedBadges = profile.badges.filter(b => b.earned)
  const unearnedBadges = profile.badges.filter(b => !b.earned)

  return (
    <div style={{ paddingTop: '88px', minHeight: '100vh', background: t.bg, transition: 'background 0.3s ease' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>

        {/* Hero stats */}
        <div
          style={{
            borderRadius: '24px', padding: '32px', marginBottom: '32px',
            background: 'linear-gradient(135deg, #FFFBEB 0%, #EEF2FF 60%, #F5F3FF 100%)',
            border: '1px solid #E2E8F0',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg, #FFD166, #FF9A3C)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>🌍</div>
                <div>
                  <p style={{ color: '#0F172A', fontSize: '20px', fontWeight: '800' }}>{profile.userName}</p>
                  <span style={{ fontSize: '12px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', background: `${levelColors[profile.level]}15`, color: levelColors[profile.level], border: `1px solid ${levelColors[profile.level]}30` }}>
                    {profile.level}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '24px' }}>
                {[{ label: 'Total Trips', value: profile.totalTrips }, { label: 'Countries', value: profile.totalCountries }, { label: 'Badges', value: earnedBadges.length }].map(s => (
                  <div key={s.label}>
                    <p style={{ color: '#0F172A', fontSize: '22px', fontWeight: '800' }}>{s.value}</p>
                    <p style={{ color: '#64748B', fontSize: '12px' }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Points & progress */}
            <div style={{ textAlign: 'center', minWidth: '200px' }}>
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: '8px' }}>
                <Zap size={20} color="#FFD166" style={{ position: 'absolute', top: '-4px', right: '-24px' }} />
                <p style={{ fontSize: '52px', fontWeight: '900', background: 'linear-gradient(135deg, #FFD166, #FF9A3C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1 }}>
                  {profile.points.toLocaleString()}
                </p>
              </div>
              <p style={{ color: '#64748B', fontSize: '13px', marginBottom: '12px' }}>Layover Points</p>
              <div style={{ background: '#E2E8F0', borderRadius: '8px', height: '8px', overflow: 'hidden', marginBottom: '6px' }}>
                <div style={{ height: '100%', width: `${profile.levelProgress}%`, borderRadius: '8px', background: 'linear-gradient(90deg, #FFD166, #FF9A3C)', transition: 'width 0.8s ease' }} />
              </div>
              <p style={{ color: '#64748B', fontSize: '11px' }}>{profile.levelProgress}% to next level · {profile.nextLevelPoints.toLocaleString()} pts needed</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '28px', background: 'rgba(0,0,0,0.025)', borderRadius: '12px', padding: '4px', width: 'fit-content', flexWrap: 'wrap' }}>
          {(['rewards', 'badges', 'leaderboard', 'history', 'guide'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding: '8px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', border: 'none', transition: 'all 0.2s ease', background: tab === t ? '#EEF2FF' : 'transparent', color: tab === t ? '#4F46E5' : '#64748B', textTransform: 'capitalize' }}>
              {t === 'rewards' ? '🎁 Rewards' : t === 'badges' ? '🏅 Badges' : t === 'leaderboard' ? '🏆 Rankings' : t === 'history' ? '📋 History' : '💡 How to Earn'}
            </button>
          ))}
        </div>

        {/* Rewards tab */}
        {tab === 'rewards' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {profile.availableRewards.map((reward, i) => {
              const canAfford = profile.points >= reward.pointsCost
              return (
                <div key={reward.id} className="card"
                  style={{ borderRadius: '16px', padding: '20px', opacity: reward.claimed ? 0.6 : 1, animation: `fadeIn 0.3s ease ${i * 0.07}s both`, border: reward.claimed ? '1px solid rgba(6,214,160,0.2)' : '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <div style={{ fontSize: '32px', lineHeight: 1 }}>{reward.icon}</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: '#0F172A', fontSize: '15px', fontWeight: '700', marginBottom: '4px' }}>{reward.title}</p>
                      <p style={{ color: '#64748B', fontSize: '12px', lineHeight: '1.5', marginBottom: '14px' }}>{reward.description}</p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Zap size={13} color="#FFD166" />
                          <span style={{ color: '#F59E0B', fontSize: '14px', fontWeight: '800' }}>{reward.pointsCost.toLocaleString()}</span>
                          <span style={{ color: '#64748B', fontSize: '12px' }}>pts</span>
                        </div>
                        <button
                          onClick={() => claimReward(reward.id)}
                          disabled={reward.claimed || !canAfford || claiming === reward.id}
                          style={{
                            padding: '7px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: reward.claimed || !canAfford ? 'not-allowed' : 'pointer', transition: 'all 0.2s ease',
                            background: reward.claimed ? 'rgba(16,185,129,0.1)' : canAfford ? 'linear-gradient(135deg, #FFD166, #FF9A3C)' : 'rgba(0,0,0,0.03)',
                            border: reward.claimed ? '1px solid rgba(6,214,160,0.2)' : 'none',
                            color: reward.claimed ? '#10B981' : canAfford ? '#ffffff' : '#94A3B8',
                            display: 'flex', alignItems: 'center', gap: '5px'
                          }}
                        >
                          {claiming === reward.id ? <Loader2 size={12} style={{ animation: 'spin 0.8s linear infinite' }} /> : null}
                          {reward.claimed ? '✓ Claimed' : canAfford ? 'Redeem' : 'Not enough pts'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Badges tab */}
        {tab === 'badges' && (
          <div>
            <p style={{ color: '#0F172A', fontSize: '15px', fontWeight: '700', marginBottom: '16px' }}>Earned ({earnedBadges.length})</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px', marginBottom: '32px' }}>
              {earnedBadges.map(badge => (
                <div key={badge.id} className="card" style={{ borderRadius: '14px', padding: '18px', textAlign: 'center', border: '1px solid rgba(255,209,102,0.15)', background: 'rgba(255,209,102,0.04)' }}>
                  <div style={{ fontSize: '36px', marginBottom: '10px' }}>{badge.icon}</div>
                  <p style={{ color: '#F59E0B', fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>{badge.name}</p>
                  <p style={{ color: '#64748B', fontSize: '11px', lineHeight: '1.5', marginBottom: '8px' }}>{badge.description}</p>
                  {badge.earnedDate && <p style={{ color: '#94A3B8', fontSize: '10px' }}>Earned {badge.earnedDate}</p>}
                </div>
              ))}
            </div>
            <p style={{ color: '#64748B', fontSize: '15px', fontWeight: '700', marginBottom: '16px' }}>Locked ({unearnedBadges.length})</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px' }}>
              {unearnedBadges.map(badge => (
                <div key={badge.id} className="card" style={{ borderRadius: '14px', padding: '18px', textAlign: 'center', opacity: 0.45 }}>
                  <div style={{ fontSize: '36px', marginBottom: '10px', filter: 'grayscale(1)' }}>{badge.icon}</div>
                  <p style={{ color: '#0F172A', fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>{badge.name}</p>
                  <p style={{ color: '#64748B', fontSize: '11px', lineHeight: '1.5' }}>{badge.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Leaderboard tab */}
        {tab === 'leaderboard' && (
          <div>
            {/* Filter bar */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              {([
                { key: 'global',      label: 'Global',      icon: Crown  },
                { key: 'connections', label: 'Connections', icon: Users  },
                { key: 'country',     label: 'Country',     icon: Globe  },
                { key: 'city',        label: 'City',        icon: MapPin },
              ] as const).map(({ key, label, icon: Icon }) => (
                <button key={key} onClick={() => setLbFilter(key)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '24px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s ease', border: lbFilter === key ? '1px solid rgba(79,70,229,0.3)' : '1px solid #E2E8F0', background: lbFilter === key ? '#EEF2FF' : '#fff', color: lbFilter === key ? '#4F46E5' : '#64748B' }}>
                  <Icon size={13} />{label}
                </button>
              ))}

              {lbFilter === 'country' && (
                <select className="input-glass" value={selCountry} onChange={e => setSelCountry(e.target.value)}
                  style={{ padding: '7px 12px', fontSize: '13px', minWidth: '160px' }}>
                  <option value="" style={{ background: '#F8FAFC' }}>All Countries</option>
                  {[...countries].sort().map(c => <option key={c} value={c} style={{ background: '#F8FAFC' }}>{c}</option>)}
                </select>
              )}

              {lbFilter === 'city' && (
                <select className="input-glass" value={selCity} onChange={e => setSelCity(e.target.value)}
                  style={{ padding: '7px 12px', fontSize: '13px', minWidth: '160px' }}>
                  <option value="" style={{ background: '#F8FAFC' }}>All Cities</option>
                  {[...cities].sort().map(c => <option key={c} value={c} style={{ background: '#F8FAFC' }}>{c}</option>)}
                </select>
              )}

              <span style={{ color: '#94A3B8', fontSize: '12px', marginLeft: 'auto' }}>
                {leaderboard.length} {lbFilter === 'connections' ? 'connections' : 'travelers'}
              </span>
            </div>

            <div className="card" style={{ borderRadius: '20px', overflow: 'hidden' }}>
              <div style={{ padding: '16px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Crown size={18} color="#FFD166" />
                <p style={{ color: '#0F172A', fontSize: '15px', fontWeight: '700' }}>
                  {lbFilter === 'global' ? 'Global Rankings' : lbFilter === 'connections' ? 'My Connections' : lbFilter === 'country' ? `Rankings in ${selCountry || 'All Countries'}` : `Rankings in ${selCity || 'All Cities'}`}
                </p>
              </div>

              {lbLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px', gap: '10px' }}>
                  <Loader2 size={20} color="#FFD166" style={{ animation: 'spin 0.8s linear infinite' }} />
                  <span style={{ color: '#64748B', fontSize: '13px' }}>Filtering...</span>
                </div>
              ) : leaderboard.length === 0 ? (
                <div style={{ padding: '48px', textAlign: 'center' }}>
                  <p style={{ color: '#64748B', fontSize: '14px' }}>No results for this filter</p>
                </div>
              ) : (
                leaderboard.map((entry, i) => {
                  const isMe = entry.userName === 'You'
                  const rankColors = ['#F59E0B', '#C0C0C0', '#CD7F32']
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 24px', borderBottom: '1px solid rgba(0,0,0,0.025)', background: isMe ? 'rgba(79,70,229,0.06)' : 'transparent', transition: 'background 0.2s ease' }}>
                      <div style={{ width: '30px', textAlign: 'center', flexShrink: 0 }}>
                        {entry.rank <= 3
                          ? <span style={{ fontSize: '18px' }}>{['🥇','🥈','🥉'][entry.rank-1]}</span>
                          : <span style={{ color: '#64748B', fontSize: '13px', fontWeight: '700' }}>#{entry.rank}</span>}
                      </div>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: isMe ? 'linear-gradient(135deg,#4F46E5,#7C3AED)' : entry.isConnection ? 'linear-gradient(135deg,#10B981,#4F46E5)' : 'linear-gradient(135deg,#F1F5F9,#E2E8F0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', color: isMe || entry.isConnection ? 'white' : '#64748B', border: isMe ? '2px solid rgba(79,70,229,0.4)' : entry.isConnection ? '2px solid rgba(16,185,129,0.3)' : '1px solid #E2E8F0', flexShrink: 0 }}>
                        {entry.avatar}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <p style={{ color: isMe ? '#4F46E5' : '#0F172A', fontSize: '14px', fontWeight: '700' }}>{entry.userName}{isMe && ' (You)'}</p>
                          {entry.isConnection && !isMe && <span style={{ fontSize: '10px', fontWeight: '700', padding: '1px 7px', borderRadius: '10px', background: 'rgba(16,185,129,0.12)', color: '#10B981', border: '1px solid rgba(6,214,160,0.2)' }}>Friend</span>}
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '2px' }}>
                          <span style={{ fontSize: '11px', padding: '1px 7px', borderRadius: '10px', background: `${levelColors[entry.level]}12`, color: levelColors[entry.level] }}>{entry.level}</span>
                          <span style={{ color: '#94A3B8', fontSize: '11px' }}>{entry.trips} trips</span>
                          {entry.city && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <MapPin size={10} color="#94A3B8" />
                              <span style={{ color: '#94A3B8', fontSize: '11px' }}>{entry.city}, {entry.country}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', justifyContent: 'flex-end' }}>
                          <Zap size={12} color="#FFD166" />
                          <span style={{ color: entry.rank <= 3 ? rankColors[entry.rank-1] : '#0F172A', fontSize: '15px', fontWeight: '800' }}>{entry.points.toLocaleString()}</span>
                        </div>
                        <p style={{ color: '#94A3B8', fontSize: '10px' }}>pts</p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}

        {/* Guide tab */}
        {tab === 'guide' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* How to earn */}
            <div className="card" style={{ borderRadius: '20px', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>⚡</span>
                <p style={{ color: '#0F172A', fontSize: '16px', fontWeight: '700' }}>Ways to Earn Points</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0' }}>
                {[
                  { action: 'Plan a new trip',          pts: 200,  icon: '✈️',  note: 'Per trip created in Planner' },
                  { action: 'Add an activity to a trip', pts: 10,  icon: '🗓️',  note: 'Each activity added to itinerary' },
                  { action: 'Settle a split expense',    pts: 100, icon: '💸',  note: 'When you settle a balance' },
                  { action: 'Share a post to the feed',  pts: 75,  icon: '📸',  note: 'Public post with destination tag' },
                  { action: 'Refer a friend',            pts: 250, icon: '👥',  note: 'Friend joins via your invite link' },
                  { action: 'Book a trip via Layover',   pts: 350, icon: '🏨',  note: 'Confirmed booking through app' },
                  { action: 'Complete a trip',           pts: 500, icon: '🌍',  note: 'Mark a past trip as completed' },
                  { action: 'Subscribe to a paid plan',  pts: 0,   icon: '👑',  note: 'Explorer: +500 · Pro: +1500 · Business: +5000' },
                ].map(({ action, pts, icon, note }) => (
                  <div key={action} style={{ padding: '16px 20px', borderBottom: '1px solid rgba(0,0,0,0.025)', display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(255,209,102,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>{icon}</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: '#0F172A', fontSize: '13px', fontWeight: '700' }}>{action}</p>
                      <p style={{ color: '#64748B', fontSize: '11px', marginTop: '2px' }}>{note}</p>
                    </div>
                    {pts > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                        <Zap size={12} color="#FFD166" />
                        <span style={{ color: '#F59E0B', fontSize: '15px', fontWeight: '800' }}>+{pts}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Level progression */}
            <div className="card" style={{ borderRadius: '20px', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>🏆</span>
                <p style={{ color: '#0F172A', fontSize: '16px', fontWeight: '700' }}>Level Progression</p>
              </div>
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'stretch', gap: '0', position: 'relative' }}>
                  {[
                    { level: 'Traveler',    pts: '0',    icon: '🌱', threshold: '0 pts'      },
                    { level: 'Explorer',    pts: '1K',   icon: '🧭', threshold: '1,000 pts'  },
                    { level: 'Adventurer',  pts: '5K',   icon: '⛺', threshold: '5,000 pts'  },
                    { level: 'Globetrotter',pts: '15K',  icon: '🌐', threshold: '15,000 pts' },
                    { level: 'Legend',      pts: '50K',  icon: '👑', threshold: '50,000 pts' },
                  ].map(({ level, icon, threshold }, i, arr) => {
                    const color = levelColors[level] || '#64748B'
                    const isCurrentLevel = profile.level === level
                    return (
                      <div key={level} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                        {i < arr.length - 1 && (
                          <div style={{ position: 'absolute', top: '22px', left: '50%', width: '100%', height: '2px', background: '#E2E8F0', zIndex: 0 }} />
                        )}
                        <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: isCurrentLevel ? `${color}22` : 'rgba(0,0,0,0.025)', border: isCurrentLevel ? `2px solid ${color}` : '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', position: 'relative', zIndex: 1, marginBottom: '8px' }}>
                          {icon}
                        </div>
                        <p style={{ color: isCurrentLevel ? color : '#0F172A', fontSize: '11px', fontWeight: '800', marginBottom: '3px', textAlign: 'center' }}>{level}</p>
                        <p style={{ color: '#64748B', fontSize: '10px', textAlign: 'center' }}>{threshold}</p>
                        {isCurrentLevel && <span style={{ fontSize: '9px', fontWeight: '800', padding: '2px 6px', borderRadius: '8px', background: `${color}20`, color, border: `1px solid ${color}40`, marginTop: '4px' }}>YOU</span>}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="card" style={{ borderRadius: '20px', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>❓</span>
                <p style={{ color: '#0F172A', fontSize: '16px', fontWeight: '700' }}>FAQ</p>
              </div>
              <div style={{ padding: '8px 0' }}>
                {[
                  { q: 'When do I get my points?',      a: 'Points are credited instantly after each qualifying action — no waiting period.' },
                  { q: 'How do I redeem rewards?',       a: 'Go to the Rewards tab, pick any reward you can afford, and hit "Redeem". The reward is delivered to your registered email.' },
                  { q: 'Do points expire?',              a: 'No. As long as your account remains active, your points never expire.' },
                  { q: 'Can I earn points on the Free plan?', a: 'Yes! All users earn points for trips, activities, invites, and social posts. Paid subscribers receive a one-time bonus on top.' },
                  { q: 'What is the monthly points booster?', a: 'Pro subscribers get an automatic +200 pts added to their balance each billing month as a loyalty bonus.' },
                ].map(({ q, a }) => (
                  <div key={q} style={{ padding: '14px 24px', borderBottom: '1px solid rgba(0,0,0,0.025)' }}>
                    <p style={{ color: '#0F172A', fontSize: '13px', fontWeight: '700', marginBottom: '6px' }}>Q: {q}</p>
                    <p style={{ color: '#64748B', fontSize: '12px', lineHeight: 1.6 }}>{a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* History tab */}
        {tab === 'history' && (
          <div className="card" style={{ borderRadius: '20px', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0' }}>
              <p style={{ color: '#0F172A', fontSize: '16px', fontWeight: '700' }}>Points History</p>
            </div>
            {profile.history.map((event, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 24px', borderBottom: '1px solid rgba(0,0,0,0.025)' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: event.type === 'earn' ? 'rgba(16,185,129,0.1)' : 'rgba(255,107,107,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                  {event.type === 'earn' ? '⬆️' : '🎁'}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#0F172A', fontSize: '13px', fontWeight: '600' }}>{event.description}</p>
                  <p style={{ color: '#64748B', fontSize: '11px' }}>{event.date}</p>
                </div>
                <span style={{ color: event.points > 0 ? '#10B981' : '#EF4444', fontSize: '15px', fontWeight: '800' }}>
                  {event.points > 0 ? '+' : ''}{event.points}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Star size={11} color="#FFD166" fill="#FFD166" />
                  <span style={{ color: '#F59E0B', fontSize: '11px' }}>pts</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  )
}