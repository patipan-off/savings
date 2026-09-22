require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const basicAuth = require('express-basic-auth');
const path = require('path');

const app = express();
app.use(express.json());

// Basic Authentication Security (ถ้าระบุไว้ใน .env)
if (process.env.AUTH_USER && process.env.AUTH_PASS) {
    app.use(basicAuth({
        users: { [process.env.AUTH_USER]: process.env.AUTH_PASS },
        challenge: true,
        realm: 'Savings Tracker Private Area'
    }));
}

app.use(express.static(path.join(__dirname, 'public')));

// MySQL Connection Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'savings_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// API Routes
app.get('/api/categories', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, name, color FROM categories ORDER BY sort_order ASC, created_at ASC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/categories', async (req, res) => {
    const { id, name, color } = req.body;
    try {
        await pool.query('INSERT INTO categories (id, name, color) VALUES (?, ?, ?)', [id, name, color]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/categories/:id', async (req, res) => {
    const { id } = req.params;
    const { name, color } = req.body;
    try {
        await pool.query(
            'UPDATE categories SET name = COALESCE(?, name), color = COALESCE(?, color) WHERE id = ?',
            [name || null, color || null, id]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/categories/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM categories WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/logs', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT month, amounts_json AS amounts, total, updated_at FROM savings_logs ORDER BY month ASC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/logs', async (req, res) => {
    const { month, amounts, total } = req.body;
    try {
        const query = `
            INSERT INTO savings_logs (month, amounts_json, total) 
            VALUES (?, ?, ?) 
            ON DUPLICATE KEY UPDATE amounts_json = VALUES(amounts_json), total = VALUES(total)
        `;
        await pool.query(query, [month, JSON.stringify(amounts), total]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/logs/:month', async (req, res) => {
    const { month } = req.params;
    try {
        await pool.query('DELETE FROM savings_logs WHERE month = ?', [month]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
