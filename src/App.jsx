import { useState } from 'react';
import MainLayout from './components/Layout/MainLayout';
import Dropzone from './components/Uploader/Dropzone';
import EmailFrame from './components/Preview/EmailFrame';
import StyleGuide from './components/Preview/StyleGuide';
import { FaMobileAlt, FaDesktop, FaCode, FaArrowLeft, FaImage, FaDownload, FaFileCode } from 'react-icons/fa';

function App() {
  const [view, setView] = useState('upload'); // 'upload' | 'preview'
  const [data, setData] = useState({ html: '', meta: { colors: [], fonts: [] } });
  const [sourceImage, setSourceImage] = useState(null);
  const [previewMode, setPreviewMode] = useState('desktop'); // 'desktop' | 'mobile'
  const [showSource, setShowSource] = useState(false);

  const handleGenerate = (result, imageBase64) => {
    setData(result);
    setSourceImage(imageBase64);
    setView('preview');
  };

  const handleReset = () => {
    setView('upload');
    setData({ html: '', meta: { colors: [], fonts: [] } });
    setSourceImage(null);
  };

  const downloadHtml = () => {
    const blob = new Blob([data.html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email-template.html';
    a.click();
  };

  return (
    <MainLayout>
      {view === 'upload' ? (
        <Dropzone onGenerate={handleGenerate} />
      ) : (
        <div style={{ display: 'flex', width: '100%', height: '100%' }}>
          {/* Toolbar / Source View */}
          <div style={{
            width: showSource ? '300px' : '60px',
            borderRight: '1px solid var(--border-color)',
            background: 'var(--bg-panel)',
            display: 'flex',
            flexDirection: 'column',
            transition: 'width 0.3s'
          }}>
            <div style={{ padding: 'var(--spacing-2)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)', alignItems: 'center' }}>
              <button onClick={handleReset} className="btn-secondary" title="New Upload">
                <FaArrowLeft />
              </button>
              <button
                className={`btn-secondary ${showSource ? 'active' : ''}`}
                onClick={() => setShowSource(!showSource)}
                title="Toggle Source Image"
              >
                <FaImage />
              </button>
            </div>

            {showSource && (
              <div style={{ padding: 'var(--spacing-2)', overflow: 'auto' }}>
                <h4 style={{ margin: '0 0 var(--spacing-2) 0' }}>Original</h4>
                <img src={sourceImage} alt="Original" style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }} />
              </div>
            )}
          </div>

          {/* Main Preview Area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{
              height: '50px',
              borderBottom: '1px solid var(--border-color)',
              background: 'var(--bg-panel)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--spacing-4)'
            }}>
              <button
                className={`btn-secondary ${previewMode === 'desktop' ? 'active' : ''}`}
                onClick={() => setPreviewMode('desktop')}
                style={{ background: previewMode === 'desktop' ? 'var(--bg-app)' : 'transparent' }}
              >
                <FaDesktop /> Desktop
              </button>
              <button
                className={`btn-secondary ${previewMode === 'mobile' ? 'active' : ''}`}
                onClick={() => setPreviewMode('mobile')}
                style={{ background: previewMode === 'mobile' ? 'var(--bg-app)' : 'transparent' }}
              >
                <FaMobileAlt /> Mobile
              </button>
              <button
                className={`btn-secondary ${previewMode === 'code' ? 'active' : ''}`}
                onClick={() => setPreviewMode('code')}
                style={{ background: previewMode === 'code' ? 'var(--bg-app)' : 'transparent' }}
              >
                <FaFileCode /> Source
              </button>
              <div style={{ width: '1px', height: '20px', background: 'var(--border-color)', margin: '0 var(--spacing-2)' }} />
              <button onClick={downloadHtml} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaDownload /> Export HTML
              </button>
            </div>

            {previewMode === 'code' ? (
              <div style={{
                flex: 1,
                background: '#282c34',
                padding: '24px',
                overflow: 'auto',
                color: '#abb2bf',
                fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
                fontSize: '14px',
                lineHeight: '1.5',
                whiteSpace: 'pre'
              }}>
                {data.html}
              </div>
            ) : (
              <EmailFrame html={data.html} mode={previewMode} onUpdate={(newHtml) => setData(prev => ({ ...prev, html: newHtml }))} />
            )}
          </div>

          {/* Style Guide Panel */}
          <StyleGuide colors={data.meta?.colors} fonts={data.meta?.fonts} />
        </div>
      )}
    </MainLayout>
  );
}

export default App;
