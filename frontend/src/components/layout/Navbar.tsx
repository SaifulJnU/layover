import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Map, Plane, BarChart3, SplitSquareVertical, Trophy, Globe, Shirt, Gem, Home, Moon, Sun } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'

const navLinks = [
  { path: '/',            label: 'Home',    icon: Home               },
  { path: '/explore',     label: 'Explore', icon: Map                },
  { path: '/planner',     label: 'Planner', icon: Plane              },
  { path: '/budget-plan', label: 'Budget',  icon: BarChart3          },
  { path: '/split',       label: 'Split',   icon: SplitSquareVertical},
  { path: '/rewards',     label: 'Rewards', icon: Trophy             },
  { path: '/social',      label: 'Social',  icon: Globe              },
  { path: '/outfits',     label: 'Outfits', icon: Shirt              },
  { path: '/pricing',     label: 'Pricing', icon: Gem                },
]

function Logo({ t }: { t: ReturnType<typeof useTheme>['t'] }) {
  return (
    <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="36" height="36" rx="10" fill="url(#logoGrad)" />
        <path d="M7 18L29 8L22 28L17 21L7 18Z" fill="white" fillOpacity="0.95"/>
        <path d="M17 21L22 28L19.5 22.5L17 21Z" fill="white" fillOpacity="0.5"/>
        <path d="M17 21L7 18L15 17.5L17 21Z" fill="white" fillOpacity="0.6"/>
        <circle cx="10" cy="26" r="1.2" fill="white" fillOpacity="0.6"/>
        <circle cx="7"  cy="29" r="0.9" fill="white" fillOpacity="0.4"/>
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4F46E5"/>
            <stop offset="1" stopColor="#7C3AED"/>
          </linearGradient>
        </defs>
      </svg>
      <span style={{ fontFamily: "'Pacifico', cursive", fontSize: '22px', color: t.text, letterSpacing: '-0.5px' }}>
        layover
      </span>
    </Link>
  )
}

export default function Navbar() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const { isDark, toggle, t } = useTheme()

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: t.navBg,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${t.border}`,
      boxShadow: isDark ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.05)',
      transition: 'background 0.3s ease, border-color 0.3s ease',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px' }}>

          <Logo t={t} />

          {/* Desktop links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
            {navLinks.map(({ path, label }) => {
              const active = location.pathname === path
              return (
                <Link
                  key={path}
                  to={path}
                  style={{
                    textDecoration: 'none',
                    padding: '7px 13px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: active ? '700' : '500',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    color: active ? '#4F46E5' : t.textSub,
                    background: active ? (isDark ? 'rgba(79,70,229,0.18)' : '#EEF2FF') : 'transparent',
                    transition: 'all 0.18s ease',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.color = t.text
                      ;(e.currentTarget as HTMLElement).style.background = isDark ? 'rgba(255,255,255,0.06)' : '#F8FAFC'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.color = t.textSub
                      ;(e.currentTarget as HTMLElement).style.background = 'transparent'
                    }
                  }}
                >
                  {label}
                </Link>
              )
            })}
          </div>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {/* Dark mode toggle */}
            <button
              onClick={toggle}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              style={{
                width: '38px', height: '38px', borderRadius: '10px', border: `1px solid ${t.border}`,
                background: t.surface, cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', transition: 'all 0.2s ease', flexShrink: 0,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#4F46E5'; (e.currentTarget as HTMLElement).style.background = isDark ? 'rgba(79,70,229,0.15)' : '#EEF2FF' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = t.border; (e.currentTarget as HTMLElement).style.background = t.surface }}
            >
              {isDark
                ? <Sun size={16} color="#F59E0B" />
                : <Moon size={16} color="#4F46E5" />}
            </button>

            <Link to="/planner" style={{ textDecoration: 'none' }}>
              <button className="btn btn-primary btn-sm" style={{ fontSize: '13px', padding: '9px 20px' }}>
                Plan a Trip
              </button>
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ background: 'none', border: 'none', color: t.textMuted, cursor: 'pointer', display: 'none', padding: '4px' }}
              className="mobile-menu-btn"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ paddingBottom: '16px', display: 'flex', flexDirection: 'column', gap: '2px', borderTop: `1px solid ${t.border}`, paddingTop: '12px' }}>
            {navLinks.map(({ path, label, icon: Icon }) => {
              const active = location.pathname === path
              return (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    textDecoration: 'none',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: active ? '700' : '500',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    color: active ? '#4F46E5' : t.textSub,
                    background: active ? (isDark ? 'rgba(79,70,229,0.15)' : '#EEF2FF') : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <Icon size={16} />{label}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </nav>
  )
}