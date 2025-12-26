const mysql = require('mysql2');

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    // 1. Capture and Clean Data (Guaranteeing no 'undefined')
    const data = {
        name: req.body?.name || "Unknown",
        email: req.body?.email || "No Email",
        phone: req.body?.phone || "No Phone",
        telegram: req.body?.telegram || "N/A",
        service: req.body?.service || "General Inquiry",
        message: req.body?.message || "No message provided"
    };

    // 2. Setup Database Connection
    const connection = mysql.createConnection(process.env.MYSQL_URI);

    // 3. Create a Manual Promise to handle the DB Execute
    const saveToDb = () => {
        return new Promise((resolve, reject) => {
            const query = `INSERT INTO leads (name, email, phone, telegram_user, service_type, message) VALUES (?, ?, ?, ?, ?, ?)`;
            const values = [data.name, data.email, data.phone, data.telegram, data.service, data.message];

            connection.execute(query, values, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    };

    try {
        // 4. Run the Database Save
        await saveToDb();

        // 5. Send Telegram Notification
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;
        
        const cleanPhone = data.phone.replace(/\D/g, '');
        const waLink = `[WhatsApp](https://wa.me/${cleanPhone})`;
        const tgLink = data.telegram.includes('@') 
            ? `[Telegram](https://t.me/${data.telegram.replace('@', '')})` 
            : data.telegram;

        const telegramMsg = `🚀 *New KORA Lead!*\n\n` +
            `👤 *Name:* ${data.name}\n` +
            `📧 *Email:* ${data.email}\n` +
            `📞 *Phone:* ${data.phone}\n` +
            `📱 *Links:* ${tgLink} | ${waLink}\n` +
            `🏋️ *Service:* ${data.service}\n` +
            `📝 *Msg:* ${data.message}`;

        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: telegramMsg,
                parse_mode: 'Markdown',
                disable_web_page_preview: true
            })
        });

        return res.status(200).json({ success: true });

    } catch (error) {
        console.error("DATABASE ERROR:", error.message);
        return res.status(500).json({ success: false, error: error.message });
    } finally {
        // 6. Close Connection
        connection.end();
    }
}