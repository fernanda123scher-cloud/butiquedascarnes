import { CartItem } from '../types/order';
import { Product } from '../types/product';
import { calculateSubtotal } from '../utils/formatters';

const CART_STORAGE_KEY = 'butique_carnes_cart';

export interface CartState {
  items: CartItem[];
  subtotal: number;
  totalItemsCount: number;
}

type CartListener = (state: CartState) => void;

class CartStore {
  private items: CartItem[] = [];
  private listeners: Set<CartListener> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem(CART_STORAGE_KEY);
      if (data) {
        this.items = JSON.parse(data);
      }
    } catch {
      this.items = [];
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.items));
    } catch (e) {
      console.error('Erro ao salvar carrinho:', e);
    }
    this.notify();
  }

  private notify(): void {
    const state = this.getState();
    this.listeners.forEach((listener) => listener(state));
  }

  subscribe(listener: CartListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  getState(): CartState {
    const subtotal = this.items.reduce((acc, item) => acc + item.subtotal, 0);
    const totalItemsCount = this.items.reduce((acc, item) => {
      // Para itens por unidade soma os itens, para kg conta como 1 item no carrinho
      return acc + (item.unit === 'unidade' ? item.quantity : 1);
    }, 0);

    return {
      items: [...this.items],
      subtotal: Math.round(subtotal * 100) / 100,
      totalItemsCount
    };
  }

  /**
   * Adiciona ou atualiza produto no carrinho
   */
  addItem(product: Product, quantity: number, notes?: string): void {
    if (quantity <= 0) return;

    const existingIndex = this.items.findIndex((item) => item.productId === product.id);

    if (existingIndex >= 0) {
      const current = this.items[existingIndex];
      // Para kg atualizamos para a nova quantidade ou incrementamos
      const newQuantity = Math.round((current.quantity + quantity) * 1000) / 1000;
      this.items[existingIndex] = {
        ...current,
        quantity: newQuantity,
        subtotal: calculateSubtotal(product.price, newQuantity),
        notes: notes !== undefined ? notes : current.notes
      };
    } else {
      this.items.push({
        productId: product.id,
        productName: product.name,
        unit: product.unit,
        unitPrice: product.price,
        quantity: Math.round(quantity * 1000) / 1000,
        subtotal: calculateSubtotal(product.price, quantity),
        notes,
        imageUrl: product.imageUrl
      });
    }

    this.saveToStorage();
  }

  /**
   * Altera a quantidade de um item existente
   */
  updateQuantity(productId: string, newQuantity: number): void {
    if (newQuantity <= 0) {
      this.removeItem(productId);
      return;
    }

    const index = this.items.findIndex((item) => item.productId === productId);
    if (index >= 0) {
      const item = this.items[index];
      this.items[index] = {
        ...item,
        quantity: Math.round(newQuantity * 1000) / 1000,
        subtotal: calculateSubtotal(item.unitPrice, newQuantity)
      };
      this.saveToStorage();
    }
  }

  /**
   * Atualiza as observações de um item específico
   */
  updateItemNotes(productId: string, notes: string): void {
    const index = this.items.findIndex((item) => item.productId === productId);
    if (index >= 0) {
      this.items[index].notes = notes;
      this.saveToStorage();
    }
  }

  /**
   * Remove item do carrinho
   */
  removeItem(productId: string): void {
    this.items = this.items.filter((item) => item.productId !== productId);
    this.saveToStorage();
  }

  /**
   * Limpa o carrinho inteiro após confirmação do pedido
   */
  clear(): void {
    this.items = [];
    this.saveToStorage();
  }

  /**
   * Retorna se um produto está no carrinho e sua quantidade atual
   */
  getItem(productId: string): CartItem | undefined {
    return this.items.find((item) => item.productId === productId);
  }
}

export const cartStore = new CartStore();
