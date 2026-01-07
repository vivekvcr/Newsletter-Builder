import { useRef, useEffect } from 'react';

const EmailFrame = ({ html, mode = 'desktop', onUpdate }) => {
    const iframeRef = useRef(null);

    useEffect(() => {
        if (iframeRef.current) {
            const doc = iframeRef.current.contentDocument;
            doc.open();
            doc.write(html);
            doc.close();

            // Inject editor styles
            const style = doc.createElement('style');
            style.id = 'editor-styles';
            style.textContent = `
                body { margin: 0; padding: 0; background: #fff; font-family: sans-serif; }
                ::-webkit-scrollbar { width: 0px; }
                *[contenteditable="true"] { outline: 2px dashed #ff6600; cursor: text; }
                img:hover { outline: 2px dashed #ff6600; cursor: pointer; }
            `;
            doc.head.appendChild(style);

            // Interaction Logic
            const saveChanges = () => {
                const clone = doc.documentElement.cloneNode(true);
                const editorStyle = clone.querySelector('#editor-styles');
                if (editorStyle) editorStyle.remove();

                const editables = clone.querySelectorAll('*[contenteditable]');
                editables.forEach(el => el.removeAttribute('contenteditable'));

                if (onUpdate) {
                    onUpdate(clone.outerHTML);
                }
            };

            const handleClick = (e) => {
                const target = e.target;

                // Image Editing
                if (target.tagName === 'IMG') {
                    e.preventDefault();
                    e.stopPropagation();
                    const newSrc = prompt('Enter new image URL:', target.src);
                    if (newSrc && newSrc !== target.src) {
                        target.src = newSrc;
                        saveChanges();
                    }
                    return;
                }

                // Text Editing
                if (target.isContentEditable) return;

                const isSafeToEdit = (el) => {
                    // Always safe text containers
                    if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'SPAN', 'A', 'LI', 'B', 'STRONG', 'I', 'EM', 'SMALL'].includes(el.tagName)) return true;

                    // Containers that are safe only if they don't contain other structural blocks
                    if (['TD', 'DIV'].includes(el.tagName)) {
                        // Check if it contains block-level elements that implies it's a layout wrapper
                        if (el.querySelector('table, tr, td, div, p, h1, h2, h3, h4, h5, h6, ul, ol, img')) return false;
                        return true;
                    }
                    return false;
                };

                if (isSafeToEdit(target)) {
                    target.contentEditable = "true";
                    target.focus();

                    // Save on blur
                    target.onblur = () => {
                        target.removeAttribute('contenteditable');
                        saveChanges();
                    };
                }
            };

            doc.body.addEventListener('click', handleClick);
        }
    }, [html, onUpdate]);

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
