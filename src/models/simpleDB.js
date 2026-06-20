const fs = require('fs').promises;
const path = require('path');

const DB_PATH = path.join(__dirname, '../../data');
const BRANCHES_FILE = path.join(DB_PATH, 'branches.json');
const USERS_FILE = path.join(DB_PATH, 'users.json');
const TRANSACTIONS_FILE = path.join(DB_PATH, 'transactions.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DB_PATH, { recursive: true });
  } catch (error) {
    console.error('Error creating data directory:', error);
  }
}

// Read JSON file
async function readJSON(filePath, defaultValue = []) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await writeJSON(filePath, defaultValue);
      return defaultValue;
    }
    throw error;
  }
}

// Write JSON file
async function writeJSON(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// Branch operations
const Branch = {
  async findAll() {
    return await readJSON(BRANCHES_FILE);
  },
  
  async findById(id) {
    const branches = await this.findAll();
    return branches.find(b => b.id === parseInt(id));
  },
  
  async create(data) {
    const branches = await this.findAll();
    const newBranch = {
      id: branches.length > 0 ? Math.max(...branches.map(b => b.id)) + 1 : 1,
      ...data,
      createdAt: new Date().toISOString()
    };
    branches.push(newBranch);
    await writeJSON(BRANCHES_FILE, branches);
    return newBranch;
  },
  
  async count() {
    const branches = await this.findAll();
    return branches.length;
  },
  
  async bulkCreate(items) {
    const branches = await this.findAll();
    const newBranches = items.map((item, index) => ({
      id: branches.length + index + 1,
      ...item,
      isActive: true,
      createdAt: new Date().toISOString()
    }));
    branches.push(...newBranches);
    await writeJSON(BRANCHES_FILE, branches);
    return newBranches;
  }
};

// User operations
const User = {
  async findAll() {
    return await readJSON(USERS_FILE);
  },
  
  async findByTelegramId(telegramId) {
    const users = await this.findAll();
    return users.find(u => u.telegramId === telegramId);
  },
  
  async upsert(data) {
    const users = await this.findAll();
    const index = users.findIndex(u => u.telegramId === data.telegramId);
    
    if (index >= 0) {
      users[index] = { ...users[index], ...data, updatedAt: new Date().toISOString() };
    } else {
      const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        ...data,
        isAdmin: false,
        createdAt: new Date().toISOString()
      };
      users.push(newUser);
    }
    
    await writeJSON(USERS_FILE, users);
    return users[index >= 0 ? index : users.length - 1];
  }
};

// Transaction operations
const Transaction = {
  async findAll(options = {}) {
    let transactions = await readJSON(TRANSACTIONS_FILE);
    
    // Filter by date if specified
    if (options.where && options.where.createdAt) {
      const dateFilter = options.where.createdAt;
      transactions = transactions.filter(t => {
        const tDate = new Date(t.createdAt);
        if (dateFilter.$gte) {
          return tDate >= new Date(dateFilter.$gte);
        }
        return true;
      });
    }
    
    // Filter by payment method if specified
    if (options.where && options.where.paymentMethod) {
      transactions = transactions.filter(t => t.paymentMethod === options.where.paymentMethod);
    }
    
    // Include branch data if requested
    if (options.includeBranch) {
      const branches = await Branch.findAll();
      transactions = transactions.map(t => ({
        ...t,
        Branch: branches.find(b => b.id === t.branchId)
      }));
    }
    
    return transactions;
  },
  
  async create(data) {
    const transactions = await readJSON(TRANSACTIONS_FILE);
    const newTransaction = {
      id: transactions.length > 0 ? Math.max(...transactions.map(t => t.id)) + 1 : 1,
      ...data,
      verificationStatus: data.verificationStatus || 'pending',
      paymentMethod: data.paymentMethod || 'CASH',
      currency: data.currency || 'KHR',
      createdAt: new Date().toISOString()
    };
    transactions.push(newTransaction);
    await writeJSON(TRANSACTIONS_FILE, transactions);
    return newTransaction;
  },
  
  async findByBranch(branchId, startDate = null) {
    let transactions = await this.findAll({ includeBranch: true });
    transactions = transactions.filter(t => t.branchId === parseInt(branchId));
    
    if (startDate) {
      transactions = transactions.filter(t => new Date(t.createdAt) >= startDate);
    }
    
    return transactions;
  }
};

// Initialize database
async function initDatabase() {
  await ensureDataDir();
  
  // Create default branches if none exist
  const branchCount = await Branch.count();
  if (branchCount === 0) {
    const branches = process.env.BRANCHES?.split(',') || ['Central Market', 'Russian Market', 'Olympic Market'];
    await Branch.bulkCreate(
      branches.map(name => ({ name: name.trim(), location: 'Phnom Penh' }))
    );
    console.log('✅ Default branches created');
  }
}

module.exports = {
  Branch,
  User,
  Transaction,
  initDatabase
};
