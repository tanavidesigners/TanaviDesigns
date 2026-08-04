import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildProductWhatsAppUrl,
  buildOrderSupportWhatsAppUrl
} from '../../lib/services/whatsapp-service.js';

test('buildProductWhatsAppUrl constructs correct wa.me link with encoded params', () => {
  const url = buildProductWhatsAppUrl({
    productName: 'Noor Hand-Block Kurta Set',
    sku: 'TNV-NOOR-M',
    size: 'M',
    colour: 'Rose Pink',
    priceFormatted: '₹2,450'
  });

  assert.ok(url.startsWith('https://wa.me/919482245679?text='));
  assert.ok(url.includes('Noor'));
  assert.ok(url.includes('TNV-NOOR-M'));
});

test('buildOrderSupportWhatsAppUrl includes order number in message', () => {
  const url = buildOrderSupportWhatsAppUrl('TNV-20260804-1234');
  assert.ok(url.includes('TNV-20260804-1234'));
});
