import mysql from 'mysql2/promise';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    // 1. Log the incoming data to debug the "undefined" issues
    console.log("Incoming Body:", JSON.stringify(req.body));

    const data = {
        name: req.body?.name || "Unknown",
        email: req.body?.email || "No Email",
        phone: req.body?.phone || "No Phone",
        telegram: req.body?.telegram || "N/A",
        service: req.body?.service || "General Inquiry",
        message: req.body?.message || ""
    };

    let connection;
    try {
        // 2. Connect using the URI from your Env Variables
        connection = await mysql.createConnection(process.env.MYSQL_URI);

        // 3. Insert into the table we created earlier
        const query = 'INSERT INTO leads (name, email, phone, telegram_user, service_type, message) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [data.name, data.email, data.phone, data.telegram, data.service, data.message];
        
        await connection.execute(query, values);

        // 4. Telegram Alert
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;
        
        const telegramMsg = `🚀 *New KORA Lead!*\n` +
            `👤 *Name:* ${data.name}\n` +
            `📧 *Email:* ${data.email}\n` +
            `📞 *Phone:* ${data.phone}\n` +
            `📱 *Telegram:* ${data.telegram}\n` +
            `🏋️ *Service:* ${data.service}\n` +
            `📝 *Msg:* ${data.message || 'None'}`;

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
        console.error("LOGS:", error.message);
        return res.status(500).json({ success: false, error: error.message });
    } finally {
        if (connection) await connection.end();
    }
}