import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle,
  FileText,
  Target,
  TrendingUp,
  Upload,
} from 'lucide-react';
import { scoreResume, type ATSAnalysis } from '../lib/api';

const ATSScoring: React.FC = () => {
  const [resume, setResume] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analysisResult, setAnalysisResult] = useState<ATSAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const sectionEntries = useMemo(
    () => Object.entries(analysisResult?.sections || {}).filter(([, value]) => value.wordCount > 0),
    [analysisResult],
  );

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setResume(file);
    setAnalysisResult(null);
    setErrorMessage('');
  };

  const analyzeResume = async () => {
    if (!resume || !jobDescription.trim()) {
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage('');

    try {
      const result = await scoreResume(resume, jobDescription.trim());
      setAnalysisResult(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not analyze resume.';
      setErrorMessage(message);
      setAnalysisResult(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'rgba(255, 122, 0, 0.22)';
    if (score >= 60) return 'rgba(255, 122, 0, 0.16)';
    return 'rgba(255, 122, 0, 0.12)';
  };

  const formatSectionTitle = (value: string) =>
    value
      .split(/[_-]/g)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
          ATS Resume Score Checker
        </h1>
        <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>
          Upload a PDF resume, compare it with a job description, and get keyword, semantic,
          experience, and skill-gap analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[420px_minmax(0,1fr)] gap-6">
        <div className="space-y-6">
          <div className="tucf-card">
            <h2 className="text-xl font-semibold mb-4 flex items-center" style={{ color: 'var(--text-primary)' }}>
              <FileText className="h-5 w-5 mr-2" style={{ color: 'var(--accent)' }} />
              Resume Upload
            </h2>

            <div
              className="border-2 border-dashed rounded-lg p-8 text-center transition-colors"
              style={{ borderColor: 'var(--border)', background: '#0f0f0f' }}
            >
              {resume ? (
                <div className="space-y-2">
                  <CheckCircle className="h-12 w-12 mx-auto" style={{ color: 'var(--accent)' }} />
                  <p className="font-medium break-all" style={{ color: 'var(--accent)' }}>
                    {resume.name}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    PDF ready for analysis
                  </p>
                  <button onClick={() => setResume(null)} className="text-sm" style={{ color: 'var(--accent)' }}>
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-12 w-12 mx-auto" style={{ color: 'var(--text-secondary)' }} />
                  <p style={{ color: 'var(--text-secondary)' }}>Drop your resume PDF here or browse</p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Only PDF is supported</p>
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleResumeUpload}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="inline-block px-4 py-2 text-white rounded-lg cursor-pointer transition-colors tucf-btn-primary"
                  >
                    Choose PDF
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="tucf-card">
            <h2 className="text-xl font-semibold mb-4 flex items-center" style={{ color: 'var(--text-primary)' }}>
              <Target className="h-5 w-5 mr-2" style={{ color: 'var(--accent)' }} />
              Job Description
            </h2>

            <textarea
              placeholder="Paste the target job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full h-56 px-4 py-3 resize-none"
            />

            {errorMessage && (
              <p className="mt-3 text-sm" style={{ color: 'var(--accent)' }}>
                {errorMessage}
              </p>
            )}

            <div className="mt-4">
              <button
                onClick={analyzeResume}
                disabled={!resume || !jobDescription.trim() || isAnalyzing}
                className="w-full py-3 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center space-x-2 tucf-btn-primary"
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

        <div className="space-y-6">
          {analysisResult ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="tucf-card text-center">
                  <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                    ATS Score
                  </h2>
                  <div
                    className="inline-flex items-center justify-center w-24 h-24 rounded-full text-3xl font-bold"
                    style={{ background: getScoreColor(analysisResult.score), color: 'var(--accent)' }}
                  >
                    {analysisResult.score}%
                  </div>
                  <p className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {analysisResult.totals.matchedKeywords} / {analysisResult.totals.requiredKeywords} keywords matched
                  </p>
                </div>

                <div className="tucf-card">
                  <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Semantic Match
                  </h3>
                  <p className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>
                    {analysisResult.semanticSimilarity.score}%
                  </p>
                  <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                    Provider: {analysisResult.semanticSimilarity.provider}
                  </p>
                  {analysisResult.semanticSimilarity.warning && (
                    <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
                      {analysisResult.semanticSimilarity.warning}
                    </p>
                  )}
                </div>

                <div className="tucf-card">
                  <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Experience Fit
                  </h3>
                  <p className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>
                    {analysisResult.experienceAnalysis.score}%
                  </p>
                  <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                    Required: {analysisResult.experienceAnalysis.requirement.requiredYears ?? 'Not stated'} years
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Resume: {analysisResult.experienceAnalysis.resumeExperience.estimatedYears} years estimated
                  </p>
                </div>

                <div className="tucf-card">
                  <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Resume Health
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Word count: {analysisResult.totals.resumeWordCount}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Missing sections: {analysisResult.totals.missingSections}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Stuffing penalty: {analysisResult.keywordStuffing.penalty}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="tucf-card">
                  <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                    Matched Keywords
                  </h3>
                  {analysisResult.matchedKeywords.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.matchedKeywords.map((keyword) => (
                        <span
                          key={keyword}
                          className="px-2 py-1 text-sm rounded"
                          style={{ background: 'rgba(255,122,0,0.12)', color: 'var(--accent)' }}
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      No strong keyword matches found.
                    </p>
                  )}

                  {analysisResult.synonymsMatched.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        Synonym Matches
                      </h4>
                      {analysisResult.synonymsMatched.map((item) => (
                        <p key={`${item.keyword}-${item.matchedVia}`} className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {item.keyword} matched via {item.matchedVia}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                <div className="tucf-card">
                  <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                    Missing Keywords
                  </h3>
                  {analysisResult.missingKeywords.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.missingKeywords.map((keyword) => (
                        <span
                          key={keyword}
                          className="px-2 py-1 text-sm rounded"
                          style={{ background: '#1a1a1a', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      No obvious missing keywords. Good alignment.
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="tucf-card">
                  <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                    Score Breakdown
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(analysisResult.scoringBreakdown).map(([key, value]) => (
                      <div key={key}>
                        <div className="flex items-center justify-between mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                          <span>{formatSectionTitle(key)}</span>
                          <span>{value}%</span>
                        </div>
                        <div className="h-2 rounded-full" style={{ background: '#181818' }}>
                          <div
                            className="h-2 rounded-full"
                            style={{ width: `${Math.min(Math.max(value, 0), 100)}%`, background: 'var(--accent)' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="tucf-card">
                  <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                    Skill Gap Analysis
                  </h3>
                  {analysisResult.skillGapAnalysis.length > 0 ? (
                    <div className="space-y-4">
                      {analysisResult.skillGapAnalysis.map((group) => (
                        <div key={group.category}>
                          <h4 className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                            {formatSectionTitle(group.category)}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {group.missing.map((skill) => (
                              <span
                                key={`${group.category}-${skill}`}
                                className="px-2 py-1 text-sm rounded"
                                style={{ background: '#1a1a1a', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      No major category-level skill gaps detected.
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="tucf-card">
                  <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                    Suggestions
                  </h3>
                  <ul className="space-y-2">
                    {analysisResult.suggestions.map((suggestion) => (
                      <li key={suggestion} className="flex items-start text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" style={{ color: 'var(--accent)' }} />
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="tucf-card">
                  <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                    Keyword Stuffing Check
                  </h3>
                  {analysisResult.keywordStuffing.flagged ? (
                    <div className="space-y-2">
                      {analysisResult.keywordStuffing.repeatedKeywords.map((item) => (
                        <p key={item.keyword} className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {item.keyword}: {item.occurrences} mentions ({item.density}% density)
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      No keyword stuffing patterns detected.
                    </p>
                  )}
                </div>
              </div>

              <div className="tucf-card">
                <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                  Parsed Resume Sections
                </h3>
                {sectionEntries.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sectionEntries.map(([section, value]) => (
                      <div key={section} className="rounded-lg border p-4" style={{ borderColor: 'var(--border)', background: '#111111' }}>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                            {formatSectionTitle(section)}
                          </h4>
                          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                            {value.wordCount} words
                          </span>
                        </div>
                        <div className="space-y-1">
                          {value.preview.map((line, index) => (
                            <p key={`${section}-${index}`} className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    No structured resume sections were detected.
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="tucf-card text-center">
              <Target className="h-16 w-16 mx-auto mb-4" style={{ color: 'var(--text-secondary)' }} />
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                Ready to Score
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Upload your resume and paste a job description to run the full ATS analysis pipeline.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ATSScoring;
