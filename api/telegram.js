// functions/telegram.js (ESKİ KODUN - SORUNSUZ!)
const axios = require('axios');

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }
    try {
        const { message } = JSON.parse(event.body);
        if (!message) {
            return { statusCode: 400, body: 'Message required' };
        }

        const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
        const CHAT_ID = process.env.CHAT_ID;

        if (!TELEGRAM_TOKEN || !CHAT_ID) {
            console.error("TELEGRAM_TOKEN veya CHAT_ID eksik!");
            return { statusCode: 500, body: JSON.stringify({ error: 'Server configuration error.' }) };
        }

        const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
        await axios.post(telegramUrl, {
            chat_id: CHAT_ID,
            text: `Sevgilinden Yeni Mesaj:\n\n${message}`
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: 'Mesaj iletildi.' })
        };
    } catch (error) {
        console.error('Telegram Gönderim Hatası:', error.response?.data || error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: `Gönderim başarısız: ${error.response?.data?.description || error.message}` })
        };
    }
};