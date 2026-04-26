import { useState } from 'react'
import { Phone, MessageCircle, Mail, MapPin, Send, CheckCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'

const WHATSAPP_NUMBER = '22300000000'

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const { error: err } = await supabase.from('contact_messages').insert({
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    })

    if (err) {
      setError('Une erreur est survenue. Veuillez réessayer.')
    } else {
      setSent(true)
      setForm({ name: '', phone: '', email: '', message: '' })
    }
    setSubmitting(false)
  }

  return (
    <div className="flex-1 bg-slate-50">
      <div className="bg-white border-b border-slate-200 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Contactez-nous</h1>
          <p className="text-slate-500 text-sm">Nous sommes disponibles pour répondre à toutes vos questions.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-6">Nos coordonnées</h2>

            <div className="space-y-4 mb-8">
              <a
                href="tel:+22300000000"
                className="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                  <Phone size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">Téléphone</p>
                  <p className="text-slate-600 text-sm">+223 00 00 00 00</p>
                  <p className="text-xs text-slate-400 mt-0.5">Lun – Sam, 8h – 18h</p>
                </div>
              </a>

              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Bonjour, je souhaite des informations.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:border-green-300 hover:shadow-sm transition-all"
              >
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                  <MessageCircle size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">WhatsApp</p>
                  <p className="text-slate-600 text-sm">+223 00 00 00 00</p>
                  <p className="text-xs text-slate-400 mt-0.5">Réponse rapide garantie</p>
                </div>
              </a>

              <a
                href="mailto:contact@techmali.ml"
                className="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                  <Mail size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">Email</p>
                  <p className="text-slate-600 text-sm">contact@techmali.ml</p>
                </div>
              </a>

              <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-200">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin size={20} className="text-orange-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">Adresse</p>
                  <p className="text-slate-600 text-sm">Hamdallaye ACI 2000</p>
                  <p className="text-slate-600 text-sm">Bamako, Mali</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-200 h-52 bg-slate-200 flex items-center justify-center">
              <a
                href="https://maps.google.com/?q=Hamdallaye+ACI+2000+Bamako+Mali"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-2"
              >
                <MapPin size={16} />
                Voir sur Google Maps
              </a>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-6">Envoyez-nous un message</h2>

            {sent ? (
              <div className="flex flex-col items-center justify-center text-center bg-white rounded-xl border border-green-200 p-10">
                <CheckCircle size={48} className="text-green-500 mb-4" />
                <h3 className="font-bold text-slate-900 text-lg mb-2">Message envoyé !</h3>
                <p className="text-slate-500 text-sm mb-6">Nous vous répondrons dans les plus brefs délais.</p>
                <button
                  onClick={() => setSent(false)}
                  className="text-blue-600 hover:underline text-sm font-medium"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nom complet *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Votre nom"
                    className="w-full border border-slate-200 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Téléphone *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="+223 XX XX XX XX"
                    className="w-full border border-slate-200 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email (optionnel)</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="votre@email.com"
                    className="w-full border border-slate-200 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Décrivez votre demande..."
                    className="w-full border border-slate-200 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none"
                  />
                </div>
                {error && (
                  <p className="text-red-600 text-xs bg-red-50 px-3 py-2 rounded-lg">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
                >
                  {submitting ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                  {submitting ? 'Envoi en cours...' : 'Envoyer le message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}