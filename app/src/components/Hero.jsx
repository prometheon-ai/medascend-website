import { Link } from 'react-router-dom'
import { Rocket, ArrowDown, Brain, Bot, GraduationCap, Flame, ShieldCheck, Target, Layers, BarChart3, Sparkles, BookOpen, Stethoscope } from 'lucide-react'

export default function Hero({ theme, onEarlyAccess }) {
  const d = theme === 'dark'
  return (
    <section id="hero" className={`relative min-h-screen flex items-center pt-[68px] overflow-hidden
      ${d ? 'bg-dark' : 'bg-cream'}`}>

      {/* BG effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute w-[500px] h-[500px] rounded-full blur-[120px] top-[10%] right-[-10%] animate-orb
          ${d ? 'bg-teal/12' : 'bg-teal/8'}`} />
        <div className={`absolute w-[400px] h-[400px] rounded-full blur-[100px] bottom-[20%] left-[-5%] animate-orb
          ${d ? 'bg-terracotta/8' : 'bg-terracotta/6'}`} style={{ animationDelay: '3s' }} />
        <div className={`absolute w-[300px] h-[300px] rounded-full blur-[80px] top-[50%] left-[40%] animate-orb
          ${d ? 'bg-gold/6' : 'bg-gold/5'}`} style={{ animationDelay: '5s' }} />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: `radial-gradient(${d ? 'rgba(66,111,128,0.15)' : 'rgba(66,111,128,0.08)'} 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center relative z-10 py-16 lg:py-0">
        {/* Content */}
        <div className="animate-fade-up">
          <div className="mb-8 flex flex-col items-start gap-2">
            <span className="text-[clamp(40px,5vw,56px)] font-extrabold tracking-tight leading-none">
              <span className={d ? 'text-cream' : 'text-teal'}>Med</span>
              <span className={d ? 'text-gold-light' : 'text-terracotta'}>Ascend</span>
            </span>
            <span className={`text-sm sm:text-base font-medium tracking-[1.5px] uppercase
              ${d ? 'text-teal-light' : 'text-teal'}`}>
              The Medical Education Revolution
            </span>
          </div>
          
            
          <h1 className="mb-5">
            <span className={`block text-[clamp(20px,2.5vw,32px)] font-extrabold tracking-[-0.03em] leading-[1.2]
              ${d ? 'text-cream' : 'text-dark'}`}>
              Built by a Medical Student,
            </span>
            <span className="block text-[clamp(20px,2.5vw,32px)] font-extrabold tracking-[-0.03em] leading-[1.2] text-gradient mt-1">
              For Medical Students .
            </span>
          </h1>

          <p className={`font-[family-name:var(--font-family-secondary)] text-[16px] leading-relaxed max-w-[500px] mb-8
            ${d ? 'text-sky/80' : 'text-teal-deep/70'}`}>
            The ultimate active recall and AI-driven companion for your medical journey.
            No more passive video fatigue. No more scattered resources. One platform. Complete comprehension.
          </p>

          <div className="flex flex-wrap gap-3 mb-8">
            <Link to="/features" className={`inline-flex items-center gap-2 px-7 py-3.5 font-semibold text-[15px] rounded-xl border transition-all duration-300 hover:-translate-y-0.5
              ${d ? 'border-teal/20 text-cream hover:bg-teal/8' : 'border-teal/15 text-dark hover:bg-teal/5'}`}>
              <ArrowDown size={18} /> Explore Features
            </Link>
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              { icon: Brain, label: 'Active Recall' },
              { icon: Bot, label: 'AI-Powered' },
              { icon: GraduationCap, label: 'NEET-PG Ready' },
            ].map(t => (
              <span key={t.label} className={`inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-full backdrop-blur-sm
                ${d ? 'bg-dark-surface/60 border border-teal/12 text-sky/70' : 'bg-white/60 border border-teal/8 text-teal-deep/60'}`}>
                <t.icon size={14} className="text-teal-light" /> {t.label}
              </span>
            ))}
          </div>
        </div>

        {/* Visual */}
        <div className="relative flex justify-center animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <div className={`phone-frame w-[220px] sm:w-[240px] relative z-10`}>
            <img src="/stitch/medascend_home_dashboard/screen.png" alt="MedAscend App" className="w-full" />
          </div>

          {/* Floating cards */}
          <div className={`absolute top-[12%] left-[-15px] sm:left-[-35px] flex items-center gap-2.5 px-4 py-3 rounded-xl z-20 backdrop-blur-xl animate-float
            ${d ? 'bg-dark-surface/70 border border-teal/15 shadow-xl' : 'bg-white/80 border border-teal/10 shadow-lg'}`}>
            <Flame size={20} className="text-terracotta" />
            <div className="hidden sm:block">
              <span className={`block text-[11px] font-medium ${d ? 'text-stone' : 'text-stone'}`}>Memory Forge</span>
              <span className={`block text-sm font-bold ${d ? 'text-cream' : 'text-dark'}`}>Active Recall</span>
            </div>
          </div>

          <div className={`absolute bottom-[35%] right-[-15px] sm:right-[-45px] flex items-center gap-2.5 px-4 py-3 rounded-xl z-20 backdrop-blur-xl animate-float-delayed
            ${d ? 'bg-dark-surface/70 border border-teal/15 shadow-xl' : 'bg-white/80 border border-teal/10 shadow-lg'}`}>
            <ShieldCheck size={20} className="text-teal" />
            <div className="hidden sm:block">
              <span className={`block text-[11px] font-medium ${d ? 'text-stone' : 'text-stone'}`}>AI Accuracy</span>
              <span className={`block text-sm font-bold ${d ? 'text-cream' : 'text-dark'}`}>Verified</span>
            </div>
          </div>

          <div className={`absolute bottom-[8%] left-[0px] sm:left-[-20px] flex items-center gap-2.5 px-4 py-3 rounded-xl z-20 backdrop-blur-xl animate-float
            ${d ? 'bg-dark-surface/70 border border-teal/15 shadow-xl' : 'bg-white/80 border border-teal/10 shadow-lg'}`} style={{ animationDelay: '2s' }}>
            <Target size={20} className="text-gold" />
            <div className="hidden sm:block">
              <span className={`block text-[11px] font-medium ${d ? 'text-stone' : 'text-stone'}`}>Practice Zone</span>
              <span className={`block text-sm font-bold ${d ? 'text-cream' : 'text-dark'}`}>QBank & Mocks</span>
            </div>
          </div>

          <div className={`absolute top-[8%] right-[-10px] sm:right-[-25px] flex items-center gap-2.5 px-4 py-3 rounded-xl z-20 backdrop-blur-xl animate-float-delayed
            ${d ? 'bg-dark-surface/70 border border-teal/15 shadow-xl' : 'bg-white/80 border border-teal/10 shadow-lg'}`} style={{ animationDelay: '1s' }}>
            <Bot size={20} className="text-teal-light" />
            <div className="hidden sm:block">
              <span className={`block text-[11px] font-medium ${d ? 'text-stone' : 'text-stone'}`}>19 Subjects</span>
              <span className={`block text-sm font-bold ${d ? 'text-cream' : 'text-dark'}`}>AI Tutors</span>
            </div>
          </div>

          <div className={`absolute top-[45%] left-[-20px] sm:left-[-55px] flex items-center gap-2.5 px-4 py-3 rounded-xl z-20 backdrop-blur-xl animate-float
            ${d ? 'bg-dark-surface/70 border border-teal/15 shadow-xl' : 'bg-white/80 border border-teal/10 shadow-lg'}`} style={{ animationDelay: '1.5s' }}>
            <Layers size={20} className="text-gold-light" />
            <div className="hidden sm:block">
              <span className={`block text-[11px] font-medium ${d ? 'text-stone' : 'text-stone'}`}>Smart Retry</span>
              <span className={`block text-sm font-bold ${d ? 'text-cream' : 'text-dark'}`}>Spaced Rep</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <div className="w-px h-10 bg-gradient-to-b from-teal-light to-transparent animate-scroll-line" />
        <span className={`text-[10px] tracking-[3px] uppercase ${d ? 'text-stone/50' : 'text-stone/70'}`}>Scroll to explore</span>
      </div>
    </section>
  )
}
