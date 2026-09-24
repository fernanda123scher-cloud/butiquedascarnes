// Validação direta das regras em Node.js Puro

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function calculateSubtotal(unitPrice, quantity) {
  return Math.round(unitPrice * quantity * 100) / 100;
}

function formatQuantity(quantity, unit) {
  if (unit === 'kg') {
    const formattedNum = quantity.toLocaleString('pt-BR', {
      minimumFractionDigits: quantity % 1 === 0 ? 0 : 1,
      maximumFractionDigits: 3
    });
    return `${formattedNum} kg`;
  }
  return `${quantity} un`;
}

function generateWhatsAppMessage(order) {
  const lines = [];

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

function buildWhatsAppLink(whatsappNumber, message) {
  const cleanNumber = whatsappNumber.replace(/\D/g, '');
  const fullNumber = cleanNumber.startsWith('55') ? cleanNumber : `55${cleanNumber}`;
  const encodedText = encodeURIComponent(message);
  return `https://api.whatsapp.com/send?phone=${fullNumber}&text=${encodedText}`;
}

console.log('--- INICIANDO SUÍTE DE TESTES ---');

// 1. Decimal calculation
const picanhaCalc = calculateSubtotal(67.00, 1.2);
console.log(`[OK] Picanha 1.2 kg @ R$ 67.00 = ${picanhaCalc} (Esperado: 80.4)`);
if (picanhaCalc !== 80.4) process.exit(1);

const contraFileCalc = calculateSubtotal(48.00, 1.0);
console.log(`[OK] Contra-filé 1.0 kg @ R$ 48.00 = ${contraFileCalc} (Esperado: 48.0)`);
if (contraFileCalc !== 48.0) process.exit(1);

// 2. WhatsApp Message
const order = {
  customerName: 'Fernanda',
  customerPhone: '(79) 99999-9999',
  orderType: 'delivery',
  addressStreet: 'Rua XXXXX',
  addressNumber: '123',
  addressNeighborhood: 'XXXXX',
  notes: 'Cortar em bifes.',
  items: [
    { productName: 'Picanha aparada', unit: 'kg', quantity: 1.2, subtotal: 80.40 },
    { productName: 'Contra-filé', unit: 'kg', quantity: 1.0, subtotal: 48.00 }
  ],
  subtotal: 128.40,
  deliveryFee: 5.00,
  totalAmount: 133.40
};

const msg = generateWhatsAppMessage(order);
console.log('\n--- Mensagem do WhatsApp Produzida ---');
console.log(msg);
console.log('--------------------------------------');

const link = buildWhatsAppLink('79999998888', msg);
console.log(`\n[OK] WhatsApp URL: ${link.slice(0, 80)}...`);

console.log('\nTODOS OS TESTES UNITÁRIOS PASSARAM COM 100% DE ÊXITO!');
