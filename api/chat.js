import axios from 'axios';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const userMessage = req.body.message;

        try {
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'You are a fortune cookie that gives short, wise, and cryptic fortunes.' },
                    { role: 'user', content: `You are a wise fortune cookie. Respond with short, cryptic, yet thoughtful fortunes. The user has asked: "${userMessage}"` }
                ]
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            res.status(200).json(response.data);  // Send response back to frontend
        } catch (error) {
            console.error('Error connecting to OpenAI:', error.message || error.response?.data || error);

            // Send a more detailed error message to the frontend
            res.status(500).json({
                error: 'Error connecting to OpenAI API.',
                details: error.message || error.response?.data || error
            });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed. Use POST.' });
    }
}