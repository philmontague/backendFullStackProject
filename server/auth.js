const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { secret } = require('./config');
const db = require('./db');

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const SQL = `SELECT id, username, password, role FROM users WHERE username = $1`;
        const { rows } = await db.query(SQL, [username]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid Credentials' });
        }

        const user = rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid Credentials' });
        }

        const token = jwt.sign({ user: { id: user.id, username: user.username, role: user.role } }, secret, { expiresIn: '1h' });

        res.json({ token });

    } catch (error) {
        console.log('Error during login', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/signup', async (req, res) => {
    const { name, username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const SQL = `INSERT INTO users (name, username, password) VALUES ($1, $2, $3) RETURNING id, username, role`;
        const { rows } = await db.query(SQL, [name, username, hashedPassword]);

        const user = rows[0];
        const token = jwt.sign({ user: { id: user.id, username: user.username, role: user.role } }, secret, { expiresIn: '1h' });

        res.json({ token });

    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
