import { SaleUnit } from '../types/product';

/**
 * Formata um valor numérico para moeda brasileira (Real - BRL).
 * Exemplo: 80.4 -> "R$ 80,40"
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Calcula o subtotal com precisão decimal exata para evitar dízimas periódicas de ponto flutuante.
 * Exemplo: 67.00 * 1.2 = 80.40
 */
export function calculateSubtotal(unitPrice: number, quantity: number): number {
  return Math.round(unitPrice * quantity * 100) / 100;
}

/**
 * Formata a quantidade com sua respectiva unidade.
 * Exemplo: 1.2 para 'kg' -> "1,2 kg"
 * Exemplo: 3 para 'unidade' -> "3 un"
 */
export function formatQuantity(quantity: number, unit: SaleUnit): string {
  if (unit === 'kg') {
    // Formata o número decimal em pt-BR (vírgula)
    const formattedNum = quantity.toLocaleString('pt-BR', {
      minimumFractionDigits: quantity % 1 === 0 ? 0 : 1,
      maximumFractionDigits: 3
    });
    return `${formattedNum} kg`;
  }
  return `${quantity} un`;
}

/**
 * Máscara para telefone celular brasileiro: (XX) XXXXX-XXXX
 */
export function formatPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}
