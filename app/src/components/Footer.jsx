import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, X } from 'lucide-react'
import Logo from './Logo'

export default function Footer() {
  const [showContact, setShowContact] = useState(false)

  return (
    <footer className="pt-16 pb-8 bg-[#0a1218]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 pb-12 border-b border-teal/10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4 no-underline">
              <Logo size={28} />
              <span className="text-lg font-extrabold tracking-tight">
                <span className="text-cream">Med</span><span className="text-gold-light">Ascend</span>
              </span>
            </Link>
            <p className="text-sm text-sky/50 font-family-secondary leading-relaxed">
              Built by a medical student.<br />For medical students.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-bold text-cream mb-4 uppercase tracking-widest">Platform</h4>
            <div className="flex flex-col gap-3">
              <Link to="/features" className="text-sm text-sky/50 hover:text-cream transition-colors duration-200 font-family-secondary">Features</Link>
              <Link to="/features#practise" className="text-sm text-sky/50 hover:text-cream transition-colors duration-200 font-family-secondary">Practice</Link>
              <Link to="/features#ai-zone" className="text-sm text-sky/50 hover:text-cream transition-colors duration-200 font-family-secondary">AI Zone</Link>
              <Link to="/features#community" className="text-sm text-sky/50 hover:text-cream transition-colors duration-200 font-family-secondary">Community</Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-bold text-cream mb-4 uppercase tracking-widest">Resources</h4>
            <div className="flex flex-col gap-3">
              <Link to="/features" className="text-sm text-sky/50 hover:text-cream transition-colors duration-200 font-family-secondary">Features</Link>
              <Link to="/help" className="text-sm text-sky/50 hover:text-cream transition-colors duration-200 font-family-secondary">Tell Us Your Problem</Link>
              <Link to="/join" className="text-sm text-sky/50 hover:text-cream transition-colors duration-200 font-family-secondary">Join Us</Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-bold text-cream mb-4 uppercase tracking-widest">Company</h4>
            <div className="flex flex-col gap-3">
              <a
                href="https://theprometheonai.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-sky/50 hover:text-cream transition-colors duration-200 font-family-secondary"
              >
                Prometheon Applied Intelligence
              </a>
              <button
                onClick={() => setShowContact(!showContact)}
                className="text-sm text-sky/50 hover:text-cream transition-colors duration-200 font-family-secondary text-left bg-transparent border-none cursor-pointer p-0"
              >
                Contact
              </button>
              {showContact && (
                <div className="p-3 rounded-xl border border-teal/15 bg-dark-surface/80 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-cream">Get in touch</span>
                    <button onClick={() => setShowContact(false)} className="text-sky/40 hover:text-cream bg-transparent border-none cursor-pointer p-0">
                      <X size={14} />
                    </button>
                  </div>
                  <a href="mailto:info@theprometheonai.com" className="inline-flex items-center gap-2 text-sm text-teal-light hover:text-cream transition-colors font-family-secondary">
                    <Mail size={14} /> info@theprometheonai.com
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-6 text-center">
          <p className="text-xs text-sky/30 font-family-secondary">
            &copy; 2026 MedAscend. A product of Prometheon Applied Intelligence Pvt. Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
