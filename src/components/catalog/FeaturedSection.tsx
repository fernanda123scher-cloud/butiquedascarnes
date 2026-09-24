import React from 'react';
import { Flame } from 'lucide-react';
import { Product } from '../../types/product';
import { ProductCard } from './ProductCard';

interface FeaturedSectionProps {
  products: Product[];
  onShowToast: (message: string) => void;
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({ products, onShowToast }) => {
  const featuredProducts = products.filter((p) => p.isFeatured && p.isActive);

  if (featuredProducts.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-brand-red/10 text-brand-red">
          <Flame className="w-5 h-5 fill-brand-red" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-black tracking-tight text-white uppercase">
            🔥 DESTAQUES DO AÇOUGUE
          </h2>
          <p className="text-xs text-gray-400">Os cortes mais pedidos da semana</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {featuredProducts.map((product) => (
          <ProductCard
            key={`featured-${product.id}`}
            product={product}
            onShowToast={onShowToast}
          />
        ))}
      </div>
    </section>
  );
};
