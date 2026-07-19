import { useState, useRef, useEffect } from 'react'
import { Menu, X, LogOut, ChevronDown } from 'lucide-react'
import Logo from './Logo'
import { useAuth } from '../lib/useAuth'
import { colorFromString } from '../lib/discordProfile'

const TABS = [
  { id: 'home', label: 'Home' },
  { id: 'work', label: 'Work' },
  { id: 'showcase', label: 'Showcase' },
  { id: 'reviews', label: 'Reviews' },
]

function DiscordMark({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.74 19.74 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.058a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.076.076 0 0 0-.04.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.055c.5-5.177-.838-9.674-3.549-13.66a.06.06 0 0 0-.031-.028ZM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.176 1.094 2.157 2.418 0 1.334-.955 2.419-2.157 2.419Zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.176 1.094 2.157 2.418 0 1.334-.946 2.419-2.157 2.419Z" />
    </svg>
  )
}

export default function Header({ activeTab, setActiveTab }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const accountRef = useRef(null)
  const { user, profile, loading, signInWithDiscord, signOut } = useAuth()

  useEffect(() => {
    function handleClickOutside(e) {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const goTo = (id) => {
    setActiveTab(id)
    setMobileOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <div className="mx-auto max-w-6xl glass rounded-2xl">
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
          {/* Logo */}
          <button
            onClick={() => goTo('home')}
            className="flex items-center gap-2.5 rounded-lg"
            aria-label="PaletteBlend home"
          >
            <Logo size={28} />
            <span className="font-display text-lg font-semibold tracking-tight text-ink">
              PaletteBlend
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => goTo(tab.id)}
                aria-current={activeTab === tab.id ? 'page' : undefined}
                className={`relative rounded-lg px-4 py-2 font-body text-sm font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'text-gold text-glow-gold'
                    : 'text-mist hover:text-blue-soft'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute inset-x-3 -bottom-[1px] h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
                )}
              </button>
            ))}
          </nav>

          {/* Right: auth */}
          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              {loading ? (
                <div className="h-9 w-24 rounded-lg bg-white/5 animate-pulse" />
              ) : user ? (
                <div className="relative" ref={accountRef}>
                  <button
                    onClick={() => setAccountOpen((v) => !v)}
                    className="flex items-center gap-2 rounded-lg py-1.5 pl-1.5 pr-3 glass hover:border-gold/30 transition-colors"
                    aria-expanded={accountOpen}
                  >
                    <Avatar profile={profile} size={26} />
                    <span className="font-body text-sm font-medium text-ink max-w-[110px] truncate">
                      {profile.username}
                    </span>
                    <ChevronDown size={14} className="text-mist" />
                  </button>
                  {accountOpen && (
                    <div className="absolute right-0 mt-2 w-44 glass-strong rounded-xl p-1.5 animate-fade-up">
                      <button
                        onClick={() => {
                          setAccountOpen(false)
                          signOut()
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-mist hover:text-ink hover:bg-white/5 transition-colors"
                      >
                        <LogOut size={15} /> Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={signInWithDiscord}
                  className="flex items-center gap-2 rounded-lg bg-[#5865F2] px-4 py-2 font-body text-sm font-semibold text-white transition-transform hover:scale-[1.03] active:scale-[0.98]"
                >
                  <DiscordMark className="h-4 w-4" />
                  Login with Discord
                </button>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden rounded-lg p-2 text-ink hover:bg-white/5"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile panel */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/10 px-4 py-3 animate-fade-up">
            <nav className="flex flex-col gap-1" aria-label="Primary mobile">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => goTo(tab.id)}
                  className={`rounded-lg px-3 py-2.5 text-left font-body text-sm font-medium transition-colors ${
                    activeTab === tab.id ? 'text-gold bg-white/5' : 'text-mist hover:text-ink'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
            <div className="mt-3 border-t border-white/10 pt-3">
              {loading ? null : user ? (
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <Avatar profile={profile} size={28} />
                    <span className="font-body text-sm text-ink">{profile.username}</span>
                  </div>
                  <button
                    onClick={signOut}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-mist hover:text-ink hover:bg-white/5"
                  >
                    <LogOut size={14} /> Sign out
                  </button>
                </div>
              ) : (
                <button
                  onClick={signInWithDiscord}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#5865F2] px-4 py-2.5 font-body text-sm font-semibold text-white"
                >
                  <DiscordMark className="h-4 w-4" />
                  Login with Discord
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export function Avatar({ profile, size = 32 }) {
  if (!profile) return null
  if (profile.avatarUrl) {
    return (
      <img
        src={profile.avatarUrl}
        alt={profile.username}
        width={size}
        height={size}
        className="rounded-full object-cover ring-1 ring-white/10"
        style={{ width: size, height: size }}
      />
    )
  }
  const initial = profile.username?.[0]?.toUpperCase() || '?'
  return (
    <div
      className="flex items-center justify-center rounded-full font-display font-semibold text-void ring-1 ring-white/10"
      style={{ width: size, height: size, background: colorFromString(profile.username), fontSize: size * 0.42 }}
    >
      {initial}
    </div>
  )
}
