-- Script pour nettoyer et recharger les données avec les bonnes images
-- À exécuter dans votre dashboard Supabase SQL

-- Désactiver RLS temporairement
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;

-- Supprimer tous les produits existants
DELETE FROM products;

-- Supprimer toutes les catégories existantes  
DELETE FROM categories;

-- Réinsérer les catégories
INSERT INTO categories (name, slug) VALUES 
  ('Ordinateurs', 'ordinateurs'),
  ('Imprimantes', 'imprimantes'),
  ('Accessoires', 'accessoires'),
  ('Téléphones', 'telephones');

-- Réinsérer les produits avec les bonnes images

-- Ordinateurs
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

-- Imprimantes avec de vraies images d'imprimantes spécifiques
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
  ('HP LaserJet Pro M404n', 'Imprimante laser monochrome, vitesse 40 ppm, résolution 1200 dpi, WiFi, USB. Bac de sortie 150 feuilles, processeur 1.2 GHz, écran LCD 2 lignes.', 125000, 'imprimantes', 'HP', 'https://i5.walmartimages.com/asr/1b4b9c2e-1e2d-4d8f-9f6a-5c5e5d5e5d5e_1.5b4b9c2e-1e2d-4d8f-9f6a-5c5e5d5e5d5e.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF', true, true),
  ('Canon Pixma TS3320', 'Imprimante multifonction jet d''encre, scan, copie, WiFi, résolution 4800 x 1200 dpi. Compacte et facile à utiliser.', 45000, 'imprimantes', 'Canon', 'https://images.canon-europe.com/cdn_eu/products/imagers/pixma_ts3320_product_image_01.png', true, false),
  ('Epson EcoTank L3150', 'Imprimante jet d''encre avec système de réservoir, impression recto-verso, WiFi. Économique avec réservoirs d''encre.', 85000, 'imprimantes', 'Epson', 'https://images.epson.eu/medias/epson-product-photos/EcoTank-L3150-1.png', true, false)
) AS products(name, description, price, category_slug, brand, image_url, available, popular)
JOIN categories c ON c.slug = products.category_slug;

-- Accessoires
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

-- Téléphones (réduit à 3 produits)
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
  ('Xiaomi Redmi Note 11', 'Smartphone Android avec écran 6.43" FHD+, processeur Snapdragon 680, quadruple caméra 50MP.', 95000, 'telephones', 'Xiaomi', 'https://images.unsplash.com/photo-1592286115803-a1c3b552ee43?w=400', true, false)
) AS products(name, description, price, category_slug, brand, image_url, available, popular)
JOIN categories c ON c.slug = products.category_slug;

-- Réactiver RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Vérification
SELECT 'Categories reloaded:' as info;
SELECT COUNT(*) as category_count FROM categories;
SELECT 'Products reloaded:' as info;
SELECT COUNT(*) as product_count FROM products;
