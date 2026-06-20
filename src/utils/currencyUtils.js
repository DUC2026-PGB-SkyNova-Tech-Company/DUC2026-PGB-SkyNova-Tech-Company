// Currency conversion utilities
// Exchange rate: 1 USD = 4100 KHR (approximate)
const USD_TO_KHR_RATE = 4100;

/**
 * Convert KHR to USD
 * @param {number} amountKHR - Amount in KHR
 * @returns {number} Amount in USD
 */
function convertKHRtoUSD(amountKHR) {
  return amountKHR / USD_TO_KHR_RATE;
}

/**
 * Convert USD to KHR
 * @param {number} amountUSD - Amount in USD
 * @returns {number} Amount in KHR
 */
function convertUSDtoKHR(amountUSD) {
  return amountUSD * USD_TO_KHR_RATE;
}

/**
 * Format amount in KHR
 * @param {number} amount - Amount in KHR
 * @returns {string} Formatted string
 */
function formatKHR(amount) {
  return `${amount.toLocaleString()} ៛`;
}

/**
 * Format amount in USD
 * @param {number} amount - Amount in USD
 * @returns {string} Formatted string
 */
function formatUSD(amount) {
  return `$${amount.toFixed(2)}`;
}

/**
 * Format amount in both currencies
 * @param {number} amountKHR - Amount in KHR
 * @returns {object} Object with both currency formats
 */
function formatBothCurrencies(amountKHR) {
  const usd = convertKHRtoUSD(amountKHR);
  return {
    khr: formatKHR(amountKHR),
    usd: formatUSD(usd),
    khrRaw: amountKHR,
    usdRaw: usd
  };
}

module.exports = {
  USD_TO_KHR_RATE,
  convertKHRtoUSD,
  convertUSDtoKHR,
  formatKHR,
  formatUSD,
  formatBothCurrencies
};
