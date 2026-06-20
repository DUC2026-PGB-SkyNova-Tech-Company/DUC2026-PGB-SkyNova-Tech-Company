# 🎨 Web Dashboard UI Guide

## Overview

A modern, high-quality web dashboard for monitoring and managing your Bakong Vendor Bot operations in real-time.

## 🌟 Features

### Real-Time Analytics
- **Live Statistics**: Total revenue, transactions, KHQR vs Cash payments
- **Dynamic Charts**: Revenue trends and payment method distribution
- **Auto-Refresh**: Dashboard updates every 30 seconds automatically

### Branch Management
- View all branches with performance metrics
- Track revenue and transaction count per branch
- Visual branch indicators with icons

### Transaction Monitoring
- Recent transaction feed
- Payment method indicators (KHQR/Cash)
- Timestamp and branch information

### Modern UI/UX
- **Gradient Design**: Beautiful purple gradient background
- **Glass Morphism**: Modern frosted glass effects
- **Responsive**: Works perfectly on desktop, tablet, and mobile
- **Dark Icons**: Font Awesome icons throughout
- **Smooth Animations**: Hover effects and transitions
- **Real-time Updates**: Live data without page refresh

## 🚀 Access the Dashboard

### 1. Start Your Server
```bash
npm start
```

### 2. Open in Browser
Navigate to:
```
http://localhost:3001
```

The dashboard will automatically load with:
- ✅ Real-time stats
- ✅ Interactive charts
- ✅ Branch performance
- ✅ Recent transactions

## 📊 Dashboard Sections

### Header
- **Logo**: SkyNova Tech branding with lightning bolt icon
- **Navigation**: Quick access to Dashboard, Transactions, Branches, Analytics
- **Status Indicator**: Shows online/offline status
- **Refresh Button**: Manual data refresh

### Stats Cards
Four beautiful gradient cards showing:
1. **Total Revenue** - USD amount with percentage change
2. **Transactions** - Total count with growth indicator
3. **KHQR Payments** - Count and percentage of total
4. **Cash Payments** - Count and percentage of total

### Charts
1. **Revenue Trend Chart**: Line chart showing revenue over time
   - Today: Hourly breakdown
   - Week: Daily breakdown
   - Month: Weekly breakdown

2. **Payment Methods Chart**: Doughnut chart showing KHQR vs Cash distribution

### Branch Performance
- List of all branches with:
  - Branch icon and name
  - Location information
  - Revenue amount
  - Transaction count

### Recent Transactions
- Last 5 transactions displayed
- Payment method icons (QR code or cash)
- Amount and timestamp
- Branch information

## 🎯 Time Period Selection

Toggle between different time periods:
- **Today**: Current day statistics
- **Week**: Last 7 days
- **Month**: Current month

Click any button to instantly update all stats and charts.

## 🎨 Color Scheme

### Primary Colors
- **Primary Gradient**: Purple (#667eea to #764ba2)
- **Success**: Green (#10b981)
- **Danger**: Red (#ef4444)
- **Info**: Blue (#3b82f6)

### Stat Card Gradients
- **Revenue**: Purple gradient
- **Transactions**: Pink-Red gradient
- **KHQR**: Blue gradient
- **Cash**: Pink-Yellow gradient

## 📱 Responsive Design

The dashboard is fully responsive:
- **Desktop**: Full layout with sidebar navigation
- **Tablet**: Adaptive grid layout
- **Mobile**: Single column, stacked cards

## 🔄 Auto-Refresh

The dashboard automatically refreshes every 30 seconds to show:
- Latest transaction data
- Updated revenue statistics
- Current branch performance
- Real-time payment trends

You can also manually refresh using the refresh button (🔄) in the header.

## 🎯 API Endpoints

The dashboard connects to these API endpoints:

### Statistics
```
GET /api/stats?period=today|week|month
```
Returns dashboard statistics for the selected period.

### Branches
```
GET /api/branches
```
Returns all branches with revenue and transaction counts.

### Recent Transactions
```
GET /api/transactions/recent?limit=5
```
Returns the most recent transactions.

### All Transactions
```
GET /api/transactions?branchId=&paymentMethod=&startDate=&endDate=
```
Returns filtered transaction list.

## 🎨 Customization

### Change Colors
Edit `public/styles.css` and modify the CSS variables:
```css
:root {
    --primary: #667eea;
    --secondary: #764ba2;
    /* Add your colors here */
}
```

### Modify Charts
Edit `public/app.js` to customize Chart.js configurations:
```javascript
// Revenue Chart configuration
revenueChart = new Chart(revenueCtx, {
    // Customize here
});
```

### Update Layout
Edit `public/index.html` to modify the dashboard structure.

## 🐛 Troubleshooting

### Dashboard Not Loading
1. Ensure server is running: `npm start`
2. Check port 3001 is not in use
3. Verify `public` folder exists

### No Data Showing
1. Check if bot has recorded transactions
2. Verify API endpoints are responding
3. Check browser console for errors

### Charts Not Rendering
1. Ensure Chart.js is loading (check network tab)
2. Verify canvas elements exist in HTML
3. Check JavaScript console for errors

## 🚀 Production Deployment

For production use:

1. **Environment Variables**: Set in production
   ```bash
   PORT=80
   NODE_ENV=production
   ```

2. **Reverse Proxy**: Use Nginx or Apache
   ```nginx
   location / {
       proxy_pass http://localhost:3001;
   }
   ```

3. **SSL Certificate**: Use Let's Encrypt for HTTPS

4. **Process Manager**: Use PM2 for 24/7 operation
   ```bash
   pm2 start src/app.js --name bakong-dashboard
   ```

## 💡 Tips

- **Keyboard Shortcuts**: Press F5 to refresh the page
- **Mobile Access**: Access from your phone using your computer's IP
- **Multiple Windows**: Open multiple dashboards for different branches
- **Export Data**: Use the export buttons on charts (coming soon)

## 🎉 Enjoy Your Dashboard!

Your beautiful, modern dashboard is now ready to use. Monitor your payments, track revenue, and manage branches all from one sleek interface!
