const mongoose = require('mongoose');

// Branch Schema
const branchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  location: {
    type: String,
    default: 'Phnom Penh'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// User Schema
const userSchema = new mongoose.Schema({
  telegramId: {
    type: Number,
    required: true,
    unique: true
  },
  username: String,
  firstName: String,
  currentBranchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch'
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Transaction Schema
const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'KHR'
  },
  transactionId: String,
  description: String,
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  userId: {
    type: Number,
    required: true
  },
  photoFileId: String,
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['QR', 'CASH'],
    default: 'CASH'
  },
  bakongReference: String
}, {
  timestamps: true
});

// Create indexes for better performance
transactionSchema.index({ createdAt: -1 });
transactionSchema.index({ branchId: 1, createdAt: -1 });
transactionSchema.index({ paymentMethod: 1 });

const Branch = mongoose.model('Branch', branchSchema);
const User = mongoose.model('User', userSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);

// Database connection
async function connectDatabase() {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bakong-bot';
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ MongoDB connected successfully');
    
    // Initialize default branches
    await initializeDefaultBranches();
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

// Initialize default branches
async function initializeDefaultBranches() {
  try {
    const count = await Branch.countDocuments();
    
    if (count === 0) {
      const branches = process.env.BRANCHES?.split(',') || ['Branch A', 'Branch B', 'Branch C'];
      
      for (const name of branches) {
        await Branch.create({
          name: name.trim(),
          location: 'Phnom Penh',
          isActive: true
        });
      }
      
      console.log('✅ Default branches created');
    }
  } catch (error) {
    console.error('Error initializing branches:', error);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});

module.exports = {
  Branch,
  User,
  Transaction,
  connectDatabase
};
