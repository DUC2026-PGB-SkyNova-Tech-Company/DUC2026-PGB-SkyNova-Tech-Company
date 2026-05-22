// Database adapter - supports PostgreSQL, MongoDB, or JSON files
const USE_POSTGRES = process.env.USE_POSTGRES === 'true';
const USE_MONGODB = process.env.USE_MONGODB === 'true';

let db;

if (USE_POSTGRES) {
  console.log('📊 Using PostgreSQL database');
  db = require('./postgresModels');
  
  // Initialize PostgreSQL connection
  db.connectDatabase().catch(err => {
    console.error('Failed to connect to PostgreSQL:', err);
    console.log('⚠️ Falling back to JSON file database');
    db = require('./simpleDB');
  });
} else if (USE_MONGODB) {
  console.log('📊 Using MongoDB database');
  db = require('./mongooseModels');
} else {
  console.log('📊 Using JSON file database');
  db = require('./simpleDB');
}

module.exports = db;
