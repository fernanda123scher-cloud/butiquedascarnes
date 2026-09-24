import React from 'react';
import { 
  Package, ShoppingCart, DollarSign, Sparkles, 
  Plus, CheckCircle2, TrendingUp, Store 
} from 'lucide-react';
import { Product } from '../types/product';
import { Order } from '../types/order';
import { formatCurrency } from '../utils/formatters';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  onNavigateTab: (tab: 'products' | 'prices' | 'orders' | 'settings' | 'categories') => void;
  onOpenNewProduct: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  orders,
  onNavigateTab,
  onOpenNewProduct,
}) => {
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.isActive).length;
  const totalOrders = orders.length;
  const totalOrdersValue = orders.reduce((acc, o) => acc + o.totalAmount, 0);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-redDark to-brand-red p-6 rounded-3xl shadow-xl border border-red-500/20 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider bg-black/30 px-3 py-1 rounded-full border border-white/20 inline-block mb-2">
            Visão Geral
          </span>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Painel de Controle do Açougue
          </h2>
          <p className="text-xs sm:text-sm text-red-100 mt-1 max-w-md">
            Gerencie seu cardápio de carnes, atualize preços instantaneamente e atenda pedidos no WhatsApp.
          </p>
        </div>

        {/* Quick Shortcuts */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onOpenNewProduct}
            className="px-4 py-2.5 bg-white text-brand-black hover:bg-gray-100 font-extrabold text-xs rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-brand-red" />
            <span>+ NOVO PRODUTO</span>
          </button>
          <button
            onClick={() => onNavigateTab('prices')}
            className="px-4 py-2.5 bg-black/40 hover:bg-black/60 text-white font-extrabold text-xs rounded-xl border border-white/30 transition-transform active:scale-95 flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>EDITAR PREÇOS</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Produtos */}
        <div className="bg-brand-dark border border-brand-border rounded-2xl p-4 sm:p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-red/10 border border-brand-red/30 flex items-center justify-center text-brand-red flex-shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Cadastrados
            </p>
            <h4 className="text-xl sm:text-2xl font-black text-white">{totalProducts}</h4>
            <span className="text-[10px] text-gray-500">Carnes & Espetinhos</span>
          </div>
        </div>

        {/* Produtos Ativos */}
        <div className="bg-brand-dark border border-brand-border rounded-2xl p-4 sm:p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Produtos Ativos
            </p>
            <h4 className="text-xl sm:text-2xl font-black text-white">{activeProducts}</h4>
            <span className="text-[10px] text-emerald-400 font-semibold">Visíveis no catálogo</span>
          </div>
        </div>

        {/* Pedidos */}
        <div className="bg-brand-dark border border-brand-border rounded-2xl p-4 sm:p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Total de Pedidos
            </p>
            <h4 className="text-xl sm:text-2xl font-black text-white">{totalOrders}</h4>
            <span className="text-[10px] text-blue-400 font-semibold">Registrados</span>
          </div>
        </div>

        {/* Faturamento Estimado */}
        <div className="bg-brand-dark border border-brand-border rounded-2xl p-4 sm:p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Valor dos Pedidos
            </p>
            <h4 className="text-xl sm:text-2xl font-black text-white">
              {formatCurrency(totalOrdersValue)}
            </h4>
            <span className="text-[10px] text-amber-400 font-semibold">Total acumulado</span>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => onNavigateTab('prices')}
          className="p-5 bg-brand-dark hover:bg-brand-card border border-brand-border rounded-2xl text-left transition-all hover:border-brand-red group"
        >
          <div className="flex items-center justify-between mb-2">
            <Sparkles className="w-6 h-6 text-brand-red group-hover:scale-110 transition-transform" />
            <span className="text-xs text-gray-400 font-bold uppercase">Acesso Rápido →</span>
          </div>
          <h4 className="font-extrabold text-base text-white">Tabela Rápida de Preços</h4>
          <p className="text-xs text-gray-400 mt-1">
            Atualize o preço de cortes e espetinhos em 1 segundo.
          </p>
        </button>

        <button
          onClick={() => onNavigateTab('products')}
          className="p-5 bg-brand-dark hover:bg-brand-card border border-brand-border rounded-2xl text-left transition-all hover:border-brand-red group"
        >
          <div className="flex items-center justify-between mb-2">
            <Package className="w-6 h-6 text-brand-red group-hover:scale-110 transition-transform" />
            <span className="text-xs text-gray-400 font-bold uppercase">Gerenciar →</span>
          </div>
          <h4 className="font-extrabold text-base text-white">Catálogo Completo</h4>
          <p className="text-xs text-gray-400 mt-1">
            Adicione novas fotos WebP, edite cortes e ative destaques.
          </p>
        </button>

        <button
          onClick={() => onNavigateTab('orders')}
          className="p-5 bg-brand-dark hover:bg-brand-card border border-brand-border rounded-2xl text-left transition-all hover:border-brand-red group"
        >
          <div className="flex items-center justify-between mb-2">
            <ShoppingCart className="w-6 h-6 text-brand-red group-hover:scale-110 transition-transform" />
            <span className="text-xs text-gray-400 font-bold uppercase">Ver Pedidos →</span>
          </div>
          <h4 className="font-extrabold text-base text-white">Fila de Pedidos</h4>
          <p className="text-xs text-gray-400 mt-1">
            Acompanhe pedidos enviados via WhatsApp e mude seus status.
          </p>
        </button>
      </div>
    </div>
  );
};
