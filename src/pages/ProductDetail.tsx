import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MessageCircle, Phone, ArrowLeft, Tag, CheckCircle, XCircle } from 'lucide-react'
import { supabase, type Product } from '../lib/supabase'

const WHATSAPP_NUMBER = '22300000000'

function formatPrice(price: number) {
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return
    supabase
      .from('products')
      .select('*, categories(id, name, slug)')
      .eq('id', id)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) setNotFound(true)
        else setProduct(data)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div className="flex-1 max-w-6xl mx-auto px-4 py-10 animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-32 mb-8" />
        <div className="grid md:grid-cols-2 gap-10">
          <div className="aspect-square bg-slate-200 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-6 bg-slate-200 rounded w-3/4" />
            <div className="h-4 bg-slate-200 rounded w-1/3" />
            <div className="h-8 bg-slate-200 rounded w-1/2" />
            <div className="h-24 bg-slate-200 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (notFound || !product) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
        <p className="text-2xl font-bold text-slate-800 mb-2">Produit introuvable</p>
        <p className="text-slate-500 mb-6 text-sm">Ce produit n'existe pas ou a été supprimé.</p>
        <Link to="/catalogue" className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">
          <ArrowLeft size={18} />
          Retour au catalogue
        </Link>
      </div>
    )
  }

  const whatsappMsg = encodeURIComponent(
    `Bonjour, je suis intéressé(e) par : ${product.name} (${formatPrice(product.price)}). Est-il disponible ?`
  )

  return (
    <div className="flex-1 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link to="/catalogue" className="hover:text-blue-600 flex items-center gap-1">
            <ArrowLeft size={16} />
            Catalogue
          </Link>
          <span>/</span>
          {product.categories && (
            <>
              <Link to={`/catalogue?categorie=${product.categories.slug}`} className="hover:text-blue-600">
                {product.categories.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-slate-700 truncate max-w-xs">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <path d="M8 21h8M12 17v4" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              {product.categories && (
                <Link
                  to={`/catalogue?categorie=${product.categories.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full hover:bg-blue-100 transition-colors"
                >
                  <Tag size={12} />
                  {product.categories.name}
                </Link>
              )}
              <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                product.available
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-600'
              }`}>
                {product.available
                  ? <><CheckCircle size={12} /> Disponible</>
                  : <><XCircle size={12} /> Épuisé</>
                }
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{product.name}</h1>

            {product.brand && (
              <p className="text-slate-500 text-sm mb-4">Marque : <span className="font-medium text-slate-700">{product.brand}</span></p>
            )}

            <div className="bg-blue-50 rounded-xl px-4 py-3 mb-6 inline-flex items-baseline gap-2">
              <span className="text-3xl font-bold text-blue-700">{formatPrice(product.price)}</span>
            </div>

            {product.description && (
              <div className="mb-6">
                <h2 className="font-semibold text-slate-800 mb-2 text-sm">Description</h2>
                <p className="text-slate-600 text-sm leading-relaxed">{product.description}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mt-auto">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
              >
                <MessageCircle size={20} />
                Commander sur WhatsApp
              </a>
              <a
                href="tel:+22300000000"
                className="flex items-center justify-center gap-2 border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-semibold py-3.5 px-6 rounded-xl transition-colors text-sm"
              >
                <Phone size={20} />
                Appeler
              </a>
            </div>

            <p className="text-xs text-slate-400 mt-4 text-center">
              Répondez via WhatsApp pour confirmer la disponibilité et la livraison.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
