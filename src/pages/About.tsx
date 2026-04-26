import { Link } from 'react-router-dom'
import { Shield, Star, Users, Award, MapPin, Phone, MessageCircle, ArrowRight } from 'lucide-react'

const WHATSAPP_NUMBER = '22300000000'

const values = [
  { icon: Shield, title: 'Confiance', desc: 'Nous sélectionnons rigoureusement nos produits pour garantir leur qualité et leur durabilité.' },
  { icon: Star, title: 'Qualité', desc: 'Toutes nos références proviennent de marques reconnues mondialement (HP, Dell, Canon, Samsung…).' },
  { icon: Users, title: 'Service', desc: 'Notre équipe vous accompagne avant, pendant et après votre achat, sans frais supplémentaires.' },
  { icon: Award, title: 'Expertise', desc: 'Plus de 5 ans d\'expérience dans le marché informatique malien au service de nos clients.' },
]

const stats = [
  { value: '500+', label: 'Clients satisfaits' },
  { value: '200+', label: 'Produits disponibles' },
  { value: '5 ans', label: 'D\'expérience' },
  { value: 'Bamako', label: 'Basé au Mali' },
]

export default function About() {
  return (
    <div className="flex-1">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">À propos de TechMali</h1>
            <p className="text-slate-300 text-base leading-relaxed">
              TechMali Informatique est une boutique spécialisée dans la vente de matériel informatique à Bamako.
              Depuis 2019, nous aidons les particuliers, étudiants et entreprises à s'équiper en technologies fiables.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-600 py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white text-center">
            {stats.map(s => (
              <div key={s.label}>
                <p className="text-3xl font-bold mb-1">{s.value}</p>
                <p className="text-blue-100 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-14">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Notre histoire</h2>
            <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
              <p>
                TechMali a été fondée en 2019 avec une mission claire : rendre le matériel informatique de qualité
                accessible à tous les Maliens, à des prix justes et compétitifs.
              </p>
              <p>
                Face à une demande croissante en matière de technologies, nous avons développé un catalogue
                diversifié comprenant ordinateurs portables, ordinateurs de bureau, imprimantes, smartphones
                et accessoires informatiques.
              </p>
              <p>
                Aujourd'hui, nous sommes fiers de servir des centaines de clients à Bamako et dans les régions,
                en offrant un service de conseil personnalisé et une expérience d'achat simple via WhatsApp
                et notre site web.
              </p>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Équipe TechMali"
              className="rounded-2xl w-full object-cover aspect-[4/3]"
            />
            <div className="absolute -bottom-4 -left-4 bg-blue-600 text-white rounded-xl px-5 py-3 shadow-lg">
              <p className="font-bold text-lg">Depuis 2019</p>
              <p className="text-blue-100 text-xs">À votre service</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 py-14">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">Nos valeurs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(v => {
              const Icon = v.icon
              return (
                <div key={v.title} className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-md hover:border-blue-200 transition-all">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                    <Icon size={22} className="text-blue-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{v.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-14">
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Nous trouver</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-800 text-sm">Adresse</p>
                  <p className="text-slate-600 text-sm">Hamdallaye ACI 2000, Bamako, Mali</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={20} className="text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-800 text-sm">Téléphone</p>
                  <a href="tel:+22300000000" className="text-blue-600 hover:underline text-sm">+223 00 00 00 00</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MessageCircle size={20} className="text-green-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-800 text-sm">WhatsApp</p>
                  <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline text-sm">
                    +223 00 00 00 00
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-6 bg-slate-100 rounded-xl p-4">
              <p className="text-sm font-semibold text-slate-700 mb-1">Horaires d'ouverture</p>
              <div className="text-sm text-slate-600 space-y-1">
                <div className="flex justify-between"><span>Lundi – Vendredi</span><span>8h00 – 18h00</span></div>
                <div className="flex justify-between"><span>Samedi</span><span>9h00 – 16h00</span></div>
                <div className="flex justify-between text-slate-400"><span>Dimanche</span><span>Fermé</span></div>
              </div>
            </div>
          </div>

          <div className="bg-blue-600 rounded-2xl p-8 text-white flex flex-col justify-center">
            <h3 className="text-xl font-bold mb-3">Prêt à équiper votre espace ?</h3>
            <p className="text-blue-100 text-sm mb-6">
              Découvrez notre catalogue ou contactez-nous directement pour un conseil personnalisé.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                to="/catalogue"
                className="flex items-center justify-center gap-2 bg-white text-blue-700 font-semibold py-3 rounded-xl hover:bg-blue-50 transition-colors text-sm"
              >
                Voir le catalogue
                <ArrowRight size={16} />
              </Link>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                <MessageCircle size={16} />
                Contacter sur WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
