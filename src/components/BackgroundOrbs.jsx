// Fixed ambient backdrop: slow-drifting gold/blue orbs plus a faint grain
// layer, sitting behind everything so the glass panels have something to
// refract. Pointer-events disabled so it never intercepts clicks/taps.
export default function BackgroundOrbs() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0 bg-void" />

      <div
        className="absolute -top-40 -left-40 h-[32rem] w-[32rem] rounded-full animate-drift-a"
        style={{
          background: 'radial-gradient(circle, rgba(212,175,55,0.28) 0%, rgba(212,175,55,0) 70%)',
        }}
      />
      <div
        className="absolute top-1/3 -right-40 h-[36rem] w-[36rem] rounded-full animate-drift-b"
        style={{
          background: 'radial-gradient(circle, rgba(74,158,255,0.24) 0%, rgba(74,158,255,0) 70%)',
        }}
      />
      <div
        className="absolute bottom-[-14rem] left-1/4 h-[28rem] w-[28rem] rounded-full animate-drift-c"
        style={{
          background: 'radial-gradient(circle, rgba(212,175,55,0.16) 0%, rgba(212,175,55,0) 70%)',
        }}
      />

      <div className="absolute inset-0 noise-overlay" />
    </div>
  )
}
