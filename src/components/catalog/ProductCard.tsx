import React, { useState } from 'react';
import { Plus, Minus, Check, Flame, Scale } from 'lucide-react';
import { Product } from '../../types/product';
import { formatCurrency, formatQuantity, calculateSubtotal } from '../../utils/formatters';
import { useCart } from '../../hooks/useCart';
import { WeightModal } from './WeightModal';

interface ProductCardProps {
  product: Product;
  onShowToast: (message: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onShowToast }) => {
  const { getItem, addItem, updateQuantity } = useCart();
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const cartItem = getItem(product.id);
  const isInCart = Boolean(cartItem && cartItem.quantity > 0);
  const isAvailable = product.isActive && product.stockStatus !== 'unavailable';

  // Adicionar produto
  const handleInitialAdd = () => {
    if (!isAvailable) return;

    if (product.unit === 'kg') {
      // Abre modal rápido para escolher o peso exato ou preset
      setShowWeightModal(true);
    } else {
      // Produto por unidade adiciona 1 unidade diretamente
      addItem(product, 1);
      triggerFeedback();
    }
  };

  const handleConfirmWeight = (quantity: number, notes?: string) => {
    addItem(product, quantity, notes);
    setShowWeightModal(false);
    triggerFeedback();
  };

  const triggerFeedback = () => {
    setJustAdded(true);
    onShowToast(`✓ Adicionado: ${product.name}`);
    setTimeout(() => {
      setJustAdded(false);
    }, 1200);
  };

  // Ajustes diretos no card para unidade
  const handleIncrementUnit = () => {
    if (!cartItem) return;
    updateQuantity(product.id, cartItem.quantity + 1);
  };

  const handleDecrementUnit = () => {
    if (!cartItem) return;
    updateQuantity(product.id, cartItem.quantity - 1);
  };

  // Ajustes diretos no card para KG
  const handleIncrementKg = () => {
    if (!cartItem) return;
    const nextWeight = Math.round((cartItem.quantity + 0.5) * 10) / 10;
    updateQuantity(product.id, nextWeight);
  };

  const handleDecrementKg = () => {
    if (!cartItem) return;
    const nextWeight = Math.round((cartItem.quantity - 0.5) * 10) / 10;
    updateQuantity(product.id, Math.max(0, nextWeight));
  };

  return (
    <>
      <div className="bg-brand-dark border border-brand-border rounded-2xl overflow-hidden flex flex-col justify-between shadow-lg transition-transform active:scale-[0.99]">
        {/* Top: Image & Badges */}
        <div className="relative aspect-[4/3] w-full bg-brand-black overflow-hidden group">
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Destaque Tag */}
          {product.isFeatured && (
            <div className="absolute top-2.5 left-2.5 bg-brand-red text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md">
              <Flame className="w-3 h-3" />
              <span>Destaque</span>
            </div>
          )}

          {/* Indisponível Overlay */}
          {!isAvailable && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px] flex items-center justify-center p-3 text-center">
              <span className="bg-zinc-800 text-zinc-300 text-xs font-black px-3 py-1.5 rounded-lg uppercase tracking-wider border border-zinc-700">
                Indisponível
              </span>
            </div>
          )}

          {/* Quick Feedback Toast Badge */}
          {justAdded && (
            <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-sm flex items-center justify-center transition-all duration-150">
              <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg animate-bounce">
                <Check className="w-4 h-4" /> Adicionado!
              </span>
            </div>
          )}
        </div>

        {/* Middle: Details */}
        <div className="p-3.5 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-white text-sm sm:text-base leading-snug line-clamp-1">
              {product.name}
            </h3>
            {product.description && (
              <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                {product.description}
              </p>
            )}
          </div>

          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="text-brand-red font-black text-base sm:text-lg">
                {formatCurrency(product.price)}
              </span>
              <span className="text-[11px] text-gray-400 font-medium">
                / {product.unit === 'kg' ? 'kg' : 'unidade'}
              </span>
            </div>

            {/* Subtotal se estiver no carrinho */}
            {isInCart && cartItem && (
              <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                No pedido: {formatQuantity(cartItem.quantity, cartItem.unit)} = {formatCurrency(cartItem.subtotal)}
              </div>
            )}
          </div>
        </div>

        {/* Bottom: Action Controls */}
        <div className="p-3.5 pt-0">
          {!isAvailable ? (
            <button
              disabled
              className="w-full py-2.5 bg-zinc-800 text-zinc-500 text-xs font-bold rounded-xl cursor-not-allowed uppercase min-h-[44px]"
            >
              Indisponível
            </button>
          ) : !cartItem || cartItem.quantity <= 0 ? (
            <button
              onClick={handleInitialAdd}
              className="w-full py-2.5 bg-brand-red hover:bg-brand-redDark text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-brand-red/20 transition-all active:scale-[0.98] min-h-[44px]"
            >
              <Plus className="w-4 h-4" />
              <span>+ ADICIONAR</span>
            </button>
          ) : (
            /* Stepper Controls */
            <div className="flex items-center justify-between bg-brand-card border border-brand-border rounded-xl p-1 min-h-[44px]">
              <button
                onClick={product.unit === 'kg' ? handleDecrementKg : handleDecrementUnit}
                className="w-10 h-10 rounded-lg bg-brand-dark hover:bg-brand-border text-white font-bold flex items-center justify-center transition-colors min-w-[40px] min-h-[40px]"
                aria-label="Diminuir"
              >
                <Minus className="w-4 h-4" />
              </button>

              <button
                onClick={() => product.unit === 'kg' && setShowWeightModal(true)}
                title={product.unit === 'kg' ? 'Clique para ajustar o peso exato' : undefined}
                className="flex-1 text-center font-black text-xs sm:text-sm text-white px-1 hover:text-brand-red transition-colors flex items-center justify-center gap-1"
              >
                <span>{formatQuantity(cartItem.quantity, cartItem.unit)}</span>
                {product.unit === 'kg' && <Scale className="w-3 h-3 text-gray-400" />}
              </button>

              <button
                onClick={product.unit === 'kg' ? handleIncrementKg : handleIncrementUnit}
                className="w-10 h-10 rounded-lg bg-brand-red hover:bg-brand-redDark text-white font-bold flex items-center justify-center shadow transition-colors min-w-[40px] min-h-[40px]"
                aria-label="Aumentar"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de seleção de peso caso o cliente queira peso específico */}
      {showWeightModal && (
        <WeightModal
          product={product}
          currentQuantity={cartItem ? cartItem.quantity : 1.0}
          onConfirm={handleConfirmWeight}
          onClose={() => setShowWeightModal(false)}
        />
      )}
    </>
  );
};
