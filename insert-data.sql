-- Run this script in your Supabase SQL Editor
-- Go to https://supabase.com/dashboard/project/rrdwvqafkiyhwxvnvhuq/sql

-- Temporarily disable RLS for categories table
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;

-- Insert categories
INSERT INTO categories (name, slug) VALUES 
  ('Ordinateurs', 'ordinateurs'),
  ('Imprimantes', 'imprimantes'),
  ('Accessoires', 'accessoires'),
  ('Téléphones', 'telephones')
ON CONFLICT (slug) DO NOTHING;

-- Re-enable RLS for categories table
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Temporarily disable RLS for products table
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- Insert products for Ordinateurs
INSERT INTO products (name, description, price, category_id, brand, image_url, available, popular) 
SELECT 
  products.name, 
  products.description, 
  products.price, 
  c.id as category_id,
  products.brand,
  products.image_url,
  products.available,
  products.popular
FROM (VALUES 
  ('Dell Latitude 5420', 'Ordinateur portable professionnel avec processeur Intel Core i5, 8GB RAM, 256GB SSD. Écran 14" Full HD, clavier rétroéclairé.', 285000, 'ordinateurs', 'Dell', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', true, true),
  ('HP Pavilion 15', 'Ordinateur portable avec processeur AMD Ryzen 5, 16GB RAM, 512GB SSD. Écran 15.6" HD, webcam HD.', 245000, 'ordinateurs', 'HP', 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400', true, false),
  ('Lenovo ThinkPad E14', 'PC portable robuste avec Intel Core i3, 8GB RAM, 256GB SSD. Écran 14" anti-reflets.', 195000, 'ordinateurs', 'Lenovo', 'https://images.unsplash.com/photo-1542496658-e33a6d0d5046?w=400', true, false),
  ('MacBook Air M1', 'Ordinateur portable Apple avec chip M1, 8GB RAM, 256GB SSD. Écran 13.3" Retina.', 450000, 'ordinateurs', 'Apple', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', true, true),
  ('Asus VivoBook 15', 'PC portable avec Intel Core i5, 8GB RAM, 512GB SSD. Écran 15.6" Full HD, pavé tactile numérique.', 220000, 'ordinateurs', 'ASUS', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', true, false)
) AS products(name, description, price, category_slug, brand, image_url, available, popular)
JOIN categories c ON c.slug = products.category_slug;

-- Insert products for Imprimantes
INSERT INTO products (name, description, price, category_id, brand, image_url, available, popular) 
SELECT 
  products.name, 
  products.description, 
  products.price, 
  c.id as category_id,
  products.brand,
  products.image_url,
  products.available,
  products.popular
FROM (VALUES 
  ('HP LaserJet Pro M404n', 'Imprimante laser monochrome, vitesse 40 ppm, résolution 1200 dpi, WiFi, USB.', 125000, 'imprimantes', 'HP', 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400', true, true),
  ('Canon Pixma TS3320', 'Imprimante multifonction jet d''encre, scan, copie, WiFi, résolution 4800 x 1200 dpi.', 45000, 'imprimantes', 'Canon', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', true, false),
  ('Epson EcoTank L3150', 'Imprimante jet d''encre avec système de réservoir, impression recto-verso, WiFi.', 85000, 'imprimantes', 'Epson', 'https://images.unsplash.com/photo-1603732551681-2e91159b9dc2?w=400', true, false),
  ('Brother MFC-L2710DW', 'Imprimante laser monochrome multifonction, scan, copie, fax, WiFi.', 155000, 'imprimantes', 'Brother', 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400', true, true),
  ('Xerox WorkCentre 3335', 'Imprimante laser multifonction couleur, vitesse 35 ppm, scan, copie, WiFi.', 285000, 'imprimantes', 'Xerox', 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400', true, false)
) AS products(name, description, price, category_slug, brand, image_url, available, popular)
JOIN categories c ON c.slug = products.category_slug;

-- Insert products for Accessoires
INSERT INTO products (name, description, price, category_id, brand, image_url, available, popular) 
SELECT 
  products.name, 
  products.description, 
  products.price, 
  c.id as category_id,
  products.brand,
  products.image_url,
  products.available,
  products.popular
FROM (VALUES 
  ('Logitech MX Master 3', 'Souris sans fil avancée, capteur Darkfield 4000 DPI, scroll magnétique, 70 jours d''autonomie.', 45000, 'accessoires', 'Logitech', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400', true, true),
  ('Corsair K95 RGB', 'Clavier mécanique gaming, switches Cherry MX, rétroéclairage RGB, 6 touches programmables.', 75000, 'accessoires', 'Corsair', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', true, false),
  ('Samsung SSD 870 EVO 1TB', 'Disque SSD SATA III, vitesse jusqu''à 560 Mo/s, garantie 5 ans.', 85000, 'accessoires', 'Samsung', 'https://images.unsplash.com/photo-1593377492648-8ad619d0aedd?w=400', true, false),
  ('WD My Passport 2TB', 'Disque dur externe portable 2TB, USB 3.0, encryption matériel.', 55000, 'accessoires', 'Western Digital', 'https://images.unsplash.com/photo-1593377492648-8ad619d0aedd?w=400', true, false),
  ('JBL Quantum 400', 'Casque gaming, son 7.1 surround, micro detachable, compatible PC/Console.', 35000, 'accessoires', 'JBL', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', true, true),
  ('Anker PowerCore 20000', 'Batterie externe 20000mAh, charge rapide PowerIQ, double sortie USB.', 25000, 'accessoires', 'Anker', 'https://images.unsplash.com/photo-1593079836373-e904a0223899?w=400', true, false)
) AS products(name, description, price, category_slug, brand, image_url, available, popular)
JOIN categories c ON c.slug = products.category_slug;

-- Insert products for Téléphones
INSERT INTO products (name, description, price, category_id, brand, image_url, available, popular) 
SELECT 
  products.name, 
  products.description, 
  products.price, 
  c.id as category_id,
  products.brand,
  products.image_url,
  products.available,
  products.popular
FROM (VALUES 
  ('iPhone 13', 'Smartphone Apple avec écran 6.1" Super Retina XDR, chip A15 Bionic, double appareil photo 12MP.', 285000, 'telephones', 'Apple', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', true, true),
  ('Samsung Galaxy S22', 'Smartphone Android avec écran 6.1" Dynamic AMOLED 2X, processeur Snapdragon 8 Gen 1, triple caméra 50MP.', 245000, 'telephones', 'Samsung', 'https://images.unsplash.com/photo-1512341689857-4e958efaffb2?w=400', true, false),
  ('Xiaomi Redmi Note 11', 'Smartphone Android avec écran 6.43" FHD+, processeur Snapdragon 680, quadruple caméra 50MP.', 95000, 'telephones', 'Xiaomi', 'https://images.unsplash.com/photo-1592286115803-a1c3b552ee43?w=400', true, false),
  ('OnePlus 10 Pro', 'Smartphone Android avec écran 6.7" Fluid AMOLED, processeur Snapdragon 8 Gen 1, triple caméra Hasselblad.', 325000, 'telephones', 'OnePlus', 'https://images.unsplash.com/photo-1592286115803-a1c3b552ee43?w=400', true, true),
  ('Tecno Camon 19', 'Smartphone Android avec écran 6.8" HD+, processeur Helio G85, double caméra 64MP.', 65000, 'telephones', 'Tecno', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', true, false),
  ('Nokia G50', 'Smartphone Android avec écran 6.82" HD+, batterie 5000mAh, triple caméra 48MP.', 85000, 'telephones', 'Nokia', 'https://images.unsplash.com/photo-1592286115803-a1c3b552ee43?w=400', true, false)
) AS products(name, description, price, category_slug, brand, image_url, available, popular)
JOIN categories c ON c.slug = products.category_slug;

-- Re-enable RLS for products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Verify the data was inserted
SELECT 'Categories added:' as info;
SELECT COUNT(*) as category_count FROM categories;
SELECT 'Products added:' as info;
SELECT COUNT(*) as product_count FROM products;
