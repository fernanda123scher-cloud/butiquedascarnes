import { SaleUnit } from './product';

export type OrderStatus = 
  | 'NOVO' 
  | 'EM PREPARAÇÃO' 
  | 'PRONTO' 
  | 'SAIU PARA ENTREGA' 
  | 'CONCLUÍDO' 
  | 'CANCELADO';

export type OrderType = 'delivery' | 'pickup';

export interface CartItem {
  productId: string;
  productName: string;
  unit: SaleUnit;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  notes?: string;
  imageUrl?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  orderType: OrderType;
  addressStreet?: string;
  addressNumber?: string;
  addressNeighborhood?: string;
  addressComplement?: string;
  addressReference?: string;
  notes?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}
