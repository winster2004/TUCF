import React, { useState } from 'react';
import { Upload, FileText, Target, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

const ATSScoring: React.FC = () => {
  const [resume, setResume] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setResume(file);
    }
  };

  const analyzeResume = async () => {
    if (!resume || !jobDescription) return;
    
    setIsAnalyzing(true);
    
    // Simulate API call
    setTimeout(() => {
      setAnalysisResult({
        score: 78,
        matchedKeywords: ['React', 'JavaScript', 'Node.js', 'MongoDB', 'Git'],
        missingKeywords: ['TypeScript', 'AWS', 'Docker', 'Kubernetes'],
        strengths: [
          'Strong technical skills section',
          'Relevant project experience',
          'Good use of action words',
          'Quantified achievements'
        ],
        improvements: [
          'Add TypeScript experience to skills',
          'Include cloud technologies (AWS, Docker)',
          'Mention specific frameworks used',
          'Add more quantified results'
        ],
        sections: {
          contact: { score: 95, status: 'excellent' },
          skills: { score: 80, status: 'good' },
          experience: { score: 75, status: 'good' },
          education: { score: 90, status: 'excellent' },
          projects: { score: 70, status: 'average' }
        }
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'excellent') return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (status === 'good') return <CheckCircle className="h-4 w-4 text-yellow-600" />;
    return <AlertCircle className="h-4 w-4 text-red-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">ATS Resume Scoring</h1>
        <p className="text-gray-600 mt-1">Optimize your resume for Applicant Tracking Systems</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="space-y-6">
          {/* Resume Upload */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-600" />
              Upload Resume
            </h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
              {resume ? (
                <div className="space-y-2">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                  <p className="text-green-600 font-medium">{resume.name}</p>
                  <p className="text-sm text-gray-500">Ready for analysis</p>
                  <button
                    onClick={() => setResume(null)}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    Change file
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                  <p className="text-gray-600">Drop your resume here or click to browse</p>
                  <p className="text-sm text-gray-500">Supports PDF, DOC, DOCX files</p>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
                  >
                    Choose File
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Job Description */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2 text-purple-600" />
              Job Description
            </h2>
            
            <textarea
              placeholder="Paste the job description here to analyze keyword match..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            
            <div className="mt-4">
              <button
                onClick={analyzeResume}
                disabled={!resume || !jobDescription || isAnalyzing}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center space-x-2"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="h-4 w-4" />
                    <span>Analyze Resume</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {analysisResult ? (
            <>
              {/* Overall Score */}
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">ATS Score</h2>
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-3xl font-bold ${getScoreColor(analysisResult.score)}`}>
                    {analysisResult.score}%
                  </div>
                  <p className="text-gray-600 mt-2">
                    {analysisResult.score >= 80 ? 'Excellent Match!' : 
                     analysisResult.score >= 60 ? 'Good Match' : 'Needs Improvement'}
                  </p>
                </div>
              </div>

              {/* Section Scores */}
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Section Analysis</h3>
                <div className="space-y-3">
                  {Object.entries(analysisResult.sections).map(([section, data]: [string, any]) => (
                    <div key={section} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(data.status)}
                        <span className="font-medium capitalize">{section}</span>
                      </div>
                      <span className={`px-2 py-1 rounded text-sm font-medium ${getScoreColor(data.score)}`}>
                        {data.score}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Keywords Analysis */}
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Keywords Analysis</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-green-700 mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Matched Keywords ({analysisResult.matchedKeywords.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.matchedKeywords.map((keyword: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-red-700 mb-2 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Missing Keywords ({analysisResult.missingKeywords.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.missingKeywords.map((keyword: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-red-100 text-red-700 text-sm rounded">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-green-700 mb-2">Strengths</h4>
                    <ul className="space-y-1">
                      {analysisResult.strengths.map((strength: string, index: number) => (
                        <li key={index} className="flex items-center text-sm text-gray-700">
                          <CheckCircle className="h-3 w-3 text-green-600 mr-2 flex-shrink-0" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-orange-700 mb-2">Areas for Improvement</h4>
                    <ul className="space-y-1">
                      {analysisResult.improvements.map((improvement: string, index: number) => (
                        <li key={index} className="flex items-center text-sm text-gray-700">
                          <AlertCircle className="h-3 w-3 text-orange-600 mr-2 flex-shrink-0" />
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-12 border border-gray-200 text-center">
              <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Analyze</h3>
              <p className="text-gray-600">Upload your resume and paste a job description to get started with ATS scoring.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ATSScoring;