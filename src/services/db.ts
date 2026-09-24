import { Product } from '../types/product';
import { StoreSettings } from '../types/settings';
import { Order, OrderStatus } from '../types/order';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS, INITIAL_CATEGORIES } from './initialData';
import { supabase } from './supabaseClient';

const PRODUCTS_STORAGE_KEY = 'butique_carnes_products';
const SETTINGS_STORAGE_KEY = 'butique_carnes_settings';
const CATEGORIES_STORAGE_KEY = 'butique_carnes_categories';
const ORDERS_STORAGE_KEY = 'butique_carnes_orders';

class DatabaseService {
  // Inicializa dados no LocalStorage se não existirem
  private initialize(): void {
    if (!localStorage.getItem(PRODUCTS_STORAGE_KEY)) {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
    }
    if (!localStorage.getItem(SETTINGS_STORAGE_KEY)) {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(INITIAL_SETTINGS));
    }
    if (!localStorage.getItem(CATEGORIES_STORAGE_KEY)) {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(INITIAL_CATEGORIES));
    }
    if (!localStorage.getItem(ORDERS_STORAGE_KEY)) {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify([]));
    }
  }

  constructor() {
    this.initialize();
  }

  // PRODUTOS
  async getProducts(): Promise<Product[]> {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('sort_order', { ascending: true });

        if (!error && data) {
          if (data.length > 0) {
            const mapped: Product[] = data.map((row) => ({
              id: row.id,
              name: row.name,
              price: Number(row.price),
              unit: row.unit,
              category: row.category_name,
              imageUrl: row.image_url,
              description: row.description || undefined,
              isActive: row.is_active,
              isFeatured: row.is_featured,
              stockStatus: row.stock_status,
              sortOrder: row.sort_order ?? 0,
            }));
            localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(mapped));
            return mapped;
          } else {
            // Se o banco no Supabase estiver vazio, semeia os dados iniciais
            this.seedInitialProductsToSupabase();
          }
        }
      }

      const localData = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (!localData) return INITIAL_PRODUCTS;
      const products: Product[] = JSON.parse(localData);

      let hasChanges = false;
      const initialMap = new Map(INITIAL_PRODUCTS.map((p) => [p.id, p.imageUrl]));

      for (const p of products) {
        const localImg = initialMap.get(p.id);
        if (localImg && p.imageUrl && p.imageUrl.includes('unsplash.com')) {
          p.imageUrl = localImg;
          hasChanges = true;
        }
      }

      if (hasChanges) {
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
      }

      return products;
    } catch (e) {
      console.error('Erro ao ler produtos:', e);
      return INITIAL_PRODUCTS;
    }
  }

  private async seedInitialProductsToSupabase(): Promise<void> {
    if (!supabase) return;
    try {
      const rows = INITIAL_PRODUCTS.map((p, idx) => ({
        name: p.name,
        price: p.price,
        unit: p.unit,
        category_name: p.category,
        image_url: p.imageUrl,
        description: p.description || null,
        is_active: p.isActive,
        is_featured: p.isFeatured,
        stock_status: p.stockStatus,
        sort_order: idx,
      }));
      await supabase.from('products').insert(rows);
    } catch (err) {
      console.warn('Erro ao semear produtos no Supabase:', err);
    }
  }

  async saveProduct(product: Product): Promise<Product> {
    const products = await this.getProducts();
    const index = products.findIndex((p) => p.id === product.id);

    if (index >= 0) {
      products[index] = product;
    } else {
      products.push(product);
    }

    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));

    if (supabase) {
      try {
        await supabase.from('products').upsert({
          id: product.id.length === 36 ? product.id : undefined,
          name: product.name,
          price: product.price,
          unit: product.unit,
          category_name: product.category,
          image_url: product.imageUrl,
          description: product.description || null,
          is_active: product.isActive,
          is_featured: product.isFeatured,
          stock_status: product.stockStatus,
          sort_order: product.sortOrder,
        });
      } catch (err) {
        console.warn('Erro ao sincronizar produto com Supabase:', err);
      }
    }

    return product;
  }

  async updateProductPrice(id: string, newPrice: number): Promise<void> {
    const products = await this.getProducts();
    const product = products.find((p) => p.id === id);
    if (product) {
      product.price = newPrice;
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));

      if (supabase) {
        try {
          await supabase.from('products').update({ price: newPrice }).eq('id', id);
        } catch (err) {
          console.warn('Erro ao atualizar preço no Supabase:', err);
        }
      }
    }
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const products = await this.getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    products[index] = { ...products[index], ...updates };
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));

    if (supabase) {
      try {
        const payload: Record<string, any> = {};
        if (updates.name !== undefined) payload.name = updates.name;
        if (updates.price !== undefined) payload.price = updates.price;
        if (updates.unit !== undefined) payload.unit = updates.unit;
        if (updates.category !== undefined) payload.category_name = updates.category;
        if (updates.imageUrl !== undefined) payload.image_url = updates.imageUrl;
        if (updates.description !== undefined) payload.description = updates.description;
        if (updates.isActive !== undefined) payload.is_active = updates.isActive;
        if (updates.isFeatured !== undefined) payload.is_featured = updates.isFeatured;
        if (updates.stockStatus !== undefined) payload.stock_status = updates.stockStatus;
        if (updates.sortOrder !== undefined) payload.sort_order = updates.sortOrder;

        await supabase.from('products').update(payload).eq('id', id);
      } catch (err) {
        console.warn('Erro ao atualizar produto no Supabase:', err);
      }
    }

    return products[index];
  }

  async deleteProduct(id: string): Promise<void> {
    const products = await this.getProducts();
    const filtered = products.filter((p) => p.id !== id);
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(filtered));

    if (supabase) {
      try {
        await supabase.from('products').delete().eq('id', id);
      } catch (err) {
        console.warn('Erro ao deletar produto no Supabase:', err);
      }
    }
  }

  // CATEGORIAS
  async getCategories(): Promise<string[]> {
    try {
      if (supabase) {
        const { data, error } = await supabase.from('categories').select('name').order('sort_order', { ascending: true });
        if (!error && data && data.length > 0) {
          const list = data.map((c) => c.name);
          localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(list));
          return list;
        }
      }
      const localData = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      return localData ? JSON.parse(localData) : [...INITIAL_CATEGORIES];
    } catch {
      return [...INITIAL_CATEGORIES];
    }
  }

  async saveCategories(categories: string[]): Promise<void> {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    if (supabase) {
      try {
        const rows = categories.map((name, idx) => ({
          name,
          slug: name.toLowerCase().replace(/[\s\W-]+/g, '-'),
          sort_order: idx,
        }));
        await supabase.from('categories').upsert(rows, { onConflict: 'name' });
      } catch (err) {
        console.warn('Erro ao salvar categorias no Supabase:', err);
      }
    }
  }

  // CONFIGURAÇÕES
  async getSettings(): Promise<StoreSettings> {
    try {
      if (supabase) {
        const { data, error } = await supabase.from('settings').select('value').eq('key', 'store_settings').single();
        if (!error && data?.value) {
          localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(data.value));
          return { ...INITIAL_SETTINGS, ...data.value };
        }
      }

      const localData = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (!localData) return INITIAL_SETTINGS;
      const parsed = JSON.parse(localData);
      if (parsed.logoUrl === "/icons/icon-192.png" || !parsed.logoUrl) {
        parsed.logoUrl = INITIAL_SETTINGS.logoUrl;
      }
      if (parsed.whatsappNumber === "79999999999" || !parsed.whatsappNumber) {
        parsed.whatsappNumber = INITIAL_SETTINGS.whatsappNumber;
      }
      if (parsed.storeName === "Butique das Carnes") {
        parsed.storeName = INITIAL_SETTINGS.storeName;
      }
      return { ...INITIAL_SETTINGS, ...parsed };
    } catch {
      return INITIAL_SETTINGS;
    }
  }

  async updateSettings(settings: StoreSettings): Promise<void> {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    if (supabase) {
      try {
        await supabase.from('settings').upsert({
          key: 'store_settings',
          value: settings,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Erro ao salvar settings no Supabase:', err);
      }
    }
  }

  // PEDIDOS
  async getOrders(): Promise<Order[]> {
    try {
      if (supabase) {
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped: Order[] = data.map((o) => ({
            id: o.id,
            customerName: o.customer_name,
            customerPhone: o.customer_phone,
            orderType: o.order_type,
            addressStreet: o.address_street || undefined,
            addressNumber: o.address_number || undefined,
            addressNeighborhood: o.address_neighborhood || undefined,
            addressComplement: o.address_complement || undefined,
            addressReference: o.address_reference || undefined,
            notes: o.notes || undefined,
            subtotal: Number(o.subtotal),
            deliveryFee: Number(o.delivery_fee),
            totalAmount: Number(o.total_amount),
            status: o.status as OrderStatus,
            createdAt: o.created_at,
            items: (o.order_items || []).map((i: any) => ({
              productId: i.product_id || '',
              productName: i.product_name,
              quantity: Number(i.quantity),
              unit: i.unit,
              unitPrice: Number(i.unit_price),
              subtotal: Number(i.subtotal),
              notes: i.notes || undefined,
            })),
          }));
          localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(mapped));
          return mapped;
        }
      }

      const localData = localStorage.getItem(ORDERS_STORAGE_KEY);
      return localData ? JSON.parse(localData) : [];
    } catch {
      return [];
    }
  }

  async saveOrder(order: Order): Promise<void> {
    const orders = await this.getOrders();
    orders.unshift(order);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));

    if (supabase) {
      try {
        const { data: insertedOrder, error: orderErr } = await supabase.from('orders').insert({
          customer_name: order.customerName,
          customer_phone: order.customerPhone,
          order_type: order.orderType,
          address_street: order.addressStreet || null,
          address_number: order.addressNumber || null,
          address_neighborhood: order.addressNeighborhood || null,
          address_complement: order.addressComplement || null,
          address_reference: order.addressReference || null,
          notes: order.notes || null,
          subtotal: order.subtotal,
          delivery_fee: order.deliveryFee,
          total_amount: order.totalAmount,
          status: order.status,
          whatsapp_sent: true,
        }).select().single();

        if (!orderErr && insertedOrder && order.items.length > 0) {
          const itemRows = order.items.map((i) => ({
            order_id: insertedOrder.id,
            product_name: i.productName,
            quantity: i.quantity,
            unit: i.unit,
            unit_price: i.unitPrice,
            subtotal: i.subtotal,
            notes: i.notes || null,
          }));
          await supabase.from('order_items').insert(itemRows);
        }
      } catch (err) {
        console.warn('Erro ao salvar pedido no Supabase:', err);
      }
    }
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    const orders = await this.getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      order.status = status;
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));

      if (supabase) {
        try {
          await supabase.from('orders').update({ status }).eq('id', orderId);
        } catch (err) {
          console.warn('Erro ao atualizar status do pedido no Supabase:', err);
        }
      }
    }
  }
}

export const db = new DatabaseService();
