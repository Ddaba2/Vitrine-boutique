import { Link } from 'react-router-dom'
import { MessageCircle, Phone } from 'lucide-react'
import { resolveLocalProductImagePath } from '../lib/productImages'
import { resolveProductImageUrl, type Product } from '../lib/supabase'

const WHATSAPP_NUMBER = '22300000000'

function formatPrice(price: number) {
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
}

function buildWhatsAppMessage(product: Product) {
  return encodeURIComponent(
    `Bonjour, je suis intéressé(e) par le produit : ${product.name} (${formatPrice(product.price)}). Est-il disponible ?`
  )
}

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const imageSrc =
    resolveLocalProductImagePath(product) || resolveProductImageUrl(product.image_url)

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
      <Link to={`/produit/${product.id}`} className="block aspect-[4/3] overflow-hidden bg-slate-100">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M8 21h8M12 17v4" />
            </svg>
          </div>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <Link to={`/produit/${product.id}`} className="font-semibold text-slate-900 hover:text-blue-600 transition-colors text-sm leading-snug flex-1">
            {product.name}
          </Link>
        </div>

        {product.brand && (
          <p className="text-xs text-slate-400 mb-2">{product.brand}</p>
        )}

        <div className="flex items-center gap-2 mb-3 mt-auto pt-2">
          <span className="font-bold text-blue-700 text-base">{formatPrice(product.price)}</span>
          <span className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full ${
            product.available
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-600'
          }`}>
            {product.available ? 'Disponible' : 'Épuisé'}
          </span>
        </div>

        <div className="flex gap-2">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppMessage(product)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold py-2 rounded-lg transition-colors"
          >
            <MessageCircle size={14} />
            Commander
          </a>
          <a
            href="tel:+22300000000"
            className="flex items-center justify-center gap-1.5 border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-600 hover:text-blue-700 text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
          >
            <Phone size={14} />
          </a>
        </div>
      </div>
    </div>
  )
}
