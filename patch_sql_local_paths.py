from pathlib import Path
import re

file_path = Path(r'd:\project\supabase\migrations\20260425100900_add_categories_and_products.sql')
backup_path = file_path.with_suffix(file_path.suffix + '.fixedbak')

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

text = file_path.read_text(encoding='utf-8')
backup_path.write_text(text, encoding='utf-8')

re_image = re.compile(r"'data:image/svg\+xml;base64,[^']*'")
updated = []

lines = []
for line in text.splitlines(True):
    if 'data:image/svg+xml;base64' in line:
        for name, path_value in mapping.items():
            if name in line:
                line = re_image.sub(f"'{path_value}'", line)
                updated.append(name)
                break
    lines.append(line)

file_path.write_text(''.join(lines), encoding='utf-8')
print('Updated products:', sorted(updated))
missing = sorted(set(mapping) - set(updated))
if missing:
    print('Missing:', missing)
