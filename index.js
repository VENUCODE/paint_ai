require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const FormData = require('form-data');
const sharp = require('sharp');

const app = express();
const port = process.env.PORT || 3000;

// Base prompt templates
const EXTERIOR_PROMPT = "You are an intelligent AI home painter. {preferences} .Make sure to maintain the architectural integrity while creating a professional and aesthetically pleasing result.";
const INTERIOR_PROMPT = "You are an expert AI interior designer. {preferences} .Ensure the design maintains proper spatial relationships, lighting, and architectural elements while creating a cohesive and sophisticated interior space.";
const NATURE_INSPIRED_PROMPT = "Transform the natural elements, patterns, and essence of this image into a stunning piece of architecture. Create a hyper-realistic building that harmoniously integrates the organic forms, textures, and colors from the natural scene. The building should appear as if it emerged from the same natural principles - incorporating flowing lines, natural materials, and biophilic design elements. Include human elements to show scale and bring life to the scene. Ensure dramatic lighting, atmospheric depth, and photorealistic materials that echo the natural inspiration while creating a sophisticated, modern architectural statement.";

app.use(cors({
    origin: '*',//allow all origins
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Helper function for image processing and API call
async function processImageAndCallAPI(imageUrl, prompt, apiKey) {
    // Download the image
    const imageResponse = await axios.get(imageUrl, {
        responseType: 'arraybuffer'
    });

    // Convert image to PNG with alpha channel
    const processedImage = await sharp(imageResponse.data)
        .ensureAlpha()
        .png()
        .toBuffer();

    // Create form data
    const formData = new FormData();
    formData.append('image', processedImage, {
        filename: 'image.png',
        contentType: 'image/png'
    });
    formData.append('model', 'gpt-image-1');
    formData.append('prompt', prompt);
    formData.append('n', 1);

    // Make request to OpenAI API
    const openaiResponse = await axios.post(
        'https://api.openai.com/v1/images/edits',
        formData,
        {
            headers: {
                ...formData.getHeaders(),
                'Authorization': `Bearer ${apiKey}`
            }
        }
    );

    return openaiResponse.data;
}

// Exterior painting endpoint
app.post('/api/edit-image', async (req, res) => {
    try {
        const { preferences, image_url } = req.body;
        const apiKey = req.headers.authorization;

        if (!image_url || !preferences) {
            return res.status(400).json({ error: 'image_url and preferences are required' });
        }

        const finalPrompt = EXTERIOR_PROMPT.replace('{preferences}', preferences);
        console.log('Generated exterior prompt:', finalPrompt);

        const result = await processImageAndCallAPI(image_url, finalPrompt, apiKey);
        res.json(result);
    } catch (error) {
        console.error('Error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });

        res.status(error.response?.status || 500).json({
            error: 'Error processing exterior design request',
            details: error.response?.data || error.message
        });
    }
});

// Interior design endpoint
app.post('/api/interior-design', async (req, res) => {
    try {
        const { preferences, image_url } = req.body;
        const apiKey = req.headers.authorization;

        if (!image_url || !preferences) {
            return res.status(400).json({ error: 'image_url and preferences are required' });
        }

        const finalPrompt = INTERIOR_PROMPT.replace('{preferences}', preferences);
        console.log('Generated interior prompt:', finalPrompt);

        const result = await processImageAndCallAPI(image_url, finalPrompt, apiKey);
        res.json(result);
    } catch (error) {
        console.error('Error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });

        res.status(error.response?.status || 500).json({
            error: 'Error processing interior design request',
            details: error.response?.data || error.message
        });
    }
});

// Nature-inspired architectural visualization endpoint
app.post('/api/nature-inspired', async (req, res) => {
    try {
        const { image_url } = req.body;
        const apiKey = req.headers.authorization;
        if (!image_url) {
            return res.status(400).json({ error: 'image_url is required' });
        }
        console.log('Processing nature-inspired architectural generation...');
        const result = await processImageAndCallAPI(image_url, NATURE_INSPIRED_PROMPT, apiKey);
        res.json(result);
    } catch (error) {
        console.error('Error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });

        res.status(error.response?.status || 500).json({
            error: 'Error processing nature-inspired architectural visualization request',
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
