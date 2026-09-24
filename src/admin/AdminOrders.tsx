import React, { useState } from 'react';
import { Package, Clock, Phone, MapPin, Truck, Store } from 'lucide-react';
import { Order, OrderStatus } from '../types/order';
import { formatCurrency, formatQuantity } from '../utils/formatters';

interface AdminOrdersProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  onShowToast: (msg: string) => void;
}

const STATUS_OPTIONS: OrderStatus[] = [
  'NOVO',
  'EM PREPARAÇÃO',
  'PRONTO',
  'SAIU PARA ENTREGA',
  'CONCLUÍDO',
  'CANCELADO'
];

export const AdminOrders: React.FC<AdminOrdersProps> = ({
  orders,
  onUpdateStatus,
  onShowToast,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('TODOS');

  const filteredOrders = filterStatus === 'TODOS'
    ? orders
    : orders.filter((o) => o.status === filterStatus);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'NOVO':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'EM PREPARAÇÃO':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'PRONTO':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'SAIU PARA ENTREGA':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'CONCLUÍDO':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'CANCELADO':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Bar with Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-brand-dark border border-brand-border p-5 rounded-2xl">
        <div>
          <h2 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
            <Package className="w-5 h-5 text-brand-red" />
            Controle de Pedidos
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Acompanhe todos os pedidos recebidos via WhatsApp e atualize seu status em tempo real.
          </p>
        </div>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3.5 py-2 bg-brand-black border border-brand-border rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-brand-red"
        >
          <option value="TODOS">Todos os Status ({orders.length})</option>
          {STATUS_OPTIONS.map((st) => (
            <option key={st} value={st}>
              {st} ({orders.filter((o) => o.status === st).length})
            </option>
          ))}
        </select>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-brand-dark border border-brand-border rounded-2xl p-12 text-center space-y-2">
          <Clock className="w-10 h-10 text-gray-600 mx-auto" />
          <h3 className="font-bold text-white text-base">Nenhum pedido encontrado</h3>
          <p className="text-xs text-gray-400">
            Os pedidos confirmados pelos clientes aparecerão listados aqui.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-brand-dark border border-brand-border rounded-2xl p-5 space-y-4 shadow-lg"
            >
              {/* Top Row: Customer & Status */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-brand-border/60 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-white text-base">
                      {order.customerName}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">
                      #{order.id.slice(-6)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mt-1">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <Phone className="w-3.5 h-3.5" /> {order.customerPhone}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      {order.orderType === 'delivery' ? (
                        <span className="text-amber-400 flex items-center gap-1 font-semibold">
                          <Truck className="w-3.5 h-3.5" /> Entrega
                        </span>
                      ) : (
                        <span className="text-blue-400 flex items-center gap-1 font-semibold">
                          <Store className="w-3.5 h-3.5" /> Retirada no Balcão
                        </span>
                      )}
                    </span>
                    <span>•</span>
                    <span>{new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                {/* Status Selector */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>

                  <select
                    value={order.status}
                    onChange={async (e) => {
                      const newStatus = e.target.value as OrderStatus;
                      await onUpdateStatus(order.id, newStatus);
                      onShowToast(`Status atualizado para: ${newStatus}`);
                    }}
                    className="px-2.5 py-1.5 bg-brand-black border border-brand-border rounded-lg text-white text-xs font-semibold focus:outline-none focus:border-brand-red cursor-pointer"
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>
                        Mudar para: {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Middle Row: Items & Delivery Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Items */}
                <div className="bg-brand-black/60 border border-brand-border rounded-xl p-3 space-y-2">
                  <h5 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Itens Solicitados:
                  </h5>
                  <ul className="space-y-1.5 text-xs">
                    {order.items.map((it, idx) => (
                      <li key={idx} className="flex justify-between items-center text-white">
                        <span>
                          <strong className="text-brand-red">{formatQuantity(it.quantity, it.unit)}</strong> {it.productName}
                          {it.notes && <span className="text-gray-400 italic block text-[10px]">({it.notes})</span>}
                        </span>
                        <span className="font-semibold text-gray-300">
                          {formatCurrency(it.subtotal)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Address & Notes */}
                <div className="space-y-2 text-xs">
                  {order.orderType === 'delivery' && (
                    <div className="bg-brand-black/60 border border-brand-border rounded-xl p-3">
                      <h5 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1 mb-1">
                        <MapPin className="w-3.5 h-3.5 text-brand-red" /> Endereço de Entrega:
                      </h5>
                      <p className="text-white font-medium">
                        {order.addressStreet}, nº {order.addressNumber}
                      </p>
                      <p className="text-gray-400">
                        Bairro: {order.addressNeighborhood}
                        {order.addressComplement && ` • Compl: ${order.addressComplement}`}
                      </p>
                      {order.addressReference && (
                        <p className="text-gray-500 text-[11px]">
                          Ref: {order.addressReference}
                        </p>
                      )}
                    </div>
                  )}

                  {order.notes && (
                    <div className="p-3 bg-brand-black/60 border border-brand-border rounded-xl">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
                        Observações do Cliente:
                      </span>
                      <p className="text-white italic">{order.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Row: Values Summary */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-brand-border/60 text-xs">
                <div className="flex items-center gap-4 text-gray-400">
                  <span>Subtotal: <strong className="text-white">{formatCurrency(order.subtotal)}</strong></span>
                  {order.orderType === 'delivery' && (
                    <span>Taxa Entrega: <strong className="text-white">{formatCurrency(order.deliveryFee)}</strong></span>
                  )}
                </div>
                <div className="text-sm font-black text-white">
                  TOTAL: <span className="text-brand-red text-base">{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
