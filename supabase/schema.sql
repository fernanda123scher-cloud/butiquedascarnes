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
-- Storage bucket for meat images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('meat-images', 'meat-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Meat Images Read" ON storage.objects
FOR SELECT USING (bucket_id = 'meat-images');

CREATE POLICY "Public Meat Images Insert" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'meat-images');

-- Full app access policies (permite sincronização completa do PWA e Admin)
DROP POLICY IF EXISTS "Public products manage" ON products;
CREATE POLICY "Public products manage" ON products FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public categories manage" ON categories;
CREATE POLICY "Public categories manage" ON categories FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public settings manage" ON settings;
CREATE POLICY "Public settings manage" ON settings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public orders select" ON orders;
CREATE POLICY "Public orders select" ON orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public orders update" ON orders FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public order_items select" ON order_items;
CREATE POLICY "Public order_items select" ON order_items FOR SELECT USING (true);

-- ==========================================================
-- 7. DADOS INICIAIS (SEED)
-- ==========================================================
INSERT INTO categories (name, slug, sort_order) VALUES
('CARNES NOBRES', 'carnes-nobres', 0),
('CARNES DO DIA A DIA', 'carnes-do-dia-a-dia', 1),
('ESPETINHOS', 'espetinhos', 2)
ON CONFLICT (name) DO NOTHING;

INSERT INTO products (name, price, unit, category_name, image_url, is_active, is_featured, stock_status, sort_order) VALUES
('Picanha aparada', 67.00, 'kg', 'CARNES NOBRES', '/images/meats/picanha.png', true, true, 'available', 1),
('Filé', 55.00, 'kg', 'CARNES NOBRES', '/images/meats/contra_file.jpg', true, true, 'available', 2),
('Contra-filé', 48.00, 'kg', 'CARNES NOBRES', '/images/meats/contra_file.jpg', true, true, 'available', 3),
('Alcatra', 48.00, 'kg', 'CARNES NOBRES', '/images/meats/alcatra.png', true, true, 'available', 4),
('Maminha', 48.00, 'kg', 'CARNES NOBRES', '/images/meats/maminha.jpg', true, false, 'available', 5),
('Patinho', 45.00, 'kg', 'CARNES DO DIA A DIA', '/images/meats/patinho.webp', true, false, 'available', 6),
('Coxão mole', 45.00, 'kg', 'CARNES DO DIA A DIA', '/images/meats/coxao_mole.webp', true, false, 'available', 7),
('Cupim', 45.00, 'kg', 'CARNES NOBRES', '/images/meats/cupim.webp', true, false, 'available', 8),
('Fraldinha', 42.00, 'kg', 'CARNES NOBRES', '/images/meats/fraldinha.jpg', true, false, 'available', 9),
('Coxão duro', 42.00, 'kg', 'CARNES DO DIA A DIA', '/images/meats/coxao_duro.webp', true, false, 'available', 10),
('Lagarto', 42.00, 'kg', 'CARNES DO DIA A DIA', '/images/meats/lagarto.webp', true, false, 'available', 11),
('Acém', 28.00, 'kg', 'CARNES DO DIA A DIA', '/images/meats/acem.jpg', true, false, 'available', 12),
('Paleta', 28.00, 'kg', 'CARNES DO DIA A DIA', '/images/meats/paleta.webp', true, false, 'available', 13),
('Músculo sem osso', 28.00, 'kg', 'CARNES DO DIA A DIA', '/images/meats/musculo_sem_osso.jpg', true, false, 'available', 14),
('Peito', 25.00, 'kg', 'CARNES DO DIA A DIA', '/images/meats/peito.webp', true, false, 'available', 15),
('Costela', 25.00, 'kg', 'CARNES DO DIA A DIA', '/images/meats/costela.webp', true, false, 'available', 16),
('Espetinho de carne', 5.50, 'unidade', 'ESPETINHOS', '/images/meats/contra_file.jpg', true, true, 'available', 17),
('Coração', 5.00, 'unidade', 'ESPETINHOS', '/images/meats/contra_file.jpg', true, false, 'available', 18),
('Frango', 4.50, 'unidade', 'ESPETINHOS', '/images/meats/contra_file.jpg', true, false, 'available', 19),
('Porco', 4.50, 'unidade', 'ESPETINHOS', '/images/meats/contra_file.jpg', true, false, 'available', 20);
