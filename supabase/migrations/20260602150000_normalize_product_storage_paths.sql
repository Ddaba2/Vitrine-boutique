/*
  # Normalize product image paths to Supabase Storage

  This migration rewrites `products.image_url` to stable object paths in the
  `products` storage bucket (`products/<filename>`). The frontend then resolves
  those paths into public Supabase Storage URLs.
*/

UPDATE products
SET image_url = CASE name
  WHEN 'Dell Latitude 5420' THEN 'products/dell-latitude-5420.png'
  WHEN 'HP Pavilion 15' THEN 'products/hp-pavilion-15.png'
  WHEN 'Lenovo ThinkPad E14' THEN 'products/lenovo-thinkpad-e14.png'
  WHEN 'MacBook Air M1' THEN 'products/macbook-air-m1.png'
  WHEN 'Asus VivoBook 15' THEN 'products/asus-vivobook-15.png'
  WHEN 'HP LaserJet Pro M404n' THEN 'products/hp-laserjet-pro-m404n.png'
  WHEN 'Canon Pixma TS3320' THEN 'products/canon-pixma-ts3320.png'
  WHEN 'Epson EcoTank L3150' THEN 'products/epson-ecotank-l3150.png'
  WHEN 'Brother MFC-L2710DW' THEN 'products/brother-mfc-l2710dw.png'
  WHEN 'Xerox WorkCentre 3335' THEN 'products/xerox-workcentre-3335.png'
  WHEN 'Logitech MX Master 3' THEN 'products/logitech-mx-master-3.png'
  WHEN 'Corsair K95 RGB' THEN 'products/corsair-k95-rgb.png'
  WHEN 'Samsung SSD 870 EVO 1TB' THEN 'products/samsung-ssd-870-evo-1tb.png'
  WHEN 'WD My Passport 2TB' THEN 'products/wd-my-passport-2tb.png'
  WHEN 'JBL Quantum 400' THEN 'products/jbl-quantum-400.png'
  WHEN 'Anker PowerCore 20000' THEN 'products/anker-powercore-20000.png'
  WHEN 'iPhone 13' THEN 'products/iphone-13.png'
  WHEN 'Samsung Galaxy S22' THEN 'products/samsung-galaxy-s22.png'
  WHEN 'Xiaomi Redmi Note 11' THEN 'products/xiaomi-redmi-note-11.png'
  WHEN 'OnePlus 10 Pro' THEN 'products/oneplus-10-pro.png'
  WHEN 'Tecno Camon 19' THEN 'products/tecno-camon-19.png'
  WHEN 'Nokia G50' THEN 'products/nokia-g50.png'
  ELSE image_url
END
WHERE name IN (
  'Dell Latitude 5420',
  'HP Pavilion 15',
  'Lenovo ThinkPad E14',
  'MacBook Air M1',
  'Asus VivoBook 15',
  'HP LaserJet Pro M404n',
  'Canon Pixma TS3320',
  'Epson EcoTank L3150',
  'Brother MFC-L2710DW',
  'Xerox WorkCentre 3335',
  'Logitech MX Master 3',
  'Corsair K95 RGB',
  'Samsung SSD 870 EVO 1TB',
  'WD My Passport 2TB',
  'JBL Quantum 400',
  'Anker PowerCore 20000',
  'iPhone 13',
  'Samsung Galaxy S22',
  'Xiaomi Redmi Note 11',
  'OnePlus 10 Pro',
  'Tecno Camon 19',
  'Nokia G50'
);
