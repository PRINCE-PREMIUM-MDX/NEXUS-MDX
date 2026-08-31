const express = require('express');
const path = require('path');
const fs = require('fs');
const startpairing = require('./pair');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const PAIRING_FILE = './nexstore/pairing/pairing.json';
const QR_FILE = './nexstore/pairing/qr.json';

// Sert la page de pairing
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

function cleanDigits(number) {
    return (number || '').replace(/[^0-9]/g, '');
}

function isValidNumber(digits) {
    return /^\d{7,15}$/.test(digits);
}

// --- Méthode : code d'appairage ---
app.post('/api/pair', async (req, res) => {
    try {
        const digits = cleanDigits(req.body.number);
        if (!isValidNumber(digits)) {
            return res.status(400).json({ error: 'Numéro invalide. Utilise le format international sans + ni espaces (ex: 243860885022).' });
        }

        const jid = `${digits}@s.whatsapp.net`;

        try {
            if (fs.existsSync(PAIRING_FILE)) fs.unlinkSync(PAIRING_FILE);
        } catch (e) {}

        startpairing(jid, 'code').catch(err => {
            console.log('Erreur pairing (code):', err.message);
        });

        res.json({ ok: true, message: 'Pairing lancé, récupération du code...' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/code', (req, res) => {
    try {
        if (!fs.existsSync(PAIRING_FILE)) {
            return res.json({ code: null });
        }
        const data = JSON.parse(fs.readFileSync(PAIRING_FILE, 'utf-8'));

        const age = Date.now() - new Date(data.timestamp).getTime();
        if (age > 2 * 60 * 1000) {
            return res.json({ code: null });
        }

        res.json({ code: data.code, number: data.number, timestamp: data.timestamp });
    } catch (error) {
        res.json({ code: null });
    }
});

// --- Méthode : QR code ---
app.post('/api/qr', async (req, res) => {
    try {
        const digits = cleanDigits(req.body.number);
        if (!isValidNumber(digits)) {
            return res.status(400).json({ error: 'Numéro invalide. Utilise le format international sans + ni espaces (ex: 243860885022).' });
        }

        const jid = `${digits}@s.whatsapp.net`;

        try {
            if (fs.existsSync(QR_FILE)) fs.unlinkSync(QR_FILE);
        } catch (e) {}

        startpairing(jid, 'qr').catch(err => {
            console.log('Erreur pairing (qr):', err.message);
        });

        res.json({ ok: true, message: 'Génération du QR en cours...' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/qr-status', (req, res) => {
    try {
        if (!fs.existsSync(QR_FILE)) {
            return res.json({ qr: null });
        }
        const data = JSON.parse(fs.readFileSync(QR_FILE, 'utf-8'));

        const age = Date.now() - new Date(data.timestamp).getTime();
        if (age > 2 * 60 * 1000) {
            return res.json({ qr: null });
        }

        res.json({ qr: data.qr, number: data.number, timestamp: data.timestamp });
    } catch (error) {
        res.json({ qr: null });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🌐 Site de pairing disponible sur le port ${PORT}`);
});

module.exports = app;
