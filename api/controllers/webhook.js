const axios = require('axios');
require('dotenv').config();

/**
 * Send CV data to the webhook endpoint.
 * @param {Object} data - The JSON payload to send.
 */
async function sendToWebhook(data) {
    const webhookUrl = 'https://rnd-assignment.automations-3d6.workers.dev';
    const candidateEmail = 'madusankadilan226@gmail.com'; // Your Metana application email

    try {
        const response = await axios.post(webhookUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                'X-Candidate-Email': candidateEmail, // Custom header
            }
        });

        console.log('Webhook response:', response.data);
        return response.data;

    } catch (error) {
        console.error('Error sending data to webhook:', error.response?.data || error.message);
    }
}

module.exports = { sendToWebhook };


