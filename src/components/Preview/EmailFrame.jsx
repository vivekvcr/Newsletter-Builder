import { useRef, useEffect } from 'react';

const EmailFrame = ({ html, mode = 'desktop', onUpdate, styleUpdates, onSelect }) => {
    const iframeRef = useRef(null);
    const onSelectRef = useRef(onSelect);
    const onUpdateRef = useRef(onUpdate);

    // Keep refs up to date
    useEffect(() => {
        onSelectRef.current = onSelect;
        onUpdateRef.current = onUpdate;
    }, [onSelect, onUpdate]);

    // Handle Style Updates separately without reloading iframe
    useEffect(() => {
        if (styleUpdates && styleUpdates.id && iframeRef.current) {
            const doc = iframeRef.current.contentDocument;
            const target = doc.querySelector(`[data-selected-id="${styleUpdates.id}"]`);
            if (target) {
                Object.assign(target.style, styleUpdates.styles);

                const saveChanges = () => {
                    const clone = doc.documentElement.cloneNode(true);
                    const editorStyle = clone.querySelector('#editor-styles');
                    if (editorStyle) editorStyle.remove();
                    const editables = clone.querySelectorAll('*[contenteditable]');
                    editables.forEach(el => el.removeAttribute('contenteditable'));
                    if (onUpdateRef.current) onUpdateRef.current(clone.outerHTML);
                };
                saveChanges();
            }
        }
    }, [styleUpdates]);

    // Initialize HTML and Listeners
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
                body { margin: 0; padding: 0; background: #fff; font - family: sans - serif; }
                :: -webkit - scrollbar { width: 0px; }
                * [contenteditable = "true"] { outline: 2px dashed #ff6600; cursor: text; }
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

                if (onUpdateRef.current) {
                    onUpdateRef.current(clone.outerHTML);
                }
            };

            // Drag and Drop Logic
            const getBlockHtml = (type) => {
                switch (type) {
                    case 'heading': return `< tr > <td style="padding:10px 30px;"><h2 style="margin:0;font-family:Arial,sans-serif;color:#000;">New Heading</h2></td></tr > `;
                    case 'paragraph': return `< tr > <td style="padding:10px 30px;"><p style="margin:0;font-family:Arial,sans-serif;font-size:16px;line-height:1.5;">New paragraph content.</p></td></tr > `;
                    case 'button': return `< tr > <td align="center" style="padding:20px;"><a href="#" style="background:#ff6600;color:#fff;padding:12px 24px;text-decoration:none;border-radius:4px;display:inline-block;font-family:Arial,sans-serif;font-weight:bold;">Button Text</a></td></tr > `;
                    case 'divider': return `< tr > <td style="padding:20px 30px;"><hr style="border:0;border-top:1px solid #ccc;"></td></tr > `;
                    case 'spacer': return `< tr > <td style="height:30px;">&nbsp;</td></tr > `;
                    case 'image': return `< tr > <td style="padding:10px 30px;"><img src="https://placehold.co/600x200" width="100%" style="display:block;height:auto;" alt="New Image" /></td></tr > `;
                    default: return '';
                }
            };

            const handleDragOver = (e) => {
                e.preventDefault();
                e.stopPropagation();

                const targetRow = e.target.closest('tr');
                if (targetRow) {
                    // Visual feedback
                    doc.querySelectorAll('.drop-target').forEach(el => el.classList.remove('drop-target'));
                    targetRow.classList.add('drop-target');
                    targetRow.style.borderBottom = '3px solid #ff6600'; // Fallback visual
                }
            };

            const handleDragLeave = (e) => {
                const targetRow = e.target.closest('tr');
                if (targetRow) {
                    targetRow.classList.remove('drop-target');
                    targetRow.style.borderBottom = '';
                }
            };

            const handleDrop = (e) => {
                e.preventDefault();
                e.stopPropagation();

                // Cleanup visual feedback
                doc.querySelectorAll('tr').forEach(el => {
                    el.classList.remove('drop-target');
                    el.style.borderBottom = '';
                });

                const type = e.dataTransfer.getData('application/email-block');
                const targetRow = e.target.closest('tr');

                if (type && targetRow) {
                    const html = getBlockHtml(type);
                    if (html) {
                        // Insert after the drop target
                        targetRow.insertAdjacentHTML('afterend', html);
                        saveChanges();
                    }
                }
            };

            const handleClick = (e) => {
                const target = e.target;

                const selectedId = target.getAttribute('data-selected-id') || `elem - ${Date.now()} `;
                target.setAttribute('data-selected-id', selectedId);

                // Extract styles
                if (onSelectRef.current) {
                    const computed = doc.defaultView.getComputedStyle(target);
                    // Use inline styles preferably, or computed if inline missing
                    const styles = {
                        color: target.style.color || '',
                        backgroundColor: target.style.backgroundColor || '',
                        fontSize: target.style.fontSize || '',
                        lineHeight: target.style.lineHeight || '',
                        fontWeight: target.style.fontWeight || '',
                        padding: target.style.padding || ''
                    };
                    onSelectRef.current({ id: selectedId, styles, tagName: target.tagName });
                }

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
            doc.body.addEventListener('dragover', handleDragOver);
            doc.body.addEventListener('dragleave', handleDragLeave);
            doc.body.addEventListener('drop', handleDrop);

            return () => {
                doc.body.removeEventListener('click', handleClick);
                doc.body.removeEventListener('dragover', handleDragOver);
                doc.body.removeEventListener('dragleave', handleDragLeave);
                doc.body.removeEventListener('drop', handleDrop);
            };
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
