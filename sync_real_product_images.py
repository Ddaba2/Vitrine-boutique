#!/usr/bin/env python3
"""
Télécharge des photos produit réelles (Unsplash) et les envoie dans Supabase Storage,
puis met à jour products.image_url.

Prérequis:
  - Bucket public `products` dans Supabase Storage
  - Variables d'environnement (voir .env.example)

Usage:
  python sync_real_product_images.py
"""

from __future__ import annotations

import io
import os
import sys
from pathlib import Path
from urllib.parse import quote

import requests
from PIL import Image

try:
    from dotenv import load_dotenv

    load_dotenv()
except ImportError:
    pass

SUPABASE_URL = os.environ.get("SUPABASE_URL", os.environ.get("VITE_SUPABASE_URL", "")).rstrip("/")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_KEY")
BUCKET_NAME = os.environ.get("SUPABASE_BUCKET", "products")

# Photos libres Unsplash — visuel réel par type de produit (pas le modèle exact).
# Pour des photos officielles (ex. Canon TS3320 exact), remplacez par vos fichiers dans public/products/.
PRODUCT_PHOTOS: dict[str, tuple[str, str]] = {
    "Dell Latitude 5420": ("dell-latitude-5420.png", "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80"),
    "HP Pavilion 15": ("hp-pavilion-15.png", "https://images.unsplash.com/photo-1588877337276-a2b06066ca0a?w=800&q=80"),
    "Lenovo ThinkPad E14": ("lenovo-thinkpad-e14.png", "https://images.unsplash.com/photo-1541807084-5c52fbcf2755?w=800&q=80"),
    "MacBook Air M1": ("macbook-air-m1.png", "https://images.unsplash.com/photo-1611185137344-6e4e2b1d4d8e?w=800&q=80"),
    "Asus VivoBook 15": ("asus-vivobook-15.png", "https://images.unsplash.com/photo-1525547719571-a2d0acfc5d0e?w=800&q=80"),
    "HP LaserJet Pro M404n": ("hp-laserjet-pro-m404n.png", "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&q=80"),
    "Canon Pixma TS3320": ("canon-pixma-ts3320.png", "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&q=80"),
    "Epson EcoTank L3150": ("epson-ecotank-l3150.png", "https://images.unsplash.com/photo-1612198188060-c7c2a3b66e0e?w=800&q=80"),
    "Brother MFC-L2710DW": ("brother-mfc-l2710dw.png", "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80"),
    "Xerox WorkCentre 3335": ("xerox-workcentre-3335.png", "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80"),
    "Logitech MX Master 3": ("logitech-mx-master-3.png", "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80"),
    "Corsair K95 RGB": ("corsair-k95-rgb.png", "https://images.unsplash.com/photo-1541142564395-198cf4efe3e5?w=800&q=80"),
    "Samsung SSD 870 EVO 1TB": ("samsung-ssd-870-evo-1tb.png", "https://images.unsplash.com/photo-1597872208301-28b9d0d1e8b0?w=800&q=80"),
    "WD My Passport 2TB": ("wd-my-passport-2tb.png", "https://images.unsplash.com/photo-1531497865144-6a1b66ebaa43?w=800&q=80"),
    "JBL Quantum 400": ("jbl-quantum-400.png", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"),
    "Anker PowerCore 20000": ("anker-powercore-20000.png", "https://images.unsplash.com/photo-1609091838570-7f08c7d0c8e3?w=800&q=80"),
    "iPhone 13": ("iphone-13.png", "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=80"),
    "Samsung Galaxy S22": ("samsung-galaxy-s22.png", "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80"),
    "Xiaomi Redmi Note 11": ("xiaomi-redmi-note-11.png", "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80"),
    "OnePlus 10 Pro": ("oneplus-10-pro.png", "https://images.unsplash.com/photo-15983271011d6-836b0983a707?w=800&q=80"),
    "Tecno Camon 19": ("tecno-camon-19.png", "https://images.unsplash.com/photo-1567581935884-3349723552fe?w=800&q=80"),
    "Nokia G50": ("nokia-g50.png", "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&q=80"),
}

# Fallback si une URL Unsplash échoue (IDs vérifiés / catégorie)
FALLBACK_BY_PREFIX: dict[str, str] = {
    "canon": "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&q=80",
    "corsair": "https://images.unsplash.com/photo-1541142564395-198cf4efe3e5?w=800&q=80",
    "samsung-galaxy": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
}


def download_image(url: str) -> bytes:
    response = requests.get(url, timeout=45, headers={"User-Agent": "TechMali-ImageSync/1.0"})
    response.raise_for_status()
    return response.content


def to_png_bytes(raw: bytes, width: int = 800, height: int = 600) -> bytes:
    img = Image.open(io.BytesIO(raw)).convert("RGB")
    img.thumbnail((width, height), Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", (width, height), (255, 255, 255))
    offset = ((width - img.width) // 2, (height - img.height) // 2)
    canvas.paste(img, offset)
    out = io.BytesIO()
    canvas.save(out, format="PNG", optimize=True)
    out.seek(0)
    return out.getvalue()


def upload_to_storage(filename: str, png_bytes: bytes) -> bool:
    url = f"{SUPABASE_URL}/storage/v1/object/{BUCKET_NAME}/{filename}"
    headers = {
        "authorization": f"Bearer {SUPABASE_KEY}",
        "apikey": SUPABASE_KEY,
        "content-type": "image/png",
        "x-upsert": "true",
    }
    response = requests.post(url, data=png_bytes, headers=headers, timeout=60)
    if response.status_code in (200, 201):
        return True
    if response.status_code in (400, 409):
        put = requests.put(url, data=png_bytes, headers=headers, timeout=60)
        return put.status_code == 200
    print(f"  Storage error {filename}: {response.status_code} {response.text[:200]}")
    return False


def update_db(product_name: str, filename: str) -> bool:
    encoded = quote(product_name, safe="")
    url = f"{SUPABASE_URL}/rest/v1/products?name=eq.{encoded}"
    headers = {
        "authorization": f"Bearer {SUPABASE_KEY}",
        "apikey": SUPABASE_KEY,
        "content-type": "application/json",
        "prefer": "return=representation",
    }
    payload = {"image_url": f"{BUCKET_NAME}/{filename}"}
    response = requests.patch(url, json=payload, headers=headers, timeout=30)
    return response.status_code in (200, 204)


def save_local(png_bytes: bytes, filename: str) -> None:
    for folder in ("public/products", "dist/products"):
        path = Path(folder)
        path.mkdir(parents=True, exist_ok=True)
        (path / filename).write_bytes(png_bytes)


def resolve_url(product_name: str, filename: str, primary_url: str) -> str:
    prefix = filename.replace(".png", "").split("-")[0]
    try:
        download_image(primary_url)
        return primary_url
    except Exception:
        for key, fallback in FALLBACK_BY_PREFIX.items():
            if key in filename:
                print(f"  Fallback URL for {product_name}")
                return fallback
        if "ordinateur" in product_name.lower() or filename.endswith((".png",)):
            return "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80"
    return primary_url


def main() -> None:
    if not SUPABASE_URL or not SUPABASE_KEY:
        print(
            "Ajoutez dans .env :\n"
            "  SUPABASE_URL=https://xxx.supabase.co\n"
            "  SUPABASE_SERVICE_ROLE_KEY=<clé service_role>\n"
            "(La clé anon VITE_* ne suffit pas pour l'upload Storage.)",
            file=sys.stderr,
        )
        sys.exit(1)

    print("Sync photos réelles → Supabase Storage\n")
    ok, fail = 0, 0

    for product_name, (filename, photo_url) in PRODUCT_PHOTOS.items():
        print(f"• {product_name}")
        try:
            url = photo_url
            try:
                raw = download_image(url)
            except Exception:
                url = resolve_url(product_name, filename, photo_url)
                raw = download_image(url)

            png = to_png_bytes(raw)
            save_local(png, filename)

            if not upload_to_storage(filename, png):
                fail += 1
                continue
            if not update_db(product_name, filename):
                print("  DB: échec mise à jour")
                fail += 1
                continue

            print(f"  OK → {BUCKET_NAME}/{filename}")
            ok += 1
        except Exception as exc:
            print(f"  Erreur: {exc}")
            fail += 1

    print(f"\nTerminé: {ok} réussis, {fail} échecs")
    if fail:
        sys.exit(1)


if __name__ == "__main__":
    main()
