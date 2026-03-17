import React, { useRef, useState } from 'react';
import { Maximize2, X } from 'lucide-react';

interface PortfolioPreviewProps {
  generatedHtml: string;
  previewKey: number;
  isGenerating?: boolean;
}

type PreviewMode = 'desktop' | 'tablet' | 'mobile';

const PortfolioPreview: React.FC<PortfolioPreviewProps> = ({ generatedHtml, previewKey, isGenerating = false }) => {
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  const previewWidths: Record<PreviewMode, string> = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
  };

  const handleFullscreenClick = () => {
    if (!document.fullscreenElement && previewContainerRef.current) {
      previewContainerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(() => {
        console.error('Failed to enter fullscreen');
      });
    }
  };

  const handleFullscreenChange = () => {
    if (!document.fullscreenElement) {
      setIsFullscreen(false);
    }
  };

  // Inject viewport meta tag and apply container width styling to the iframe
  const enhancedHtml = (() => {
    if (!generatedHtml) return '';

    // Check if viewport meta tag exists
    const hasViewport = generatedHtml.includes('name="viewport"');
    
    let html = generatedHtml;

    // Add viewport meta tag if missing
    if (!hasViewport) {
      const headEndIndex = html.indexOf('</head>');
      if (headEndIndex !== -1) {
        const viewportTag = '<meta name="viewport" content="width=device-width, initial-scale=1">';
        html = html.slice(0, headEndIndex) + viewportTag + html.slice(headEndIndex);
      }
    }

    return html;
  })();

  React.useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  if (isFullscreen) {
    return (
      <div
        ref={containerRef}
        className="fixed inset-0 z-50 bg-black flex flex-col"
        role="region"
        aria-label="Fullscreen portfolio preview"
      >
        <div className="px-4 py-3 flex items-center justify-between" style={{ background: 'var(--bg-sidebar)', borderBottom: '1px solid var(--border)' }}>
          <h3 className="text-white font-semibold">Portfolio Preview (Fullscreen)</h3>
          <button
            onClick={() => {
              document.exitFullscreen().catch(() => {
                console.error('Failed to exit fullscreen');
              });
            }}
            className="transition"
            style={{ color: 'var(--text-secondary)' }}
            aria-label="Exit fullscreen"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 flex justify-center items-start overflow-auto bg-black p-4">
          <div
            style={{ width: previewWidths[previewMode], background: '#0f0f0f', border: '1px solid var(--border)' }}
            className="rounded-lg overflow-hidden shadow-2xl"
          >
            <iframe
              key={previewKey}
              title="Portfolio Preview"
              srcDoc={enhancedHtml}
              className="w-full h-screen border-none"
              style={{
                height: '100vh',
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full rounded-2xl overflow-hidden"
      style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}
      role="region"
      aria-label="Portfolio preview panel"
    >
      <div className="px-5 py-4 border-b flex flex-col gap-3" style={{ borderBottomColor: 'var(--border)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Live Preview</h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {isGenerating ? 'Updating...' : '✓ Live'}
            </p>
          </div>
          <button
            onClick={handleFullscreenClick}
            className="p-2 rounded-lg transition"
            style={{ background: '#0f0f0f', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
            title="Enter fullscreen"
            aria-label="Enter fullscreen mode"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>

        <div className="flex gap-2">
          {(['desktop', 'tablet', 'mobile'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setPreviewMode(mode)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${previewMode === mode ? 'text-white' : ''}`}
              style={previewMode === mode ? { background: 'var(--accent)', color: '#fff' } : { background: '#0f0f0f', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
              aria-pressed={previewMode === mode}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={previewContainerRef}
        className="flex-1 overflow-hidden flex justify-center items-start p-4"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          overflow: 'auto',
          background: '#0a0a0a',
        }}
      >
        <div
          style={{
            width: previewWidths[previewMode],
            height: '100%',
            background: '#0f0f0f',
            border: '1px solid var(--border)',
          }}
          className="rounded-xl overflow-hidden flex flex-col"
        >
          <div className="h-10 border-b flex items-center px-4 gap-3" style={{ background: '#111111', borderBottomColor: 'var(--border)' }}>
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#2f2f2f' }}></span>
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#7a3d00' }}></span>
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--accent)' }}></span>
          </div>

          <div className="flex-1 overflow-hidden">
            <iframe
              key={previewKey}
              title="Portfolio Preview"
              srcDoc={enhancedHtml}
              className="w-full h-full border-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPreview;
