import React, { useState, useEffect, useMemo } from 'react';
import { Product } from './types/product';
import { StoreSettings } from './types/settings';
import { Order, OrderStatus } from './types/order';
import { db } from './services/db';

// Componentes da Loja
import { Header } from './components/common/Header';
import { SearchBar } from './components/common/SearchBar';
import { CategoryPills } from './components/common/CategoryPills';
import { FeaturedSection } from './components/catalog/FeaturedSection';
import { ProductCard } from './components/catalog/ProductCard';
import { FloatingCartBar } from './components/cart/FloatingCartBar';
import { CartDrawer } from './components/cart/CartDrawer';
import { Toast } from './components/common/Toast';
import { InstallPrompt } from './components/pwa/InstallPrompt';
import { MascotPresentation } from './components/catalog/MascotPresentation';

// Componentes do Admin
import { AdminLogin } from './admin/AdminLogin';
import { AdminLayout } from './admin/AdminLayout';

export const App: React.FC = () => {
  // Estado de visão (Catálogo ou Painel Admin)
  const [currentView, setCurrentView] = useState<'store' | 'admin-login' | 'admin'>('store');
  
  // Dados do sistema
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  // Filtros da loja pública
  const [selectedCategory, setSelectedCategory] = useState<string>('TODAS');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Modais e Feedback
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Inicialização e sincronização
  useEffect(() => {
    const loadAll = async () => {
      const [prods, cats, sets, ords] = await Promise.all([
        db.getProducts(),
        db.getCategories(),
        db.getSettings(),
        db.getOrders()
      ]);
      setProducts(prods);
      setCategories(cats);
      setSettings(sets);
      setOrders(ords);
    };

    loadAll();

    // Verifica URL hash para /admin
    if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
      const isAuth = sessionStorage.getItem('butique_admin_session') === 'authenticated';
      setCurrentView(isAuth ? 'admin' : 'admin-login');
    }
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
  };

  // Filtro inteligente e ultrarrápido de produtos
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (!product.isActive) return false;

      // Filtro por busca
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase().trim());

      // Filtro por categoria
      const matchesCategory =
        selectedCategory === 'TODAS' ||
        product.category === selectedCategory ||
        (selectedCategory === 'CHURRASCO' && (product.category === 'CHURRASCO' || product.isFeatured));

      return matchesSearch && matchesCategory;
    });
  }, [products, selectedCategory, searchTerm]);

  // Ações Administrativas
  const handleSaveProduct = async (product: Product) => {
    await db.saveProduct(product);
    const updated = await db.getProducts();
    setProducts(updated);
  };

  const handleDeleteProduct = async (id: string) => {
    await db.deleteProduct(id);
    const updated = await db.getProducts();
    setProducts(updated);
  };

  const handleUpdatePrice = async (id: string, newPrice: number) => {
    await db.updateProductPrice(id, newPrice);
    const updated = await db.getProducts();
    setProducts(updated);
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    await db.updateProduct(id, { isActive: active });
    const updated = await db.getProducts();
    setProducts(updated);
  };

  const handleToggleStock = async (id: string, available: boolean) => {
    await db.updateProduct(id, { stockStatus: available ? 'available' : 'unavailable' });
    const updated = await db.getProducts();
    setProducts(updated);
  };

  const handleToggleFeatured = async (id: string, featured: boolean) => {
    await db.updateProduct(id, { isFeatured: featured });
    const updated = await db.getProducts();
    setProducts(updated);
  };

  const handleSaveCategories = async (cats: string[]) => {
    await db.saveCategories(cats);
    setCategories(cats);
  };

  const handleUpdateOrderStatus = async (id: string, status: OrderStatus) => {
    await db.updateOrderStatus(id, status);
    const updated = await db.getOrders();
    setOrders(updated);
  };

  const handleSaveSettings = async (newSettings: StoreSettings) => {
    await db.updateSettings(newSettings);
    setSettings(newSettings);
  };

  // Navegação entre Loja e Admin
  const handleNavigateAdmin = () => {
    const isAuth = sessionStorage.getItem('butique_admin_session') === 'authenticated';
    setCurrentView(isAuth ? 'admin' : 'admin-login');
    window.location.hash = '#admin';
  };

  const handleBackToStore = () => {
    setCurrentView('store');
    window.location.hash = '';
  };

  const handleLogout = () => {
    sessionStorage.removeItem('butique_admin_session');
    setCurrentView('store');
    window.location.hash = '';
    showToast('Sessão administrativa encerrada.');
  };

  if (!settings) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center p-4">
        <div className="w-8 h-8 border-2 border-brand-red border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Visualização do Login do Admin
  if (currentView === 'admin-login') {
    return (
      <AdminLogin
        onLoginSuccess={() => setCurrentView('admin')}
        onBackToStore={handleBackToStore}
      />
    );
  }

  // Visualização do Painel Administrativo
  if (currentView === 'admin') {
    return (
      <>
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
        <AdminLayout
          products={products}
          categories={categories}
          orders={orders}
          settings={settings}
          onBackToStore={handleBackToStore}
          onLogout={handleLogout}
          onSaveProduct={handleSaveProduct}
          onDeleteProduct={handleDeleteProduct}
          onUpdatePrice={handleUpdatePrice}
          onToggleActive={handleToggleActive}
          onToggleStock={handleToggleStock}
          onToggleFeatured={handleToggleFeatured}
          onSaveCategories={handleSaveCategories}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onSaveSettings={handleSaveSettings}
          onShowToast={showToast}
        />
      </>
    );
  }

  // Visualização do Catálogo Público (Mobile-First)
  return (
    <div className="min-h-screen bg-brand-black text-white flex flex-col pb-28">
      {/* Toast de Feedback */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Notificação PWA de Instalação */}
      <InstallPrompt />

      {/* Header Compacto */}
      <Header
        storeName={settings.storeName}
        logoUrl={settings.logoUrl}
        onOpenCart={() => setIsCartOpen(true)}
        onNavigateAdmin={handleNavigateAdmin}
      />

      {/* Conteúdo Principal Centralizado (máx 1200px) */}
      <main className="max-w-[1200px] w-full mx-auto px-4 pt-5 pb-8 space-y-6">
        
        {/* Banner de Boas-vindas / Hero Compacto */}
        <div className="text-center sm:text-left space-y-1">
          <span className="text-xs font-black text-brand-red uppercase tracking-widest block">
            CARNES FRESQUINHAS
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Escolha suas carnes e faça seu pedido
          </h2>
          <p className="text-xs text-gray-400">
            Cortes selecionados, fracionamento preciso por KG e envio direto para o WhatsApp.
          </p>
        </div>

        {/* Barra de Busca Instantânea */}
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {/* Categorias Horizontais com Rolagem Suave */}
        <CategoryPills
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Seção 🔥 DESTAQUES (Visível apenas quando 'TODAS' está selecionada e sem busca) */}
        {selectedCategory === 'TODAS' && !searchTerm && (
          <FeaturedSection
            products={products}
            onShowToast={showToast}
          />
        )}

        {/* Grade de Produtos */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-white">
              {searchTerm ? `Resultados para "${searchTerm}"` : selectedCategory}
            </h3>
            <span className="text-xs text-gray-400 font-semibold">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'produto' : 'produtos'}
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-12 text-center bg-brand-dark/50 border border-brand-border rounded-3xl p-8 space-y-2">
              <p className="font-bold text-white text-base">Nenhuma carne encontrada</p>
              <p className="text-xs text-gray-400">
                Tente buscar por outro termo ou selecione outra categoria acima.
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-2 text-xs font-bold text-brand-red hover:underline"
                >
                  Limpar busca
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onShowToast={showToast}
                />
              ))}
            </div>
          )}
        </section>

        {/* Apresentação no Final: Vídeo na Brasa & Mascote Boi Açougueiro Apresentando */}
        <MascotPresentation
          settings={settings}
          onScrollToCatalog={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </main>

      {/* Carrinho Fixo Inferior */}
      <FloatingCartBar onOpenCart={() => setIsCartOpen(true)} />

      {/* Gaveta / Modal de Carrinho e Checkout WhatsApp */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        settings={settings}
        onShowToast={showToast}
      />
    </div>
  );
};

export default App;
