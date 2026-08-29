const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const figlet = require('figlet');

const AUTH_FILE = './auth.json';
const PAIRING_DIR = './nexstore/pairing/';
const startpairing = require('./pair');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

function isAuthenticated() {
    try {
        return fs.existsSync(AUTH_FILE) && JSON.parse(fs.readFileSync(AUTH_FILE)).authenticated;
    } catch { return false; }
}

function setAuthenticated(value) {
    fs.writeFileSync(AUTH_FILE, JSON.stringify({ authenticated: value }));
}

const autoLoadPairs = async () => {
    console.log(chalk.cyan('🔄 Auto-loading all paired users...'));
    if (!fs.existsSync(PAIRING_DIR)) {
        console.log(chalk.red('❌ Pairing directory not found.'));
        return;
    }
    const pairedUsers = fs.readdirSync(PAIRING_DIR, { withFileTypes: true })
        .filter(d => d.isDirectory()).map(d => d.name)
        .filter(name => name.endsWith('@s.whatsapp.net'));

    if (pairedUsers.length === 0) {
        console.log(chalk.yellow('ℹ️ No paired users found.'));
        return;
    }
    console.log(chalk.green(`✅ Found ${pairedUsers.length} paired users.`));
    await delay(4000);

    for (let i = 0; i < pairedUsers.length; i++) {
        const userNumber = pairedUsers[i];
        try {
            console.log(chalk.blue(`🔄 Connecting ${i+1}/${pairedUsers.length}: ${userNumber}`));
            await startpairing(userNumber);
            console.log(chalk.green(`✅ Connected: ${userNumber}`));
            if (i < pairedUsers.length - 1) await delay(4000);
        } catch (error) {
            console.log(chalk.red(`❌ Failed for ${userNumber}: ${error.message}`));
            if (i < pairedUsers.length - 1) await delay(4000);
        }
    }
};

const initializeBot = async () => {
    console.log(chalk.cyan(figlet.textSync('NEXUS-MDX BOT ACTIVE')));
    console.log(chalk.yellow('\n⚄︎═════════════════════════════════════⚄︎'));
    
    await autoLoadPairs();

    // Sur Railway, on skip le password automatiquement
    if (process.env.RAILWAY_ENVIRONMENT || process.env.NODE_ENV === 'production') {
        console.log(chalk.green('✅ Railway detected - Skipping password...'));
        setAuthenticated(true);
        launchBot();
    } else if (isAuthenticated()) {
        console.log(chalk.green('✅ Welcome back! Skipping password...'));
        launchBot();
    } else {
        // Mot de passe seulement en local
        const { startupPassword } = require('./nexstore/token');
        const readline = require('readline');
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        console.log(chalk.bold.yellow('🔐 Enter password to start bot:'));
        rl.question(chalk.green('Password: '), function (input) {
            if (input !== startupPassword) {
                console.log(chalk.red('\n❌ Incorrect password. Exiting...'));
                process.exit(1);
            }
            console.log(chalk.green('\n✅ Password correct.'));
            setAuthenticated(true);
            rl.close();
            launchBot();
        });
    }
};

function launchBot() {
    console.log(chalk.blue('NEXUS-MDX ME ALL....\n'));
    let telegramLoaded = false;
    let whatsappLoaded = false;

    const botPath = path.join(__dirname, 'bot.js');
    if (fs.existsSync(botPath)) {
        try {
            console.log(chalk.blue('📱 Loading Telegram pairing system...'));
            require('./bot');
            telegramLoaded = true;
            console.log(chalk.blue('✅ NEXUS-MDX IS SUCCESSFULLY ACTIVE'));
        } catch (error) {
            console.log(chalk.red('❌ Failed to load bot.js:', error.message));
            console.log(chalk.yellow('⚠️ Continuing without Telegram bot...\n'));
        }
    }

    const nexusPath = path.join(__dirname, 'case.js');
    if (fs.existsSync(nexusPath)) {
        try {
            console.log(chalk.blue('💬 Loading WhatsApp commands system...'));
            require('./case');
            whatsappLoaded = true;
            console.log(chalk.green('✅ WhatsApp commands loaded successfully!'));
        } catch (error) {
            console.log(chalk.red('❌ Failed to load WhatsApp commands (case.js):'));
            console.log(chalk.red('   Error:', error.message));
            console.log(chalk.yellow('⚠️ Continuing without WhatsApp commands...\n'));
        }
    }

    console.log(chalk.cyan('\n⚄︎══════════════════════════════════════════════⚄︎'));
    console.log(telegramLoaded ? chalk.green('✅ NEXUS-MDX : ACTIVE ') : chalk.red('❌ NEXUS-MDX : INACTIVE'));
    console.log(whatsappLoaded ? chalk.green('✅ WHATSAPP COMMANDS: ACTIVE') : chalk.red('❌ WHATSAPP COMMANDS : INACTIVE'));
    console.log(chalk.cyan('⚄︎════════════════════════════════⚄︎\n'));
}

process.on('SIGINT', () => { console.log(chalk.yellow('\n⚠️ Shutting down...')); process.exit(0); });
process.on('SIGTERM', () => { process.exit(0); });

initializeBot().catch((error) => {
    console.log(chalk.red('\n❌ Fatal error:'), error.message);
    process.exit(1);
});
