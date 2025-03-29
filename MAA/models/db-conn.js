const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'MAA',
    password: 'P@$$w0rd',
    port: 5432,
});

client.connect()
    .then(() => {
        console.log('Connected to PostgreSQL database');
        // Test query to ensure the connection works
        return client.query('SELECT NOW()');
    })
    .then(result => console.log('Database test query result:', result.rows[0]))
    .catch(err => {
        console.error('Connection error', err.stack); // Log the error stack
        process.exit(1); // Exit the process if the connection fails
    });

module.exports = client;