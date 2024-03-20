const express = require('express');
const router = express.Router();
const db = require('./db');
const { authenticateUser, authenticateAdmin } = require('./middleware');
const { getCartForUser, addToCart, updateCartItem, removeCartItem, checkoutProduct } = require('./cartController');
const { addProduct, editProduct, removeProduct } = require('./productController'); 

// getAllUsers function 
const getAllUsers = async (req, res) => { 
    try {
        const SQL = `SELECT * FROM users`; 
        const { rows } = await db.query(SQL); 
        res.json(rows); 
    } catch (error) {
        console.error('Error fetching all users:', error); 
        res.status(500).json({ error: 'Internal Server Error'}); 
    }
}

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

// Get cart for user
router.get('/user/:id', authenticateUser, getCartForUser);

// Add item to cart 
router.post('/cart', authenticateUser, addToCart); 

// Update item in cart
router.put('/cart/:id', authenticateUser, updateCartItem); 

// Remove item from cart 
router.delete('/cart/:id', authenticateUser, removeCartItem); 

// Get all users (Admin) 
router.get('/users', authenticateUser, authenticateAdmin, getAllUsers); 

// Cart checkout 
router.put('/cart/:id/checkout', authenticateUser, checkoutProduct); 

// Add product 
router.post('/products', authenticateAdmin, addProduct); 

// Edit product 
router.put('/product/:id', authenticateAdmin, editProduct); 

// Remove product 
router.delete('/product/:id', authenticateAdmin, removeProduct); 

module.exports = router;
