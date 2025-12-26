import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 1️⃣ Clean + Safe Payload
  const data = {
    name: req.body?.name || 'Unknown',
    email: req.body?.email || 'No Email',
    phone: req.body?.phone || 'No Phone',
    telegram: req.body?.telegram || 'N/A',
    service: req.body?.service || 'General Inquiry',
    message: req.body?.message || 'No message provided',
  };

  let connection;

  try {
        // 2️⃣ Create DB Connection (Vercel Safe)
    connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT || 3306,
    ssl: false,
    });

    // 3️⃣ Insert Lead
    await connection.execute(
      `INSERT INTO leads 
       (name, email, phone, telegram_user, service_type, message)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.name,
        data.email,
        data.phone,
        data.telegram,
        data.service,
        data.message,
      ]
    );

    // 4️⃣ Telegram Notification
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    const cleanPhone = data.phone.replace(/\D/g, '');
    const waLink = cleanPhone
      ? `[WhatsApp](https://wa.me/${cleanPhone})`
      : 'N/A';

    const tgLink = data.telegram.includes('@')
      ? `[Telegram](https://t.me/${data.telegram.replace('@', '')})`
      : data.telegram;

    const telegramMsg =
      `🚀 *New KORA Lead!*\n\n` +
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
        disable_web_page_preview: true,
      }),
    });

    // 5️⃣ Success Response
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('API ERROR:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  } finally {
    // 6️⃣ Always Close Connection
    if (connection) await connection.end();
  }
}
