import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Monitor, Printer, Headphones, Smartphone, Phone, MessageCircle, Star, Shield, Truck } from 'lucide-react'
import { supabase, type Product } from '../lib/supabase'
import ProductCard from '../components/ProductCard'

const WHATSAPP_NUMBER = '22300000000'

const categories = [
  { label: 'Ordinateurs', slug: 'ordinateurs', icon: Monitor, color: 'bg-blue-50 text-blue-600' },
  { label: 'Imprimantes', slug: 'imprimantes', icon: Printer, color: 'bg-orange-50 text-orange-600' },
  { label: 'Accessoires', slug: 'accessoires', icon: Headphones, color: 'bg-slate-50 text-slate-600' },
  { label: 'Téléphones', slug: 'telephones', icon: Smartphone, color: 'bg-green-50 text-green-600' },
]

const features = [
  { icon: Shield, title: 'Produits garantis', desc: 'Tous nos produits sont garantis et de qualité certifiée.' },
  { icon: Star, title: 'Meilleurs prix', desc: 'Prix compétitifs adaptés au marché malien.' },
  { icon: Truck, title: 'Service rapide', desc: 'Livraison et disponibilité à Bamako et environs.' },
  { icon: Phone, title: 'Support client', desc: 'Équipe disponible par téléphone et WhatsApp.' },
]

export default function Home() {
  const [popularProducts, setPopularProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('products')
      .select('*, categories(id, name, slug)')
      .eq('popular', true)
      .limit(4)
      .then(({ data }) => {
        setPopularProducts(data || [])
        setLoading(false)
      })
  }, [])

  return (
    <div className="flex-1">
      <section className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-blue-300 blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-2xl">
            <span className="inline-block bg-blue-500/40 text-blue-100 text-xs font-semibold px-3 py-1 rounded-full mb-4 border border-blue-400/30">
              Boutique #1 à Bamako
            </span>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
              Votre Matériel Informatique<br />
              <span className="text-blue-200">de Confiance au Mali</span>
            </h1>
            <p className="text-blue-100 text-base md:text-lg leading-relaxed mb-8">
              Ordinateurs, imprimantes, accessoires et téléphones. Qualité garantie, prix adaptés, livraison rapide à Bamako.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/catalogue"
                className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-sm"
              >
                Voir le catalogue
                <ArrowRight size={18} />
              </Link>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Bonjour, je souhaite des informations sur vos produits.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                <MessageCircle size={18} />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Nos catégories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map(cat => {
            const Icon = cat.icon
            return (
              <Link
                key={cat.slug}
                to={`/catalogue?categorie=${cat.slug}`}
                className="flex flex-col items-center gap-3 p-5 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all bg-white"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cat.color}`}>
                  <Icon size={24} />
                </div>
                <span className="text-sm font-semibold text-slate-700">{cat.label}</span>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="bg-slate-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Produits populaires</h2>
            <Link to="/catalogue" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
              Voir tout <ArrowRight size={16} />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse">
                  <div className="aspect-[4/3] bg-slate-200" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                    <div className="h-4 bg-slate-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {popularProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-xl font-bold text-slate-900 text-center mb-8">Pourquoi choisir TechMali ?</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {features.map(f => {
            const Icon = f.icon
            return (
              <div key={f.title} className="text-center p-6 rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon size={22} className="text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2 text-sm">{f.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="bg-blue-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-3">Besoin d'aide pour choisir ?</h2>
          <p className="text-blue-100 mb-6 text-sm">Notre équipe est disponible pour vous conseiller via WhatsApp ou téléphone.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              <MessageCircle size={18} />
              Nous écrire sur WhatsApp
            </a>
            <a
              href="tel:+22300000000"
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold px-6 py-3 rounded-xl transition-colors border border-white/30"
            >
              <Phone size={18} />
              Appeler maintenant
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
