export type SaleUnit = 'kg' | 'unidade';
export type StockStatus = 'available' | 'unavailable';

export interface Product {
  id: string;
  name: string;
  price: number;
  unit: SaleUnit;
  category: string;
  imageUrl: string;
  description?: string;
  isActive: boolean;
  isFeatured: boolean;
  stockStatus: StockStatus;
  sortOrder: number;
}

export type Category = {
  id: string;
  name: string;
  slug: string;
  icon?: string;
};
