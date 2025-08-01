import { useState } from 'react'
import FileUpload from './components/FileUpload'
import StatusDisplay from './components/StatusDisplay'
import FeedbackDisplay from './components/FeedbackDisplay'

function App() {
  const [sessionId, setSessionId] = useState(null)
  const [status, setStatus] = useState('idle')
  const [feedback, setFeedback] = useState(null)
  const [error, setError] = useState(null)

  const handleUploadSuccess = (uploadSessionId) => {
    setSessionId(uploadSessionId)
    setStatus('uploaded')
    setError(null)
  }

  const handleUploadError = (errorMessage) => {
    setError(errorMessage)
    setStatus('error')
  }

  const handleStatusUpdate = (newStatus) => {
    setStatus(newStatus)
  }

  const handleFeedbackReceived = (feedbackData) => {
    setFeedback(feedbackData)
    setStatus('completed')
  }

  const handleError = (errorMessage) => {
    setError(errorMessage)
    setStatus('error')
  }

  const handleReset = () => {
    setSessionId(null)
    setStatus('idle')
    setFeedback(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Resume Analyzer
          </h1>
          <p className="text-gray-600">
            Upload your PDF resume to get AI-powered feedback and suggestions
          </p>
        </header>

        <div className="space-y-6">
          {/* File Upload Section */}
          {!sessionId && (
            <FileUpload 
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
            />
          )}

          {/* Status Display */}
          {sessionId && status !== 'completed' && (
            <StatusDisplay
              sessionId={sessionId}
              status={status}
              error={error}
              onStatusUpdate={handleStatusUpdate}
              onFeedbackReceived={handleFeedbackReceived}
              onError={handleError}
              onReset={handleReset}
            />
          )}

          {/* Feedback Display */}
          {feedback && (
            <FeedbackDisplay 
              feedback={feedback}
              onReset={handleReset}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default App
