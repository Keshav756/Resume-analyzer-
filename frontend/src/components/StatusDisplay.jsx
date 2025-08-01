import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  FileText, 
  Brain, 
  RefreshCw,
  Upload,
  X
} from 'lucide-react'
import { resumeAPI } from '@/services/api'
import { config } from '@/config'

const STATUS_DISPLAY = {
  uploading: {
    icon: Upload,
    color: 'text-blue-600',
    bg: 'bg-blue-50 border-blue-200',
    message: 'Uploading your resume...',
    animate: true,
    progress: 20
  },
  uploaded: { 
    icon: CheckCircle, 
    color: 'text-green-600', 
    bg: 'bg-green-50 border-green-200', 
    message: 'File uploaded successfully',
    progress: 30
  },
  extracting: { 
    icon: Loader2, 
    color: 'text-blue-600', 
    bg: 'bg-blue-50 border-blue-200', 
    message: 'Extracting text from PDF...', 
    animate: true,
    progress: 45
  },
  extracted: { 
    icon: FileText, 
    color: 'text-green-600', 
    bg: 'bg-green-50 border-green-200', 
    message: 'Text extraction completed',
    progress: 55
  },
  analyzing: { 
    icon: Brain, 
    color: 'text-purple-600', 
    bg: 'bg-purple-50 border-purple-200', 
    message: 'AI analysis in progress...', 
    animate: false,
    progress: 70
  },
  streaming: {
    icon: Loader2,
    color: 'text-purple-600',
    bg: 'bg-purple-50 border-purple-200',
    message: 'Receiving AI feedback...',
    animate: true,
    progress: 85
  },
  retrying: { 
    icon: RefreshCw, 
    color: 'text-orange-600', 
    bg: 'bg-orange-50 border-orange-200', 
    message: 'Retrying analysis...', 
    animate: true,
    progress: 70
  },
  completed: { 
    icon: CheckCircle, 
    color: 'text-green-600', 
    bg: 'bg-green-50 border-green-200', 
    message: 'Analysis completed successfully!',
    progress: 100
  },
  error: { 
    icon: AlertCircle, 
    color: 'text-red-600', 
    bg: 'bg-red-50 border-red-200', 
    message: 'An error occurred',
    progress: 0
  }
}

