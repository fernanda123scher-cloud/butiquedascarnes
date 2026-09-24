import React from 'react';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatters';

interface FloatingCartBarProps {
  onOpenCart: () => void;
}

export const FloatingCartBar: React.FC<FloatingCartBarProps> = ({ onOpenCart }) => {
  const { totalItemsCount, subtotal, items } = useCart();

  if (items.length === 0) return null;

  return (
    <aside aria-label="Carrinho fixo" className="fixed bottom-0 left-0 right-0 z-40 p-4 pb-6 pointer-events-none">
      <div className="max-w-md mx-auto pointer-events-auto">
        <button
          onClick={onOpenCart}
          className="w-full bg-brand-red hover:bg-brand-redDark text-white py-3.5 px-5 rounded-2xl shadow-2xl shadow-brand-red/40 flex items-center justify-between transition-all transform active:scale-[0.98] border border-red-500/30 backdrop-blur-md min-h-[52px]"
          aria-label="Abrir carrinho de compras"
        >
          {/* Left: Icon & Count */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <span className="text-xs font-semibold text-red-100 block">
                {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'itens'} no carrinho
              </span>
              <span className="text-base font-extrabold text-white">
                {formatCurrency(subtotal)}
              </span>
            </div>
          </div>

          {/* Right: Call to action */}
          <div className="flex items-center gap-1.5 font-bold text-sm bg-black/25 px-3 py-1.5 rounded-xl border border-white/10">
            <span>Ver Pedido</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>
      </div>
    </aside>
  );
};
