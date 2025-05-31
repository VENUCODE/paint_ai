# Image Edit API

This API provides an endpoint to edit images using OpenAI's image editing API, specifically optimized for house exterior painting visualization.

## Features
- Automatic PNG conversion with alpha channel support
- Cross-origin resource sharing (CORS) enabled
- Intelligent AI home painter prompt system
- Error handling and validation

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the root directory and add your OpenAI API key:

```
OPENAI_API_KEY=your_openai_api_key_here
```

3. Start the server:

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

## API Usage

### Edit Image Endpoint

**POST** `/api/edit-image`

**Request Body:**

```json
{
  "image_url": "https://your-s3-bucket.amazonaws.com/house-image.png",
  "preferences": "Paint this house in a modern style using earth tones for the main exterior and white for the trim"
}
```

#### Parameters:

- `image_url` (required): URL of the house image to edit (any common image format supported)
- `preferences` (required): Instructions for how you want the house painted

**Example Preferences:**

- "Paint this house in a modern style using earth tones for the main exterior and white for the trim"
- "Repaint the exterior in bright red with black accents for a bold look"
- "Transform this house using Mediterranean colors with a terracotta roof and cream walls"
- "Apply a coastal color scheme with light blue siding and crisp white trim"
- "Update the exterior with sage green siding and cream colored trim for a natural look"

**Response:**

```json
{
    "created": 1748668361,
    "background": "opaque",
    "data": [
        {
            "b64_json":"base64 code",
        }
    ]
     "output_format": "png",
    "quality": "high",
    "size": "1024x1024",
    "usage": {
        "input_tokens": 394,
        "input_tokens_details": {
            "image_tokens": 323,
            "text_tokens": 71
        },
        "output_tokens": 4160,
        "total_tokens": 4554
    }
}
```

**Error Response:**

```json
{
  "error": "Error processing image edit request",
  "details": "Detailed error information"
}
```

## Technical Details

### Image Processing
- Images are automatically converted to PNG format
- Alpha channel is added if missing
- Handled by the Sharp library for optimal quality

### CORS Configuration
The API allows:
- All origins (`*`)
- GET and POST methods
- Content-Type and Authorization headers

### Dependencies
- express: Web server framework
- axios: HTTP client
- form-data: Multipart form handling
- sharp: Image processing
- dotenv: Environment variable management
- cors: Cross-origin resource sharing

## Notes

- The image URL must be publicly accessible
- Any common image format is accepted (will be converted to PNG)
- The API uses OpenAI's image editing endpoint
- Make sure your OpenAI API key has access to the image editing feature
- The AI acts as an intelligent home painter that understands architectural integrity

## Development
- The project includes a `.gitignore` file for Node.js development
- Environment variables are protected from version control
- Logs and temporary files are excluded from Git
