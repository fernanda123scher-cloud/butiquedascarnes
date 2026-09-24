import { Order } from '../types/order';
import { formatCurrency, formatQuantity } from '../utils/formatters';

/**
 * Gera o texto exato da mensagem para o WhatsApp do açougue.
 */
export function generateWhatsAppMessage(order: Order): string {
  const lines: string[] = [];

  lines.push('🥩 NOVO PEDIDO');
  lines.push('');
  lines.push('Cliente:');
  lines.push(order.customerName);
  lines.push('');
  lines.push('Telefone:');
  lines.push(order.customerPhone);
  lines.push('');
  lines.push('Forma de recebimento:');
  lines.push(order.orderType === 'delivery' ? 'ENTREGA' : 'RETIRADA NA LOJA');
  lines.push('');

  if (order.orderType === 'delivery') {
    lines.push('Endereço:');
    lines.push(`Rua: ${order.addressStreet || ''}`);
    lines.push(`Número: ${order.addressNumber || 'S/N'}`);
    lines.push(`Bairro: ${order.addressNeighborhood || ''}`);
    if (order.addressComplement && order.addressComplement.trim()) {
      lines.push(`Complemento: ${order.addressComplement}`);
    }
    if (order.addressReference && order.addressReference.trim()) {
      lines.push(`Ponto de referência: ${order.addressReference}`);
    }
    lines.push('');
  }

  lines.push('ITENS:');
  lines.push('');

  order.items.forEach((item, index) => {
    lines.push(`${index + 1}. ${item.productName}`);
    lines.push(`Quantidade: ${formatQuantity(item.quantity, item.unit)}`);
    lines.push(`Valor: ${formatCurrency(item.subtotal)}`);
    if (item.notes && item.notes.trim()) {
      lines.push(`Obs item: ${item.notes.trim()}`);
    }
    lines.push('');
  });

  lines.push('Subtotal:');
  lines.push(formatCurrency(order.subtotal));
  lines.push('');

  if (order.orderType === 'delivery') {
    lines.push('Taxa de entrega:');
    lines.push(order.deliveryFee === 0 ? 'Grátis' : formatCurrency(order.deliveryFee));
    lines.push('');
  }

  lines.push('TOTAL:');
  lines.push(formatCurrency(order.totalAmount));

  if (order.notes && order.notes.trim()) {
    lines.push('');
    lines.push('Observações:');
    lines.push(order.notes.trim());
  }

  return lines.join('\n');
}

/**
 * Cria o link com codificação segura de URL para abrir diretamente no WhatsApp.
 */
export function buildWhatsAppLink(whatsappNumber: string, message: string): string {
  // Limpa caracteres não numéricos do telefone
  const cleanNumber = whatsappNumber.replace(/\D/g, '');
  // Adiciona DDI 55 do Brasil se não estiver presente
  const fullNumber = cleanNumber.startsWith('55') ? cleanNumber : `55${cleanNumber}`;
  
  const encodedText = encodeURIComponent(message);
  return `https://api.whatsapp.com/send?phone=${fullNumber}&text=${encodedText}`;
}
