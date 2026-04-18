import { createContext, useContext, useEffect, useState } from 'react'

export interface ThemeTokens {
  bg: string
  surface: string
  surface2: string
  card: string
  text: string
  textSub: string
  textMuted: string
  border: string
  borderLight: string
  navBg: string
  inputBg: string
  sectionAlt: string
}

const light: ThemeTokens = {
  bg:          '#ffffff',
  surface:     '#F8FAFC',
  surface2:    '#F1F5F9',
  card:        '#ffffff',
  text:        '#0F172A',
  textSub:     '#64748B',
  textMuted:   '#94A3B8',
  border:      '#E2E8F0',
  borderLight: 'rgba(0,0,0,0.025)',
  navBg:       'rgba(255,255,255,0.95)',
  inputBg:     '#F8FAFC',
  sectionAlt:  'linear-gradient(135deg,#F5F3FF 0%,#EEF2FF 100%)',
}

const dark: ThemeTokens = {
  bg:          '#0F172A',
  surface:     '#1E293B',
  surface2:    '#334155',
  card:        '#1E293B',
  text:        '#F1F5F9',
  textSub:     '#94A3B8',
  textMuted:   '#64748B',
  border:      '#334155',
  borderLight: 'rgba(255,255,255,0.06)',
  navBg:       'rgba(15,23,42,0.95)',
  inputBg:     '#1E293B',
  sectionAlt:  'linear-gradient(135deg,#1E1B4B 0%,#1E293B 100%)',
}

interface ThemeCtx { isDark: boolean; toggle: () => void; t: ThemeTokens }

const Ctx = createContext<ThemeCtx>({ isDark: false, toggle: () => {}, t: light })

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('layover-theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('layover-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const toggle = () => setIsDark(d => !d)

  return <Ctx.Provider value={{ isDark, toggle, t: isDark ? dark : light }}>{children}</Ctx.Provider>
}

export const useTheme = () => useContext(Ctx)