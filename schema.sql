-- SQL Schema for Electra Mobile Store Database Setup
-- Run these commands in your Supabase SQL Editor (https://supabase.com)

-- 1. DROP Existing Tables if they exist (clean setup)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- 2. CREATE Products Table
CREATE TABLE products (
    id TEXT PRIMARY KEY, -- Slug-style IDs (e.g. 'iphone-15-pro-max')
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    price NUMERIC NOT NULL CHECK (price >= 0),
    rating NUMERIC NOT NULL DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5.0),
    reviews_count INTEGER NOT NULL DEFAULT 0,
    description TEXT,
    colors JSONB NOT NULL, -- Color array with hex code and image path
    storage JSONB NOT NULL, -- Storage option details and extra pricing
    specs JSONB NOT NULL, -- Processor, screen, battery details
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. CREATE Orders Table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    subtotal NUMERIC NOT NULL,
    tax NUMERIC NOT NULL,
    shipping NUMERIC NOT NULL,
    total NUMERIC NOT NULL,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Shipped', 'Delivered', 'Cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. CREATE Order Items Table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    color TEXT NOT NULL,
    storage TEXT NOT NULL,
    price NUMERIC NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0)
);

-- 5. Enable RLS (Row Level Security) and Policies
-- For simplicity in a prototype/demo workspace, we can disable RLS or allow public access.
-- Here we enable public read on products, and public write on orders/order_items.
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to products" ON products 
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow public inserts to orders" ON orders 
    FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Allow public inserts to order_items" ON order_items 
    FOR INSERT TO public WITH CHECK (true);

-- Admin dashboard policies using service role (bypass RLS automatically)
-- Or we can allow all access for public under anon key for standard dev testing.
-- For a seamless dev experience, we will add full access policies for development:
CREATE POLICY "Allow public full control for products (Dev)" ON products 
    FOR ALL TO public USING (true) WITH CHECK (true);

CREATE POLICY "Allow public full control for orders (Dev)" ON orders 
    FOR ALL TO public USING (true) WITH CHECK (true);

CREATE POLICY "Allow public full control for order_items (Dev)" ON order_items 
    FOR ALL TO public USING (true) WITH CHECK (true);


