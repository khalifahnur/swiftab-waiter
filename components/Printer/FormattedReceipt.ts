// import COMMANDS from "./Command";

// const formatReceipt = (items) => {
//     const date = new Date().toLocaleString();
//     let receipt = '';
  
//     // Header
//     receipt += COMMANDS.ALIGN_CENTER;
//     receipt += 'MY STORE\n';
//     receipt += '123 Store Street\n';
//     receipt += 'Tel: (123) 456-7890\n\n';
  
//     // Date and Line
//     receipt += COMMANDS.ALIGN_LEFT;
//     receipt += `Date: ${date}\n`;
//     receipt += '--------------------------------\n';
  
//     // Items
//     receipt += 'ITEM      QTY    PRICE    TOTAL\n';
//     receipt += '--------------------------------\n';
  
//     let total = 0;
//     items.forEach((item) => {
//       const itemTotal = item.price * item.quantity;
//       total += itemTotal;
//       receipt += `${item.name.padEnd(10)} ${item.quantity}    $${item.price.toFixed(2)}   $${itemTotal.toFixed(2)}\n`;
//     });
  
//     // Footer
//     receipt += '--------------------------------\n';
//     receipt += `TOTAL: $${total.toFixed(2)}\n\n`;
//     receipt += COMMANDS.ALIGN_CENTER;
//     receipt += 'Thank you for your purchase!\n';
//     receipt += 'Please come again\n\n\n';
//     receipt += COMMANDS.CUT_PAPER;
  
//     return receipt;
//   };
// export default formatReceipt;



import { OrderItem, ReceiptConfig } from '../../types';

const DEFAULT_CONFIG: ReceiptConfig = {
  storeName: 'My Store',
  taxRate: 0.1, // 10%
  currency: '$'
};

export const formatReceipt = (
  items: OrderItem[],
  config: Partial<ReceiptConfig> = {}
): string => {
  const finalConfig: ReceiptConfig = { ...DEFAULT_CONFIG, ...config };
  const { storeName, storeAddress, phoneNumber, taxRate, currency } = finalConfig;

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  // Center text helper
  const center = (text: string, width: number = 32): string => {
    const padding = Math.max(0, width - text.length);
    const leftPad = Math.floor(padding / 2);
    return ' '.repeat(leftPad) + text;
  };

  // Right align helper for prices
  const rightAlign = (text: string, width: number = 32): string => {
    const padding = Math.max(0, width - text.length);
    return ' '.repeat(padding) + text;
  };

  const formatPrice = (price: number): string => 
    `${currency}${price.toFixed(2)}`;

  // Build receipt
  const lines: string[] = [
    '\n',
    center(storeName),
    storeAddress ? center(storeAddress) : '',
    phoneNumber ? center(phoneNumber) : '',
    center('--------------------------------'),
    '\n',
    'Item                  Qty     Price',
    '--------------------------------',
    ...items.map(item => {
      const itemTotal = formatPrice(item.price * item.quantity);
      return `${item.name.slice(0, 18).padEnd(18)} ${
        String(item.quantity).padStart(3)} x ${
        formatPrice(item.price).padStart(6)} = ${
        itemTotal.padStart(7)}`;
    }),
    '--------------------------------',
    rightAlign(`Subtotal: ${formatPrice(subtotal)}`),
    rightAlign(`Tax (${(taxRate * 100).toFixed(0)}%): ${formatPrice(tax)}`),
    rightAlign(`Total: ${formatPrice(total)}`),
    '\n',
    center('Thank you for your business!'),
    center('Please come again'),
    '\n\n\n' // Extra line feeds for paper cutting
  ];

  return lines.filter(Boolean).join('\n');
};
  