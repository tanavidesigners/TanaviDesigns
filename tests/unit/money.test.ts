import test from 'node:test';
import assert from 'node:assert/strict';
import { formatMoney } from '../../lib/services/catalog-service.js';

test('formatMoney formats paise integer into INR currency string', () => {
  assert.equal(formatMoney(245000), '₹2,450');
  assert.equal(formatMoney(485000), '₹4,850');
  assert.equal(formatMoney(0), '₹0');
  assert.equal(formatMoney(14900), '₹149');
});
