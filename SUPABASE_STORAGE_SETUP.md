# Supabase Storage setup (images produits)

## 1) Creer le bucket

- Dans Supabase > Storage, creer un bucket `products`
- Mettre le bucket en **public**

## 2) Variables d'environnement

Definir ces variables avant d'executer les scripts:

- `SUPABASE_URL` (ex: `https://<project-ref>.supabase.co`)
- `SUPABASE_SERVICE_ROLE_KEY` (recommande) ou `SUPABASE_KEY`
- Optionnel: `SUPABASE_BUCKET` (defaut: `products`)

## 3) Normaliser les chemins en base

Executer la migration:

- `supabase/migrations/20260602150000_normalize_product_storage_paths.sql`

Cette migration stocke les images au format `products/<fichier>`.

## 4) Uploader des **vraies** photos produit

**Ne pas utiliser** `upload_images.py` pour la prod : il genere des placeholders (fond + texte).

Utiliser plutot:

```powershell
pip install requests pillow python-dotenv
python sync_real_product_images.py
```

Le script telecharge des photos reelles (Unsplash), les envoie dans `products/<fichier>` et met a jour `products.image_url`.

Pour des photos **exactes** du modele (ex. Canon Pixma TS3320 officiel), placez vos fichiers dans `public/products/` puis re-uploadez avec le script ou l'UI Supabase Storage.

## 5) Frontend

Le frontend convertit automatiquement les valeurs:

- `/products/mon-image.png`
- `products/mon-image.png`
- URL absolues (`https://...`)

en URL publique Supabase Storage.
