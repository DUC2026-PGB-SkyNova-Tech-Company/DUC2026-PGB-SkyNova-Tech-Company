// Database adapter - automatically uses MongoDB if available, falls back to JSON
const USE_MONGODB = process.env.USE_MONGODB === 'true';

let db;

if (USE_MONGODB) {
  console.log('📊 Using MongoDB database');
  db = require('./mongooseModels');
} else {
  console.log('📊 Using JSON file database');
  db = require('./simpleDB');
}

module.exports = db;
