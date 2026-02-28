import { MessageCircle, Users, Camera, FileText, FileQuestion, Layers, Lightbulb, UserRound, Headphones, ShieldCheck, CheckCircle } from 'lucide-react'

const aiTools = [
  { icon: MessageCircle, label: 'AI Chat Tutor' },
  { icon: Users, label: '19 Subject Bots' },
  { icon: Camera, label: 'Snap & Ask' },
  { icon: FileText, label: 'Content Summarizer' },
  { icon: FileQuestion, label: 'MCQ Generator' },
  { icon: Layers, label: 'Flashcard Generator' },
  { icon: Lightbulb, label: 'Mnemonic Creator' },
  { icon: UserRound, label: 'Patient Simulator' },
  { icon: Headphones, label: 'Audio Overview' },
]

export default function AIZone({ theme }) {
  const d = theme === 'dark'
  return (
    <section id="ai-zone" className={`py-24 lg:py-32 ${d ? 'bg-dark-card' : 'bg-cream-dark'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className={`text-[11px] font-semibold tracking-[5px] uppercase mb-4 block ${d ? 'text-teal-light' : 'text-teal'}`}>AI ZONE</span>
            <h2 className={`text-[clamp(28px,4vw,44px)] font-extrabold tracking-tight leading-[1.15] mb-4 ${d ? 'text-cream' : 'text-dark'}`}>
              Context That Generic AI <span className="text-gradient">Cannot Touch</span>
            </h2>
            <p className={`font-[family-name:var(--font-family-secondary)] text-base mb-8 ${d ? 'text-sky/70' : 'text-teal-deep/60'}`}>
              ChatGPT hallucinates. It invents facts. MedAscend's AI is different — responses shaped by actual subject context, not probabilistic guessing.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {aiTools.map((t, i) => (
                <div key={i} className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl transition-all duration-200 cursor-default
                  ${d ? 'bg-dark-surface/50 border border-teal/8 hover:border-teal/20' : 'bg-white border border-teal/6 hover:border-teal/12 shadow-sm'}`}>
                  <t.icon size={16} className="text-teal shrink-0" />
                  <span className={`text-[13px] font-semibold ${d ? 'text-cream/80' : 'text-dark/80'}`}>{t.label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                ${d ? 'bg-teal/10 text-teal-light' : 'bg-teal/8 text-teal'}`}>
                <ShieldCheck size={16} /> Bounded Expertise
              </div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                ${d ? 'bg-teal/10 text-teal-light' : 'bg-teal/8 text-teal'}`}>
                <CheckCircle size={16} /> Verified Responses
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="phone-frame w-[260px] sm:w-[280px]">
              <img src="/stitch/ai_zone_graphic/screen.png" alt="AI Zone" className="w-full" loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
