# 🐘 PostgreSQL Database Setup Guide

This guide will help you set up PostgreSQL for the Bakong Vendor Bot, enabling cloud-based data storage accessible from multiple devices.

---

## 📋 Table of Contents

1. [Why PostgreSQL?](#why-postgresql)
2. [Quick Start](#quick-start)
3. [Local PostgreSQL Setup](#local-postgresql-setup)
4. [Cloud PostgreSQL Setup](#cloud-postgresql-setup)
5. [Configuration](#configuration)
6. [Migration from JSON/MongoDB](#migration-from-jsonmongodb)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Why PostgreSQL?

**Benefits:**
- ✅ **Production-Ready**: Industry standard for reliable data storage
- ✅ **Cloud-Friendly**: Easy deployment on Heroku, Railway, Render, AWS RDS
- ✅ **Multi-Device**: Access same database from multiple devices
- ✅ **ACID Compliant**: Guaranteed data consistency
- ✅ **Free Tiers**: Many cloud providers offer free PostgreSQL hosting
- ✅ **Powerful Queries**: Advanced analytics and reporting capabilities

**When to Use:**
- Running bot 24/7 on a server
- Multiple staff accessing from different devices
- Need reliable transaction history
- Want advanced reporting and analytics

---

## ⚡ Quick Start

### Option 1: Use Free Cloud PostgreSQL (Recommended)

**Best Free Options:**
1. **Railway** - 500 hours/month free
2. **Render** - Free tier available
3. **Supabase** - Free PostgreSQL with dashboard
4. **ElephantSQL** - 20MB free tier

### Option 2: Local PostgreSQL

For testing or single-device use.

---

## 🏠 Local PostgreSQL Setup

### Step 1: Install PostgreSQL

**Windows:**
1. Download from: https://www.postgresql.org/download/windows/
2. Run installer (PostgreSQL 15 or higher)
3. Remember the password you set for `postgres` user
4. Default port: 5432

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Step 2: Create Database

**Windows (using pgAdmin or psql):**
```sql
-- Open psql or pgAdmin
CREATE DATABASE bakong_bot;
```

**macOS/Linux:**
```bash
# Switch to postgres user
sudo -u postgres psql

# Create database
CREATE DATABASE bakong_bot;

# Create user (optional)
CREATE USER bakong_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE bakong_bot TO bakong_user;

# Exit
\q
```

### Step 3: Configure Bot

Update `.env` file:
```env
USE_POSTGRES=true
POSTGRES_URL=postgresql://postgres:your_password@localhost:5432/bakong_bot
```

Or if you created a custom user:
```env
USE_POSTGRES=true
POSTGRES_URL=postgresql://bakong_user:your_password@localhost:5432/bakong_bot
```

---

## ☁️ Cloud PostgreSQL Setup

### Option 1: Railway (Recommended - Easy & Free)

1. **Sign Up**: Go to https://railway.app/
2. **Create Project**: Click "New Project"
3. **Add PostgreSQL**: Click "Add PostgreSQL"
4. **Get Connection String**:
   - Click on PostgreSQL service
   - Go to "Connect" tab
   - Copy "Postgres Connection URL"

5. **Update .env**:
```env
USE_POSTGRES=true
DATABASE_URL=postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway
```

**Railway Benefits:**
- ✅ 500 hours/month free
- ✅ Automatic backups
- ✅ Easy to use dashboard
- ✅ No credit card required

---

### Option 2: Render

1. **Sign Up**: Go to https://render.com/
2. **Create PostgreSQL**:
   - Dashboard → New → PostgreSQL
   - Choose free tier
   - Set database name: `bakong_bot`

3. **Get Connection String**:
   - Click on database
   - Copy "External Database URL"

4. **Update .env**:
```env
USE_POSTGRES=true
DATABASE_URL=postgres://user:pass@dpg-xxxxx.oregon-postgres.render.com/bakong_bot
```

---

### Option 3: Supabase (With Dashboard)

1. **Sign Up**: Go to https://supabase.com/
2. **Create Project**:
   - New Project
   - Set database password
   - Choose region closest to you

3. **Get Connection String**:
   - Project Settings → Database
   - Copy "Connection string" (URI format)
   - Replace `[YOUR-PASSWORD]` with your password

4. **Update .env**:
```env
USE_POSTGRES=true
POSTGRES_URL=postgresql://postgres:your_password@db.xxxxx.supabase.co:5432/postgres
```

**Supabase Benefits:**
- ✅ Free tier: 500MB database
- ✅ Built-in dashboard to view data
- ✅ Automatic backups
- ✅ REST API included

---

### Option 4: ElephantSQL

1. **Sign Up**: Go to https://www.elephantsql.com/
2. **Create Instance**:
   - Create New Instance
   - Choose "Tiny Turtle" (free)
   - Select region

3. **Get Connection String**:
   - Click on instance
   - Copy URL

4. **Update .env**:
```env
USE_POSTGRES=true
POSTGRES_URL=postgres://username:password@lucky.db.elephantsql.com/username
```

---

## ⚙️ Configuration

### Environment Variables

Your `.env` file should have:

```env
# Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token

# PostgreSQL Database
USE_POSTGRES=true
POSTGRES_URL=postgresql://user:password@host:5432/database
# OR
DATABASE_URL=postgresql://user:password@host:5432/database

# Branches
BRANCHES=SkyNova-Tech-Company A,SkyNova-Tech-Company B,SkyNova-Tech-Company C

# Admin Users
ADMIN_USER_IDS=123456789,987654321
```

### Connection String Format

```
postgresql://username:password@host:port/database
```

**Example:**
```
postgresql://postgres:mypassword@localhost:5432/bakong_bot
```

**With SSL (for cloud):**
```
postgresql://user:pass@host.com:5432/db?sslmode=require
```

---

## 🔄 Migration from JSON/MongoDB

### From JSON Files

Your existing data in `data/` folder can be migrated:

1. **Backup Current Data**:
```bash
# Copy data folder
cp -r data data_backup
```

2. **Enable PostgreSQL**:
```env
USE_POSTGRES=true
POSTGRES_URL=your_connection_string
```

3. **Start Bot**:
```bash
npm start
```

The bot will create tables automatically. Your old JSON data will remain in `data/` folder as backup.

4. **Manual Migration** (if needed):

You can manually import data using a script or SQL:

```javascript
// migration-script.js
const oldData = require('./data/transactions.json');
const { Transaction } = require('./src/models/postgresModels');

async function migrate() {
  for (const tx of oldData) {
    await Transaction.create({
      amount: tx.amount,
      currency: tx.currency,
      branchId: tx.branchId,
      userId: tx.userId,
      paymentMethod: tx.paymentMethod,
      createdAt: tx.timestamp
    });
  }
  console.log('Migration complete!');
}

migrate();
```

### From MongoDB

1. **Export MongoDB Data**:
```bash
mongoexport --uri="mongodb://..." --collection=transactions --out=transactions.json
```

2. **Enable PostgreSQL** in `.env`

3. **Import to PostgreSQL** using similar script as above

---

## 🚀 Running the Bot

### Start Bot with PostgreSQL

```bash
npm start
```

You should see:
```
📊 Using PostgreSQL database
✅ PostgreSQL connected successfully
✅ Database tables synchronized
✅ Default branches created
🤖 Bot started successfully!
```

### Verify Connection

The bot will automatically:
1. Connect to PostgreSQL
2. Create tables (branches, users, transactions)
3. Initialize default branches
4. Start accepting payments

---

## 🔍 Troubleshooting

### Error: "Connection refused"

**Problem**: Can't connect to PostgreSQL

**Solutions:**
1. Check PostgreSQL is running:
   ```bash
   # Windows
   services.msc → PostgreSQL service
   
   # macOS
   brew services list
   
   # Linux
   sudo systemctl status postgresql
   ```

2. Verify connection string:
   - Check username, password, host, port
   - Test with psql: `psql "postgresql://user:pass@host:5432/db"`

3. Check firewall settings

---

### Error: "password authentication failed"

**Problem**: Wrong credentials

**Solutions:**
1. Verify password in connection string
2. Reset PostgreSQL password:
   ```sql
   ALTER USER postgres WITH PASSWORD 'new_password';
   ```

---

### Error: "database does not exist"

**Problem**: Database not created

**Solution:**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE bakong_bot;
```

---

### Error: "SSL connection required"

**Problem**: Cloud provider requires SSL

**Solution:**
Add `?sslmode=require` to connection string:
```env
POSTGRES_URL=postgresql://user:pass@host:5432/db?sslmode=require
```

---

### Tables Not Created

**Problem**: Bot starts but no tables

**Solution:**
1. Check bot logs for errors
2. Manually create tables:
   ```sql
   -- Connect to database
   psql "your_connection_string"
   
   -- Check tables
   \dt
   ```

3. Restart bot with fresh connection

---

### Performance Issues

**Problem**: Slow queries

**Solutions:**
1. Add indexes (already included in models)
2. Use connection pooling (already configured)
3. Upgrade to paid tier for better performance

---

## 📊 Database Management

### View Data

**Using psql:**
```bash
psql "your_connection_string"

-- List tables
\dt

-- View branches
SELECT * FROM branches;

-- View recent transactions
SELECT * FROM transactions ORDER BY "createdAt" DESC LIMIT 10;

-- Daily summary
SELECT 
  DATE("createdAt") as date,
  COUNT(*) as count,
  SUM(amount) as total
FROM transactions
GROUP BY DATE("createdAt")
ORDER BY date DESC;
```

**Using GUI Tools:**
- **pgAdmin**: https://www.pgadmin.org/
- **DBeaver**: https://dbeaver.io/
- **TablePlus**: https://tableplus.com/

---

### Backup Database

**Local:**
```bash
pg_dump -U postgres bakong_bot > backup.sql
```

**Cloud:**
Most cloud providers have automatic backups. Check your provider's dashboard.

**Manual Backup:**
```bash
pg_dump "your_connection_string" > backup_$(date +%Y%m%d).sql
```

---

### Restore Database

```bash
psql "your_connection_string" < backup.sql
```

---

## 🎯 Best Practices

1. **Use Environment Variables**: Never commit connection strings to Git
2. **Enable SSL**: Always use SSL for cloud connections
3. **Regular Backups**: Set up automatic backups
4. **Monitor Usage**: Check your free tier limits
5. **Connection Pooling**: Already configured (max 5 connections)
6. **Indexes**: Already added for common queries

---

## 🆚 Database Comparison

| Feature | JSON | MongoDB | PostgreSQL |
|---------|------|---------|------------|
| Setup | ✅ Easy | ⚠️ Medium | ⚠️ Medium |
| Multi-Device | ❌ No | ✅ Yes | ✅ Yes |
| Cloud Hosting | ❌ No | ✅ Yes | ✅ Yes |
| Free Tier | ✅ Always | ✅ 512MB | ✅ Various |
| Reliability | ⚠️ Low | ✅ High | ✅ Very High |
| Queries | ❌ Limited | ✅ Good | ✅ Excellent |
| Transactions | ❌ No | ⚠️ Limited | ✅ Full ACID |
| Best For | Testing | Cloud Apps | Production |

---

## 📞 Support

**Need Help?**
- Check logs: `npm start` will show connection errors
- Test connection: Use `psql` command line tool
- Cloud provider docs: Each provider has detailed guides
- PostgreSQL docs: https://www.postgresql.org/docs/

---

## ✅ Checklist

- [ ] PostgreSQL installed (local) or cloud account created
- [ ] Database created
- [ ] Connection string obtained
- [ ] `.env` file updated with `USE_POSTGRES=true`
- [ ] Connection string added to `.env`
- [ ] Bot started successfully
- [ ] Tables created automatically
- [ ] Test payment works
- [ ] Data persists after restart

---

**🎉 Congratulations!** Your bot is now using PostgreSQL for reliable, cloud-based data storage!
