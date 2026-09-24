-- ==========================================================
-- BUTIQUE DAS CARNES - SUPABASE SCHEMA & RLS POLICIES
-- ==========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    unit TEXT NOT NULL CHECK (unit IN ('kg', 'unidade')),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    category_name TEXT NOT NULL DEFAULT 'CARNES DO DIA A DIA',
    image_url TEXT,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    stock_status TEXT NOT NULL DEFAULT 'available' CHECK (stock_status IN ('available', 'unavailable')),
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. SETTINGS TABLE
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. DELIVERY ZONES TABLE
CREATE TABLE IF NOT EXISTS delivery_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    neighborhood TEXT NOT NULL UNIQUE,
    fee NUMERIC(10, 2) NOT NULL DEFAULT 5.00 CHECK (fee >= 0),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    order_type TEXT NOT NULL CHECK (order_type IN ('delivery', 'pickup')),
    address_street TEXT,
    address_number TEXT,
    address_neighborhood TEXT,
    address_complement TEXT,
    address_reference TEXT,
    notes TEXT,
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    status TEXT NOT NULL DEFAULT 'NOVO' CHECK (status IN ('NOVO', 'EM PREPARAÇÃO', 'PRONTO', 'SAIU PARA ENTREGA', 'CONCLUÍDO', 'CANCELADO')),
    whatsapp_sent BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    quantity NUMERIC(10, 3) NOT NULL CHECK (quantity > 0),
    unit TEXT NOT NULL CHECK (unit IN ('kg', 'unidade')),
    unit_price NUMERIC(10, 2) NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Categories: Public read, Authenticated write
CREATE POLICY "Public categories read" ON categories FOR SELECT USING (true);
CREATE POLICY "Admin categories manage" ON categories FOR ALL TO authenticated USING (true);

-- Products: Public read active, Authenticated full manage
CREATE POLICY "Public products read" ON products FOR SELECT USING (is_active = true OR auth.role() = 'authenticated');
CREATE POLICY "Admin products manage" ON products FOR ALL TO authenticated USING (true);

-- Settings: Public read, Authenticated update
CREATE POLICY "Public settings read" ON settings FOR SELECT USING (true);
CREATE POLICY "Admin settings manage" ON settings FOR ALL TO authenticated USING (true);

-- Delivery Zones: Public read, Authenticated update
CREATE POLICY "Public delivery_zones read" ON delivery_zones FOR SELECT USING (true);
CREATE POLICY "Admin delivery_zones manage" ON delivery_zones FOR ALL TO authenticated USING (true);

-- Orders & Items: Public can insert their own orders, Admin can view/edit
CREATE POLICY "Public orders insert" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin orders manage" ON orders FOR ALL TO authenticated USING (true);

CREATE POLICY "Public order_items insert" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin order_items manage" ON order_items FOR ALL TO authenticated USING (true);

-- Storage bucket for meat images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('meat-images', 'meat-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Meat Images Read" ON storage.objects
FOR SELECT USING (bucket_id = 'meat-images');

CREATE POLICY "Admin Meat Images Insert" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'meat-images');

CREATE POLICY "Admin Meat Images Delete" ON storage.objects
FOR DELETE TO authenticated USING (bucket_id = 'meat-images');
