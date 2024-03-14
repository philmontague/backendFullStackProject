const express = require('express'); 
const router = express.Router(); 

router.get('/products', (req, res) => {
    res.json({ message: 'This is the products route' }); 
})

module.exports = router; 