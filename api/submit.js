const mysql = require('mysql2/promise');

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { name, email, phone, service, message } = req.body;

    let connection;
    try {
        connection = await mysql.createConnection(process.env.MYSQL_URI);

        // 1. Save all fields to Aiven MySQL
        await connection.execute(
            'INSERT INTO leads (name, email, phone, service_type, message) VALUES (?, ?, ?, ?, ?)',
            [name, email, phone, service, message]
        );

        // 2. Format a detailed Telegram message for the Admin
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;
        
        const telegramMsg = `
🚀 *New KORA Customer Received!*
━━━━━━━━━━━━━━━
👤 *Name:* ${name}
📧 *Email:* ${email}
📞 *Phone:* ${phone}
🏋️ *Service:* ${service}
📝 *Message:* ${message || 'No message provided'}
━━━━━━━━━━━━━━━
        `;

        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: telegramMsg,
                parse_mode: 'Markdown'
            })
        });

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: error.message });
    } finally {
        if (connection) await connection.end();
    }
}