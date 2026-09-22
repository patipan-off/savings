require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const basicAuth = require('express-basic-auth');
const path = require('path');

const app = express();
app.use(express.json());
app.use('/fonts/kanit', express.static(path.join(__dirname, 'node_modules/@fontsource/kanit')));

// Basic Authentication Security
if (process.env.AUTH_USER && process.env.AUTH_PASS) {
    app.use(basicAuth({
        users: { [process.env.AUTH_USER]: process.env.AUTH_PASS },
        challenge: true,
        realm: 'Financial Tracker Private Area'
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

/* =========================================================
   1. SAVINGS API ROUTES
   ========================================================= */
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
        const [rows] = await pool.query('SELECT month, entry_date, amounts_json AS amounts, total, note, updated_at FROM savings_logs ORDER BY month ASC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/logs', async (req, res) => {
    const { month, entry_date, amounts, total, note } = req.body;
    try {
        const query = `
            INSERT INTO savings_logs (month, entry_date, amounts_json, total, note) 
            VALUES (?, ?, ?, ?, ?) 
            ON DUPLICATE KEY UPDATE entry_date = VALUES(entry_date), amounts_json = VALUES(amounts_json), total = VALUES(total), note = VALUES(note)
        `;
        await pool.query(query, [month, entry_date || null, JSON.stringify(amounts), total, note || null]);
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

/* =========================================================
   2. EXPENSES API ROUTES
   ========================================================= */
app.get('/api/expense-categories', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, name, color FROM expense_categories ORDER BY sort_order ASC, created_at ASC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/expense-categories', async (req, res) => {
    const { id, name, color } = req.body;
    try {
        await pool.query('INSERT INTO expense_categories (id, name, color) VALUES (?, ?, ?)', [id, name, color]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/expense-categories/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM expense_categories WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/expense-logs', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT month, entry_date, amounts_json AS amounts, total, note, updated_at FROM expense_logs ORDER BY month ASC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/expense-logs', async (req, res) => {
    const { month, entry_date, amounts, total, note } = req.body;
    try {
        const query = `
            INSERT INTO expense_logs (month, entry_date, amounts_json, total, note) 
            VALUES (?, ?, ?, ?, ?) 
            ON DUPLICATE KEY UPDATE entry_date = VALUES(entry_date), amounts_json = VALUES(amounts_json), total = VALUES(total), note = VALUES(note)
        `;
        await pool.query(query, [month, entry_date || null, JSON.stringify(amounts), total, note || null]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/expense-logs/:month', async (req, res) => {
    const { month } = req.params;
    try {
        await pool.query('DELETE FROM expense_logs WHERE month = ?', [month]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
