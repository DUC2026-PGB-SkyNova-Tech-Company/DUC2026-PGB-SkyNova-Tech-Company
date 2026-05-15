# Payment Methods & Currency Guide

## 🎯 New Features

Your bot now supports:
1. **Two Payment Methods**: QR and Cash
2. **Dual Currency Display**: KHR (៛) and USD ($)
3. **Detailed Reports**: Breakdown by payment method
4. **Automatic Conversion**: 1 USD = 4,100 KHR

---

## 📱 How to Record Payments

### Step 1: Select Branch
```
/branch → Select your branch
```

### Step 2: Enter Payment Amount
```
50000 Test payment
```

### Step 3: Choose Payment Method
You'll see two options:
- 📱 **QR Payment** - For KHQR/ABA/Wing payments
- 💵 **Cash Payment** - For cash transactions

### Step 4: Confirm
Review the details and click ✅ Confirm

---

## 📄 Payment Receipt Format

```
╔═══════════════════════════════╗
║         PAYMENT RECEIPT        ║
╚═══════════════════════════════╝

🏢 DUC2026-PGB-SkyNova-Tech Company

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🆔 Transaction ID: #1
🏪 Branch: SkyNova-Tech-Company A
👤 Staff: John

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 Description: Test payment
💰 Amount (KHR): 50,000 ៛
💵 Amount (USD): $12.20
📱 Payment Method: QR Payment

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 Date: 15/05/2026
🕐 Time: 16:46:33
✅ Status: PAID

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Thank you for your payment!
Use /daily to see today's summary.

╚═══════════════════════════════╝
```

---

## 📊 Daily Report Format

```
╔═══════════════════════════════╗
║      DAILY SALES REPORT       ║
╚═══════════════════════════════╝

📅 Date: 15/05/2026

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 TOTAL SALES
   450,000 ៛
   $109.76
   📝 Transactions: 18

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📱 QR PAYMENTS
   300,000 ៛
   $73.17
   📝 Count: 12

💵 CASH PAYMENTS
   150,000 ៛
   $36.59
   📝 Count: 6

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏪 BY BRANCH:

SkyNova-Tech-Company A
   Total: 200,000 ៛ / $48.78
   📱 QR: 150,000 ៛
   💵 Cash: 50,000 ៛
   📝 Transactions: 8

SkyNova-Tech-Company B
   Total: 150,000 ៛ / $36.59
   📱 QR: 100,000 ៛
   💵 Cash: 50,000 ៛
   📝 Transactions: 6

SkyNova-Tech-Company C
   Total: 100,000 ៛ / $24.39
   📱 QR: 50,000 ៛
   💵 Cash: 50,000 ៛
   📝 Transactions: 4
```

---

## 💱 Currency Conversion

**Exchange Rate:** 1 USD = 4,100 KHR

### Examples:
- 50,000 KHR = $12.20 USD
- 100,000 KHR = $24.39 USD
- 500,000 KHR = $121.95 USD
- 1,000,000 KHR = $243.90 USD

---

## 📈 Report Features

### Total Sales
- Shows combined total in both KHR and USD
- Total number of transactions

### Payment Method Breakdown
- **QR Payments**: Total amount and count
- **Cash Payments**: Total amount and count

### Branch Breakdown
- Total sales per branch (both currencies)
- QR vs Cash breakdown per branch
- Transaction count per branch

---

## 🎯 Use Cases

### For Staff
1. Record QR payments from customers
2. Record cash payments
3. View daily summary

### For Managers
1. See total sales in both currencies
2. Compare QR vs Cash payments
3. Analyze branch performance
4. Track payment method preferences

### For Owners
1. Complete financial overview
2. Currency conversion for accounting
3. Payment method analytics
4. Branch comparison

---

## 💡 Tips

### For Staff:
- ✅ Always select the correct payment method
- ✅ Double-check amounts before confirming
- ✅ Use clear descriptions

### For Managers:
- ✅ Check `/daily` report every evening
- ✅ Compare QR vs Cash trends
- ✅ Monitor branch performance
- ✅ Use USD amounts for accounting

### For Accounting:
- ✅ Exchange rate: 1 USD = 4,100 KHR
- ✅ All amounts stored in KHR
- ✅ USD calculated automatically
- ✅ Update exchange rate in code if needed

---

## 🔧 Customization

### Change Exchange Rate

Edit `src/utils/currencyUtils.js`:

```javascript
const USD_TO_KHR_RATE = 4100; // Change this value
```

Common rates:
- 4,000 KHR = 1 USD
- 4,100 KHR = 1 USD (current)
- 4,200 KHR = 1 USD

---

## 📞 Support

For questions or issues:
- Check this guide
- Read USER_MANUAL.md
- Contact system administrator

---

**Happy tracking! 🎉**
