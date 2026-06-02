import requests
import os
import sys
from urllib.parse import quote

SUPABASE_URL = os.environ.get('SUPABASE_URL', '').rstrip('/')
SUPABASE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY') or os.environ.get('SUPABASE_KEY')
HEADERS = {
    'apikey': SUPABASE_KEY,
    'Authorization': f'Bearer {SUPABASE_KEY}',
    'Content-Type': 'application/json',
    'Prefer': 'return=representation',
}

mapping = {
    'Dell Latitude 5420': '/products/dell-latitude-5420.png',
    'HP Pavilion 15': '/products/hp-pavilion-15.png',
    'Lenovo ThinkPad E14': '/products/lenovo-thinkpad-e14.png',
    'MacBook Air M1': '/products/macbook-air-m1.png',
    'Asus VivoBook 15': '/products/asus-vivobook-15.png',
    'HP LaserJet Pro M404n': '/products/hp-laserjet-pro-m404n.png',
    'Canon Pixma TS3320': '/products/canon-pixma-ts3320.png',
    'Epson EcoTank L3150': '/products/epson-ecotank-l3150.png',
    'Brother MFC-L2710DW': '/products/brother-mfc-l2710dw.png',
    'Xerox WorkCentre 3335': '/products/xerox-workcentre-3335.png',
    'Logitech MX Master 3': '/products/logitech-mx-master-3.png',
    'Corsair K95 RGB': '/products/corsair-k95-rgb.png',
    'Samsung SSD 870 EVO 1TB': '/products/samsung-ssd-870-evo-1tb.png',
    'WD My Passport 2TB': '/products/wd-my-passport-2tb.png',
    'JBL Quantum 400': '/products/jbl-quantum-400.png',
    'Anker PowerCore 20000': '/products/anker-powercore-20000.png',
    'iPhone 13': '/products/iphone-13.png',
    'Samsung Galaxy S22': '/products/samsung-galaxy-s22.png',
    'Xiaomi Redmi Note 11': '/products/xiaomi-redmi-note-11.png',
    'OnePlus 10 Pro': '/products/oneplus-10-pro.png',
    'Tecno Camon 19': '/products/tecno-camon-19.png',
    'Nokia G50': '/products/nokia-g50.png',
}

success = []
failed = []

if not SUPABASE_URL or not SUPABASE_KEY:
    print('Missing SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_KEY).', file=sys.stderr)
    sys.exit(1)

for name, path in mapping.items():
    query_name = quote(name, safe='')
    url = f'{SUPABASE_URL}/rest/v1/products?name=eq.{query_name}'
    r = requests.patch(url, headers=HEADERS, json={'image_url': path})
    if r.status_code in (200, 204):
        success.append((name, r.status_code))
    else:
        failed.append((name, r.status_code, r.text))
        print(f'FAIL {name}: {r.status_code} {r.text}')

print('\nSucceeded:', len(success))
print('Failed:', len(failed))
if success:
    print(success[:10])
if failed:
    print(failed[:5])
