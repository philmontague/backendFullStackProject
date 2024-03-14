const { Pool } = require('pg'); 

const pool = new Pool({ 
    user: 'philandrose', 
    host: 'localhost',
    database: 'philsProductShop', 
    port: 5432,
})

module.exports = pool; 