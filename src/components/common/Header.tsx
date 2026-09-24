import React from 'react';
import { ShoppingCart, ShieldCheck, Flame } from 'lucide-react';
import { useCart } from '../../hooks/useCart';

interface HeaderProps {
  storeName: string;
  logoUrl?: string;
  onOpenCart: () => void;
  onNavigateAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({ storeName, logoUrl, onOpenCart, onNavigateAdmin }) => {
  const { totalItemsCount } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-brand-black/95 backdrop-blur border-b border-brand-border px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={storeName}
              className="w-11 h-11 rounded-full object-contain bg-black border-2 border-brand-red/40 shadow-md shadow-brand-red/25 flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-red to-brand-redDark flex items-center justify-center shadow-md shadow-brand-red/20 flex-shrink-0">
              <Flame className="w-6 h-6 text-white" />
            </div>
          )}
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight uppercase">
              {storeName}
            </h1>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] font-medium text-gray-400">Açougue Aberto • Pedidos Online</span>
            </div>
          </div>
        </div>

        {/* Right Actions: Cart & Admin */}
        <div className="flex items-center gap-2">
          {/* Subtle Admin Button */}
          <button
            onClick={onNavigateAdmin}
            title="Painel Administrativo"
            className="p-2.5 text-gray-400 hover:text-white hover:bg-brand-dark rounded-lg transition-colors"
            aria-label="Admin"
          >
            <ShieldCheck className="w-5 h-5" />
          </button>

          {/* Cart Icon Button with Counter */}
          <button
            onClick={onOpenCart}
            className="relative p-2.5 bg-brand-dark hover:bg-brand-border text-white rounded-lg transition-colors border border-brand-border flex items-center justify-center min-w-[44px] min-h-[44px]"
            aria-label="Carrinho"
          >
            <ShoppingCart className="w-5 h-5 text-brand-white" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-brand-red text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-brand-black">
                {totalItemsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
