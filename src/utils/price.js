export const parsePriceValue = (value) => {
  if (typeof value === 'number') return value;
  if (value == null) return 0;

  const text = String(value).trim();
  if (!text) return 0;

  // Handle legacy values like "2.500.000" where dots are thousands separators.
  const dotCount = (text.match(/\./g) || []).length;
  if (dotCount > 1 && !text.includes(',')) {
    return Number(text.replace(/[^0-9]/g, '')) || 0;
  }

  const normalized = text.replace(/[^0-9.,-]/g, '').replace(/,/g, '');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const formatUsd = (value) => `$${parsePriceValue(value).toLocaleString('en-US')}`;
