const express = require('express');
const router = express.Router();
const db = require('./db');
const { authenticateUser } = require('./middleware');
const { getCartForUser, addToCart } = require('./cartController');

router.get('/products', async (req, res) => {
    try {
        const SQL = `SELECT * FROM products`;
        const { rows } = await db.query(SQL);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Single Product
router.get('/product/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const SQL = `SELECT * FROM products WHERE id = $1`;
        const { rows } = await db.query(SQL, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/user/:id', authenticateUser, getCartForUser);

router.post('/cart', authenticateUser, addToCart); 

module.exports = router;
