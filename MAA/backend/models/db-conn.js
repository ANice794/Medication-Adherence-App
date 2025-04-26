require('dotenv').config();
const { Pool } = require('pg');

console.log('Initializing database connection pool with config:', {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'MAA',
    user: process.env.DB_USER || 'postgres',
    // Not logging password for security
});

const client = new Pool({
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'P@$$w0rd',
    database: process.env.DB_NAME || 'MAA',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    // Add error handling configurations
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
    max: 20
});

// Log pool events
client.on('connect', () => {
    console.log('New client connected to the pool');
});

client.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});

// Test the connection
const testConnection = async () => {
    try {
        console.log('Testing database connection...');
        const conn = await client.connect();
        console.log('Successfully connected to PostgreSQL database');
        conn.release();
        return true;
    } catch (err) {
        console.error('Error connecting to PostgreSQL:', {
            message: err.message,
            code: err.code,
            stack: err.stack
        });
        return false;
    }
};

testConnection();

module.exports = client;