# Image Edit API

This API provides endpoints for AI-powered home design, including exterior painting and interior design visualization using OpenAI's image editing API.

## Features
- Exterior house painting visualization
- Interior room design visualization
- Automatic PNG conversion with alpha channel support
- Cross-origin resource sharing (CORS) enabled
- Intelligent AI design prompt system
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

### 1. Exterior Painting Endpoint

**POST** `/api/edit-image`

**Request Body:**

```json
{
  "image_url": "https://your-s3-bucket.amazonaws.com/house-exterior.png",
  "preferences": "Paint this house in a modern style using earth tones for the main exterior and white for the trim"
}
```

**Example Exterior Preferences:**

- "Paint this house in a modern style using earth tones for the main exterior and white for the trim"
- "Repaint the exterior in bright red with black accents for a bold look"
- "Transform this house using Mediterranean colors with a terracotta roof and cream walls"

### 2. Interior Design Endpoint

**POST** `/api/interior-design`

**Request Body:**

```json
{
    "image_url": "https://your-s3-bucket.amazonaws.com/room-interior.png",
    "preferences": "Transform this space into a modern minimalist living room with neutral tones and natural textures"
}
```

**Example Interior Preferences:**

- "Transform this space into a modern minimalist living room with neutral tones and natural textures"
- "Redesign this room in a cozy bohemian style with warm colors and layered textiles"
- "Convert this space to a contemporary office with clean lines and professional atmosphere"
- "Create a luxurious master bedroom with rich textures and a calming color palette"

### Response Format (for both endpoints)

**Success Response:**

```json
{
    "created": 1748668361,
    "background": "opaque",
    "data": [
        {
            "b64_json": "base64 code"
        }
    ],
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
    "error": "Error processing design request",
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
- The AI system includes specialized prompts for both exterior and interior design
- Both endpoints maintain architectural integrity and spatial relationships

## Development
- The project includes a `.gitignore` file for Node.js development
- Environment variables are protected from version control
- Logs and temporary files are excluded from Git
