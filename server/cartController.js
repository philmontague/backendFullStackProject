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

module.exports = { getCartForUser, addToCart };

