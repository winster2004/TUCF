import React, { useState } from 'react';
import { Search, MapPin, Filter, Bookmark, ExternalLink, Clock, Building } from 'lucide-react';

const JobSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const mockJobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'TechCorp Solutions',
      location: 'Bangalore, India',
      type: 'Full-time',
      remote: true,
      salary: '₹15-25 LPA',
      posted: '2 hours ago',
      description: 'We are looking for a skilled Frontend Developer with expertise in React, TypeScript, and modern web technologies.',
      skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
      saved: false,
    },
    {
      id: 2,
      title: 'Full Stack Engineer',
      company: 'Startup Hub',
      location: 'Remote',
      type: 'Full-time',
      remote: true,
      salary: '₹12-20 LPA',
      posted: '4 hours ago',
      description: 'Join our fast-growing startup as a Full Stack Engineer. Work with cutting-edge technologies and build scalable applications.',
      skills: ['React', 'Node.js', 'MongoDB', 'AWS'],
      saved: true,
    },
    {
      id: 3,
      title: 'React Developer',
      company: 'Digital Innovations',
      location: 'Hyderabad, India',
      type: 'Full-time',
      remote: false,
      salary: '₹10-18 LPA',
      posted: '1 day ago',
      description: 'Looking for a passionate React Developer to join our team and work on exciting projects for global clients.',
      skills: ['React', 'JavaScript', 'CSS', 'Redux'],
      saved: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Job Search</h1>
          <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>Find your dream job from top companies</p>
        </div>
      </div>

      <div className="tucf-card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: 'var(--text-secondary)' }} />
            <input
              type="text"
              placeholder="Job title, keywords, or company"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3"
            />
          </div>
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: 'var(--text-secondary)' }} />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-10 pr-4 py-3"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-6 py-3 tucf-btn-ghost flex items-center space-x-2"
          >
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </button>
          <button className="px-8 py-3 tucf-btn-primary font-medium">
            Search Jobs
          </button>
        </div>

        {showFilters && (
          <div className="mt-6 p-4 rounded-lg border" style={{ background: '#0f0f0f', borderColor: 'var(--border)' }}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Experience</label>
                <select className="w-full px-3 py-2">
                  <option>Any</option>
                  <option>0-1 years</option>
                  <option>1-3 years</option>
                  <option>3-5 years</option>
                  <option>5+ years</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Job Type</label>
                <select className="w-full px-3 py-2">
                  <option>All</option>
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Internship</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Remote</label>
                <select className="w-full px-3 py-2">
                  <option>All</option>
                  <option>Remote</option>
                  <option>Hybrid</option>
                  <option>On-site</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Salary Range</label>
                <select className="w-full px-3 py-2">
                  <option>Any</option>
                  <option>₹0-5 LPA</option>
                  <option>₹5-10 LPA</option>
                  <option>₹10-20 LPA</option>
                  <option>₹20+ LPA</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <p style={{ color: 'var(--text-secondary)' }}>
          Showing <span className="font-semibold">{mockJobs.length}</span> jobs out of <span className="font-semibold">156</span> results
        </p>
        <div className="flex items-center space-x-2">
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Sort by:</span>
          <select className="px-3 py-1 text-sm">
            <option>Most Recent</option>
            <option>Most Relevant</option>
            <option>Salary: High to Low</option>
            <option>Salary: Low to High</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {mockJobs.map((job) => (
          <div key={job.id} className="tucf-card">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-xl font-semibold cursor-pointer" style={{ color: 'var(--text-primary)' }}>
                    {job.title}
                  </h3>
                  {job.remote && (
                    <span className="px-2 py-1 text-xs rounded-full" style={{ background: 'rgba(255,122,0,0.15)', color: 'var(--accent)' }}>
                      Remote
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-4 mb-3" style={{ color: 'var(--text-secondary)' }}>
                  <div className="flex items-center space-x-1">
                    <Building className="h-4 w-4" />
                    <span className="text-sm">{job.company}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{job.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{job.posted}</span>
                  </div>
                </div>

                <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>{job.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm rounded-full"
                      style={{ background: 'rgba(255,122,0,0.12)', color: 'var(--accent)' }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{job.salary}</span>
                    <span className="px-2 py-1 text-sm rounded" style={{ background: '#0f0f0f', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                      {job.type}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-2 ml-6">
                <button
                  className={`p-2 rounded-lg transition-colors ${
                    job.saved
                      ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100'
                        : 'hover:bg-[rgba(255,122,0,0.1)]'
                  }`}
                      style={job.saved ? { color: 'var(--accent)', background: 'rgba(255,122,0,0.1)' } : { color: 'var(--text-secondary)' }}
                >
                  <Bookmark className={`h-5 w-5 ${job.saved ? 'fill-current' : ''}`} />
                </button>
                <button className="p-2 rounded-lg transition-colors" style={{ color: 'var(--text-secondary)' }}>
                  <ExternalLink className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-4 pt-4 border-t" style={{ borderTopColor: 'var(--border)' }}>
              <button className="px-4 py-2 font-medium transition-colors" style={{ color: 'var(--text-secondary)' }}>
                View Details
              </button>
              <button className="px-6 py-2 tucf-btn-primary font-medium">
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <button className="px-8 py-3 tucf-btn-ghost font-medium">
          Load More Jobs
        </button>
      </div>
    </div>
  );
};

export default JobSearch;