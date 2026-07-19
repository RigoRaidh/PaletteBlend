import { ArrowRight, Layers, Users, Headphones, Star } from 'lucide-react'

const STATS = [
  { label: 'Servers architected', value: '50+', icon: Layers },
  { label: 'Members onboarded', value: '12K+', icon: Users },
  { label: 'Support', value: '24/7', icon: Headphones },
  { label: 'Average rating', value: '4.9', icon: Star },
]

export default function HomeTab({ setActiveTab }) {
  return (
    <div className="animate-fade-up">
      {/* Hero */}
      <section className="pt-16 pb-14 sm:pt-24 sm:pb-20 text-center">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-pulse-soft rounded-full bg-gold" />
          </span>
          <span className="font-mono text-xs text-mist">Currently building for 6 communities</span>
        </div>

        <h1 className="mx-auto max-w-3xl font-display text-4xl font-semibold leading-[1.1] sm:text-6xl">
          <span className="bg-gradient-to-r from-gold-soft via-ink to-blue-soft bg-clip-text text-transparent">
            Server architecture,
          </span>
          <br />
          <span className="bg-gradient-to-r from-blue-soft via-ink to-gold-soft bg-clip-text text-transparent">
            built like software.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-balance font-body text-base text-mist sm:text-lg">
          PaletteBlend designs the channel structure, role systems, and visual identity behind
          Discord's most considered communities — for founders, labels, and guilds who treat their
          server like a product, not an afterthought.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="https://discord.gg/your-invite-code"
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-2 rounded-lg bg-gradient-to-r from-gold to-gold-soft px-6 py-3 font-body text-sm font-semibold text-void transition-transform hover:scale-[1.03] active:scale-[0.98]"
          >
            Join the Discord
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </a>
          <button
            onClick={() => setActiveTab('work')}
            className="rounded-lg glass px-6 py-3 font-body text-sm font-semibold text-ink transition-colors hover:border-blue/30"
          >
            See the work
          </button>
        </div>
      </section>

      {/* Stats strip */}
      <section className="pb-20">
        <div className="glass grid grid-cols-2 gap-px overflow-hidden rounded-2xl sm:grid-cols-4">
          {STATS.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 px-4 py-6 text-center sm:py-8"
            >
              <Icon size={18} className="text-gold" />
              <span className="font-display text-2xl font-semibold text-ink sm:text-3xl">
                {value}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-wide text-mist">
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* What we do */}
      <section className="pb-24">
        <div className="mx-auto max-w-2xl text-center mb-10">
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            Community design, taken seriously
          </h2>
          <p className="mt-3 font-body text-sm text-mist sm:text-base">
            Every server we touch gets the same treatment: structure first, then style.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              title: 'Channel architecture',
              body: 'Information flow mapped before a single channel is created — onboarding, engagement, and moderation paths that hold up at scale.',
            },
            {
              title: 'Role & permission systems',
              body: 'Hierarchies that reflect how your community actually works, from public tiers to gated, paid access.',
            },
            {
              title: 'Visual identity',
              body: 'Custom emoji, banners, and server aesthetics that feel considered — not a theme pack.',
            },
          ].map((item) => (
            <div key={item.title} className="glass rounded-2xl p-6 transition-colors hover:border-blue/20">
              <h3 className="font-display text-base font-semibold text-ink">{item.title}</h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-mist">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
