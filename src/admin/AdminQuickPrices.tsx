import React, { useState } from 'react';
import { Check, Edit3, Search, Sparkles } from 'lucide-react';
import { Product } from '../types/product';
import { formatCurrency } from '../utils/formatters';

interface AdminQuickPricesProps {
  products: Product[];
  onUpdatePrice: (productId: string, newPrice: number) => Promise<void>;
  onShowToast: (msg: string) => void;
}

export const AdminQuickPrices: React.FC<AdminQuickPricesProps> = ({
  products,
  onUpdatePrice,
  onShowToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPriceVal, setEditPriceVal] = useState<string>('');

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startEditing = (product: Product) => {
    setEditingId(product.id);
    setEditPriceVal(product.price.toFixed(2).replace('.', ','));
  };

  const handleSavePrice = async (productId: string) => {
    const parsed = parseFloat(editPriceVal.replace(',', '.'));
    if (!isNaN(parsed) && parsed > 0) {
      await onUpdatePrice(productId, parsed);
      onShowToast('✓ Preço atualizado com sucesso!');
    }
    setEditingId(null);
  };

  return (
    <div className="space-y-5">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-brand-dark border border-brand-border p-5 rounded-2xl">
        <div>
          <h2 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-red" />
            Edição Rápida de Preços
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Altere os valores de carnes e espetinhos em 1 clique sem precisar abrir o cadastro completo.
          </p>
        </div>

        {/* Busca rápida */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filtrar carne..."
            className="w-full pl-9 pr-3 py-2 bg-brand-black border border-brand-border rounded-xl text-white text-xs focus:outline-none focus:border-brand-red"
          />
        </div>
      </div>

      {/* Lista de Preços */}
      <div className="bg-brand-dark border border-brand-border rounded-2xl overflow-hidden divide-y divide-brand-border">
        {filtered.map((product) => {
          const isBeingEdited = editingId === product.id;

          return (
            <div
              key={product.id}
              className="p-4 flex items-center justify-between gap-4 hover:bg-brand-card/50 transition-colors"
            >
              {/* Produto info */}
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-12 h-12 rounded-xl object-cover border border-brand-border flex-shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="font-bold text-white text-sm truncate">
                    {product.name}
                  </h4>
                  <span className="text-[11px] text-gray-400 uppercase tracking-wider">
                    {product.category} • por {product.unit}
                  </span>
                </div>
              </div>

              {/* Preço e Ação */}
              <div className="flex items-center gap-3 flex-shrink-0">
                {isBeingEdited ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 font-bold">R$</span>
                    <input
                      type="text"
                      autoFocus
                      value={editPriceVal}
                      onChange={(e) => setEditPriceVal(e.target.value.replace(/[^0-9,.]/g, ''))}
                      className="w-24 px-2 py-1.5 bg-brand-black border border-brand-red rounded-lg text-white font-extrabold text-sm focus:outline-none text-right"
                    />
                    <button
                      onClick={() => handleSavePrice(product.id)}
                      className="p-2 bg-brand-red hover:bg-brand-redDark text-white rounded-lg transition-colors"
                      title="Salvar preço"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="text-base font-black text-brand-red">
                      {formatCurrency(product.price)}
                    </span>
                    <button
                      onClick={() => startEditing(product)}
                      className="px-3 py-1.5 bg-brand-card hover:bg-brand-border border border-brand-border text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-brand-red" />
                      <span>EDITAR</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
