export function normalizeSymbol(value) {
  return value.trim().toUpperCase();
}

export function isValidSymbol(value) {
  return /^[A-Z0-9.-]{1,12}$/.test(normalizeSymbol(value));
}

export function clampLimit(value, fallback = 20) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) ? Math.min(Math.max(parsed, 1), 100) : fallback;
}
