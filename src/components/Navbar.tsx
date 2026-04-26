import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, Monitor, Phone } from 'lucide-react'

const WHATSAPP_NUMBER = '22300000000'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const links = [
    { to: '/', label: 'Accueil' },
    { to: '/catalogue', label: 'Catalogue' },
    { to: '/contact', label: 'Contact' },
    { to: '/a-propos', label: 'À propos' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <Monitor size={20} className="text-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-slate-900 text-base leading-none">TechMali</span>
              <span className="text-xs text-blue-600 font-medium">Informatique</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              <Phone size={16} />
              WhatsApp
            </a>
          </div>

          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white">
          <nav className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1">
            {links.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 mt-2 bg-green-500 text-white text-sm font-semibold px-4 py-3 rounded-lg"
            >
              <Phone size={16} />
              Contacter sur WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
