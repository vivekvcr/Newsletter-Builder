import { useRef, useEffect } from 'react';

const EmailFrame = ({ html, mode = 'desktop' }) => {
    const iframeRef = useRef(null);

    useEffect(() => {
        if (iframeRef.current) {
            const doc = iframeRef.current.contentDocument;
            doc.open();
            doc.write(html);
            doc.close();
            // Inject some reset styles for the iframe itself
            const style = doc.createElement('style');
            style.textContent = `
        body { margin: 0; padding: 0; background: #fff; font-family: sans-serif; }
        ::-webkit-scrollbar { width: 0px; }
      `;
            doc.head.appendChild(style);
        }
    }, [html]);

    const width = mode === 'mobile' ? '375px' : '100%';

    return (
        <div style={{
            flex: 1,
            background: '#e5e7eb',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'start',
            padding: '50px',
            overflow: 'auto'
        }}>
            <iframe
                ref={iframeRef}
                style={{
                    width: width,
                    height: '100%',
                    minHeight: '800px',
                    border: 'none',
                    background: 'white',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    transition: 'width 0.3s ease'
                }}
                title="Email Preview"
            />
        </div>
    );
};

export default EmailFrame;
