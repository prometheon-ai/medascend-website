import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'

export default function ArenaPoster({ onClose }) {
  const navigate = useNavigate()

  const handleEnter = () => {
    onClose()
    navigate('/arena')
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-[201] p-2 rounded-full bg-dark-card border border-teal/20 text-sky/60 hover:text-cream hover:border-teal/40 transition-all cursor-pointer border-solid"
      >
        <X size={16} />
      </button>

      {/* Poster frame */}
      <div
        className="relative w-full max-w-5xl rounded-2xl overflow-hidden"
        style={{
          background: 'radial-gradient(110% 70% at 86% 14%, rgba(66,111,128,0.18), transparent 55%), radial-gradient(80% 70% at 8% 100%, rgba(211,140,70,0.06), transparent 60%), #0f1a1f',
          color: '#FAF3EB',
          boxShadow: '0 40px 120px -20px rgba(0,0,0,0.8)',
          border: '1px solid rgba(66,111,128,0.2)',
          fontFamily: "'Inter', system-ui, sans-serif",
          maxHeight: '92vh',
          overflowY: 'auto',
        }}
      >
        {/* Main content — two col on desktop, single col on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-6 lg:gap-10 p-6 sm:p-8 lg:p-[52px_64px] items-center">

          {/* LEFT — text content */}
          <div className="flex flex-col gap-4">

            {/* Branding */}
            <div className="flex items-center gap-2.5">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight leading-none">
                <span style={{ color: '#FAF3EB' }}>Med</span>
                <span style={{ background: 'linear-gradient(95deg, #D38C46, #BA5B47)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Ascend</span>
              </span>
              <span className="w-px h-4 bg-sky/20" />
              <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-sky/70">Quiz Arena</span>
            </div>

            {/* Live eyebrow */}
            <div className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.18em] uppercase text-sky/70">
              <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" style={{ boxShadow: '0 0 10px rgba(74,222,128,0.6)', animation: 'pulse 1.8s ease-out infinite' }} />
              <b className="text-cream tracking-[0.18em]">Live · Quiz Arena</b>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              Open · All India
            </div>

            {/* Headline */}
            <h2
              className="leading-[0.98] tracking-[-0.025em] text-cream m-0"
              style={{
                fontFamily: "'Fraunces', Georgia, serif",
                fontWeight: 600,
                fontSize: 'clamp(32px, 5vw, 60px)',
              }}
            >
              Compete in real&nbsp;time.<br />
              Climb to{' '}
              <em
                className="not-italic"
                style={{ fontStyle: 'italic', fontWeight: 500, background: 'linear-gradient(95deg, #D38C46, #BA5B47)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                Legend
              </em>.
            </h2>

            {/* Subhead */}
            <p className="text-sm sm:text-base leading-relaxed text-sky/80 max-w-md m-0">
              Live, timed quizzes across your core subjects. Compete against students across India and win cash prizes from a{' '}
              <span className="font-mono font-bold text-gold-light">₹5,500</span> pot every paid quiz.
            </p>

            {/* Subject chips */}
            <div className="flex flex-wrap gap-2">
              {['FMT', 'PSM', 'Pathology', 'Pharmacology', 'Microbiology'].map(s => (
                <span key={s} className="text-xs font-medium px-3 py-1.5 rounded-full border border-teal-light/30 bg-teal/10 text-cream/90">
                  {s}
                </span>
              ))}
            </div>

            {/* CTA row */}
            <div className="flex items-center gap-4 mt-1">
              <button
                onClick={handleEnter}
                className="flex items-center gap-3 px-5 py-3 rounded-full font-bold text-sm cursor-pointer border-none"
                style={{ background: '#FAF3EB', color: '#0f1a1f', boxShadow: '0 14px 36px -14px rgba(250,243,235,0.45)' }}
              >
                Enter the Arena
                <span>→</span>
                <span className="font-mono font-bold pl-3 border-l border-black/15" style={{ color: '#9e4535' }}>₹99</span>
              </button>
              <div className="text-[11px] leading-snug" style={{ color: '#A49692' }}>
                Top prize <b className="font-mono font-bold" style={{ color: '#e4a86a' }}>₹2,200</b><br />
                Credited within 24h
              </div>
            </div>
          </div>

          {/* RIGHT — single phone mockup on mobile (live quiz), both on desktop */}
          <div className="relative flex items-center justify-center" style={{ height: '420px' }}>

            {/* Back phone (leaderboard) — hidden on mobile */}
            <div
              className="hidden lg:block absolute right-0 top-[20px]"
              style={{ width: '240px', transform: 'rotate(4deg)', borderRadius: '30px', background: '#152229', boxShadow: '0 0 0 1.5px #243842, 0 0 0 6px #07111a, 0 30px 60px -15px rgba(0,0,0,0.7)', overflow: 'hidden' }}
            >
              <div style={{ height: '28px', display: 'flex', alignItems: 'center', padding: '8px 18px 0', fontFamily: 'monospace', fontSize: '10px', color: '#A1B9C5', fontWeight: 600 }}>
                <span>9:41</span>
              </div>
              <div style={{ padding: '4px 14px 16px' }}>
                <div style={{ fontFamily: 'Georgia, serif', fontWeight: 600, fontSize: '18px', letterSpacing: '-0.015em', color: '#FAF3EB', lineHeight: 1.1 }}>PSM Quiz · Final</div>
                <div style={{ marginTop: '4px', fontSize: '9px', color: '#A49692' }}><b style={{ color: '#e4a86a', fontFamily: 'monospace' }}>247</b> entries · ranked by score</div>

                <div style={{ margin: '8px 0 10px', padding: '8px 10px', borderRadius: '8px', background: 'linear-gradient(180deg, rgba(211,140,70,0.14), rgba(211,140,70,0.04))', border: '1px solid rgba(211,140,70,0.32)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#e4a86a', fontWeight: 700 }}>Prize pot</span>
                  <span style={{ fontFamily: 'monospace', fontSize: '18px', fontWeight: 700, color: '#FAF3EB' }}>₹5,500</span>
                </div>

                {[
                  { rk: 1, nm: 'shreya_d', sub: 'Diamond II', sc: '2,418', pr: '₹2,200' },
                  { rk: 2, nm: 'aman.k', sub: 'Diamond I', sc: '2,354', pr: '₹1,100' },
                  { rk: 3, nm: 'ravi98', sub: 'Platinum III', sc: '2,287', pr: '₹700' },
                ].map(r => (
                  <div key={r.rk} style={{ display: 'grid', gridTemplateColumns: '16px 10px 1fr auto auto', alignItems: 'center', gap: '7px', padding: '7px 3px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '9px', color: '#A1B9C5' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#FAF3EB', textAlign: 'right' }}>{r.rk}</span>
                    <span style={{ width: '9px', height: '9px', borderRadius: '3px', background: 'linear-gradient(135deg, #B0FFFA, #5DE0E6)', flexShrink: 0 }} />
                    <span><span style={{ color: '#FAF3EB', fontWeight: 500 }}>{r.nm}</span> <span style={{ color: '#A49692', fontSize: '8px' }}>· {r.sub}</span></span>
                    <span style={{ fontFamily: 'monospace' }}>{r.sc}</span>
                    <span style={{ fontFamily: 'monospace', color: '#e4a86a', fontWeight: 700 }}>{r.pr}</span>
                  </div>
                ))}

                <div style={{ margin: '8px 0 6px', display: 'grid', gridTemplateColumns: '16px 10px 1fr auto auto', alignItems: 'center', gap: '7px', padding: '7px 3px', background: 'rgba(211,140,70,0.10)', border: '1px solid rgba(211,140,70,0.34)', borderRadius: '6px', fontSize: '9px' }}>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#e4a86a', textAlign: 'right' }}>8</span>
                  <span style={{ width: '9px', height: '9px', borderRadius: '3px', background: 'linear-gradient(135deg, #FFD96A, #C28F1D)', flexShrink: 0 }} />
                  <span><span style={{ color: '#FAF3EB', fontWeight: 500 }}>you</span> <span style={{ color: '#A49692', fontSize: '8px' }}>· Gold III</span></span>
                  <span style={{ fontFamily: 'monospace', color: '#A1B9C5' }}>2,034</span>
                  <span style={{ fontFamily: 'monospace', color: '#e4a86a', fontWeight: 700 }}>₹140</span>
                </div>
              </div>
            </div>

            {/* Front phone — Live Quiz (visible on all sizes, centered on mobile) */}
            <div
              className="absolute lg:left-[10px]"
              style={{ width: '240px', transform: 'rotate(-3deg)', borderRadius: '30px', background: '#152229', boxShadow: '0 0 0 1.5px #243842, 0 0 0 6px #07111a, 0 30px 60px -15px rgba(0,0,0,0.7)', overflow: 'hidden', zIndex: 2, top: '80px' }}
            >
              <div style={{ height: '28px', display: 'flex', alignItems: 'center', padding: '8px 18px 0', fontFamily: 'monospace', fontSize: '10px', color: '#A1B9C5', fontWeight: 600 }}>
                <span>9:41</span>
              </div>
              <div style={{ padding: '4px 14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '7px' }}>
                  <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', color: '#A1B9C5' }}>PATHOLOGY · <b style={{ color: '#BA5B47' }}>HARD</b></span>
                  <span style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 700, color: '#FAF3EB' }}>07<span style={{ color: '#A49692', fontWeight: 500 }}> / 15</span></span>
                </div>
                <div style={{ height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', overflow: 'hidden', marginBottom: '8px' }}>
                  <div style={{ width: '47%', height: '100%', background: '#5a92a6' }} />
                </div>

                <div style={{ margin: '2px 0 10px', border: '1px solid rgba(186,91,71,0.30)', background: 'rgba(186,91,71,0.10)', borderRadius: '7px', padding: '6px 9px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#BA5B47', fontWeight: 700 }}>Timer</span>
                  <span style={{ fontFamily: 'monospace', fontSize: '16px', color: '#FAF3EB', fontWeight: 700 }}>00:28</span>
                </div>

                <div style={{ fontSize: '10px', lineHeight: 1.5, fontWeight: 500, color: '#FAF3EB', margin: '2px 0 10px' }}>
                  <span style={{ color: '#A1B9C5', fontWeight: 400, display: 'block', marginBottom: '5px', fontSize: '9.5px' }}>A 58-year-old male, chronic alcohol use, severe epigastric pain radiating to back, elevated lipase.</span>
                  Most likely diagnosis?
                </div>

                {[
                  { k: 'A', t: 'Acute appendicitis', sel: false },
                  { k: 'B', t: 'Acute pancreatitis', sel: true },
                  { k: 'C', t: 'Perforated peptic ulcer', sel: false },
                  { k: 'D', t: 'Acute cholecystitis', sel: false },
                ].map(o => (
                  <div key={o.k} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '7px 9px', background: o.sel ? 'rgba(66,111,128,0.20)' : 'rgba(255,255,255,0.025)', border: `1px solid ${o.sel ? 'rgba(90,146,166,0.65)' : 'rgba(255,255,255,0.06)'}`, borderRadius: '7px', fontSize: '10px', color: o.sel ? '#FAF3EB' : '#f0e6d9', fontWeight: 500, marginBottom: '5px' }}>
                    <span style={{ width: '16px', height: '16px', borderRadius: '50%', border: `1.5px solid ${o.sel ? '#426F80' : 'rgba(161,185,197,0.30)'}`, fontFamily: 'monospace', fontSize: '8px', display: 'grid', placeItems: 'center', color: o.sel ? '#FAF3EB' : '#A1B9C5', flexShrink: 0, fontWeight: 700, background: o.sel ? '#426F80' : 'transparent' }}>{o.k}</span>
                    {o.t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex items-center justify-between flex-wrap gap-3 px-6 sm:px-10 lg:px-16 py-3"
          style={{ borderTop: '1px solid rgba(66,111,128,0.15)', background: 'rgba(10,18,24,0.5)' }}
        >
          <span className="text-xs" style={{ color: '#A49692' }}>
            <span style={{ color: '#FAF3EB' }}>Med</span>
            <span style={{ background: 'linear-gradient(95deg, #D38C46, #BA5B47)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 700 }}>Ascend</span>
            {' '}· Built by a medical student. For medical students.
          </span>
          <div className="flex gap-4 text-[10px] uppercase tracking-wider" style={{ color: '#A1B9C5' }}>
            <span>+10 Correct</span>
            <span style={{ color: '#A49692' }}>−3 Wrong</span>
            <span style={{ color: '#e4a86a' }}>⚡ Speed Bonus</span>
            <span style={{ color: '#BA5B47' }}>🔥 Streak</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%   { box-shadow: 0 0 0 0 rgba(74,222,128,0.55); }
          70%  { box-shadow: 0 0 0 8px rgba(74,222,128,0); }
          100% { box-shadow: 0 0 0 0 rgba(74,222,128,0); }
        }
      `}</style>
    </div>
  )
}
