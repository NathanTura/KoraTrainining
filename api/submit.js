import mysql from 'mysql2/promise';

// --- Save lead to DB ---
async function saveLeadToDB(data) {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT || 3306,
  });

  const query = `
    INSERT INTO leads (name, email, phone, whatsapp_user, telegram_user, service_type, message)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    data.name,
    data.email,
    data.phone,
    data.whatsapp_user,
    data.telegram_user,
    data.service_type,
    data.message,
  ];

  try {
    const [result] = await connection.execute(query, values);
    return result;
  } finally {
    await connection.end();
  }
}

// --- Send Telegram notification ---
async function sendTelegramMessage(data) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) return false;

  const waLink = data.whatsapp_user !== 'N/A'
    ? `[WhatsApp](https://wa.me/${data.whatsapp_user.replace(/\D/g,'')})`
    : 'N/A';

  const tgLink = data.telegram_user !== 'N/A'
    ? `[Telegram](https://t.me/${data.telegram_user.replace(/^@/, '')})`
    : 'N/A';

  const telegramMsg =
    `🚀 *New KORA Lead!*\n\n` +
    `👤 *Name:* ${data.name}\n` +
    `📧 *Email:* ${data.email}\n` +
    `📞 *Phone:* ${data.phone}\n` +
    `📱 *Telegram:* ${tgLink}\n` +
    `📱 *WhatsApp:* ${waLink}\n` +
    `🏋️ *Service:* ${data.service_type}\n` +
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
    return result.ok;
  } catch (err) {
    console.error('Telegram error:', err);
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
    whatsapp_user: req.body?.whatsapp || 'N/A',
    telegram_user: req.body?.telegram || 'N/A',
    service_type: req.body?.service || 'General Inquiry',
    message: req.body?.message || 'No message provided',
  };

  try {
    await saveLeadToDB(data);
    await sendTelegramMessage(data);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
