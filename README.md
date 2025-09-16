# Resume Analyzer

An AI-powered resume analysis tool that provides detailed feedback on your resume. Built with Node.js, Express, React, and Google's Gemini AI.
https://resume-analyzer-keshav.onrender.com/
## Features

- PDF resume upload and validation
- Real-time processing status updates via Server-Sent Events (SSE)
- Text extraction from PDF documents
- AI-powered resume analysis with streaming feedback
- Modern, responsive UI with real-time status updates

## Prerequisites

- Node.js 
- Google Cloud API Key (for Gemini AI)

## Setup & Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Resume-analyzer
```

2. Install dependencies for both frontend and backend:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Configure environment variables:

Create a `.env` file in the backend directory:
```env
PORT=8080
GOOGLE_API_KEY=your_gemini_api_key_here
NODE_ENV=development
```

## Running the Application

### Development Mode

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:8080`.

### Production Mode

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Start the backend server:
```bash
cd backend
npm start
```

The application will be served at `http://localhost:8080`.

## Important Configuration Notes

If you're not using the backend to serve the frontend (i.e., not using `express.static('dist')`), you need to:

1. Update the API base URL in `frontend/src/config/index.js`:
```javascript
// Change from
const API_BASE_URL = '/api'
// to
const API_BASE_URL = 'http://localhost:8080/api'
```

2. Ensure CORS is properly configured in `backend/index.js` for your frontend domain.

## API Endpoints

### Upload and Process

`POST /api/upload-and-process`
- Handles file upload, text extraction, and AI analysis
- Accepts PDF files up to 10MB
- Returns a session ID for tracking progress

### Server-Sent Events (SSE)

`GET /api/events/:sessionId`
- Provides real-time updates on processing status
- Event types:
  - `extraction.started`: PDF text extraction begun
  - `extraction.completed`: Text extraction finished
  - `analysis.started`: AI analysis started
  - `analysis.streaming`: Real-time AI feedback
  - `analysis.completed`: Analysis finished
  - `error.occurred`: Processing errors


### Status Check

`GET /api/events/:sessionId/status`
- Returns current processing status
- Useful for recovering from disconnections

## Processing Workflow

1. **Upload**: File validation and initial processing
2. **Extraction**: PDF text extraction with metadata
3. **Analysis**: AI-powered resume evaluation
4. **Streaming**: Real-time feedback delivery
5. **Completion**: Final results and cleanup

## Error Handling

- Graceful error recovery with detailed error messages
- Automatic file cleanup after processing
- Session management for tracking progress

## Security Features

- File type validation
- File size limits (10MB max)
- Automatic file cleanup
- Session-based processing
- CORS protection (when serving frontend separately)

## Contributing

## License

