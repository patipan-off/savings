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

// Auto-initialize Tables if missing
async function initTables() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS categories (
                id VARCHAR(50) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                color VARCHAR(20) DEFAULT '#10b981',
                sort_order INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        await pool.query(`
            CREATE TABLE IF NOT EXISTS savings_logs (
                month VARCHAR(7) PRIMARY KEY,
                entry_date DATE DEFAULT NULL,
                amounts_json JSON NOT NULL,
                total DECIMAL(12,2) NOT NULL DEFAULT 0.00,
                note TEXT DEFAULT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        await pool.query(`
            CREATE TABLE IF NOT EXISTS expense_categories (
                id VARCHAR(50) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                color VARCHAR(20) DEFAULT '#ef4444',
                sort_order INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        await pool.query(`
            CREATE TABLE IF NOT EXISTS expense_logs (
                month VARCHAR(7) PRIMARY KEY,
                entry_date DATE DEFAULT NULL,
                amounts_json JSON NOT NULL,
                total DECIMAL(12,2) NOT NULL DEFAULT 0.00,
                note TEXT DEFAULT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        await pool.query(`
            CREATE TABLE IF NOT EXISTS subscriptions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                price DECIMAL(12,2) NOT NULL DEFAULT 0.00,
                cycle ENUM('monthly', 'yearly') DEFAULT 'monthly',
                color VARCHAR(20) DEFAULT '#6366f1',
                category VARCHAR(50) DEFAULT NULL,
                note TEXT DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Migration Check: add column color
        const [cols] = await pool.query(`SHOW COLUMNS FROM subscriptions LIKE 'color'`);
        if (cols.length === 0) {
            await pool.query(`ALTER TABLE subscriptions ADD COLUMN color VARCHAR(20) DEFAULT '#6366f1' AFTER cycle`);
        }

        console.log("✅ Database tables checked/created successfully.");
    } catch (err) {
        console.error("❌ Database table initialization failed:", err.message);
    }
}
initTables();

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

app.put('/api/categories/:id', async (req, res) => {
    const { id } = req.params;
    const { name, color } = req.body;
    try {
        await pool.query('UPDATE categories SET name = ?, color = ? WHERE id = ?', [name, color, id]);
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

app.put('/api/expense-categories/:id', async (req, res) => {
    const { id } = req.params;
    const { name, color } = req.body;
    try {
        await pool.query('UPDATE expense_categories SET name = ?, color = ? WHERE id = ?', [name, color, id]);
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

/* =========================================================
   3. SUBSCRIPTIONS API ROUTES
   ========================================================= */
app.get('/api/subscriptions', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM subscriptions ORDER BY id DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/subscriptions', async (req, res) => {
    const { name, price, cycle, color, category, note } = req.body;
    try {
        await pool.query(
            'INSERT INTO subscriptions (name, price, cycle, color, category, note) VALUES (?, ?, ?, ?, ?, ?)',
            [name, price, cycle || 'monthly', color || '#6366f1', category || null, note || null]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/subscriptions/:id', async (req, res) => {
    const { id } = req.params;
    const { name, price, cycle, color, category, note } = req.body;
    try {
        await pool.query(
            'UPDATE subscriptions SET name = ?, price = ?, cycle = ?, color = ?, category = ?, note = ? WHERE id = ?',
            [name, price, cycle, color || '#6366f1', category, note, id]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/subscriptions/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM subscriptions WHERE id = ?', [id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Fallback for missing API Routes
app.use('/api/*', (req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
