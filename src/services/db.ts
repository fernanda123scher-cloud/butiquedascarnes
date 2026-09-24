import { Product } from '../types/product';
import { StoreSettings } from '../types/settings';
import { Order, OrderStatus } from '../types/order';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS, INITIAL_CATEGORIES } from './initialData';

const PRODUCTS_STORAGE_KEY = 'butique_carnes_products';
const SETTINGS_STORAGE_KEY = 'butique_carnes_settings';
const CATEGORIES_STORAGE_KEY = 'butique_carnes_categories';
const ORDERS_STORAGE_KEY = 'butique_carnes_orders';

class DatabaseService {
  // Inicializa dados se não existirem
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
      const data = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (!data) return INITIAL_PRODUCTS;
      const products: Product[] = JSON.parse(data);

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
      console.error('Erro ao ler produtos do cache:', e);
      return INITIAL_PRODUCTS;
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
    return product;
  }

  async updateProductPrice(id: string, newPrice: number): Promise<void> {
    const products = await this.getProducts();
    const product = products.find((p) => p.id === id);
    if (product) {
      product.price = newPrice;
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    }
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const products = await this.getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    products[index] = { ...products[index], ...updates };
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    return products[index];
  }

  async deleteProduct(id: string): Promise<void> {
    const products = await this.getProducts();
    const filtered = products.filter((p) => p.id !== id);
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(filtered));
  }

  // CATEGORIAS
  async getCategories(): Promise<string[]> {
    try {
      const data = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      return data ? JSON.parse(data) : [...INITIAL_CATEGORIES];
    } catch {
      return [...INITIAL_CATEGORIES];
    }
  }

  async saveCategories(categories: string[]): Promise<void> {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
  }

  async getSettings(): Promise<StoreSettings> {
    try {
      const data = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (!data) return INITIAL_SETTINGS;
      const parsed = JSON.parse(data);
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
  }

  // PEDIDOS
  async getOrders(): Promise<Order[]> {
    try {
      const data = localStorage.getItem(ORDERS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  async saveOrder(order: Order): Promise<void> {
    const orders = await this.getOrders();
    orders.unshift(order); // adiciona no início
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    const orders = await this.getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      order.status = status;
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    }
  }
}

export const db = new DatabaseService();
