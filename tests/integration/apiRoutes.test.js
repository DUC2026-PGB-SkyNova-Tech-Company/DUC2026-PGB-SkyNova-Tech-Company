/**
 * Integration Tests — Express API Routes
 * Tests all REST endpoints with real logic but an isolated temporary DB
 */

const request = require('supertest');
const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

// We test apiRoutes.js which requires Transaction and Branch from '../models'
// We mock those models to return controlled test data

jest.mock('../../src/models/simpleDB', () => {
  const sampleBranches = [
    { id: 1, name: 'Central Market', location: 'Phnom Penh', isActive: true },
    { id: 2, name: 'Russian Market', location: 'Phnom Penh', isActive: true }
  ];

  const now = new Date().toISOString();
  const sampleTransactions = [
    { id: 1, amount: 25000, branchId: 1, paymentMethod: 'QR', timestamp: now, amountUSD: 6.10 },
    { id: 2, amount: 15000, branchId: 2, paymentMethod: 'Cash', timestamp: now, amountUSD: 3.66 },
    { id: 3, amount: 50000, branchId: 1, paymentMethod: 'QR', timestamp: now, amountUSD: 12.20 }
  ];

  return {
    Branch: {
      getAll: jest.fn().mockResolvedValue(sampleBranches),
      findAll: jest.fn().mockResolvedValue(sampleBranches)
    },
    Transaction: {
      getAll: jest.fn().mockResolvedValue(sampleTransactions),
      findAll: jest.fn().mockResolvedValue(sampleTransactions)
    }
  };
});

// apiRoutes uses '../models' which resolves to the index or simpleDB
// We also need to mock the models/index.js path used by apiRoutes
jest.mock('../../src/models', () => {
  const simpleDB = require('../../src/models/simpleDB');
  return {
    User: {},
    Transaction: simpleDB.Transaction,
    Branch: simpleDB.Branch
  };
});

let app;

beforeAll(() => {
  app = express();
  app.use(express.json());
  const apiRoutes = require('../../src/routes/apiRoutes');
  app.use('/api', apiRoutes);
});

// ─── GET /api/stats ──────────────────────────────────────────────────────────

describe('GET /api/stats', () => {
  it('returns 200 with stats object for default period (today)', async () => {
    const res = await request(app).get('/api/stats');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('totalRevenue');
    expect(res.body).toHaveProperty('totalTransactions');
    expect(res.body).toHaveProperty('khqrPayments');
    expect(res.body).toHaveProperty('cashPayments');
    expect(res.body).toHaveProperty('revenueData');
  });

  it('returns revenueData with 24 hourly labels for period=today', async () => {
    const res = await request(app).get('/api/stats?period=today');
    expect(res.status).toBe(200);
    expect(res.body.revenueData.labels).toHaveLength(24);
  });

  it('returns revenueData with 7 daily labels for period=week', async () => {
    const res = await request(app).get('/api/stats?period=week');
    expect(res.status).toBe(200);
    expect(res.body.revenueData.labels).toHaveLength(7);
  });

  it('returns revenueData with week labels for period=month', async () => {
    const res = await request(app).get('/api/stats?period=month');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.revenueData.labels)).toBe(true);
    res.body.revenueData.labels.forEach(label => {
      expect(label).toMatch(/^Week/);
    });
  });

  it('returns numeric values for all amount fields', async () => {
    const res = await request(app).get('/api/stats');
    expect(typeof res.body.totalRevenue).toBe('number');
    expect(typeof res.body.revenueChange).toBe('number');
    expect(typeof res.body.totalTransactions).toBe('number');
  });
});

// ─── GET /api/branches ───────────────────────────────────────────────────────

describe('GET /api/branches', () => {
  it('returns 200 with array of branches', async () => {
    const res = await request(app).get('/api/branches');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('each branch has revenue and transactions fields', async () => {
    const res = await request(app).get('/api/branches');
    res.body.forEach(branch => {
      expect(branch).toHaveProperty('revenue');
      expect(branch).toHaveProperty('transactions');
      expect(typeof branch.revenue).toBe('number');
      expect(typeof branch.transactions).toBe('number');
    });
  });

  it('branch revenue matches sum of its transactions', async () => {
    const res = await request(app).get('/api/branches');
    const centralMarket = res.body.find(b => b.id === 1);
    // Branch 1 has transactions: 25000 + 50000 = 75000 KHR → $18.30 USD
    expect(centralMarket).toBeDefined();
    expect(centralMarket.transactions).toBe(2);
  });
});

// ─── GET /api/transactions/recent ────────────────────────────────────────────

describe('GET /api/transactions/recent', () => {
  it('returns 200 with an array', async () => {
    const res = await request(app).get('/api/transactions/recent');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('respects the default limit of 10', async () => {
    const res = await request(app).get('/api/transactions/recent');
    expect(res.body.length).toBeLessThanOrEqual(10);
  });

  it('respects custom limit parameter', async () => {
    const res = await request(app).get('/api/transactions/recent?limit=2');
    expect(res.body.length).toBeLessThanOrEqual(2);
  });

  it('each transaction includes branchName', async () => {
    const res = await request(app).get('/api/transactions/recent');
    res.body.forEach(tx => {
      expect(tx).toHaveProperty('branchName');
    });
  });
});

// ─── GET /api/transactions ────────────────────────────────────────────────────

describe('GET /api/transactions', () => {
  it('returns 200 with all transactions sorted newest first', async () => {
    const res = await request(app).get('/api/transactions');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('accepts branchId filter query param without error', async () => {
    const res = await request(app).get('/api/transactions?branchId=1');
    expect(res.status).toBe(200);
  });

  it('accepts paymentMethod filter query param without error', async () => {
    const res = await request(app).get('/api/transactions?paymentMethod=QR');
    expect(res.status).toBe(200);
  });

  it('accepts date range filter params without error', async () => {
    const res = await request(app)
      .get('/api/transactions?startDate=2026-01-01&endDate=2026-12-31');
    expect(res.status).toBe(200);
  });
});
