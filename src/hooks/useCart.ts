import { useState, useEffect } from 'react';
import { cartStore, CartState } from '../store/cartStore';

export function useCart(): CartState & {
  addItem: typeof cartStore.addItem;
  updateQuantity: typeof cartStore.updateQuantity;
  updateItemNotes: typeof cartStore.updateItemNotes;
  removeItem: typeof cartStore.removeItem;
  clear: typeof cartStore.clear;
  getItem: typeof cartStore.getItem;
} {
  const [state, setState] = useState<CartState>(cartStore.getState());

  useEffect(() => {
    return cartStore.subscribe((newState) => {
      setState(newState);
    });
  }, []);

  return {
    ...state,
    addItem: cartStore.addItem.bind(cartStore),
    updateQuantity: cartStore.updateQuantity.bind(cartStore),
    updateItemNotes: cartStore.updateItemNotes.bind(cartStore),
    removeItem: cartStore.removeItem.bind(cartStore),
    clear: cartStore.clear.bind(cartStore),
    getItem: cartStore.getItem.bind(cartStore),
  };
}
