require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const FormData = require('form-data');
const sharp = require('sharp'); // Added sharp for image conversion

const app = express();
const port = process.env.PORT || 3000;

// Base prompt template for house painting
const BASE_PROMPT = "You are an intelligent AI home painter. {preferences} Make sure to maintain the architectural integrity while creating a professional and aesthetically pleasing result.";

app.use(cors({
    origin: '*',//allow all origins
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

app.post('/api/edit-image', async (req, res) => {
    try {
        const { preferences, image_url } = req.body;

        if (!image_url || !preferences) {
            return res.status(400).json({ error: 'image_url and preferences are required' });
        }

        // Generate the complete prompt
        const finalPrompt = BASE_PROMPT.replace('{preferences}', preferences);
        console.log('Generated prompt:', finalPrompt);

        // Download the image from S3
        const imageResponse = await axios.get(image_url, {
            responseType: 'arraybuffer'
        });

        // Convert image to PNG with alpha channel using sharp
        const processedImage = await sharp(imageResponse.data)
            .ensureAlpha()  // Add alpha channel if missing
            .png()          // Convert to PNG format
            .toBuffer();

        // Create form data
        const formData = new FormData();
        formData.append('image', processedImage, {
            filename: 'image.png',
            contentType: 'image/png'
        });
        formData.append('model', 'gpt-image-1');
        formData.append('prompt', finalPrompt);
        formData.append('n', 1);

        // Make request to OpenAI API
        const openaiResponse = await axios.post(
            'https://api.openai.com/v1/images/edits',
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
                }
            }
        );

        res.json(openaiResponse.data);
    } catch (error) {
        console.error('Error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });

        res.status(error.response?.status || 500).json({
            error: 'Error processing image edit request',
            details: error.response?.data || error.message
        });
    }
});

app.get('/', (req, res) => {
    res.json({ message: 'server is running' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
