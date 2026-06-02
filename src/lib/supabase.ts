import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const productImagesBucket = import.meta.env.VITE_SUPABASE_PRODUCT_IMAGES_BUCKET || 'products'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/** true = images dans public/products/ (Vercel). false = bucket Supabase Storage. */
const useLocalProductImages =
  import.meta.env.VITE_USE_LOCAL_PRODUCT_IMAGES === 'true'

export function resolveProductImageUrl(imageUrl?: string | null): string {
  if (!imageUrl) return ''

  if (imageUrl.startsWith('data:') || /^https?:\/\//i.test(imageUrl)) {
    return imageUrl
  }

  // Fichiers statiques : public/products/ → /products/nom.png
  if (
    useLocalProductImages ||
    imageUrl.startsWith('/products/') ||
    /^products\/[^/]+\.(png|jpe?g|webp|gif|jfif|avif)$/i.test(imageUrl)
  ) {
    return imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`
  }

  // Sinon : chemin dans le bucket Supabase (ex. products/dell-latitude-5420.png)
  const sanitized = imageUrl.replace(/^\/+/, '')
  const pathInBucket = sanitized.startsWith(`${productImagesBucket}/`)
    ? sanitized.slice(productImagesBucket.length + 1)
    : sanitized.startsWith('products/')
      ? sanitized.slice('products/'.length)
      : sanitized

  const { data } = supabase.storage.from(productImagesBucket).getPublicUrl(pathInBucket)
  return data.publicUrl
}

export interface Category {
  id: string
  name: string
  slug: string
  created_at: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category_id: string | null
  brand: string
  image_url: string
  available: boolean
  popular: boolean
  created_at: string
  categories?: Category
}