-- 6. SEED Initial Flagship Products
INSERT INTO products (id, name, brand, price, rating, reviews_count, description, colors, storage, specs, featured)
VALUES 
(
  'iphone-15-pro-max',
  'iPhone 15 Pro Max',
  'Apple',
  1199,
  4.9,
  142,
  'Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.',
  '[
    {"name": "Titanium Black", "hex": "#232426", "image": "assets/iphone.png"},
    {"name": "Titanium Blue", "hex": "#2f4452", "image": "assets/iphone.png"},
    {"name": "Titanium White", "hex": "#e3e4e5", "image": "assets/iphone.png"}
  ]'::jsonb,
  '[
    {"size": "256GB", "extraPrice": 0},
    {"size": "512GB", "extraPrice": 200},
    {"size": "1TB", "extraPrice": 400}
  ]'::jsonb,
  '{
    "display": "6.7\" Super Retina XDR OLED, 120Hz",
    "processor": "A17 Pro chip (3nm)",
    "camera": "48MP Main + 12MP Ultra Wide + 12MP 5x Telephoto",
    "battery": "4441 mAh, 25W fast charging",
    "os": "iOS 17 (Upgradable)",
    "weight": "221g"
  }'::jsonb,
  true
),
(
  'galaxy-s24-ultra',
  'Galaxy S24 Ultra',
  'Samsung',
  1299,
  4.8,
  198,
  'Welcome to the era of mobile AI. With Galaxy S24 Ultra in your hands, you can unleash whole new levels of creativity, productivity and possibility.',
  '[
    {"name": "Titanium Gray", "hex": "#8e8e90", "image": "assets/galaxy.png"},
    {"name": "Titanium Yellow", "hex": "#ece3cc", "image": "assets/galaxy.png"},
    {"name": "Titanium Violet", "hex": "#4b415a", "image": "assets/galaxy.png"}
  ]'::jsonb,
  '[
    {"size": "256GB", "extraPrice": 0},
    {"size": "512GB", "extraPrice": 120},
    {"size": "1TB", "extraPrice": 360}
  ]'::jsonb,
  '{
    "display": "6.8\" Dynamic AMOLED 2X, 120Hz, HDR10+",
    "processor": "Snapdragon 8 Gen 3 for Galaxy",
    "camera": "200MP Main + 50MP Periscope + 12MP Ultra Wide + 10MP Telephoto",
    "battery": "5000 mAh, 45W fast charging",
    "os": "Android 14 (One UI 6.1)",
    "weight": "232g"
  }'::jsonb,
  true
),
(
  'pixel-8-pro',
  'Pixel 8 Pro',
  'Google',
  999,
  4.7,
  110,
  'The all-pro phone engineered by Google. It has the best of Google AI, the most advanced Pixel Camera ever, and can help you do more, even faster.',
  '[
    {"name": "Bay Blue", "hex": "#a4c2e6", "image": "assets/pixel.png"},
    {"name": "Obsidian", "hex": "#2d2d2d", "image": "assets/pixel.png"},
    {"name": "Porcelain", "hex": "#f4f0ea", "image": "assets/pixel.png"}
  ]'::jsonb,
  '[
    {"size": "128GB", "extraPrice": 0},
    {"size": "256GB", "extraPrice": 60},
    {"size": "512GB", "extraPrice": 180}
  ]'::jsonb,
  '{
    "display": "6.7\" LTPO OLED, 120Hz, 2400 nits",
    "processor": "Google Tensor G3 (4nm)",
    "camera": "50MP Main + 48MP Ultra Wide + 48MP 5x Telephoto",
    "battery": "5050 mAh, 30W fast charging",
    "os": "Android 14 (Pure Pixel Experience)",
    "weight": "213g"
  }'::jsonb,
  true
),
(
  'oneplus-12',
  'OnePlus 12',
  'OnePlus',
  799,
  4.8,
  85,
  'Redefined flagship specs. Combining the latest hardware with custom optimization, the OnePlus 12 delivers smooth performance, elite cameras, and ultra-fast charging.',
  '[
    {"name": "Flowy Emerald", "hex": "#4e6a57", "image": "assets/oneplus.png"},
    {"name": "Silky Black", "hex": "#1f2022", "image": "assets/oneplus.png"}
  ]'::jsonb,
  '[
    {"size": "256GB", "extraPrice": 0},
    {"size": "512GB", "extraPrice": 100}
  ]'::jsonb,
  '{
    "display": "6.82\" LTPO2 AMOLED, 120Hz, 4500 nits",
    "processor": "Snapdragon 8 Gen 3 (4nm)",
    "camera": "50MP Main + 64MP 3x Periscope + 48MP Ultra Wide",
    "battery": "5400 mAh, 100W SuperVOOC",
    "os": "Android 14 (OxygenOS 14)",
    "weight": "220g"
  }'::jsonb,
  false
),
(
  'xiaomi-14-ultra',
  'Xiaomi 14 Ultra',
  'Xiaomi',
  1099,
  4.9,
  74,
  'Co-engineered with Leica, featuring a quad-camera system with a massive 1-inch sensor and stepless variable aperture. A masterpiece of optical engineering.',
  '[
    {"name": "Black Leather", "hex": "#1a1a1a", "image": "assets/xiaomi.png"},
    {"name": "White Leather", "hex": "#eaeaea", "image": "assets/xiaomi.png"}
  ]'::jsonb,
  '[
    {"size": "512GB", "extraPrice": 0}
  ]'::jsonb,
  '{
    "display": "6.73\" LTPO AMOLED, 120Hz, Dolby Vision",
    "processor": "Snapdragon 8 Gen 3 (4nm)",
    "camera": "50MP Leica 1\" Main + 50MP Telephoto + 50MP Periscope + 50MP Ultra Wide",
    "battery": "5000 mAh, 90W HyperCharge",
    "os": "Android 14 (HyperOS)",
    "weight": "220g"
  }'::jsonb,
  false
),
(
  'xperia-1-vi',
  'Xperia 1 VI',
  'Sony',
  1199,
  4.6,
  43,
  'Designed for creators and audiophiles. Features a unique optical telephoto zoom lens (85-170mm), a brilliant OLED display, and high-res audio jacks.',
  '[
    {"name": "Black", "hex": "#111111", "image": "assets/xperia.png"},
    {"name": "Khaki Green", "hex": "#44493f", "image": "assets/xperia.png"}
  ]'::jsonb,
  '[
    {"size": "256GB", "extraPrice": 0},
    {"size": "512GB", "extraPrice": 150}
  ]'::jsonb,
  '{
    "display": "6.5\" OLED, 120Hz, 19.5:9 ratio",
    "processor": "Snapdragon 8 Gen 3 (4nm)",
    "camera": "48MP Main + 12MP Continuous Telephoto + 12MP Ultra Wide",
    "battery": "5000 mAh, 30W USB-PD",
    "os": "Android 14",
    "weight": "192g"
  }'::jsonb,
  false
);
