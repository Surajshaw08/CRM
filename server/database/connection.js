const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '', 
  database: process.env.DB_NAME || 'cms_deals',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool = null;

// Create connection pool
async function createConnection() {
  try {
    // First, try to connect without database to create it if it doesn't exist
    const tempPool = mysql.createPool({
      ...dbConfig,
      database: undefined
    });

    // Create database if it doesn't exist
    await tempPool.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
    await tempPool.end();

    // Create main connection pool
    pool = mysql.createPool(dbConfig);

    // Test the connection
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();

    console.log(' Database connection pool created successfully');
    return pool;
  } catch (error) {
    console.error(' Database connection failed:', error);
    throw error;
  }
}

// Get connection from pool
async function getConnection() {

  if (!pool) {

    throw new Error('Database connection not initialized');

  }
  
  return await pool.getConnection();
}

// Execute query with automatic connection management
async function executeQuery(query, params = []) {
  let connection;
  try {
    connection = await getConnection();
    const [results] = await connection.execute(query, params);
    return results;
  } catch (error) {
    console.error('❌ Query execution error:', error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}




// Close all connections
async function closeConnection() {
  
  if (pool) {


    await pool.end();
    pool = null;

    console.log(' Database connections closed');
  }
}

module.exports = {

  createConnection,
  getConnection,
  executeQuery,
  closeConnection,

  pool: () => pool

};
