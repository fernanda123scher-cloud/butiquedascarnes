import React, { useState } from 'react';
import { Plus, Search, Edit3, Flame, Check, AlertTriangle } from 'lucide-react';
import { Product } from '../types/product';
import { formatCurrency } from '../utils/formatters';

interface AdminProductsProps {
  products: Product[];
  categories: string[];
  onOpenCreate: () => void;
  onOpenEdit: (product: Product) => void;
  onToggleActive: (id: string, active: boolean) => Promise<void>;
  onToggleStock: (id: string, available: boolean) => Promise<void>;
  onToggleFeatured: (id: string, featured: boolean) => Promise<void>;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({
  products,
  categories,
  onOpenCreate,
  onOpenEdit,
  onToggleActive,
  onToggleStock,
  onToggleFeatured,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('TODAS');

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCat === 'TODAS' || p.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-5">
      {/* Top Header & New Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-brand-dark border border-brand-border p-5 rounded-2xl">
        <div>
          <h2 className="text-lg font-black text-white uppercase tracking-wider">
            Catálogo de Produtos ({products.length})
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Cadastre novos cortes, ajuste fotos, estoques e destaques do açougue.
          </p>
        </div>

        <button
          onClick={onOpenCreate}
          className="px-5 py-2.5 bg-brand-red hover:bg-brand-redDark text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-brand-red/30 transition-all min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>+ NOVO PRODUTO</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome do produto..."
            className="w-full pl-9 pr-3 py-2.5 bg-brand-dark border border-brand-border rounded-xl text-white text-xs focus:outline-none focus:border-brand-red"
          />
        </div>

        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className="px-3.5 py-2.5 bg-brand-dark border border-brand-border rounded-xl text-white text-xs font-bold focus:outline-none focus:border-brand-red"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Grid of Product Cards for Admin */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((product) => {
          const isAvailable = product.stockStatus !== 'unavailable';

          return (
            <div
              key={product.id}
              className={`bg-brand-dark border rounded-2xl p-4 flex flex-col justify-between transition-all ${
                product.isActive ? 'border-brand-border' : 'border-zinc-800 opacity-60'
              }`}
            >
              {/* Product Top */}
              <div className="flex gap-3">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-16 h-16 rounded-xl object-cover border border-brand-border flex-shrink-0"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] uppercase font-bold text-gray-400">
                      {product.category}
                    </span>
                    {product.isFeatured && (
                      <span className="bg-brand-red/20 text-brand-red text-[10px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <Flame className="w-2.5 h-2.5" /> Destaque
                      </span>
                    )}
                  </div>

                  <h4 className="font-extrabold text-white text-sm truncate mt-0.5">
                    {product.name}
                  </h4>

                  <p className="text-brand-red font-black text-sm mt-0.5">
                    {formatCurrency(product.price)}{' '}
                    <span className="text-[11px] text-gray-400 font-normal">
                      / {product.unit}
                    </span>
                  </p>
                </div>
              </div>

              {/* Badges / Toggles */}
              <div className="grid grid-cols-3 gap-1.5 my-3 pt-3 border-t border-brand-border/60 text-[11px]">
                {/* Ativo */}
                <button
                  onClick={() => onToggleActive(product.id, !product.isActive)}
                  className={`py-1 rounded-lg font-bold border transition-colors flex items-center justify-center gap-1 ${
                    product.isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                  }`}
                  title="Visibilidade no catálogo"
                >
                  <Check className="w-3 h-3" />
                  {product.isActive ? 'Ativo' : 'Oculto'}
                </button>

                {/* Estoque */}
                <button
                  onClick={() => onToggleStock(product.id, !isAvailable)}
                  className={`py-1 rounded-lg font-bold border transition-colors flex items-center justify-center gap-1 ${
                    isAvailable
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}
                  title="Disponibilidade de estoque"
                >
                  {isAvailable ? 'Em Estoque' : 'Esgotado'}
                </button>

                {/* Destaque */}
                <button
                  onClick={() => onToggleFeatured(product.id, !product.isFeatured)}
                  className={`py-1 rounded-lg font-bold border transition-colors flex items-center justify-center gap-1 ${
                    product.isFeatured
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                  }`}
                  title="Destaque na página inicial"
                >
                  <Flame className="w-3 h-3" />
                  Destaque
                </button>
              </div>

              {/* Botão de Edição Completa */}
              <button
                onClick={() => onOpenEdit(product)}
                className="w-full py-2 bg-brand-card hover:bg-brand-border border border-brand-border text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors min-h-[40px]"
              >
                <Edit3 className="w-3.5 h-3.5 text-brand-red" />
                <span>Editar Detalhes & Foto</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
