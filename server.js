import 'dotenv/config';
import express from 'express';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


const app = express();
const PORT = 3000;

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database
const db = new sqlite3.Database('emails.db');

db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS emails (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Routes
app.post('/signup', (req, res) => {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'Invalid email' });
    }

    db.run(
        `INSERT OR IGNORE INTO emails (email) VALUES (?)`,
        [email],
        async (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error' });
            }

            try {
                await transporter.sendMail({
                    from: '"Landing Page Bot" <noahobrien012845@gmail.com>',
                    to: "noahobrien012845@gmail.com",
                    subject: 'New App Signup 🚀',
                    text: `New user signed up with email: ${email}`
                });

                res.json({ success: true });
            } catch (mailErr) {
                console.error(mailErr);
                res.status(500).json({ error: 'Email notification failed' });
            }
        }
    );
});


// Start server
app.listen(PORT, () => {
    console.log(`🚀 Landing page running on http://localhost:${PORT}`);
});
