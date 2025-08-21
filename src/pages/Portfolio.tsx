import React, { useState } from 'react';
import { Github, Globe, Upload, Eye, Download, Star, GitFork } from 'lucide-react';

const Portfolio: React.FC = () => {
  const [githubUrl, setGithubUrl] = useState('');
  const [certificates, setCertificates] = useState<File[]>([]);
  const [portfolioData, setPortfolioData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCertificateUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setCertificates(prev => [...prev, ...files]);
  };

  const generatePortfolio = async () => {
    if (!githubUrl) return;
    
    setIsGenerating(true);
    
    // Simulate GitHub API call and portfolio generation
    setTimeout(() => {
      setPortfolioData({
        user: {
          name: 'John Doe',
          bio: 'Full-stack developer passionate about creating amazing web experiences',
          avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=3B82F6&color=fff',
          location: 'Bangalore, India',
          followers: 150,
          following: 80,
        },
        stats: {
          repositories: 24,
          stars: 180,
          commits: 1250,
          languages: ['JavaScript', 'TypeScript', 'Python', 'Java']
        },
        repositories: [
          { name: 'react-dashboard', description: 'Modern React dashboard with TypeScript', stars: 45, forks: 12, language: 'TypeScript' },
          { name: 'nodejs-api', description: 'RESTful API built with Node.js and Express', stars: 23, forks: 8, language: 'JavaScript' },
          { name: 'python-ml-project', description: 'Machine learning project for data analysis', stars: 67, forks: 15, language: 'Python' },
        ],
        portfolioUrl: 'https://john-doe-portfolio.netlify.app'
      });
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Portfolio Generator</h1>
        <p className="text-gray-600 mt-1">Generate a professional portfolio from your GitHub profile</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          {/* GitHub URL */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Github className="h-5 w-5 mr-2 text-gray-700" />
              GitHub Profile
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GitHub Username or Profile URL
                </label>
                <input
                  type="text"
                  placeholder="https://github.com/yourusername or just 'yourusername'"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Github className="h-4 w-4" />
                <span>We'll fetch your repositories, stars, and contributions</span>
              </div>
            </div>
          </div>

          {/* Certificates Upload */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Upload className="h-5 w-5 mr-2 text-blue-600" />
              Certificates & Achievements
            </h2>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Upload certificates, awards, or achievements</p>
                <p className="text-sm text-gray-500 mt-1">JPEG, PNG, PDF files</p>
                <input
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleCertificateUpload}
                  className="hidden"
                  id="certificate-upload"
                />
                <label
                  htmlFor="certificate-upload"
                  className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
                >
                  Choose Files
                </label>
              </div>
              
              {certificates.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Uploaded Files:</h4>
                  {certificates.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <button
                        onClick={() => setCertificates(prev => prev.filter((_, i) => i !== index))}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generatePortfolio}
            disabled={!githubUrl || isGenerating}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center space-x-2"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Generating Portfolio...</span>
              </>
            ) : (
              <>
                <Globe className="h-4 w-4" />
                <span>Generate Portfolio</span>
              </>
            )}
          </button>
        </div>

        {/* Preview Section */}
        <div className="space-y-6">
          {portfolioData ? (
            <>
              {/* Portfolio Preview */}
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Portfolio Preview</h2>
                  <div className="flex space-x-2">
                    <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Profile Section */}
                <div className="text-center mb-6">
                  <img
                    src={portfolioData.user.avatar}
                    alt={portfolioData.user.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4"
                  />
                  <h3 className="text-2xl font-bold text-gray-900">{portfolioData.user.name}</h3>
                  <p className="text-gray-600 mt-1">{portfolioData.user.bio}</p>
                  <p className="text-sm text-gray-500 mt-2">{portfolioData.user.location}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{portfolioData.stats.repositories}</p>
                    <p className="text-sm text-gray-600">Repositories</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">{portfolioData.stats.stars}</p>
                    <p className="text-sm text-gray-600">Stars</p>
                  </div>
                </div>

                {/* Top Repositories */}
                <div className="space-y-3 mb-6">
                  <h4 className="font-semibold text-gray-900">Featured Projects</h4>
                  {portfolioData.repositories.slice(0, 2).map((repo: any, index: number) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <h5 className="font-medium text-gray-900">{repo.name}</h5>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                          {repo.language}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{repo.description}</p>
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Star className="h-3 w-3" />
                          <span>{repo.stars}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <GitFork className="h-3 w-3" />
                          <span>{repo.forks}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Portfolio URL */}
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-green-800">Portfolio Generated!</p>
                      <p className="text-sm text-green-700 mt-1">Your portfolio is ready to share</p>
                    </div>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                      Copy Link
                    </button>
                  </div>
                  <div className="mt-2 p-2 bg-white rounded border">
                    <code className="text-sm text-gray-800">{portfolioData.portfolioUrl}</code>
                  </div>
                </div>
              </div>

              {/* Customization Options */}
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customization</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Modern Dark</option>
                      <option>Clean Light</option>
                      <option>Colorful</option>
                      <option>Minimal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sections</label>
                    <div className="space-y-2">
                      {['About', 'Projects', 'Skills', 'Experience', 'Contact'].map((section) => (
                        <label key={section} className="flex items-center">
                          <input type="checkbox" defaultChecked className="mr-2" />
                          <span className="text-sm text-gray-700">{section}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-12 border border-gray-200 text-center">
              <Globe className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Portfolio Preview</h3>
              <p className="text-gray-600">Enter your GitHub profile to generate a professional portfolio</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;