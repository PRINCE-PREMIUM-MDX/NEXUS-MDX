const express = require('express');
const path = require('path');
const fs = require('fs');
const startpairing = require('./pair');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const PAIRING_FILE = './nexstore/pairing/pairing.json';

// Sert la page de pairing
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Démarre le pairing pour un numéro donné
app.post('/api/pair', async (req, res) => {
    try {
        const { number } = req.body;
        if (!number || !/^\d{7,15}$/.test(number.replace(/[^0-9]/g, ''))) {
            return res.status(400).json({ error: 'Numéro invalide. Utilise le format international sans + ni espaces (ex: 243860885022).' });
        }

        const cleanNumber = number.replace(/[^0-9]/g, '');
        const jid = `${cleanNumber}@s.whatsapp.net`;

        // Supprime l'ancien code en attente pour ne pas renvoyer un code périmé
        try {
            if (fs.existsSync(PAIRING_FILE)) fs.unlinkSync(PAIRING_FILE);
        } catch (e) {}

        // Lance le pairing en arrière-plan (le code sera écrit dans pairing.json après ~3s)
        startpairing(jid).catch(err => {
            console.log('Erreur pairing:', err.message);
        });

        res.json({ ok: true, message: 'Pairing lancé, récupération du code...' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Le front-end interroge cette route pour récupérer le code une fois généré
app.get('/api/code', (req, res) => {
    try {
        if (!fs.existsSync(PAIRING_FILE)) {
            return res.json({ code: null });
        }
        const data = JSON.parse(fs.readFileSync(PAIRING_FILE, 'utf-8'));

        // On ne renvoie le code que s'il a moins de 2 minutes (évite d'afficher un vieux code)
        const age = Date.now() - new Date(data.timestamp).getTime();
        if (age > 2 * 60 * 1000) {
            return res.json({ code: null });
        }

        res.json({ code: data.code, number: data.number, timestamp: data.timestamp });
    } catch (error) {
        res.json({ code: null });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🌐 Site de pairing disponible sur le port ${PORT}`);
});

module.exports = app;
