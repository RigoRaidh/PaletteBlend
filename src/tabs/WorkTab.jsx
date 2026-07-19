import { useState } from 'react'
import { workItems } from '../data/workItems'
import { colorFromString } from '../lib/discordProfile'

function WorkImage({ item }) {
  const [errored, setErrored] = useState(false)

  if (errored) {
    return (
      <div
        className="flex h-full w-full items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${colorFromString(item.id)}33, #08080a)`,
        }}
      >
        <span className="font-display text-3xl font-semibold text-white/20">{item.name[0]}</span>
      </div>
    )
  }

  return (
    <img
      src={item.image}
      alt={`${item.name} — ${item.category}`}
      onError={() => setErrored(true)}
      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
      loading="lazy"
    />
  )
}

export default function WorkTab() {
  return (
    <div className="animate-fade-up py-14 sm:py-20">
      <div className="mx-auto max-w-2xl text-center mb-10">
        <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Selected work</h2>
        <p className="mt-3 font-body text-sm text-mist sm:text-base">
          Six servers, six very different communities — same rigor underneath.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {workItems.map((item) => (
          <div
            key={item.id}
            className="group glass relative aspect-[4/5] overflow-hidden rounded-2xl"
          >
            <WorkImage item={item} />
            <div className="absolute inset-0 bg-gradient-to-t from-void via-void/20 to-transparent opacity-90" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <span className="font-mono text-[11px] uppercase tracking-wide text-gold-soft">
                {item.category}
              </span>
              <h3 className="mt-1 font-display text-lg font-semibold text-ink">{item.name}</h3>
              <p className="mt-2 max-h-0 overflow-hidden font-body text-sm leading-relaxed text-mist opacity-0 transition-all duration-300 group-hover:max-h-24 group-hover:opacity-100">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
