#!/usr/bin/env python3
"""
Génère des images PLACEHOLDER (fond + texte), pas de vraies photos produit.
Pour des photos réelles, utilisez: python sync_real_product_images.py
"""
import io
import os
import sys
from urllib.parse import quote

import requests
from PIL import Image, ImageDraw

SUPABASE_URL = os.environ.get("SUPABASE_URL", "").rstrip("/")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_KEY")
BUCKET_NAME = os.environ.get("SUPABASE_BUCKET", "products")

# Products data
PRODUCTS = {
    "dell-latitude-5420.png": ("Dell Latitude 5420", "#1f2937"),
    "hp-pavilion-15.png": ("HP Pavilion 15", "#3b82f6"),
    "lenovo-thinkpad-e14.png": ("Lenovo ThinkPad E14", "#ef4444"),
    "macbook-air-m1.png": ("MacBook Air M1", "#6b7280"),
    "asus-vivobook-15.png": ("ASUS VivoBook 15", "#10b981"),
    "hp-laserjet-pro-m404n.png": ("HP LaserJet Pro M404n", "#f59e0b"),
    "canon-pixma-ts3320.png": ("Canon Pixma TS3320", "#8b5cf6"),
    "epson-ecotank-l3150.png": ("Epson EcoTank L3150", "#06b6d4"),
    "brother-mfc-l2710dw.png": ("Brother MFC-L2710DW", "#ec4899"),
    "xerox-workcentre-3335.png": ("Xerox WorkCentre 3335", "#14b8a6"),
    "logitech-mx-master-3.png": ("Logitech MX Master 3", "#f97316"),
    "corsair-k95-rgb.png": ("Corsair K95 RGB", "#6366f1"),
    "samsung-ssd-870-evo-1tb.png": ("Samsung SSD 870 EVO 1TB", "#0ea5e9"),
    "wd-my-passport-2tb.png": ("WD My Passport 2TB", "#84cc16"),
    "jbl-quantum-400.png": ("JBL Quantum 400", "#d946ef"),
    "anker-powercore-20000.png": ("Anker PowerCore 20000", "#f43f5e"),
    "iphone-13.png": ("iPhone 13", "#000000"),
    "samsung-galaxy-s22.png": ("Samsung Galaxy S22", "#1f2937"),
    "xiaomi-redmi-note-11.png": ("Xiaomi Redmi Note 11", "#ea580c"),
    "oneplus-10-pro.png": ("OnePlus 10 Pro", "#d4af37"),
    "tecno-camon-19.png": ("Tecno Camon 19", "#7c3aed"),
    "nokia-g50.png": ("Nokia G50", "#0891b2"),
}

def create_image(filename, product_name, color):
    """Create a simple product image with PIL"""
    width, height = 400, 300
    img = Image.new('RGB', (width, height), color=color)
    draw = ImageDraw.Draw(img)
    
    # Draw text
    text = product_name
    text_bbox = draw.textbbox((0, 0), text, font=None)
    text_width = text_bbox[2] - text_bbox[0]
    text_x = (width - text_width) // 2
    text_y = (height - 20) // 2
    draw.text((text_x, text_y), text, fill="white")
    
    # Save to bytes
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='PNG')
    img_bytes.seek(0)
    return img_bytes

def upload_image(filename, img_bytes):
    """Upload image to Supabase Storage (upsert)"""
    url = f"{SUPABASE_URL}/storage/v1/object/{BUCKET_NAME}/{filename}"
    headers = {
        "authorization": f"Bearer {SUPABASE_KEY}",
        "apikey": SUPABASE_KEY,
        "content-type": "image/png",
        "x-upsert": "true",
    }

    response = requests.post(url, data=img_bytes.getvalue(), headers=headers, timeout=30)
    if response.status_code in [200, 201]:
        print(f"✓ Uploaded: {filename}")
        return True

    # Existing file path can return 400 depending on configuration; retry with PUT.
    if response.status_code in [400, 409]:
        put_response = requests.put(url, data=img_bytes.getvalue(), headers=headers, timeout=30)
        if put_response.status_code in [200]:
            print(f"✓ Replaced: {filename}")
            return True
        print(f"✗ Failed to replace {filename}: {put_response.status_code} - {put_response.text}")
        return False

    print(f"✗ Failed to upload {filename}: {response.status_code} - {response.text}")
    return False


def update_product_image_path(product_name, filename):
    """Update products.image_url to products/<filename>."""
    encoded_name = quote(product_name, safe="")
    url = f"{SUPABASE_URL}/rest/v1/products?name=eq.{encoded_name}"
    headers = {
        "authorization": f"Bearer {SUPABASE_KEY}",
        "apikey": SUPABASE_KEY,
        "content-type": "application/json",
        "prefer": "return=representation",
    }
    payload = {"image_url": f"{BUCKET_NAME}/{filename}"}
    response = requests.patch(url, json=payload, headers=headers, timeout=30)
    if response.status_code in [200, 204]:
        print(f"  ↳ DB updated: {product_name}")
        return True
    print(f"  ↳ DB update failed ({product_name}): {response.status_code} - {response.text}")
    return False

def main():
    if not SUPABASE_URL or not SUPABASE_KEY:
        print(
            "Missing credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY "
            "(or SUPABASE_KEY) in your environment.",
            file=sys.stderr,
        )
        sys.exit(1)

    print("Starting image upload to Supabase Storage...\n")

    for filename, (product_name, color) in PRODUCTS.items():
        # Create image
        img_bytes = create_image(filename, product_name, color)

        # Upload to Supabase
        if upload_image(filename, img_bytes):
            update_product_image_path(product_name, filename)

    print("\n" + "="*60)
    print("Image upload complete!")
    print("="*60 + "\n")

if __name__ == "__main__":
    main()
