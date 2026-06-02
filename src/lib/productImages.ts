import type { Product } from './supabase'
import availableImages from '../generated/product-images.json'

const IMAGE_FILES = availableImages as string[]
const IMAGE_BY_LOWER = new Map(IMAGE_FILES.map((file) => [file.toLowerCase(), file]))
const IMAGE_SET = new Set(IMAGE_BY_LOWER.keys())

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'jfif', 'webp', 'avif', 'gif', 'png'] as const

export function getAvailableProductImageFilenames(): string[] {
  return IMAGE_FILES
}

export function imageFilenameFromUrl(imageUrl?: string | null): string | null {
  if (!imageUrl) return null
  const withoutQuery = imageUrl.split('?')[0]
  const filename = withoutQuery.split('/').pop()
  return filename ? filename.toLowerCase() : null
}

function slugifyProductName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function normalizeForMatch(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-z0-9]/g, '')
}

function publicPath(filename: string): string {
  return `/products/${filename}`
}

function isGeneratedPlaceholder(filename: string): boolean {
  return /^[a-z0-9]+(-[a-z0-9]+)+\.png$/i.test(filename)
}

function pickPreferredImage(files: string[]): string {
  const rank = (file: string) => {
    const ext = file.split('.').pop()?.toLowerCase() ?? ''
    const idx = IMAGE_EXTENSIONS.indexOf(ext as (typeof IMAGE_EXTENSIONS)[number])
    const placeholderPenalty = isGeneratedPlaceholder(file) ? 100 : 0
    return (idx === -1 ? IMAGE_EXTENSIONS.length : idx) + placeholderPenalty
  }
  return [...files].sort((a, b) => rank(a) - rank(b))[0]
}

function filesForProduct(product: Product): string[] {
  const nameKey = normalizeForMatch(product.name)
  const byName = IMAGE_FILES.filter((file) => normalizeForMatch(file) === nameKey)
  if (byName.length > 0) return byName

  const slug = slugifyProductName(product.name)
  return IMAGE_FILES.filter((file) => {
    const base = file.toLowerCase().replace(/\.[^.]+$/, '')
    return base === slug
  })
}

/** Chemin public `/products/...` si un fichier correspond, sinon null. */
export function resolveLocalProductImagePath(product: Product): string | null {
  const matches = filesForProduct(product)
  if (matches.length > 0) {
    return publicPath(pickPreferredImage(matches))
  }

  const fromUrl = imageFilenameFromUrl(product.image_url)
  if (fromUrl && IMAGE_SET.has(fromUrl) && !isGeneratedPlaceholder(fromUrl)) {
    return publicPath(IMAGE_BY_LOWER.get(fromUrl)!)
  }

  return null
}

export function productHasLocalImage(product: Product): boolean {
  return resolveLocalProductImagePath(product) !== null
}

/** Un seul produit par nom (garde le plus récent). */
export function dedupeProductsByName(products: Product[]): Product[] {
  const byName = new Map<string, Product>()

  for (const product of products) {
    const key = product.name.trim().toLowerCase()
    const existing = byName.get(key)
    if (!existing) {
      byName.set(key, product)
      continue
    }
    const existingDate = new Date(existing.created_at).getTime()
    const currentDate = new Date(product.created_at).getTime()
    if (currentDate >= existingDate) {
      byName.set(key, product)
    }
  }

  return Array.from(byName.values())
}

function dedupeProductsByImagePath(products: Product[]): Product[] {
  const byImage = new Map<string, Product>()

  for (const product of products) {
    const localPath = resolveLocalProductImagePath(product)
    if (!localPath) continue

    const key = localPath.toLowerCase()
    const existing = byImage.get(key)
    if (!existing) {
      byImage.set(key, product)
      continue
    }
    const existingDate = new Date(existing.created_at).getTime()
    const currentDate = new Date(product.created_at).getTime()
    if (currentDate >= existingDate) {
      byImage.set(key, product)
    }
  }

  return Array.from(byImage.values())
}

export function filterProductsWithLocalImages(products: Product[]): Product[] {
  return dedupeProductsByImagePath(
    dedupeProductsByName(products)
      .filter(productHasLocalImage)
      .map((product) => {
        const localPath = resolveLocalProductImagePath(product)!
        if (product.image_url === localPath) return product
        return { ...product, image_url: localPath }
      }),
  )
}
