const db = require('./db'); 


const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body; 

        if (!userId || !productId || !quantity) {
            return res.status(400).json({ error: 'Missing required fields' }); 
        }

        const SQL = `
            INSERT INTO cart (user_id, product_id, quantity)
            VALUES ($1, $2, $3)
            RETURNING *`; 
        const { rows } = await db.query(SQL, [userId, productId, quantity]); 

        res.status(200).json(rows[0]); 
    } catch (error) {
        console.error('Error adding product to cart:', error); 
        res.status(500).json({ error: 'Internal Server Error' }); 
    }
}

const getCartForUser = async (req, res) => { 
    try {
        const userId = req.params.id; 
        const SQL = `SELECT * FROM cart WHERE user_id = $1`; 
        const { rows } = await db.query(SQL, [userId]); 
        res.json(rows); 
    } catch (error) {
        console.error('Error fetching cart for user:', error); 
        res.status(500).json({ error: 'Internal Server Error' }); 
    }
}

const updateCartItem = async (req, res) => {
    try {
        const { id } = req.params; 
        const { quantity } = req.body; 

        if (!id || !quantity) { 
            return res.status(400).json({ error: 'Missing required fields' }); 
        }

        const SQL = `
            UPDATE cart 
            SET quantity = $1
            WHERE id = $2
            RETURNING *
        `; 
        const { rows } = await db.query(SQL, [quantity, id]); 

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Cart item not found' }); 
        }

        res.status(200).json(rows[0]); 

    } catch (error) {
        console.error('Error updating cart item:', error); 
        res.status(500).json({ error: 'Internal Server Error' }); 
    }
}

const removeCartItem = async (req, res) => {
    try {
        const { id } = req.params; 

        if (!id) {
            return res.status(400).json({ error: 'Missing required fields' }); 
        }

        const SQL = `
            DELETE FROM cart
            WHERE id = $1
            RETURNING *
        `; 
        const { rows } = await db.query(SQL, [id]); 

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Cart item not found' }); 
        }

        res.status(404).json({ message: 'Cart item removed successfully' }); 

    } catch (error) {
        console.error('Error removing cart item:', error); 
        res.status(500).json({ error: 'Interal Server Error' }); 
    }
}

const checkoutProduct = async (req, res) => {
    try {
        const { id } = req.params; 

        if (!id) {
            return res.status(400).json({ error: 'Missing required fields'}); 
        }

        const SQL = `
            UPDATE cart
            SET status = 'checked_out'
            WHERE id = $1
            RETURNING *
        `; 
        const { rows } = await db.query(SQL, [id]); 

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Cart item not found'}); 
        }

        res.status(200).json(rows[0]); 

    } catch (error) {
        console.error('Error checking out product:', error); 
        res.status(500).json({ error: 'Internal Server Error' }); 
    }
}

module.exports = { getCartForUser, addToCart, updateCartItem, removeCartItem, checkoutProduct };