function StatusDisplay({ 
  sessionId, 
  status, 
  error, 
  onStatusUpdate, 
  onFeedbackReceived, 
  onError, 
  onReset 
}) {
  const [streamingText, setStreamingText] = useState('')
  const [extractedInfo, setExtractedInfo] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const [visible, setVisible] = useState(true)
  const eventSourceRef = useRef(null)
  const hideTimeoutRef = useRef(null)

  useEffect(() => {
    // Clear any existing timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
    }

    // If we get feedback, hide the status display after 1 second
    if (status === 'completed') {
      hideTimeoutRef.current = setTimeout(() => {
        setVisible(false)
      }, 1000)
    } else {
      setVisible(true)
    }

    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
      }
    }
  }, [status])

  useEffect(() => {
    if (!sessionId) return

    // Establish SSE connection
    const eventSource = resumeAPI.createEventSource(sessionId)
    eventSourceRef.current = eventSource

    eventSource.onopen = () => {
      console.log('SSE connection established')
    }

    eventSource.onmessage = (event) => {
      try {
        console.log('Raw SSE event received:', event)
        const data = JSON.parse(event.data)
        console.log('Parsed SSE data:', data)
        handleServerEvent({ type: event.type || 'message', ...data })
      } catch (err) {
        console.error('Error parsing SSE event:', err, 'Raw event:', event)
      }
    }

    // Handle custom event types
    eventSource.addEventListener('extraction.started', (event) => {
      try {
        const data = JSON.parse(event.data)
        handleServerEvent({ type: 'extraction.started', ...data })
      } catch (err) {
        console.error('Error parsing extraction.started event:', err)
      }
    })

    eventSource.addEventListener('extraction.completed', (event) => {
      try {
        const data = JSON.parse(event.data)
        handleServerEvent({ type: 'extraction.completed', ...data })
      } catch (err) {
        console.error('Error parsing extraction.completed event:', err)
      }
    })

    eventSource.addEventListener('analysis.started', (event) => {
      try {
        const data = JSON.parse(event.data)
        handleServerEvent({ type: 'analysis.started', ...data })
      } catch (err) {
        console.error('Error parsing analysis.started event:', err)
      }
    })

    eventSource.addEventListener('analysis.streaming', (event) => {
      try {
        const data = JSON.parse(event.data)
        handleServerEvent({ type: 'analysis.streaming', ...data })
      } catch (err) {
        console.error('Error parsing analysis.streaming event:', err)
      }
    })

    eventSource.addEventListener('analysis.completed', (event) => {
      try {
        const data = JSON.parse(event.data)
        handleServerEvent({ type: 'analysis.completed', ...data })
      } catch (err) {
        console.error('Error parsing analysis.completed event:', err)
      }
    })

    eventSource.addEventListener('error.occurred', (event) => {
      try {
        const data = JSON.parse(event.data)
        handleServerEvent({ type: 'error.occurred', ...data })
      } catch (err) {
        console.error('Error parsing error.occurred event:', err)
      }
    })

    eventSource.addEventListener('retry.started', (event) => {
      try {
        const data = JSON.parse(event.data)
        handleServerEvent({ type: 'retry.started', ...data })
      } catch (err) {
        console.error('Error parsing retry.started event:', err)
      }
    })

    eventSource.addEventListener('connected', (event) => {
      try {
        const data = JSON.parse(event.data)
        handleServerEvent({ type: 'connected', ...data })
      } catch (err) {
        console.error('Error parsing connected event:', err)
      }
    })

    eventSource.addEventListener('session.status', (event) => {
      try {
        const data = JSON.parse(event.data)
        handleServerEvent({ type: 'session.status', ...data })
      } catch (err) {
        console.error('Error parsing session.status event:', err)
      }
    })

    eventSource.onerror = async (err) => {
      console.error('SSE connection error:', err)
      // Check if this is a 404 (session not found)
      if (err.target && err.target.readyState === EventSource.CLOSED) {
        console.log('SSE connection closed, possibly due to session not found')
        // Try to get session status via regular API call as fallback
        try {
          const result = await resumeAPI.getSessionStatus(sessionId)
          if (result.success) {
            onStatusUpdate(result.status)
            // If completed, try to get the final results
            if (result.status === 'completed') {
              onStatusUpdate('completed')
            }
          }
        } catch (error) {
          onError(error.message)
        }
      }
    }

    // Cleanup on component unmount
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
      }
    }
  }, [sessionId])

  const handleServerEvent = (data) => {
    console.log('Received SSE event:', data)
    
    switch (data.type) {
      case 'connected':
        console.log('SSE connected successfully')
        break
        
      case 'session.status':
        // Handle initial session status
        if (data.sessionData?.status) {
          onStatusUpdate(data.sessionData.status)
          if (data.sessionData.extractionInfo) {
            setExtractedInfo(data.sessionData.extractionInfo)
          }
          if (data.sessionData.streamingContent) {
            setStreamingText(data.sessionData.streamingContent)
          }
        }
        break

      case 'upload.started':
        onStatusUpdate('uploading')
        break

      case 'upload.completed':
        onStatusUpdate('uploaded')
        break
        
      case 'extraction.started':
        onStatusUpdate('extracting')
        setStreamingText('') // Clear any previous streaming text
        break
        
      case 'extraction.completed':
        onStatusUpdate('extracted')
        setExtractedInfo({
          textLength: data.extractionInfo?.textLength,
          pageCount: data.extractionInfo?.pageCount,
          hasText: data.extractionInfo?.hasText
        })
        break
        
      case 'analysis.started':
        onStatusUpdate('analyzing')
        setStreamingText('')
        break
        
      case 'analysis.streaming':
        onStatusUpdate('streaming')
        if (data.content) {
          setStreamingText(prev => prev + data.content)
        }
        break
        
      case 'analysis.completed':
        onStatusUpdate('completed')
        if (data.feedback) {
          onFeedbackReceived(data.feedback)
        }
        break
        
      case 'retry.started':
        onStatusUpdate('retrying')
        setRetryCount(data.retryInfo?.attempt || 0)
        setStreamingText('') // Clear streaming text for retry
        break
        
      case 'error.occurred':
        onStatusUpdate('error')
        onError(data.error?.message || data.message || 'An error occurred')
        break
        
      default:
        console.log('Unknown event type:', data.type, data)
    }
  }

  const handleRetry = async () => {
    try {
      await resumeAPI.retryAnalysis(sessionId)
      // Reset states for retry
      setStreamingText('')
      setRetryCount(0)
    } catch (err) {
      onError(err.message)
    }
  }

  const displayConfig = STATUS_DISPLAY[status] || STATUS_DISPLAY.error
  const Icon = displayConfig.icon

  if (!visible) {
    return null
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Processing Status</CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onReset}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {/* Progress Bar */}
        <div className="mb-6">
          <Progress value={displayConfig.progress} />
          <div className="mt-2 flex justify-between text-xs text-gray-500">
            <span>Upload</span>
            <span>Extract</span>
            <span>Analyze</span>
            <span>Complete</span>
          </div>
        </div>

        {/* Current Status */}
        <Card className={`mb-4 ${displayConfig.bg}`}>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Icon 
                className={`w-5 h-5 mr-3 ${displayConfig.color} ${
                  displayConfig.animate ? 'animate-spin' : ''
                }`} 
              />
              <div className="flex-1">
                <span className="font-medium text-gray-900">
                  {displayConfig.message}
                </span>
                {retryCount > 0 && (
                  <span className="ml-2 text-sm text-gray-600">
                    (Attempt {retryCount + 1})
                  </span>
                )}
              </div>
              {['uploading', 'extracting', 'analyzing', 'streaming', 'retrying'].includes(status) && (
                <div className="ml-2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Extracted Information */}
        {extractedInfo && (
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <FileText className="w-4 h-4 mr-2 text-blue-600" />
                Extraction Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-gray-500">Pages</div>
                    <div className="text-lg font-semibold">{extractedInfo.pageCount}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-gray-500">Characters</div>
                    <div className="text-lg font-semibold">{extractedInfo.textLength?.toLocaleString()}</div>
                  </CardContent>
                </Card>
              </div>
              {!extractedInfo.hasText && (
                <div className="mt-3 text-sm text-orange-600 flex items-center bg-orange-50 p-2 rounded-md">
                  <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                  <span>Warning: Limited text found in PDF</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Streaming Analysis Text */}
        {(status === 'analyzing' || status === 'streaming') && streamingText && (
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Brain className="w-4 h-4 mr-2 text-purple-600" />
                AI Analysis
                {status === 'streaming' && (
                  <div className="ml-2 flex items-center gap-1">
                    <div className="w-1 h-1 bg-purple-600 rounded-full animate-ping"></div>
                    <div className="w-1 h-1 bg-purple-600 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1 h-1 bg-purple-600 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-gray-700 whitespace-pre-wrap max-h-48 overflow-y-auto">
                    {streamingText}
                    {status === 'streaming' && (
                      <span className="inline-block w-1 h-4 bg-purple-600 animate-pulse ml-1" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        )}

        {/* Error Display */}
        {error && status === 'error' && (
          <Card className="mb-4 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">Error</p>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
              
              <div className="mt-4 flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRetry}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onReset}
                >
                  Start Over
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Processing Progress */}
        {['uploading', 'extracting', 'analyzing', 'streaming', 'retrying'].includes(status) && (
          <div className="flex items-center justify-center py-4">
            <div className="text-sm text-gray-500">
              Please wait while we process your resume...
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default StatusDisplay 