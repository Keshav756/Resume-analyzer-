import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, FileText, AlertCircle } from 'lucide-react'
import { resumeAPI } from '@/services/api'
import { config } from '@/config'

function FileUpload({ onUploadSuccess, onUploadError }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Validate file type
      if (!config.upload.acceptedTypes.includes(file.type)) {
        setError('Please select a PDF file')
        return
      }
      
      // Validate file size
      if (file.size > config.upload.maxSize) {
        setError('File size must be less than 10MB')
        return
      }

      setSelectedFile(file)
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    setError(null)

    try {
      const result = await resumeAPI.uploadAndProcess(selectedFile)
      if (result.success) {
        onUploadSuccess(result.sessionId)
      } else {
        throw new Error(result.error || 'Upload failed')
      }
    } catch (err) {
      setError(err.message)
      onUploadError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="text-center">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Upload className="w-6 h-6 text-blue-600" />
        </div>
        
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Upload Your Resume
        </h2>
        
        <p className="text-gray-600 mb-6">
          Select a PDF file to get started with AI-powered analysis
        </p>

        {/* File Input */}
        <div className="mb-4">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="hidden"
            id="resume-upload"
            disabled={uploading}
          />
          <label
            htmlFor="resume-upload"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileText className="w-4 h-4 mr-2" />
            Choose PDF File
          </label>
        </div>

        {/* Selected File Info */}
        {selectedFile && (
          <div className="bg-gray-50 rounded-md p-3 mb-4">
            <div className="flex items-center justify-center text-sm text-gray-600">
              <FileText className="w-4 h-4 mr-2" />
              <span className="font-medium">{selectedFile.name}</span>
              <span className="ml-2">({formatFileSize(selectedFile.size)})</span>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
            <div className="flex items-center text-sm text-red-600">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </div>
          </div>
        )}

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className="w-full sm:w-auto"
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload & Analyze
            </>
          )}
        </Button>

        {/* File Requirements */}
        <div className="mt-6 text-xs text-gray-500">
          <p>• PDF files only</p>
          <p>• Maximum file size: 10MB</p>
          <p>• Text-based PDFs work best</p>
        </div>
      </div>
    </div>
  )
}

export default FileUpload