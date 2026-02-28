import Logo from './Logo'

export default function Footer({ theme }) {
  const d = theme === 'dark'
  const cols = [
    {
      title: 'Platform',
      links: [
        { label: 'Study Hub', href: '#study-hub' },
        { label: 'Practice Zone', href: '#practice' },
        { label: 'AI Zone', href: '#ai-zone' },
        { label: 'Flashcards', href: '#more-features' },
        { label: 'Library', href: '#more-features' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'Pain Points', href: '#painpoints' },
        { label: 'Roadmap', href: '#roadmap' },
        { label: 'About', href: '#founder' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'Prometheon AI', href: '#' },
        { label: 'Contact', href: '#' },
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' },
      ],
    },
  ]

  return (
    <footer className={`pt-16 pb-8 ${d ? 'bg-[#0a1218]' : 'bg-dark-surface'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 pb-12 border-b border-teal/10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <Logo size={30} />
              <span className="text-lg font-extrabold tracking-tight">
                <span className="text-cream">Med</span>
                <span className="text-gold-light">Ascend</span>
              </span>
            </div>
            <p className="text-xs text-sky/40 tracking-[3px] uppercase mb-2 font-[family-name:var(--font-family-secondary)]">Rise Through Medicine</p>
            <p className="text-sm text-sky/50 font-[family-name:var(--font-family-secondary)]">Built at KEM. Designed for success.</p>
          </div>

          {cols.map((col, i) => (
            <div key={i}>
              <h4 className="text-sm font-bold text-cream mb-4">{col.title}</h4>
              <div className="flex flex-col gap-2.5">
                {col.links.map((link, j) => (
                  <a key={j} href={link.href} className="text-sm text-sky/50 hover:text-cream transition-colors duration-200 font-[family-name:var(--font-family-secondary)]">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-6 text-center">
          <p className="text-xs text-sky/30 font-[family-name:var(--font-family-secondary)]">
            &copy; 2025 MedAscend. Prometheon Applied Intelligence Pvt. Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
