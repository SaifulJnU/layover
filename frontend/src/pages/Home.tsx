import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, MapPin, Sparkles, Globe, Users, Star,
  Shield, Compass, BarChart3, SplitSquareVertical,
  Trophy, ChevronRight, ArrowRight, Zap, Wind, Check,
} from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

const DESTINATIONS = [
  { name: 'Bali',       country: 'Indonesia',  image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80', tag: 'Tropical',  rating: 4.8 },
  { name: 'Maldives',   country: 'Maldives',   image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=600&q=80', tag: 'Beach',     rating: 4.9 },
  { name: 'Santorini',  country: 'Greece',     image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&q=80', tag: 'Scenic',    rating: 4.8 },
  { name: 'Kyoto',      country: 'Japan',      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80', tag: 'Culture',   rating: 4.9 },
  { name: 'Costa Rica', country: 'Costa Rica', image: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=600&q=80', tag: 'Jungle',    rating: 4.7 },
  { name: 'Amalfi',     country: 'Italy',      image: 'https://images.unsplash.com/photo-1612698093158-e07ac200d44e?w=600&q=80', tag: 'Coastal',   rating: 4.8 },
]

const FEATURES = [
  {
    icon: Sparkles, title: 'AI Itinerary Builder',
    desc: 'Generate a personalised day-by-day itinerary in seconds — tailored to your budget, pace, and travel style.',
    color: '#4F46E5', bg: '#EEF2FF',
  },
  {
    icon: Wind, title: 'Live Weather & Seasons',
    desc: 'Real-time forecasts and smart season filters help you choose the perfect travel window every time.',
    color: '#0891B2', bg: '#ECFEFF',
  },
  {
    icon: Users, title: 'Group Collaboration',
    desc: 'Invite your crew, vote on activities, and keep everyone on the same page — no group chats needed.',
    color: '#7C3AED', bg: '#F5F3FF',
  },
  {
    icon: SplitSquareVertical, title: 'Smart Bill Splitting',
    desc: 'Divide any expense fairly across your group and settle balances with a single tap.',
    color: '#F97316', bg: '#FFF7ED',
  },
  {
    icon: Trophy, title: 'Rewards & Badges',
    desc: 'Earn points on every booking and interaction. Redeem for upgrades, discounts, and travel perks.',
    color: '#D97706', bg: '#FFFBEB',
  },
  {
    icon: BarChart3, title: 'Visual Budget Planner',
    desc: 'Set category budgets, track spending in real time, and share expense breakdowns with your group.',
    color: '#059669', bg: '#ECFDF5',
  },
]


const HOW = [
  { step: '01', title: 'Tell us your dream', desc: 'Enter your destination, dates, budget and travel style.' },
  { step: '02', title: 'AI builds your plan', desc: 'Get a full itinerary, weather forecast, and packing list instantly.' },
  { step: '03', title: 'Travel & enjoy', desc: 'Share with friends, split costs, and collect rewards as you go.' },
]

const TESTIMONIALS = [
  { name: 'Sarah M.',  role: 'Solo Traveller', text: 'layover.ai planned my 2-week Japan trip in 10 minutes. The AI even matched restaurants to my dietary needs. Absolutely incredible.', avatar: 'https://i.pravatar.cc/48?img=47', rating: 5 },
  { name: 'James K.',  role: 'Group of 8',     text: 'We used the bill-splitting feature for our Bali trip. No more awkward money convos — everyone could see exactly what they owed.', avatar: 'https://i.pravatar.cc/48?img=12', rating: 5 },
  { name: 'Priya L.',  role: 'Couples Travel', text: 'The live weather integration saved us from a bad week in Santorini. It suggested we shift by 3 days and it was perfect weather!', avatar: 'https://i.pravatar.cc/48?img=9',  rating: 5 },
]

export default function Home() {
  const navigate = useNavigate()
  const { t, isDark } = useTheme()
  const [query, setQuery]       = useState('')
  const [hovered, setHovered]   = useState<string | null>(null)

  const handleSearch = () => {
    if (query.trim()) navigate(`/explore?q=${encodeURIComponent(query)}`)
    else navigate('/explore')
  }

  return (
    <div style={{ background: t.bg, transition: 'background 0.3s ease' }}>

      {/* ════════════════════════════════════ HERO */}
      <section style={{ height: '100vh', minHeight: '640px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Background photo */}
        <img
          src="https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1920&q=85"
          alt="Travel background"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
        {/* Overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.48) 55%, rgba(0,0,0,0.72) 100%)' }} />

        {/* Left floating photo cards */}
        <div style={{ position: 'absolute', left: '5%', top: '50%', transform: 'translateY(-55%)', display: 'flex', flexDirection: 'column', gap: '14px', zIndex: 2, pointerEvents: 'none' }}>
          {[DESTINATIONS[3], DESTINATIONS[4]].map((d, i) => (
            <div key={d.name} style={{
              width: '156px', height: '108px', borderRadius: '16px', overflow: 'hidden',
              transform: i === 0 ? 'rotate(-4deg) translateX(-8px)' : 'rotate(2.5deg) translateX(4px)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.45)', border: '2.5px solid rgba(255,255,255,0.28)', position: 'relative',
            }}>
              <img src={d.image} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)' }} />
              <div style={{ position: 'absolute', bottom: '8px', left: '10px' }}>
                <p style={{ color: '#fff', fontSize: '12px', fontWeight: '800', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{d.name}</p>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '10px' }}>{d.country}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right floating photo cards */}
        <div style={{ position: 'absolute', right: '5%', top: '50%', transform: 'translateY(-55%)', display: 'flex', flexDirection: 'column', gap: '14px', zIndex: 2, pointerEvents: 'none' }}>
          {[DESTINATIONS[5], DESTINATIONS[2]].map((d, i) => (
            <div key={d.name} style={{
              width: '156px', height: '108px', borderRadius: '16px', overflow: 'hidden',
              transform: i === 0 ? 'rotate(4deg) translateX(8px)' : 'rotate(-2.5deg) translateX(-4px)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.45)', border: '2.5px solid rgba(255,255,255,0.28)', position: 'relative',
            }}>
              <img src={d.image} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)' }} />
              <div style={{ position: 'absolute', bottom: '8px', left: '10px' }}>
                <p style={{ color: '#fff', fontSize: '12px', fontWeight: '800', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{d.name}</p>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '10px' }}>{d.country}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Center content */}
        <div style={{ position: 'relative', zIndex: 3, textAlign: 'center', padding: '0 24px', maxWidth: '680px', width: '100%' }}>
          {/* Brand name */}
          <h1 style={{
            fontFamily: "'Pacifico', cursive",
            fontSize: 'clamp(64px,10vw,118px)', fontWeight: '400',
            color: '#fff', letterSpacing: '-1px', lineHeight: 1.2,
            marginBottom: '36px', textShadow: '0 4px 48px rgba(0,0,0,0.35)',
            animation: 'fadeIn 0.5s ease both',
          }}>
            layover
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '16px', marginBottom: '40px', letterSpacing: '0.2px', animation: 'fadeIn 0.5s ease 0.1s both' }}>
            AI-powered travel planning for every adventurer
          </p>

          {/* Pill search bar */}
          <div style={{
            display: 'flex', alignItems: 'center',
            background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(20px)',
            borderRadius: '60px', padding: '7px 7px 7px 24px',
            boxShadow: '0 24px 64px rgba(0,0,0,0.28)',
            marginBottom: '24px', animation: 'fadeIn 0.5s ease 0.18s both',
          }}>
            <MapPin size={17} color="#4F46E5" style={{ flexShrink: 0, marginRight: '12px' }} />
            <input
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: '15px', color: '#0F172A', background: 'transparent', fontFamily: "'Inter',sans-serif", padding: '11px 0' }}
              placeholder="Tell me about your vacation..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              style={{
                padding: '13px 30px', borderRadius: '50px', flexShrink: 0,
                background: 'linear-gradient(135deg, #F97316, #EA580C)',
                border: 'none', color: 'white', fontSize: '14px', fontWeight: '700',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                fontFamily: "'Plus Jakarta Sans',sans-serif", whiteSpace: 'nowrap',
                boxShadow: '0 4px 20px rgba(249,115,22,0.45)', transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform='scale(1.04)'; (e.currentTarget as HTMLElement).style.boxShadow='0 8px 28px rgba(249,115,22,0.55)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform='scale(1)'; (e.currentTarget as HTMLElement).style.boxShadow='0 4px 20px rgba(249,115,22,0.45)' }}
            >
              <Search size={15} /> Book a trip
            </button>
          </div>

          {/* Quick tags */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', animation: 'fadeIn 0.5s ease 0.26s both' }}>
            {['🏖️ Beach', '🌿 Jungle', '🏔️ Mountains', '🏛️ Culture', '🍜 Food'].map(tag => (
              <button
                key={tag}
                onClick={() => { const w = tag.split(' ')[1]; navigate(`/explore?q=${w}`) }}
                style={{
                  padding: '7px 16px', borderRadius: '30px', fontSize: '12px', fontWeight: '600',
                  background: 'rgba(255,255,255,0.16)', backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.28)', color: '#fff', cursor: 'pointer',
                  transition: 'all 0.18s ease', fontFamily: "'Plus Jakarta Sans',sans-serif",
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.28)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.16)'}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom stats bar */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 3,
          background: 'rgba(0,0,0,0.42)', backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.1)', padding: '18px 24px',
          display: 'flex', justifyContent: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '40px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Star size={15} fill="#FFD166" color="#FFD166" />
              <span style={{ color: '#fff', fontSize: '14px', fontWeight: '700', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>4.7 stars</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>· 50K Reviews</span>
            </div>
            <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.18)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={15} color="rgba(255,255,255,0.7)" />
              <span style={{ color: '#fff', fontSize: '14px', fontWeight: '700', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>50k</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>Travellers</span>
            </div>
            <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.18)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={15} color="rgba(255,255,255,0.7)" />
              <span style={{ color: '#fff', fontSize: '14px', fontWeight: '700', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>10M+</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>Followers</span>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════ DESTINATIONS */}
      <section style={{ padding:'96px 24px', maxWidth:'1280px', margin:'0 auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'48px' }}>
          <div>
            <div className="section-label">
              <Compass size={11} /> Trending Now
            </div>
            <h2 style={{ fontSize:'36px', fontWeight:'900', letterSpacing:'-0.8px' }}>
              Popular Destinations
            </h2>
            <p style={{ color:'#64748B', fontSize:'15px', marginTop:'8px' }}>Handpicked by our AI based on traveller ratings and seasonal highlights</p>
          </div>
          <button
            onClick={() => navigate('/explore')}
            style={{ display:'flex', alignItems:'center', gap:'6px', background:'none', border:'none', color:'#4F46E5', fontSize:'14px', fontWeight:'700', cursor:'pointer', fontFamily:"'Plus Jakarta Sans',sans-serif" }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.gap='10px'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.gap='6px'}
          >
            View all <ArrowRight size={15} />
          </button>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'20px' }}>
          {DESTINATIONS.map((dest, i) => (
            <div
              key={dest.name}
              onClick={() => navigate(`/explore?q=${dest.name}`)}
              onMouseEnter={() => setHovered(dest.name)}
              onMouseLeave={() => setHovered(null)}
              className="card-hover"
              style={{
                borderRadius:'20px', overflow:'hidden', cursor:'pointer', position:'relative',
                height: i === 0 || i === 3 ? '380px' : '280px',
                border:`1px solid ${t.border}`,
                boxShadow:'0 2px 12px rgba(0,0,0,0.06)',
                animation:`fadeIn 0.5s ease ${i*0.08}s both`,
              }}
            >
              <img
                src={dest.image} alt={dest.name}
                style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.5s ease', transform: hovered===dest.name ? 'scale(1.05)' : 'scale(1)' }}
              />
              <div className="card-image-overlay" style={{ position:'absolute', inset:0 }} />

              <div style={{ position:'absolute', top:'14px', left:'14px', padding:'4px 12px', borderRadius:'20px', background:'rgba(255,255,255,0.18)', backdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.35)' }}>
                <span style={{ color:'#fff', fontSize:'11px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.4px', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{dest.tag}</span>
              </div>

              <div style={{ position:'absolute', bottom:'18px', left:'18px', right:'18px' }}>
                <h3 style={{ color:'#fff', fontSize:'20px', fontWeight:'800', letterSpacing:'-0.3px', marginBottom:'4px', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{dest.name}</h3>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
                    <MapPin size={11} color="rgba(255,255,255,0.6)" />
                    <span style={{ color:'rgba(255,255,255,0.65)', fontSize:'12px' }}>{dest.country}</span>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:'4px', background:'rgba(0,0,0,0.35)', backdropFilter:'blur(8px)', padding:'3px 10px', borderRadius:'12px' }}>
                    <Star size={11} fill="#FFD166" color="#FFD166" />
                    <span style={{ color:'#FFD166', fontSize:'12px', fontWeight:'700' }}>{dest.rating}</span>
                  </div>
                </div>
              </div>

              {hovered === dest.name && (
                <div style={{ position:'absolute', bottom:'18px', right:'18px', width:'32px', height:'32px', borderRadius:'50%', background:'white', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 12px rgba(0,0,0,0.2)', animation:'fadeInScale 0.2s ease' }}>
                  <ChevronRight size={14} color="#4F46E5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════ HOW IT WORKS */}
      <section style={{ background: t.sectionAlt, padding:'96px 24px' }}>
        <div style={{ maxWidth:'960px', margin:'0 auto', textAlign:'center' }}>
          <div className="section-label" style={{ margin:'0 auto 12px' }}>
            <Zap size={11} /> How It Works
          </div>
          <h2 style={{ fontSize:'36px', fontWeight:'900', letterSpacing:'-0.8px', marginBottom:'14px' }}>
            From idea to itinerary in minutes
          </h2>
          <p style={{ color:'#64748B', fontSize:'16px', maxWidth:'480px', margin:'0 auto 64px', lineHeight:1.7 }}>
            No spreadsheets. No endless tabs. Just tell us your dream and we handle the rest.
          </p>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'24px' }}>
            {HOW.map(({ step, title, desc }, i) => (
              <div
                key={step}
                style={{ background: t.card, borderRadius:'20px', padding:'36px 28px', border:`1px solid ${t.border}`, boxShadow: isDark ? 'none' : '0 4px 20px rgba(0,0,0,0.06)', textAlign:'left', animation:`fadeIn 0.5s ease ${i*0.1}s both` }}
              >
                <div style={{ fontSize:'13px', fontWeight:'900', color:'#4F46E5', background:'#EEF2FF', padding:'6px 12px', borderRadius:'8px', display:'inline-block', marginBottom:'20px', fontFamily:"'Plus Jakarta Sans',sans-serif", letterSpacing:'0.5px' }}>{step}</div>
                <h3 style={{ fontSize:'18px', fontWeight:'800', marginBottom:'10px', letterSpacing:'-0.3px' }}>{title}</h3>
                <p style={{ color:'#64748B', fontSize:'14px', lineHeight:1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════ FEATURES */}
      <section style={{ padding:'96px 24px', maxWidth:'1280px', margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:'56px' }}>
          <div className="section-label" style={{ margin:'0 auto 12px' }}>
            <Shield size={11} /> Why layover.ai
          </div>
          <h2 style={{ fontSize:'36px', fontWeight:'900', letterSpacing:'-0.8px', marginBottom:'10px' }}>Everything your trip needs</h2>
          <p style={{ color:'#64748B', fontSize:'15px', maxWidth:'460px', margin:'0 auto', lineHeight:1.7 }}>
            One platform that handles every part of your trip — from dream to done.
          </p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'16px' }}>
          {FEATURES.map(({ icon: Icon, title, desc, color, bg }, i) => (
            <div
              key={title}
              className="card card-hover"
              style={{ padding:'32px', animation:`fadeIn 0.5s ease ${i*0.06}s both`, borderRadius:'20px' }}
            >
              <div style={{ width:'50px', height:'50px', borderRadius:'14px', background:bg, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'22px' }}>
                <Icon size={22} color={color} strokeWidth={1.8} />
              </div>
              <h3 style={{ fontSize:'16px', fontWeight:'800', marginBottom:'10px', letterSpacing:'-0.2px' }}>{title}</h3>
              <p style={{ color:'#64748B', fontSize:'13.5px', lineHeight:1.75 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════ TESTIMONIALS */}
      <section style={{ background: t.surface, borderTop:`1px solid ${t.border}`, borderBottom:`1px solid ${t.border}`, padding:'80px 24px' }}>
        <div style={{ maxWidth:'1100px', margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'48px' }}>
            <div className="section-label" style={{ margin:'0 auto 12px' }}>
              <Star size={11} /> Traveller Stories
            </div>
            <h2 style={{ fontSize:'32px', fontWeight:'900', letterSpacing:'-0.6px' }}>Loved by travellers worldwide</h2>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'20px' }}>
            {TESTIMONIALS.map(({ name, role, text, avatar, rating }, i) => (
              <div key={name} className="card" style={{ padding:'28px', borderRadius:'20px', animation:`fadeIn 0.5s ease ${i*0.1}s both` }}>
                <div style={{ display:'flex', gap:'2px', marginBottom:'16px' }}>
                  {Array.from({length:rating}).map((_,j) => <Star key={j} size={14} fill="#F97316" color="#F97316" />)}
                </div>
                <p style={{ color:'#475569', fontSize:'14px', lineHeight:1.75, marginBottom:'20px' }}>"{text}"</p>
                <div style={{ display:'flex', alignItems:'center', gap:'12px', borderTop:'1px solid #F1F5F9', paddingTop:'16px' }}>
                  <img src={avatar} alt={name} style={{ width:'40px', height:'40px', borderRadius:'50%', objectFit:'cover' }} />
                  <div>
                    <p style={{ fontWeight:'700', fontSize:'14px', color:'#0F172A', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{name}</p>
                    <p style={{ color:'#94A3B8', fontSize:'12px' }}>{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════ CTA */}
      <section style={{ padding:'80px 24px' }}>
        <div style={{ maxWidth:'900px', margin:'0 auto' }}>
          <div style={{ borderRadius:'28px', background:'linear-gradient(135deg,#4F46E5 0%,#7C3AED 60%,#6D28D9 100%)', padding:'72px 48px', textAlign:'center', position:'relative', overflow:'hidden', boxShadow:'0 24px 64px rgba(79,70,229,0.32)' }}>
            {/* Faint pattern overlay */}
            <div style={{ position:'absolute', inset:0, backgroundImage:`linear-gradient(rgba(255,255,255,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.06) 1px,transparent 1px)`, backgroundSize:'32px 32px', pointerEvents:'none' }} />
            <div style={{ position:'absolute', top:'-60px', right:'-60px', width:'240px', height:'240px', borderRadius:'50%', background:'rgba(255,255,255,0.06)', pointerEvents:'none' }} />

            <div style={{ position:'relative' }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:'6px', padding:'5px 14px', borderRadius:'20px', background:'rgba(255,255,255,0.14)', border:'1px solid rgba(255,255,255,0.25)', marginBottom:'20px' }}>
                <Zap size={12} color="rgba(255,255,255,0.9)" />
                <span style={{ color:'rgba(255,255,255,0.9)', fontSize:'11px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.8px', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Free to start · No credit card</span>
              </div>
              <h2 style={{ fontSize:'42px', fontWeight:'900', color:'#fff', letterSpacing:'-1px', lineHeight:1.1, marginBottom:'14px', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                Ready for your next adventure?
              </h2>
              <p style={{ color:'rgba(255,255,255,0.70)', fontSize:'16px', marginBottom:'36px', lineHeight:1.65 }}>
                Join 50,000+ travellers who plan smarter with layover.ai
              </p>
              <div style={{ display:'flex', gap:'14px', justifyContent:'center', flexWrap:'wrap' }}>
                <button
                  onClick={() => navigate('/explore')}
                  className="btn btn-lg"
                  style={{ background:'#fff', color:'#4F46E5', boxShadow:'0 8px 28px rgba(0,0,0,0.15)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform='translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow='0 16px 40px rgba(0,0,0,0.2)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform='translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow='0 8px 28px rgba(0,0,0,0.15)' }}
                >
                  <Compass size={16} /> Start Planning Free
                </button>
                <button
                  onClick={() => navigate('/pricing')}
                  className="btn btn-lg"
                  style={{ background:'rgba(255,255,255,0.12)', color:'#fff', border:'1.5px solid rgba(255,255,255,0.3)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.20)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.12)' }}
                >
                  View Pricing <ChevronRight size={16} />
                </button>
              </div>

              {/* Trust signals */}
              <div style={{ display:'flex', justifyContent:'center', gap:'28px', marginTop:'36px', flexWrap:'wrap' }}>
                {['No credit card required','Cancel anytime','Free forever plan'].map(t => (
                  <div key={t} style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                    <Check size={13} color="rgba(255,255,255,0.7)" />
                    <span style={{ color:'rgba(255,255,255,0.65)', fontSize:'13px', fontWeight:'500' }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════ FOOTER */}
      <footer style={{ borderTop:`1px solid ${t.border}`, background: t.surface, padding:'40px 24px' }}>
        <div style={{ maxWidth:'1280px', margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'16px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <svg width="28" height="28" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="36" height="36" rx="10" fill="url(#footerGrad)"/>
              <path d="M7 18L29 8L22 28L17 21L7 18Z" fill="white" fillOpacity="0.95"/>
              <path d="M17 21L22 28L19.5 22.5L17 21Z" fill="white" fillOpacity="0.5"/>
              <defs><linearGradient id="footerGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse"><stop stopColor="#4F46E5"/><stop offset="1" stopColor="#7C3AED"/></linearGradient></defs>
            </svg>
            <span style={{ fontFamily:"'Pacifico',cursive", fontSize:'17px', color: t.text }}>layover</span>
          </div>
          <p style={{ color:'#94A3B8', fontSize:'13px' }}>© 2026 layover · Plan smarter. Travel better.</p>
          <div style={{ display:'flex', gap:'20px' }}>
            {['Privacy','Terms','Support'].map(l => (
              <a key={l} href="#" style={{ color:'#94A3B8', fontSize:'13px', textDecoration:'none' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color='#4F46E5'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color='#94A3B8'}
              >{l}</a>
            ))}
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }
        @keyframes fadeInScale { from{opacity:0;transform:scale(0.85);} to{opacity:1;transform:scale(1);} }
      `}</style>
    </div>
  )
}