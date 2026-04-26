import { Link } from 'react-router-dom'
import { Monitor, Phone, Mail, MapPin, MessageCircle } from 'lucide-react'

const WHATSAPP_NUMBER = '22300000000'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center">
                <Monitor size={20} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-white text-base leading-none">TechMali</p>
                <p className="text-xs text-blue-400">Informatique</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Votre boutique informatique de confiance à Bamako. Matériel de qualité, prix compétitifs.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">Navigation</h3>
            <ul className="space-y-2 text-sm">
              {[
                { to: '/', label: 'Accueil' },
                { to: '/catalogue', label: 'Catalogue' },
                { to: '/contact', label: 'Contact' },
                { to: '/a-propos', label: 'À propos' },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-blue-400 shrink-0" />
                <a href="tel:+22300000000" className="hover:text-white transition-colors">+223 00 00 00 00</a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle size={16} className="text-green-400 shrink-0" />
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-blue-400 shrink-0" />
                <a href="mailto:contact@techmali.ml" className="hover:text-white transition-colors">
                  contact@techmali.ml
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-blue-400 shrink-0 mt-0.5" />
                <span>Bamako, Hamdallaye ACI 2000</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} TechMali Informatique. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
