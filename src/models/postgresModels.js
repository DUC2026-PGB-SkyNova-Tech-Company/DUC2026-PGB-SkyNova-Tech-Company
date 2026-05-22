const { Sequelize, DataTypes } = require('sequelize');

// Initialize Sequelize with PostgreSQL
const sequelize = new Sequelize(process.env.DATABASE_URL || process.env.POSTGRES_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Branch Model
const Branch = sequelize.define('Branch', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  location: {
    type: DataTypes.STRING,
    defaultValue: 'Phnom Penh'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'branches',
  timestamps: true
});

// User Model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  telegramId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    unique: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  currentBranchId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'branches',
      key: 'id'
    }
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'users',
  timestamps: true
});

// Transaction Model
const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'KHR'
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  branchId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'branches',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  photoFileId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  verificationStatus: {
    type: DataTypes.ENUM('pending', 'verified', 'failed'),
    defaultValue: 'pending'
  },
  paymentMethod: {
    type: DataTypes.ENUM('QR', 'CASH'),
    defaultValue: 'CASH'
  },
  bakongReference: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'transactions',
  timestamps: true,
  indexes: [
    {
      fields: ['createdAt']
    },
    {
      fields: ['branchId', 'createdAt']
    },
    {
      fields: ['paymentMethod']
    }
  ]
});

// Define relationships
Branch.hasMany(Transaction, { foreignKey: 'branchId' });
Transaction.belongsTo(Branch, { foreignKey: 'branchId' });

User.belongsTo(Branch, { as: 'CurrentBranch', foreignKey: 'currentBranchId' });

// Database connection and initialization
async function connectDatabase() {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected successfully');
    
    // Sync models (create tables if they don't exist)
    await sequelize.sync({ alter: false });
    console.log('✅ Database tables synchronized');
    
    // Initialize default branches
    await initializeDefaultBranches();
    
  } catch (error) {
    console.error('❌ PostgreSQL connection error:', error);
    throw error;
  }
}

// Initialize default branches
async function initializeDefaultBranches() {
  try {
    const count = await Branch.count();
    
    if (count === 0) {
      const branches = process.env.BRANCHES?.split(',') || ['Branch A', 'Branch B', 'Branch C'];
      
      await Branch.bulkCreate(
        branches.map(name => ({
          name: name.trim(),
          location: 'Phnom Penh',
          isActive: true
        }))
      );
      
      console.log('✅ Default branches created');
    }
  } catch (error) {
    console.error('Error initializing branches:', error);
  }
}

// Adapter methods to match existing interface
const BranchAdapter = {
  async findAll() {
    return await Branch.findAll();
  },
  
  async findById(id) {
    return await Branch.findByPk(id);
  },
  
  async count() {
    return await Branch.count();
  },
  
  async countDocuments() {
    return await Branch.count();
  }
};

const UserAdapter = {
  async findAll() {
    return await User.findAll();
  },
  
  async findByTelegramId(telegramId) {
    return await User.findOne({ where: { telegramId } });
  },
  
  async upsert(data) {
    const [user] = await User.upsert(data);
    return user;
  },
  
  async count() {
    return await User.count();
  },
  
  async countDocuments() {
    return await User.count();
  }
};

const TransactionAdapter = {
  async findAll(options = {}) {
    const queryOptions = {};
    
    // Handle where clause
    if (options.where) {
      queryOptions.where = {};
      
      if (options.where.createdAt && options.where.createdAt.$gte) {
        queryOptions.where.createdAt = {
          [Sequelize.Op.gte]: options.where.createdAt.$gte
        };
      }
      
      if (options.where.paymentMethod) {
        queryOptions.where.paymentMethod = options.where.paymentMethod;
      }
    }
    
    // Handle include/populate
    if (options.includeBranch) {
      queryOptions.include = [{
        model: Branch,
        as: 'Branch'
      }];
    }
    
    // Order by createdAt descending
    queryOptions.order = [['createdAt', 'DESC']];
    
    return await Transaction.findAll(queryOptions);
  },
  
  async create(data) {
    return await Transaction.create(data);
  },
  
  async findByBranch(branchId, startDate = null) {
    const where = { branchId: parseInt(branchId) };
    
    if (startDate) {
      where.createdAt = {
        [Sequelize.Op.gte]: startDate
      };
    }
    
    return await Transaction.findAll({
      where,
      include: [{
        model: Branch,
        as: 'Branch'
      }]
    });
  },
  
  async count() {
    return await Transaction.count();
  },
  
  async countDocuments() {
    return await Transaction.count();
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  await sequelize.close();
  console.log('PostgreSQL connection closed');
  process.exit(0);
});

module.exports = {
  Branch: BranchAdapter,
  User: UserAdapter,
  Transaction: TransactionAdapter,
  connectDatabase,
  sequelize
};
