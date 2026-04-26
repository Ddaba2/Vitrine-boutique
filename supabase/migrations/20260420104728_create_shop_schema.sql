/*
  # IT Shop - Initial Schema

  ## New Tables

  ### categories
  - id: uuid primary key
  - name: category name (e.g., Ordinateurs, Imprimantes, Accessoires)
  - slug: url-friendly identifier
  - created_at: timestamp

  ### products
  - id: uuid primary key
  - name: product name
  - description: detailed description
  - price: price in FCFA
  - category_id: foreign key to categories
  - brand: manufacturer brand
  - image_url: main product image URL
  - available: stock availability flag
  - popular: flag for featured/popular products on homepage
  - created_at: timestamp

  ### contact_messages
  - id: uuid primary key
  - name: sender name
  - phone: sender phone
  - email: sender email (optional)
  - message: message content
  - created_at: timestamp

  ## Security
  - RLS enabled on all tables
  - Public read access for products and categories
  - Anyone can insert contact messages
  - No delete/update for public
*/

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  price numeric(12, 0) NOT NULL DEFAULT 0,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  brand text DEFAULT '',
  image_url text DEFAULT '',
  available boolean DEFAULT true,
  popular boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text DEFAULT '',
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read categories"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can read products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert contact messages"
  ON contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
