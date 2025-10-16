// functions/telegram.js
const axios = require('axios'); // Bunu kullanmak için 3. Adımı yapman lazım!

exports.handler = async (event, context) => {
    // Sadece POST isteklerini kabul et
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        // Gelen mesajı body'den al
        const { message } = JSON.parse(event.body);

        if (!message) {
            return { statusCode: 400, body: 'Message required' };
        }

        // Token ve Chat ID'yi Netlify Ortam Değişkenlerinden al
        const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
        const CHAT_ID = process.env.CHAT_ID;

        if (!TELEGRAM_TOKEN || !CHAT_ID) {
             console.error("TELEGRAM_TOKEN veya CHAT_ID eksik!");
             return { statusCode: 500, body: JSON.stringify({ error: 'Server configuration error.' }) };
        }

        // Telegram API'sine isteği gönder
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

        // Frontend'e NetworkError yerine daha anlamlı bir hata dön
        return {
            statusCode: 500,
            body: JSON.stringify({ error: `Gönderim başarısız: ${error.response?.data?.description || error.message}` })
        };
    }
};
