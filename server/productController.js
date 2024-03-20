const db = require('./db'); 

const addProduct = async (req, res) => { 
    try {
        const { name, description, price } = req.body; 

        if (!name || !description || !price) { 
            return res.status(400).json({ error: 'Missing required fields' }); 
        }

        const SQL = `
            INSERT INTO products (name, description, price)
            VALUES ($1, $2, $3)
            RETURNING *
        `; 

        const { rows } = await db.query(SQL, [name, description, price]); 

        res.status(201).json(rows[0]); 

    } catch (error) {
        console.error('Error adding product:', error); 
        res.status(500).json({ error: 'Interal Server Error' }); 
    }
}

const editProduct = async (req, res) => { 
    try {
        const { id } = req.params; 
        const { name, description, price } = req.body; 

        if (!name || !description || !price) {
            return res.status(400).json({ error: 'Missing required fields' }); 
        }

        const SQL = ` 
            UPDATE products
            SET name = $1, description = $2, price = $3
            WHERE id = $4
            RETURNING *
        `; 
        const { rows } = await db.query(SQL, [name, description, price, id]); 

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' }); 
        }

        res.json(rows[0]); 

    } catch (error) {
        console.error('Error editing product:', error); 
        res.status(500).json({ error: 'Internal Server Error' }); 
    }
}

const removeProduct = async (req, res) => {
    try {
        const productId = req.params.id; 

        const SQL = `
            DELETE FROM products
            WHERE id = $1
            RETURNING *
        `; 

        const { rows } = await db.query(SQL, [productId]); 

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' }); 
        }

        res.json({ message: 'Product deleted successfully' }); 

    } catch (error) {
        console.error('Error deleting product:', error); 
        res.status(500).json({ error: 'Internal Server Error' }); 
    }
}


module.exports = { addProduct, editProduct, removeProduct }; 