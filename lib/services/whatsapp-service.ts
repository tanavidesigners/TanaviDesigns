export function getWhatsAppNumber(): string {
  return process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919482245679';
}

export function buildGeneralWhatsAppUrl(message?: string): string {
  const num = getWhatsAppNumber();
  const msg = message || process.env.NEXT_PUBLIC_WHATSAPP_DEFAULT_MESSAGE || 'Hello Tanavi, I would like to know more about your latest designer collection.';
  return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
}

export function buildProductWhatsAppUrl(params: {
  productName: string;
  sku: string;
  size?: string;
  colour?: string;
  priceFormatted: string;
  productUrl?: string;
}): string {
  const num = getWhatsAppNumber();
  const text = `Hello Tanavi, I am interested in your piece:\n\n*Product:* ${params.productName}\n*SKU:* ${params.sku}\n${params.size ? `*Size:* ${params.size}\n` : ''}${params.colour ? `*Colour:* ${params.colour}\n` : ''}*Price:* ${params.priceFormatted}${params.productUrl ? `\n*Link:* ${params.productUrl}` : ''}\n\nPlease confirm availability and details.`;
  return `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
}

export function buildCartWhatsAppUrl(params: {
  itemCount: number;
  subtotalFormatted: string;
  itemSummary: string;
}): string {
  const num = getWhatsAppNumber();
  const text = `Hello Tanavi, I have ${params.itemCount} items in my cart:\n\n${params.itemSummary}\n*Subtotal Estimate:* ${params.subtotalFormatted}\n\nI would like assistance with ordering this selection.`;
  return `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
}

export function buildOrderSupportWhatsAppUrl(orderNumber: string): string {
  const num = getWhatsAppNumber();
  const text = `Hello Tanavi, I need assistance with my order *${orderNumber}*. Could you please share an update?`;
  return `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
}
