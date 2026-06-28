/**
 * Unit Tests — Currency Utilities
 * Tests KHR/USD conversion and formatting functions
 */

const {
  USD_TO_KHR_RATE,
  convertKHRtoUSD,
  convertUSDtoKHR,
  formatKHR,
  formatUSD,
  formatBothCurrencies
} = require('../../src/utils/currencyUtils');

describe('currencyUtils', () => {

  // ─── Constants ──────────────────────────────────────────────────────────────

  describe('USD_TO_KHR_RATE', () => {
    it('should be 4100', () => {
      expect(USD_TO_KHR_RATE).toBe(4100);
    });
  });

  // ─── convertKHRtoUSD ────────────────────────────────────────────────────────

  describe('convertKHRtoUSD()', () => {
    it('converts 4100 KHR to exactly 1 USD', () => {
      expect(convertKHRtoUSD(4100)).toBeCloseTo(1.0);
    });

    it('converts 0 KHR to 0 USD', () => {
      expect(convertKHRtoUSD(0)).toBe(0);
    });

    it('converts large amount correctly', () => {
      // 1,000,000 KHR / 4100 ≈ 243.90 USD
      expect(convertKHRtoUSD(1000000)).toBeCloseTo(243.90, 1);
    });

    it('converts 25000 KHR to ~6.10 USD', () => {
      expect(convertKHRtoUSD(25000)).toBeCloseTo(6.10, 1);
    });
  });

  // ─── convertUSDtoKHR ────────────────────────────────────────────────────────

  describe('convertUSDtoKHR()', () => {
    it('converts 1 USD to 4100 KHR', () => {
      expect(convertUSDtoKHR(1)).toBe(4100);
    });

    it('converts 0 USD to 0 KHR', () => {
      expect(convertUSDtoKHR(0)).toBe(0);
    });

    it('converts 10 USD to 41000 KHR', () => {
      expect(convertUSDtoKHR(10)).toBe(41000);
    });
  });

  // ─── formatKHR ──────────────────────────────────────────────────────────────

  describe('formatKHR()', () => {
    it('formats 25000 with thousands separator and ៛ symbol', () => {
      const result = formatKHR(25000);
      expect(result).toContain('25,000');
      expect(result).toContain('៛');
    });

    it('formats 0 as "0 ៛"', () => {
      const result = formatKHR(0);
      expect(result).toContain('0');
      expect(result).toContain('៛');
    });

    it('formats 1000000 with correct separators', () => {
      const result = formatKHR(1000000);
      expect(result).toContain('1,000,000');
    });
  });

  // ─── formatUSD ──────────────────────────────────────────────────────────────

  describe('formatUSD()', () => {
    it('formats 6.097... as "$6.10"', () => {
      expect(formatUSD(6.097560975609756)).toBe('$6.10');
    });

    it('formats 0 as "$0.00"', () => {
      expect(formatUSD(0)).toBe('$0.00');
    });

    it('prepends $ sign', () => {
      expect(formatUSD(1)).toMatch(/^\$/);
    });

    it('always has 2 decimal places', () => {
      expect(formatUSD(1)).toBe('$1.00');
      expect(formatUSD(1.5)).toBe('$1.50');
    });
  });

  // ─── formatBothCurrencies ───────────────────────────────────────────────────

  describe('formatBothCurrencies()', () => {
    it('returns an object with khr, usd, khrRaw, usdRaw keys', () => {
      const result = formatBothCurrencies(25000);
      expect(result).toHaveProperty('khr');
      expect(result).toHaveProperty('usd');
      expect(result).toHaveProperty('khrRaw');
      expect(result).toHaveProperty('usdRaw');
    });

    it('khrRaw equals the input amount unchanged', () => {
      expect(formatBothCurrencies(25000).khrRaw).toBe(25000);
    });

    it('usdRaw equals the KHR / 4100', () => {
      expect(formatBothCurrencies(4100).usdRaw).toBeCloseTo(1.0);
    });

    it('khr string contains ៛ symbol', () => {
      expect(formatBothCurrencies(25000).khr).toContain('៛');
    });

    it('usd string starts with $', () => {
      expect(formatBothCurrencies(25000).usd).toMatch(/^\$/);
    });

    it('handles zero correctly', () => {
      const result = formatBothCurrencies(0);
      expect(result.khrRaw).toBe(0);
      expect(result.usdRaw).toBe(0);
    });
  });
});
