import mysql from 'mysql2/promise';

// --- Helper: Save lead to DB ---
async function saveLeadToDB(data) {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT || 3306,
    ssl: { rejectUnauthorized: false },
  });

  const query = `
    INSERT INTO leads (name, email, phone, whatsapp, telegram_user, service_type, message)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    data.name,
    data.email,
    data.phone,
    data.whatsapp,
    data.telegram,
    data.service,
    data.message,
  ];

  try {
    const [result] = await connection.execute(query, values);
    return result;
  } finally {
    await connection.end();
  }
}

// --- Helper: Send Telegram notification ---
async function sendTelegramMessage(data) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn('Telegram bot token or chat ID missing!');
    return false;
  }

  const cleanPhone = data.phone.replace(/\D/g, '');
  const waLink = data.whatsapp
    ? `[WhatsApp](https://wa.me/${data.whatsapp.replace(/\D/g, '')})`
    : 'N/A';

  const tgLink = data.telegram.includes('@')
    ? `[Telegram](https://t.me/${data.telegram.replace('@', '')})`
    : data.telegram;

  const telegramMsg =
    `🚀 *New KORA Lead!*\n\n` +
    `👤 *Name:* ${data.name}\n` +
    `📧 *Email:* ${data.email}\n` +
    `📞 *Phone:* ${data.phone}\n` +
    `📱 *Telegram:* ${data.telegram_user}\n` +
    `📱 *WhatsApp:* ${data.whatsapp}\n` +
    `🏋️ *Service:* ${data.service}\n` +
    `📝 *Msg:* ${data.message}`;

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: telegramMsg,
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      }),
    });
    const result = await response.json();
    if (!result.ok) console.error('Telegram API error:', result);
    return result.ok;
  } catch (err) {
    console.error('Failed to send Telegram message:', err);
    return false;
  }
}

// --- API Handler ---
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const data = {
    name: req.body?.name || 'Unknown',
    email: req.body?.email || 'No Email',
    phone: req.body?.phone || 'No Phone',
    whatsapp: req.body?.whatsapp || 'N/A',
    telegram: req.body?.telegram || 'N/A',
    service: req.body?.service || 'General Inquiry',
    message: req.body?.message || 'No message provided',
  };

  try {
    const dbResult = await saveLeadToDB(data);
    console.log('Lead saved to DB:', dbResult);

    const telegramSent = await sendTelegramMessage(data);
    if (!telegramSent) console.warn('Telegram message not sent!');

    return res.status(200).json({ success: true, telegramSent });
  } catch (err) {
    console.error('API ERROR:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
