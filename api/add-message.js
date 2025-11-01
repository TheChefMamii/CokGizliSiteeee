// functions/add-message.js
exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { message, from, apiKey } = JSON.parse(event.body);
        
        // Güvenlik için basit API key kontrolü
        if (apiKey !== process.env.API_SECRET_KEY) {
            return { statusCode: 401, body: 'Unauthorized' };
        }

        // Burada mesajı kaydetmek için bir veritabanı kullanman lazım
        // Örnek: Firebase, MongoDB, Supabase, vb.
        
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};