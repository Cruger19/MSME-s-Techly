// Import necessary modules and dependencies
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const mysql = require('mysql2');
require('dotenv').config(); // Load environment variables

const app = express();
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: true,
}));
app.use(express.json()); // Middleware for parsing JSON data

// Create MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'your_Password',
    database: process.env.DB_NAME || 'msme_project_db',
});

// Test the connection
db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL as ID:', db.threadId);
});

// Middleware to authenticate user via JWT
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.sendStatus(403);
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

// User Authentication Endpoints
app.post('/api/auth/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], (error, results) => {
        if (error) return res.status(500).json({ message: 'Database error' });
        res.status(201).json({ id: results.insertId, username, email });
    });
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
        if (error || results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });
        const user = results[0];
        if (!(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token });
    });
});

// Product Management Endpoints
app.get('/api/products', (req, res) => {
    db.query('SELECT * FROM products', (error, results) => {
        if (error) return res.status(500).json({ message: 'Database error' });
        res.json(results);
    });
});

app.post('/api/products', authenticate, (req, res) => {
    const { name, price, stock } = req.body;
    db.query('INSERT INTO products (name, price, stock) VALUES (?, ?, ?)', [name, price, stock], (error, results) => {
        if (error) return res.status(500).json({ message: 'Database error' });
        res.status(201).json({ id: results.insertId, name, price, stock });
    });
});

// Order and Payment Endpoints
app.post('/api/orders', authenticate, (req, res) => {
    const { products } = req.body;
    let total_price = 0;

    const processOrders = async (index) => {
        if (index >= products.length) {
            // Create order after processing all products
            db.query('INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, ?)', [req.user.id, total_price, 'Pending'], (error, results) => {
                if (error) return res.status(500).json({ message: 'Database error' });
                res.status(201).json({ orderId: results.insertId, total_price, status: 'Pending' });
            });
            return;
        }

        const p = products[index];
        db.query('SELECT * FROM products WHERE id = ?', [p.id], (error, results) => {
            if (error || results.length === 0) return res.status(400).json({ message: `Product not found` });

            const product = results[0];
            if (product.stock < p.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
            }

            total_price += product.price * p.quantity;
            product.stock -= p.quantity; // Update stock

            // Update product stock in the database
            db.query('UPDATE products SET stock = ? WHERE id = ?', [product.stock, product.id], (err) => {
                if (err) return res.status(500).json({ message: 'Database error' });
                // Process the next product
                processOrders(index + 1);
            });
        });
    };

    processOrders(0);
});

// Expense Management Endpoints
app.post('/api/expenses', authenticate, (req, res) => {
    const { category, amount, description } = req.body;
    db.query('INSERT INTO expenses (user_id, category, amount, description) VALUES (?, ?, ?, ?)', [req.user.id, category, amount, description], (error, results) => {
        if (error) return res.status(500).json({ message: 'Database error' });
        res.status(201).json({ id: results.insertId, category, amount, description });
    });
});

app.get('/api/expenses', authenticate, (req, res) => {
    db.query('SELECT * FROM expenses WHERE user_id = ?', [req.user.id], (error, results) => {
        if (error) return res.status(500).json({ message: 'Database error' });
        res.json(results);
    });
});

// Start the server
app.listen(3000, () => {
    console.log('MSME backend running on port 3000');
});
