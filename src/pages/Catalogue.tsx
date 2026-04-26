import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { supabase, type Product, type Category } from '../lib/supabase'
import ProductCard from '../components/ProductCard'

export default function Catalogue() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const categoryParam = searchParams.get('categorie') || ''
  const brandParam = searchParams.get('marque') || ''
  const maxPriceParam = searchParams.get('prix') || ''

  const brands = [...new Set(products.map(p => p.brand).filter(Boolean))]

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    let query = supabase
      .from('products')
      .select('*, categories(id, name, slug)')
      .order('created_at', { ascending: false })

    if (categoryParam) {
      const cat = categories.find(c => c.slug === categoryParam)
      if (cat) query = query.eq('category_id', cat.id)
    }

    if (brandParam) {
      query = query.eq('brand', brandParam)
    }

    if (maxPriceParam) {
      query = query.lte('price', Number(maxPriceParam))
    }

    const { data } = await query
    setProducts(data || [])
    setLoading(false)
  }, [categoryParam, brandParam, maxPriceParam, categories])

  useEffect(() => {
    supabase.from('categories').select('*').then(({ data }) => {
      setCategories(data || [])
    })
  }, [])

  useEffect(() => {
    if (categories.length > 0 || !categoryParam) {
      fetchProducts()
    }
  }, [fetchProducts, categories.length, categoryParam])

  const filteredProducts = search
    ? products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase())
      )
    : products

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next)
  }

  function clearFilters() {
    setSearchParams(new URLSearchParams())
    setSearch('')
  }

  const hasFilters = categoryParam || brandParam || maxPriceParam || search

  const priceRanges = [
    { label: 'Tous les prix', value: '' },
    { label: 'Moins de 50 000 FCFA', value: '50000' },
    { label: 'Moins de 100 000 FCFA', value: '100000' },
    { label: 'Moins de 250 000 FCFA', value: '250000' },
    { label: 'Moins de 500 000 FCFA', value: '500000' },
  ]

  return (
    <div className="flex-1 bg-slate-50 min-h-screen">
      <div className="bg-white border-b border-slate-200 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Catalogue</h1>
          <p className="text-slate-500 text-sm">
            {loading ? '...' : `${filteredProducts.length} produit${filteredProducts.length !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Rechercher un produit, une marque..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white"
            />
          </div>
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
              filtersOpen || hasFilters
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
            }`}
          >
            <SlidersHorizontal size={16} />
            <span className="hidden sm:inline">Filtres</span>
            {hasFilters && (
              <span className="w-2 h-2 rounded-full bg-blue-600" />
            )}
          </button>
        </div>

        {filtersOpen && (
          <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Catégorie</label>
              <select
                value={categoryParam}
                onChange={e => setParam('categorie', e.target.value)}
                className="w-full border border-slate-200 rounded-lg py-2 px-3 text-sm text-slate-700 focus:outline-none focus:border-blue-400"
              >
                <option value="">Toutes les catégories</option>
                {categories.map(c => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Marque</label>
              <select
                value={brandParam}
                onChange={e => setParam('marque', e.target.value)}
                className="w-full border border-slate-200 rounded-lg py-2 px-3 text-sm text-slate-700 focus:outline-none focus:border-blue-400"
              >
                <option value="">Toutes les marques</option>
                {brands.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Prix maximum</label>
              <select
                value={maxPriceParam}
                onChange={e => setParam('prix', e.target.value)}
                className="w-full border border-slate-200 rounded-lg py-2 px-3 text-sm text-slate-700 focus:outline-none focus:border-blue-400"
              >
                {priceRanges.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {hasFilters && (
          <div className="flex flex-wrap gap-2 mb-4">
            {categoryParam && (
              <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full">
                {categories.find(c => c.slug === categoryParam)?.name || categoryParam}
                <button onClick={() => setParam('categorie', '')} className="hover:text-blue-900"><X size={12} /></button>
              </span>
            )}
            {brandParam && (
              <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full">
                {brandParam}
                <button onClick={() => setParam('marque', '')} className="hover:text-blue-900"><X size={12} /></button>
              </span>
            )}
            {maxPriceParam && (
              <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full">
                Max {Number(maxPriceParam).toLocaleString('fr-FR')} FCFA
                <button onClick={() => setParam('prix', '')} className="hover:text-blue-900"><X size={12} /></button>
              </span>
            )}
            {search && (
              <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full">
                "{search}"
                <button onClick={() => setSearch('')} className="hover:text-blue-900"><X size={12} /></button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-xs text-slate-500 hover:text-red-600 underline px-1"
            >
              Tout effacer
            </button>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
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
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <Search size={40} className="mx-auto mb-4 text-slate-300" />
            <p className="font-medium text-slate-700 mb-1">Aucun produit trouvé</p>
            <p className="text-sm">Essayez de modifier vos filtres ou votre recherche.</p>
            <button onClick={clearFilters} className="mt-4 text-blue-600 hover:underline text-sm font-medium">
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
