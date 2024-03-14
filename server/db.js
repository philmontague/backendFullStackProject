const { Pool } = require('pg');
const { database } = require('./config');

const pool = new Pool({
    user: 'philandrosie',
    host: 'localhost',
    database: 'philsEcommerceShop',
    port: 5432,
});

const createTables = async () => {
    try {
        const client = await pool.connect();

        // Create tables if they don't exist
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255),
                username VARCHAR(255) UNIQUE,
                password VARCHAR(255),
                role VARCHAR(30) DEFAULT 'shopper'
            )
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                total_amount NUMERIC,
                status VARCHAR(50) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await client.query(`
           CREATE TABLE IF NOT EXISTS cart ( 
            id SERIAL PRIMARY KEY, 
            user_id INTEGER REFERENCES users(id), 
            product_id INTEGER, 
            quantity INTEGER DEFAULT 1, 
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
           )
        `); 

        client.release();
        console.log('Tables created successfully');
    } catch (error) {
        console.error('Error creating tables:', error);
    }
};

module.exports = { pool, createTables };

(async () => {
    await createTables(); 
})(); 