// functions/telegram-webhook.js
const axios = require('axios');

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const update = JSON.parse(event.body);
        
        if (update.message && update.message.text) {
            const chatId = update.message.chat.id;
            const text = update.message.text;
            const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
            const AUTHORIZED_CHAT_ID = process.env.CHAT_ID;
            const API_SECRET_KEY = process.env.API_SECRET_KEY;

            if (chatId.toString() !== AUTHORIZED_CHAT_ID) {
                return { statusCode: 200, body: 'OK' };
            }

            if (text.startsWith('/reply ') || text.startsWith('/r ')) {
                const message = text.replace(/^\/reply\s+/, '').replace(/^\/r\s+/, '').trim();
                
                if (message) {
                    const siteUrl = process.env.SITE_URL || `https://${event.headers.host}`;
                    
                    try {
                        await axios.post(`${siteUrl}/.netlify/functions/add-message`, {
                            message: message,
                            from: 'mami',
                            apiKey: API_SECRET_KEY
                        });

                        await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
                            chat_id: chatId,
                            text: `✅ Mesaj gönderildi:\n\n"${message}"`,
                            parse_mode: 'HTML'
                        });
                    } catch (error) {
                        await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
                            chat_id: chatId,
                            text: `❌ Hata: ${error.message}`
                        });
                    }
                }
            } 
            else if (text === '/help' || text === '/start') {
                await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
                    chat_id: chatId,
                    text: `💕 <b>Mami Bot</b>\n\n<b>Komutlar:</b>\n/reply [mesaj] - Sevgiline mesaj gönder\n/r [mesaj] - Kısa versiyon\n\n<b>Örnek:</b>\n/reply Aşkım nasılsın? ❤️`,
                    parse_mode: 'HTML'
                });
            }
        }

        return { statusCode: 200, body: 'OK' };
    } catch (error) {
        console.error('Webhook Hatası:', error);
        return { statusCode: 500, body: 'Internal Server Error' };
    }
};