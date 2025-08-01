import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { 
  CheckCircle, 
  AlertCircle, 
  Star, 
  Users, 
  BookOpen, 
  Lightbulb,
  RefreshCw,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

function FeedbackDisplay({ feedback, onReset }) {
  const [expandedSections, setExpandedSections] = useState({
    clarity: true,
    grammar: true,
    skills: true,
    improvements: true
  })

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600 bg-green-100'
    if (score >= 6) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getScoreText = (score) => {
    if (score >= 8) return 'Excellent'
    if (score >= 6) return 'Good'
    if (score >= 4) return 'Fair'
    return 'Needs Improvement'
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high': return 'High Priority'
      case 'medium': return 'Medium Priority'
      case 'low': return 'Low Priority'
      default: return 'Priority'
    }
  }

  if (!feedback) {
    return null
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between pb-4">
        <div>
          <CardTitle>Resume Analysis Results</CardTitle>
          <CardDescription>AI-powered feedback on your resume</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={onReset}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Analyze New Resume
        </Button>
      </CardHeader>
      <CardContent>
        {/* Clarity Section */}
        {feedback.clarity && (
          <Card className="mb-6">
            <CardHeader className="cursor-pointer" onClick={() => toggleSection('clarity')}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BookOpen className="w-5 h-5 text-blue-600 mr-3" />
                  <CardTitle className="text-lg">Clarity & Structure</CardTitle>
                  <div className={`ml-4 px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(feedback.clarity.score)}`}>
                    {feedback.clarity.score}/10 - {getScoreText(feedback.clarity.score)}
                  </div>
                </div>
                {expandedSections.clarity ? (
                  <ChevronUp className="w-5 h-5 text-blue-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-blue-600" />
                )}
              </div>
            </CardHeader>
            {expandedSections.clarity && (
              <CardContent>
                {/* Strengths */}
                {feedback.clarity.strengths && feedback.clarity.strengths.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      Strengths
                    </h4>
                    <ul className="space-y-1">
                      {feedback.clarity.strengths.map((strength, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start">
                          <span className="w-2 h-2 bg-green-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Weaknesses */}
                {feedback.clarity.weaknesses && feedback.clarity.weaknesses.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <AlertCircle className="w-4 h-4 text-yellow-600 mr-2" />
                      Areas for Improvement
                    </h4>
                    <ul className="space-y-1">
                      {feedback.clarity.weaknesses.map((weakness, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start">
                          <span className="w-2 h-2 bg-yellow-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                          {weakness}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Suggestions */}
                {feedback.clarity.suggestions && feedback.clarity.suggestions.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <Lightbulb className="w-4 h-4 text-blue-600 mr-2" />
                      Suggestions
                    </h4>
                    <ul className="space-y-1">
                      {feedback.clarity.suggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start">
                          <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        )}

        {/* Grammar Section */}
        {feedback.grammar && (
          <Card className="mb-6">
            <CardHeader className="cursor-pointer" onClick={() => toggleSection('grammar')}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-green-600 mr-3" />
                  <CardTitle className="text-lg text-green-900">Grammar & Writing</CardTitle>
                  <div className={`ml-4 px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(feedback.grammar.score)}`}>
                    {feedback.grammar.score}/10 - {getScoreText(feedback.grammar.score)}
                  </div>
                </div>
                {expandedSections.grammar ? (
                  <ChevronUp className="w-5 h-5 text-green-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-green-600" />
                )}
              </div>
            </CardHeader>
            {expandedSections.grammar && (
              <CardContent>
                {/* Corrections */}
                {feedback.grammar.corrections && feedback.grammar.corrections.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <AlertCircle className="w-4 h-4 text-orange-600 mr-2" />
                      Corrections
                    </h4>
                    <ul className="space-y-1">
                      {feedback.grammar.corrections.map((correction, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start">
                          <span className="w-2 h-2 bg-orange-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                          {correction}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvements */}
                {feedback.grammar.improvements && feedback.grammar.improvements.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <Lightbulb className="w-4 h-4 text-green-600 mr-2" />
                      Improvements
                    </h4>
                    <ul className="space-y-1">
                      {feedback.grammar.improvements.map((improvement, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start">
                          <span className="w-2 h-2 bg-green-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        )}

        {/* Skills Section */}
        {feedback.skills && (
          <Card className="mb-6">
            <CardHeader className="cursor-pointer" onClick={() => toggleSection('skills')}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-purple-600 mr-3" />
                  <CardTitle className="text-lg text-purple-900">Skills Assessment</CardTitle>
                </div>
                {expandedSections.skills ? (
                  <ChevronUp className="w-5 h-5 text-purple-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-purple-600" />
                )}
              </div>
            </CardHeader>
            {expandedSections.skills && (
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Relevant Skills */}
                  {feedback.skills.relevantSkills && feedback.skills.relevantSkills.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        Relevant Skills Found
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {feedback.skills.relevantSkills.map((skill, index) => (
                          <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Missing Skills */}
                  {feedback.skills.missingSkills && feedback.skills.missingSkills.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                        <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                        Skills to Consider Adding
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {feedback.skills.missingSkills.map((skill, index) => (
                          <span key={index} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Recommendations */}
                {feedback.skills.recommendations && feedback.skills.recommendations.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <Lightbulb className="w-4 h-4 text-purple-600 mr-2" />
                      Recommendations
                    </h4>
                    <ul className="space-y-1">
                      {feedback.skills.recommendations.map((recommendation, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start">
                          <span className="w-2 h-2 bg-purple-600 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                          {recommendation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        )}

        {/* Improvements Section */}
        {feedback.improvements && feedback.improvements.length > 0 && (
          <Card className="mb-6">
            <CardHeader className="cursor-pointer" onClick={() => toggleSection('improvements')}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Lightbulb className="w-5 h-5 text-orange-600 mr-3" />
                  <CardTitle className="text-lg text-orange-900">Actionable Improvements</CardTitle>
                  <span className="ml-4 px-3 py-1 bg-orange-200 text-orange-800 rounded-full text-sm font-medium">
                    {feedback.improvements.length} suggestions
                  </span>
                </div>
                {expandedSections.improvements ? (
                  <ChevronUp className="w-5 h-5 text-orange-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-orange-600" />
                )}
              </div>
            </CardHeader>
            {expandedSections.improvements && (
              <CardContent>
                <div className="space-y-4">
                  {feedback.improvements.map((improvement, index) => (
                    <div key={index} className="p-4 bg-white border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          <span className="font-medium text-gray-900 capitalize">
                            {improvement.category}
                          </span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(improvement.priority)}`}>
                          {getPriorityText(improvement.priority)}
                        </span>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm text-gray-700 mb-2">
                          <strong>Suggestion:</strong> {improvement.suggestion}
                        </p>
                        {improvement.example && (
                          <div className="bg-gray-50 p-3 rounded border-l-4 border-blue-400">
                            <p className="text-sm text-gray-600">
                              <strong>Example:</strong> {improvement.example}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        )}

        {/* Summary */}
        <Card className="mt-6">
          <CardContent className="p-6">
            <h3 className="font-medium text-gray-900 mb-2">Summary</h3>
            <p className="text-sm text-gray-600">
              Your resume has been analyzed across multiple dimensions. Focus on the high-priority improvements first, 
              then work through medium and low-priority suggestions to enhance your resume's effectiveness.
            </p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}

export default FeedbackDisplay 