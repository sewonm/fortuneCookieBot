import axios from 'axios';
import dotenv from 'dotenv'; // Only needed if running locally
dotenv.config(); // Loads environment variables from .env file if running locally

export default async function handler(req, res) {
    // Check if OpenAI API Key is available
    if (!process.env.OPENAI_API_KEY) {
        console.error('Missing OpenAI API Key'); // Log error to server logs
        return res.status(500).json({ error: 'OpenAI API key is missing' });
    }

    if (req.method === 'POST') {
        const userMessage = req.body.message;

        // Debugging: Log the OpenAI API key (REMOVE THIS AFTER TESTING)
        console.log('API Key:', process.env.OPENAI_API_KEY);

        try {
            // Make a POST request to OpenAI's API
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

            // Send the OpenAI API response back to the frontend
            res.status(200).json(response.data);

        } catch (error) {
            // Log the error details for debugging
            console.error('Error connecting to OpenAI API:', error.message || error.response?.data || error);

            // Send a meaningful error response back to the client
            res.status(500).json({
                error: 'Error connecting to OpenAI API.',
                details: error.message || error.response?.data || error
            });
        }
    } else {
        // Handle invalid request method
        res.status(405).json({ error: 'Method not allowed. Use POST.' });
    }
}