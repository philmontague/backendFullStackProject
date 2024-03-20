const crypto = require('crypto'); 

// Generates a random string of hexidecimal characters 
const generateRandomString = () => {
    return crypto.randomBytes(32).toString('hex'); 
}; 

module.exports = {
    secret: generateRandomString(), 
    database: { 
        user: 'philandrosie', 
        host: 'localhost', 
        port: 5432, 
        name: 'philsEcommerceShop'
    }
}