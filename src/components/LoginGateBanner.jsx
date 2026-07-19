import { Sparkles } from 'lucide-react'
import { useAuth } from '../lib/useAuth'

export default function LoginGateBanner({ text = 'Please login with Discord to participate.' }) {
  const { signInWithDiscord } = useAuth()

  return (
    <div className="glass rounded-2xl px-6 py-8 text-center">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gold/20 to-blue/20 text-gold">
        <Sparkles size={18} />
      </div>
      <p className="font-body text-sm text-mist mb-4">{text}</p>
      <button
        onClick={signInWithDiscord}
        className="rounded-lg bg-[#5865F2] px-5 py-2 font-body text-sm font-semibold text-white transition-transform hover:scale-[1.03] active:scale-[0.98]"
      >
        Login with Discord
      </button>
    </div>
  )
}
