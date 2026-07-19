import { useState } from 'react'
import { AuthProvider } from './lib/useAuth'
import BackgroundOrbs from './components/BackgroundOrbs'
import Header from './components/Header'
import Logo from './components/Logo'
import HomeTab from './tabs/HomeTab'
import WorkTab from './tabs/WorkTab'
import ShowcaseTab from './tabs/ShowcaseTab'
import ReviewsTab from './tabs/ReviewsTab'

function AppShell() {
  const [activeTab, setActiveTab] = useState('home')

  return (
    <div className="min-h-screen">
      <BackgroundOrbs />
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="mx-auto max-w-6xl px-4 sm:px-6">
        {activeTab === 'home' && <HomeTab setActiveTab={setActiveTab} />}
        {activeTab === 'work' && <WorkTab />}
        {activeTab === 'showcase' && <ShowcaseTab />}
        {activeTab === 'reviews' && <ReviewsTab />}
      </main>

      <footer className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-center gap-3 border-t border-white/10 pt-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-2">
            <Logo size={18} />
            <span className="font-display text-sm font-semibold text-ink">PaletteBlend</span>
          </div>
          <p className="font-mono text-xs text-mist">
            &copy; {new Date().getFullYear()} PaletteBlend. Community-run, built with care.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  )
}
