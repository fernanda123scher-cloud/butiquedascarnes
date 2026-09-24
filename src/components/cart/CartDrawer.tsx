import React, { useState } from 'react';
import { 
  X, Trash2, Plus, Minus, ShoppingCart, Truck, Store, 
  Send, AlertCircle, ArrowLeft, CheckCircle2 
} from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { StoreSettings } from '../../types/settings';
import { Order, OrderType } from '../../types/order';
import { formatCurrency, formatQuantity, formatPhoneNumber } from '../../utils/formatters';
import { generateWhatsAppMessage, buildWhatsAppLink } from '../../services/whatsappService';
import { db } from '../../services/db';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StoreSettings;
  onShowToast: (message: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  settings,
  onShowToast,
}) => {
  const { items, subtotal, updateQuantity, removeItem, clear } = useCart();

  // Estado do formulário de checkout
  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [orderType, setOrderType] = useState<OrderType>('delivery');
  
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [addressStreet, setAddressStreet] = useState('');
  const [addressNumber, setAddressNumber] = useState('');
  const [addressNeighborhood, setAddressNeighborhood] = useState('');
  const [addressComplement, setAddressComplement] = useState('');
  const [addressReference, setAddressReference] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Cálculo da taxa de entrega
  const currentDeliveryFee = orderType === 'delivery' 
    ? (settings.isFreeDelivery ? 0 : settings.deliveryFee) 
    : 0;
  const totalAmount = Math.round((subtotal + currentDeliveryFee) * 100) / 100;

  // Validação do checkout
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!customerName.trim()) {
      errors.name = 'Por favor, informe seu nome.';
    }

    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      errors.phone = 'Informe um telefone válido com DDD.';
    }

    if (orderType === 'delivery') {
      if (!addressStreet.trim()) errors.street = 'Informe o nome da rua/avenida.';
      if (!addressNumber.trim()) errors.number = 'Informe o número.';
      if (!addressNeighborhood.trim()) errors.neighborhood = 'Informe o bairro.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerPhone(formatPhoneNumber(e.target.value));
  };

  // Envio final para WhatsApp
  const handleFinalizeOrder = async () => {
    if (!validateForm()) return;
    if (items.length === 0) return;

    setIsSubmitting(true);

    try {
      const order: Order = {
        id: `ped-${Date.now()}`,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        orderType,
        addressStreet: orderType === 'delivery' ? addressStreet.trim() : undefined,
        addressNumber: orderType === 'delivery' ? addressNumber.trim() : undefined,
        addressNeighborhood: orderType === 'delivery' ? addressNeighborhood.trim() : undefined,
        addressComplement: orderType === 'delivery' ? addressComplement.trim() : undefined,
        addressReference: orderType === 'delivery' ? addressReference.trim() : undefined,
        notes: orderNotes.trim() || undefined,
        items,
        subtotal,
        deliveryFee: currentDeliveryFee,
        totalAmount,
        status: 'NOVO',
        createdAt: new Date().toISOString()
      };

      // 1. Salva no banco local/Supabase para registro do painel admin
      await db.saveOrder(order);

      // 2. Monta mensagem oficial e gera link do WhatsApp
      const message = generateWhatsAppMessage(order);
      const whatsappUrl = buildWhatsAppLink(settings.whatsappNumber, message);

      // 3. Limpa o carrinho
      clear();
      onShowToast('✓ Pedido gerado! Abrindo WhatsApp...');

      // 4. Abre o WhatsApp oficial do açougue
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

      // 5. Fecha gaveta
      onClose();
    } catch (err) {
      console.error('Erro ao processar pedido:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-brand-black border-l border-brand-border w-full max-w-lg h-full flex flex-col justify-between shadow-2xl overflow-hidden">
        
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-brand-border bg-brand-dark/90 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {step === 'checkout' ? (
              <button
                onClick={() => setStep('cart')}
                className="p-1.5 -ml-1 text-gray-400 hover:text-white rounded-lg"
                aria-label="Voltar"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <ShoppingCart className="w-5 h-5 text-brand-red" />
            )}
            <h2 className="font-extrabold text-white text-base uppercase tracking-wider">
              {step === 'cart' ? 'Seu Carrinho' : 'Finalizar Pedido'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-lg"
            aria-label="Fechar carrinho"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-brand-dark flex items-center justify-center text-gray-500">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-lg text-white">Seu carrinho está vazio</h3>
              <p className="text-xs text-gray-400 max-w-xs">
                Navegue pelo catálogo e escolha seus cortes e espetinhos favoritos para começar.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-6 py-2.5 bg-brand-red text-white text-xs font-bold rounded-xl"
              >
                Ver Carnes
              </button>
            </div>
          ) : step === 'cart' ? (
            /* STEP 1: ITENS DO CARRINHO */
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="bg-brand-dark border border-brand-border rounded-2xl p-3.5 flex gap-3 items-center justify-between"
                >
                  {/* Foto miniatura */}
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-16 h-16 rounded-xl object-cover border border-brand-border flex-shrink-0"
                    />
                  )}

                  {/* Informações */}
                  <div className="flex-1 min-w-0 pr-2">
                    <h4 className="font-bold text-white text-sm truncate">
                      {item.productName}
                    </h4>
                    <p className="text-[11px] text-gray-400">
                      {formatCurrency(item.unitPrice)} / {item.unit}
                    </p>
                    <p className="text-xs font-black text-brand-red mt-1">
                      {formatCurrency(item.subtotal)}
                    </p>
                    {item.notes && (
                      <p className="text-[10px] text-zinc-400 italic truncate mt-0.5">
                        Obs: {item.notes}
                      </p>
                    )}
                  </div>

                  {/* Controles de Quantidade */}
                  <div className="flex items-center gap-1.5 bg-brand-black border border-brand-border rounded-xl p-1">
                    <button
                      onClick={() => {
                        const stepVal = item.unit === 'kg' ? 0.5 : 1;
                        const nextVal = Math.round((item.quantity - stepVal) * 10) / 10;
                        updateQuantity(item.productId, Math.max(0, nextVal));
                      }}
                      className="w-8 h-8 rounded-lg bg-brand-dark hover:bg-brand-border text-white flex items-center justify-center"
                      aria-label="Diminuir quantidade"
                    >
                      {item.quantity <= (item.unit === 'kg' ? 0.5 : 1) ? (
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      ) : (
                        <Minus className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <span className="text-xs font-bold text-white px-1.5 min-w-[42px] text-center">
                      {formatQuantity(item.quantity, item.unit)}
                    </span>

                    <button
                      onClick={() => {
                        const stepVal = item.unit === 'kg' ? 0.5 : 1;
                        const nextVal = Math.round((item.quantity + stepVal) * 10) / 10;
                        updateQuantity(item.productId, nextVal);
                      }}
                      className="w-8 h-8 rounded-lg bg-brand-red hover:bg-brand-redDark text-white flex items-center justify-center"
                      aria-label="Aumentar quantidade"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="pt-2 flex justify-between items-center">
                <button
                  onClick={clear}
                  className="text-xs text-gray-500 hover:text-red-400 flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Limpar carrinho
                </button>
                <button
                  onClick={onClose}
                  className="text-xs font-bold text-gray-300 hover:text-white"
                >
                  + Adicionar mais itens
                </button>
              </div>
            </div>
          ) : (
            /* STEP 2: DADOS DE ENTREGA / RETIRADA */
            <div className="space-y-4 text-left">
              {/* Seletor Entrega / Retirada */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-300 block mb-2">
                  Como você quer receber?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOrderType('delivery')}
                    className={`py-3 px-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition-all min-h-[44px] ${
                      orderType === 'delivery'
                        ? 'bg-brand-red text-white border-brand-red shadow-lg shadow-brand-red/20'
                        : 'bg-brand-dark text-gray-400 border-brand-border hover:bg-brand-card'
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                    <span>ENTREGA</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderType('pickup')}
                    className={`py-3 px-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition-all min-h-[44px] ${
                      orderType === 'pickup'
                        ? 'bg-brand-red text-white border-brand-red shadow-lg shadow-brand-red/20'
                        : 'bg-brand-dark text-gray-400 border-brand-border hover:bg-brand-card'
                    }`}
                  >
                    <Store className="w-4 h-4" />
                    <span>RETIRADA NA LOJA</span>
                  </button>
                </div>
              </div>

              {/* Dados do Cliente */}
              <div className="space-y-3 bg-brand-dark border border-brand-border rounded-2xl p-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Seus Dados
                </h4>

                <div>
                  <label className="text-[11px] font-semibold text-gray-400 block mb-1">
                    Seu Nome *
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ex: Fernanda Silva"
                    className="w-full px-3.5 py-2.5 bg-brand-black border border-brand-border rounded-xl text-white text-sm focus:outline-none focus:border-brand-red"
                  />
                  {formErrors.name && (
                    <p className="text-red-400 text-[11px] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {formErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-gray-400 block mb-1">
                    Telefone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={handlePhoneChange}
                    placeholder="(79) 99999-9999"
                    maxLength={15}
                    className="w-full px-3.5 py-2.5 bg-brand-black border border-brand-border rounded-xl text-white text-sm focus:outline-none focus:border-brand-red"
                  />
                  {formErrors.phone && (
                    <p className="text-red-400 text-[11px] mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {formErrors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Endereço (Apenas se ENTREGA) */}
              {orderType === 'delivery' && (
                <div className="space-y-3 bg-brand-dark border border-brand-border rounded-2xl p-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
                    <span>Endereço de Entrega</span>
                    <span className="text-[11px] text-brand-red font-bold">
                      Taxa: {settings.isFreeDelivery ? 'Grátis' : formatCurrency(settings.deliveryFee)}
                    </span>
                  </h4>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <label className="text-[11px] font-semibold text-gray-400 block mb-1">
                        Rua / Avenida *
                      </label>
                      <input
                        type="text"
                        value={addressStreet}
                        onChange={(e) => setAddressStreet(e.target.value)}
                        placeholder="Rua das Flores"
                        className="w-full px-3 py-2 bg-brand-black border border-brand-border rounded-xl text-white text-xs focus:outline-none focus:border-brand-red"
                      />
                      {formErrors.street && (
                        <p className="text-red-400 text-[10px] mt-1">{formErrors.street}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-gray-400 block mb-1">
                        Número *
                      </label>
                      <input
                        type="text"
                        value={addressNumber}
                        onChange={(e) => setAddressNumber(e.target.value)}
                        placeholder="123"
                        className="w-full px-3 py-2 bg-brand-black border border-brand-border rounded-xl text-white text-xs focus:outline-none focus:border-brand-red"
                      />
                      {formErrors.number && (
                        <p className="text-red-400 text-[10px] mt-1">{formErrors.number}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-gray-400 block mb-1">
                      Bairro *
                    </label>
                    <input
                      type="text"
                      value={addressNeighborhood}
                      onChange={(e) => setAddressNeighborhood(e.target.value)}
                      placeholder="Centro"
                      className="w-full px-3 py-2 bg-brand-black border border-brand-border rounded-xl text-white text-xs focus:outline-none focus:border-brand-red"
                    />
                    {formErrors.neighborhood && (
                      <p className="text-red-400 text-[10px] mt-1">{formErrors.neighborhood}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-gray-400 block mb-1">
                        Complemento (opcional)
                      </label>
                      <input
                        type="text"
                        value={addressComplement}
                        onChange={(e) => setAddressComplement(e.target.value)}
                        placeholder="Apto 102"
                        className="w-full px-3 py-2 bg-brand-black border border-brand-border rounded-xl text-white text-xs focus:outline-none focus:border-brand-red"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-gray-400 block mb-1">
                        Ponto de referência
                      </label>
                      <input
                        type="text"
                        value={addressReference}
                        onChange={(e) => setAddressReference(e.target.value)}
                        placeholder="Próximo à praça"
                        className="w-full px-3 py-2 bg-brand-black border border-brand-border rounded-xl text-white text-xs focus:outline-none focus:border-brand-red"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Se RETIRADA, exibe endereço da loja */}
              {orderType === 'pickup' && (
                <div className="p-3 bg-brand-dark/50 border border-brand-border rounded-xl text-xs text-gray-300 flex items-start gap-2">
                  <Store className="w-4 h-4 text-brand-red flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">Retirada no Balcão:</p>
                    <p className="text-gray-400 mt-0.5">{settings.storeAddress}</p>
                    <p className="text-gray-400">{settings.openingHours}</p>
                  </div>
                </div>
              )}

              {/* Observações do Pedido */}
              <div className="bg-brand-dark border border-brand-border rounded-2xl p-4">
                <label className="text-xs font-bold text-white uppercase tracking-wider block mb-1">
                  Observações do pedido (opcional)
                </label>
                <textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Ex: Quero a picanha fatiada em bifes de 2 dedos, etc."
                  rows={2}
                  className="w-full px-3 py-2 bg-brand-black border border-brand-border rounded-xl text-white text-xs focus:outline-none focus:border-brand-red resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer / Resumo de Valores e Ação */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-brand-border bg-brand-dark space-y-3">
            {/* Totais */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal:</span>
                <span className="font-semibold text-white">{formatCurrency(subtotal)}</span>
              </div>

              {orderType === 'delivery' && (
                <div className="flex justify-between text-gray-400">
                  <span>Taxa de entrega:</span>
                  <span className="font-semibold text-white">
                    {settings.isFreeDelivery || currentDeliveryFee === 0 ? 'Grátis' : formatCurrency(currentDeliveryFee)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-base font-black text-white pt-2 border-t border-brand-border/60">
                <span>TOTAL:</span>
                <span className="text-brand-red">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            {/* Botões de Ação */}
            {step === 'cart' ? (
              <button
                onClick={() => setStep('checkout')}
                className="w-full py-3.5 bg-brand-red hover:bg-brand-redDark text-white font-bold rounded-xl shadow-lg shadow-brand-red/30 transition-all flex items-center justify-center gap-2 min-h-[48px]"
              >
                <span>Avançar para Entrega / Retirada</span>
              </button>
            ) : (
              <button
                onClick={handleFinalizeOrder}
                disabled={isSubmitting}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm uppercase tracking-wide rounded-xl shadow-xl shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 min-h-[50px] active:scale-[0.98]"
              >
                <Send className="w-5 h-5" />
                <span>ENVIAR PEDIDO PELO WHATSAPP</span>
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
