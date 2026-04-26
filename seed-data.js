import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedData() {
  console.log('🌱 Starting data seeding...');

  try {
    // Insert categories
    console.log('📁 Adding categories...');
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .upsert([
        { name: 'Ordinateurs', slug: 'ordinateurs' },
        { name: 'Imprimantes', slug: 'imprimantes' },
        { name: 'Accessoires', slug: 'accessoires' },
        { name: 'Téléphones', slug: 'telephones' }
      ], { onConflict: 'slug' })
      .select();

    if (categoriesError) {
      console.error('❌ Error inserting categories:', categoriesError);
      return;
    }
    console.log('✅ Categories added successfully:', categories);

    // Get category IDs
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.slug] = cat.id;
    });

    // Insert products for Ordinateurs
    console.log('💻 Adding computers...');
    const computers = [
      {
        name: 'Dell Latitude 5420',
        description: 'Ordinateur portable professionnel avec processeur Intel Core i5, 8GB RAM, 256GB SSD. Écran 14" Full HD, clavier rétroéclairé.',
        price: 285000,
        category_id: categoryMap.ordinateurs,
        brand: 'Dell',
        image_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
        available: true,
        popular: true
      },
      {
        name: 'HP Pavilion 15',
        description: 'Ordinateur portable avec processeur AMD Ryzen 5, 16GB RAM, 512GB SSD. Écran 15.6" HD, webcam HD.',
        price: 245000,
        category_id: categoryMap.ordinateurs,
        brand: 'HP',
        image_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
        available: true,
        popular: false
      },
      {
        name: 'Lenovo ThinkPad E14',
        description: 'PC portable robuste avec Intel Core i3, 8GB RAM, 256GB SSD. Écran 14" anti-reflets.',
        price: 195000,
        category_id: categoryMap.ordinateurs,
        brand: 'Lenovo',
        image_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
        available: true,
        popular: false
      },
      {
        name: 'MacBook Air M1',
        description: 'Ordinateur portable Apple avec chip M1, 8GB RAM, 256GB SSD. Écran 13.3" Retina.',
        price: 450000,
        category_id: categoryMap.ordinateurs,
        brand: 'Apple',
        image_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
        available: true,
        popular: true
      },
      {
        name: 'Asus VivoBook 15',
        description: 'PC portable avec Intel Core i5, 8GB RAM, 512GB SSD. Écran 15.6" Full HD, pavé tactile numérique.',
        price: 220000,
        category_id: categoryMap.ordinateurs,
        brand: 'ASUS',
        image_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
        available: true,
        popular: false
      }
    ];

    const { data: computersData, error: computersError } = await supabase
      .from('products')
      .insert(computers)
      .select();

    if (computersError) {
      console.error('❌ Error inserting computers:', computersError);
    } else {
      console.log('✅ Computers added successfully:', computersData?.length, 'items');
    }

    // Insert products for Imprimantes
    console.log('🖨️ Adding printers...');
    const printers = [
      {
        name: 'HP LaserJet Pro M404n',
        description: 'Imprimante laser monochrome, vitesse 40 ppm, résolution 1200 dpi, WiFi, USB.',
        price: 125000,
        category_id: categoryMap.imprimantes,
        brand: 'HP',
        image_url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400',
        available: true,
        popular: true
      },
      {
        name: 'Canon Pixma TS3320',
        description: 'Imprimante multifonction jet d\'encre, scan, copie, WiFi, résolution 4800 x 1200 dpi.',
        price: 45000,
        category_id: categoryMap.imprimantes,
        brand: 'Canon',
        image_url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400',
        available: true,
        popular: false
      },
      {
        name: 'Epson EcoTank L3150',
        description: 'Imprimante jet d\'encre avec système de réservoir, impression recto-verso, WiFi.',
        price: 85000,
        category_id: categoryMap.imprimantes,
        brand: 'Epson',
        image_url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400',
        available: true,
        popular: false
      },
      {
        name: 'Brother MFC-L2710DW',
        description: 'Imprimante laser monochrome multifonction, scan, copie, fax, WiFi.',
        price: 155000,
        category_id: categoryMap.imprimantes,
        brand: 'Brother',
        image_url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400',
        available: true,
        popular: true
      },
      {
        name: 'Xerox WorkCentre 3335',
        description: 'Imprimante laser multifonction couleur, vitesse 35 ppm, scan, copie, WiFi.',
        price: 285000,
        category_id: categoryMap.imprimantes,
        brand: 'Xerox',
        image_url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400',
        available: true,
        popular: false
      }
    ];

    const { data: printersData, error: printersError } = await supabase
      .from('products')
      .insert(printers)
      .select();

    if (printersError) {
      console.error('❌ Error inserting printers:', printersError);
    } else {
      console.log('✅ Printers added successfully:', printersData?.length, 'items');
    }

    // Insert products for Accessoires
    console.log('🎧 Adding accessories...');
    const accessories = [
      {
        name: 'Logitech MX Master 3',
        description: 'Souris sans fil avancée, capteur Darkfield 4000 DPI, scroll magnétique, 70 jours d\'autonomie.',
        price: 45000,
        category_id: categoryMap.accessoires,
        brand: 'Logitech',
        image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
        available: true,
        popular: true
      },
      {
        name: 'Corsair K95 RGB',
        description: 'Clavier mécanique gaming, switches Cherry MX, rétroéclairage RGB, 6 touches programmables.',
        price: 75000,
        category_id: categoryMap.accessoires,
        brand: 'Corsair',
        image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
        available: true,
        popular: false
      },
      {
        name: 'Samsung SSD 870 EVO 1TB',
        description: 'Disque SSD SATA III, vitesse jusqu\'à 560 Mo/s, garantie 5 ans.',
        price: 85000,
        category_id: categoryMap.accessoires,
        brand: 'Samsung',
        image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
        available: true,
        popular: false
      },
      {
        name: 'WD My Passport 2TB',
        description: 'Disque dur externe portable 2TB, USB 3.0, encryption matériel.',
        price: 55000,
        category_id: categoryMap.accessoires,
        brand: 'Western Digital',
        image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
        available: true,
        popular: false
      },
      {
        name: 'JBL Quantum 400',
        description: 'Casque gaming, son 7.1 surround, micro detachable, compatible PC/Console.',
        price: 35000,
        category_id: categoryMap.accessoires,
        brand: 'JBL',
        image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        available: true,
        popular: true
      },
      {
        name: 'Anker PowerCore 20000',
        description: 'Batterie externe 20000mAh, charge rapide PowerIQ, double sortie USB.',
        price: 25000,
        category_id: categoryMap.accessoires,
        brand: 'Anker',
        image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
        available: true,
        popular: false
      }
    ];

    const { data: accessoriesData, error: accessoriesError } = await supabase
      .from('products')
      .insert(accessories)
      .select();

    if (accessoriesError) {
      console.error('❌ Error inserting accessories:', accessoriesError);
    } else {
      console.log('✅ Accessories added successfully:', accessoriesData?.length, 'items');
    }

    // Insert products for Téléphones
    console.log('📱 Adding phones...');
    const phones = [
      {
        name: 'iPhone 13',
        description: 'Smartphone Apple avec écran 6.1" Super Retina XDR, chip A15 Bionic, double appareil photo 12MP.',
        price: 285000,
        category_id: categoryMap.telephones,
        brand: 'Apple',
        image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
        available: true,
        popular: true
      },
      {
        name: 'Samsung Galaxy S22',
        description: 'Smartphone Android avec écran 6.1" Dynamic AMOLED 2X, processeur Snapdragon 8 Gen 1, triple caméra 50MP.',
        price: 245000,
        category_id: categoryMap.telephones,
        brand: 'Samsung',
        image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
        available: true,
        popular: false
      },
      {
        name: 'Xiaomi Redmi Note 11',
        description: 'Smartphone Android avec écran 6.43" FHD+, processeur Snapdragon 680, quadruple caméra 50MP.',
        price: 95000,
        category_id: categoryMap.telephones,
        brand: 'Xiaomi',
        image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
        available: true,
        popular: false
      },
      {
        name: 'OnePlus 10 Pro',
        description: 'Smartphone Android avec écran 6.7" Fluid AMOLED, processeur Snapdragon 8 Gen 1, triple caméra Hasselblad.',
        price: 325000,
        category_id: categoryMap.telephones,
        brand: 'OnePlus',
        image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
        available: true,
        popular: true
      },
      {
        name: 'Tecno Camon 19',
        description: 'Smartphone Android avec écran 6.8" HD+, processeur Helio G85, double caméra 64MP.',
        price: 65000,
        category_id: categoryMap.telephones,
        brand: 'Tecno',
        image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
        available: true,
        popular: false
      },
      {
        name: 'Nokia G50',
        description: 'Smartphone Android avec écran 6.82" HD+, batterie 5000mAh, triple caméra 48MP.',
        price: 85000,
        category_id: categoryMap.telephones,
        brand: 'Nokia',
        image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
        available: true,
        popular: false
      }
    ];

    const { data: phonesData, error: phonesError } = await supabase
      .from('products')
      .insert(phones)
      .select();

    if (phonesError) {
      console.error('❌ Error inserting phones:', phonesError);
    } else {
      console.log('✅ Phones added successfully:', phonesData?.length, 'items');
    }

    console.log('🎉 Data seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

seedData();
