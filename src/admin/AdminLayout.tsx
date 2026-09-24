import React, { useState } from 'react';
import { 
  LayoutDashboard, Package, Sparkles, Layers, 
  ShoppingCart, Settings, LogOut, ArrowLeft, Flame 
} from 'lucide-react';
import { Product } from '../types/product';
import { Order, OrderStatus } from '../types/order';
import { StoreSettings } from '../types/settings';

import { AdminDashboard } from './AdminDashboard';
import { AdminProducts } from './AdminProducts';
import { AdminQuickPrices } from './AdminQuickPrices';
import { AdminCategories } from './AdminCategories';
import { AdminOrders } from './AdminOrders';
import { AdminSettings } from './AdminSettings';
import { ProductEditModal } from './ProductEditModal';

interface AdminLayoutProps {
  products: Product[];
  categories: string[];
  orders: Order[];
  settings: StoreSettings;
  onBackToStore: () => void;
  onLogout: () => void;
  onSaveProduct: (p: Product) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
  onUpdatePrice: (id: string, price: number) => Promise<void>;
  onToggleActive: (id: string, active: boolean) => Promise<void>;
  onToggleStock: (id: string, available: boolean) => Promise<void>;
  onToggleFeatured: (id: string, featured: boolean) => Promise<void>;
  onSaveCategories: (cats: string[]) => Promise<void>;
  onUpdateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  onSaveSettings: (settings: StoreSettings) => Promise<void>;
  onShowToast: (msg: string) => void;
}

type TabType = 'dashboard' | 'products' | 'prices' | 'categories' | 'orders' | 'settings';

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  products,
  categories,
  orders,
  settings,
  onBackToStore,
  onLogout,
  onSaveProduct,
  onDeleteProduct,
  onUpdatePrice,
  onToggleActive,
  onToggleStock,
  onToggleFeatured,
  onSaveCategories,
  onUpdateOrderStatus,
  onSaveSettings,
  onShowToast,
}) => {
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setIsModalOpen(true);
  };

  const handleSaveModal = async (p: Product) => {
    await onSaveProduct(p);
    setIsModalOpen(false);
    onShowToast(`✓ Produto "${p.name}" salvo com sucesso!`);
  };

  const handleDeleteModal = async (id: string) => {
    await onDeleteProduct(id);
    setIsModalOpen(false);
    onShowToast('✓ Produto excluído com sucesso.');
  };

  interface NavItemDef {
    id: TabType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }

  const navItems: NavItemDef[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'prices', label: 'Preços', icon: Sparkles },
    { id: 'categories', label: 'Categorias', icon: Layers },
    { id: 'orders', label: 'Pedidos', icon: ShoppingCart, badge: orders.filter(o => o.status === 'NOVO').length },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-brand-black text-white flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-brand-dark/95 backdrop-blur border-b border-brand-border px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToStore}
              className="p-2 text-gray-400 hover:text-white hover:bg-brand-card rounded-lg transition-colors"
              title="Voltar ao Catálogo"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-red flex items-center justify-center">
                <Flame className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-sm sm:text-base uppercase tracking-wider text-white">
                Painel Admin <span className="text-gray-500 font-normal">| {settings.storeName}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onBackToStore}
              className="hidden sm:inline-flex px-3 py-1.5 bg-brand-card hover:bg-brand-border text-xs font-bold rounded-lg text-gray-300 hover:text-white transition-colors"
            >
              Ver Loja
            </button>
            <button
              onClick={onLogout}
              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-lg transition-colors"
              title="Sair do painel"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Submenu (Desktop & Mobile Scroll) */}
      <div className="border-b border-brand-border bg-brand-black/90 sticky top-[57px] z-30">
        <div className="max-w-6xl mx-auto px-4 overflow-x-auto no-scrollbar flex items-center gap-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id as TabType)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all whitespace-nowrap min-h-[40px] ${
                  isActive
                    ? 'bg-brand-red text-white shadow-md shadow-brand-red/20'
                    : 'text-gray-400 hover:text-white hover:bg-brand-dark'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
                {Boolean(item.badge && item.badge > 0) && (
                  <span className="bg-white text-brand-red text-[10px] font-black px-1.5 py-0.2 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 pb-20">
        {currentTab === 'dashboard' && (
          <AdminDashboard
            products={products}
            orders={orders}
            onNavigateTab={(tab) => setCurrentTab(tab)}
            onOpenNewProduct={handleOpenCreate}
          />
        )}

        {currentTab === 'products' && (
          <AdminProducts
            products={products}
            categories={categories}
            onOpenCreate={handleOpenCreate}
            onOpenEdit={handleOpenEdit}
            onToggleActive={onToggleActive}
            onToggleStock={onToggleStock}
            onToggleFeatured={onToggleFeatured}
          />
        )}

        {currentTab === 'prices' && (
          <AdminQuickPrices
            products={products}
            onUpdatePrice={onUpdatePrice}
            onShowToast={onShowToast}
          />
        )}

        {currentTab === 'categories' && (
          <AdminCategories
            categories={categories}
            onSaveCategories={onSaveCategories}
            onShowToast={onShowToast}
          />
        )}

        {currentTab === 'orders' && (
          <AdminOrders
            orders={orders}
            onUpdateStatus={onUpdateOrderStatus}
            onShowToast={onShowToast}
          />
        )}

        {currentTab === 'settings' && (
          <AdminSettings
            settings={settings}
            onSave={onSaveSettings}
            onShowToast={onShowToast}
          />
        )}
      </main>

      {/* Modal de Criação / Edição de Produto */}
      {isModalOpen && (
        <ProductEditModal
          product={editingProduct}
          categories={categories}
          onSave={handleSaveModal}
          onDelete={handleDeleteModal}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};
