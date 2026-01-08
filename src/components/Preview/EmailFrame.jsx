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

            const getSplitTarget = (e, row) => {
                if (!row || row.cells.length !== 1) return null;
                const td = row.cells[0];
                let target = e.target;
                while (target && target.parentNode !== td && target !== td && target !== row) {
                    target = target.parentNode;
                }
                if (target && target.parentNode === td) {
                    const rect = target.getBoundingClientRect();
                    const isAfter = (e.clientY - rect.top) > (rect.height / 2);
                    return { node: target, position: isAfter ? 'after' : 'before' };
                }
                return null;
            };

            const handleDragOver = (e) => {
                e.preventDefault();
                e.stopPropagation();

                doc.querySelectorAll('.drop-target, .drop-target-top, .drop-target-bottom').forEach(el => {
                    el.classList.remove('drop-target', 'drop-target-top', 'drop-target-bottom');
                    el.style.borderBottom = '';
                    el.style.boxShadow = '';
                });

                const targetRow = e.target.closest('tr');
                if (targetRow) {
                    const split = getSplitTarget(e, targetRow);
                    if (split) {
                        if (split.position === 'after') {
                            split.node.classList.add('drop-target-bottom');
                            split.node.style.boxShadow = '0 4px 0 #ff6600';
                        } else {
                            split.node.classList.add('drop-target-top');
                            split.node.style.boxShadow = '0 -4px 0 #ff6600';
                        }
                    } else {
                        targetRow.classList.add('drop-target');
                        targetRow.style.borderBottom = '3px solid #ff6600';
                    }
                }
            };

            const handleDragLeave = (e) => {
                const targetRow = e.target.closest('tr');
                if (targetRow) {
                    targetRow.classList.remove('drop-target');
                    targetRow.style.borderBottom = '';
                }
            };

            const handleDragStart = (e) => {
                const row = e.target.closest('tr');
                if (row) {
                    if (!row.id) row.id = `row-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                    e.dataTransfer.setData('application/email-row-id', row.id);
                    e.dataTransfer.effectAllowed = 'move';
                    row.style.opacity = '0.5';
                }
            };

            const handleDragEnd = (e) => {
                const row = e.target.closest('tr');
                if (row) {
                    row.style.opacity = '1';
                }
                doc.querySelectorAll('.drop-target, .drop-target-top, .drop-target-bottom').forEach(el => {
                    el.classList.remove('drop-target', 'drop-target-top', 'drop-target-bottom');
                    el.style.borderBottom = '';
                    el.style.boxShadow = '';
                });
            };

            const handleDrop = (e) => {
                e.preventDefault();
                e.stopPropagation();

                doc.querySelectorAll('.drop-target, .drop-target-top, .drop-target-bottom').forEach(el => {
                    el.classList.remove('drop-target', 'drop-target-top', 'drop-target-bottom');
                    el.style.borderBottom = '';
                    el.style.boxShadow = '';
                });

                const targetRow = e.target.closest('tr');
                if (!targetRow) return;

                const split = getSplitTarget(e, targetRow);
                let insertMode = split ? 'split' : 'row';
                const splitRef = split;

                const processInsert = (newContentNodeOrHtml) => {
                    if (insertMode === 'split' && splitRef) {
                        const td = targetRow.cells[0];
                        const children = Array.from(td.childNodes);
                        const index = children.indexOf(splitRef.node);
                        const splitIndex = splitRef.position === 'after' ? index + 1 : index;
                        const group1 = children.slice(0, splitIndex);
                        const group2 = children.slice(splitIndex);

                        const createRowFromNodes = (nodes) => {
                            const hasContent = nodes.some(n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()));
                            if (!hasContent) return null;
                            const newRow = targetRow.cloneNode(true);
                            newRow.removeAttribute('id');
                            newRow.cells[0].innerHTML = '';
                            nodes.forEach(n => newRow.cells[0].appendChild(n));
                            return newRow;
                        };

                        const row1 = createRowFromNodes(group1);
                        const row2 = createRowFromNodes(group2);

                        let rowInsert;
                        if (typeof newContentNodeOrHtml === 'string') {
                            const temp = doc.createElement('tbody');
                            temp.innerHTML = newContentNodeOrHtml;
                            rowInsert = temp.firstElementChild;
                        } else {
                            rowInsert = newContentNodeOrHtml;
                        }

                        const parent = targetRow.parentNode;
                        if (row1) parent.insertBefore(row1, targetRow);
                        if (rowInsert) parent.insertBefore(rowInsert, targetRow);
                        if (row2) parent.insertBefore(row2, targetRow);
                        parent.removeChild(targetRow);
                    } else {
                        let nodeToInsert;
                        if (typeof newContentNodeOrHtml === 'string') {
                            const temp = doc.createElement('tbody');
                            temp.innerHTML = newContentNodeOrHtml;
                            nodeToInsert = temp.firstElementChild;
                        } else {
                            nodeToInsert = newContentNodeOrHtml;
                        }

                        const rect = targetRow.getBoundingClientRect();
                        const next = (e.clientY - rect.top) > (rect.height / 2);

                        if (nodeToInsert && nodeToInsert !== targetRow) {
                            if (next) targetRow.parentNode.insertBefore(nodeToInsert, targetRow.nextSibling);
                            else targetRow.parentNode.insertBefore(nodeToInsert, targetRow);
                        }
                    }
                    enableDragOnRows();
                    saveChanges();
                };

                const sourceId = e.dataTransfer.getData('application/email-row-id');
                if (sourceId) {
                    const sourceRow = doc.getElementById(sourceId);
                    if (sourceRow && sourceRow !== targetRow) processInsert(sourceRow);
                } else {
                    const type = e.dataTransfer.getData('application/email-block');
                    if (type) {
                        const html = getBlockHtml(type);
                        if (html) processInsert(html);
                    }
                }
            };

            const handleClick = (e) => {
                const target = e.target;
                const selectedId = target.getAttribute('data-selected-id') || `elem-${Date.now()}`;
                target.setAttribute('data-selected-id', selectedId);

                if (onSelectRef.current) {
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
                    if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'SPAN', 'A', 'LI', 'B', 'STRONG', 'I', 'EM', 'SMALL'].includes(el.tagName)) return true;
                    if (['TD', 'DIV'].includes(el.tagName)) {
                        if (el.querySelector('table, tr, td, div, p, h1, h2, h3, h4, h5, h6, ul, ol, img')) return false;
                        return true;
                    }
                    return false;
                };

                if (isSafeToEdit(target)) {
                    target.contentEditable = "true";
                    target.focus();
                    target.onblur = () => {
                        target.removeAttribute('contenteditable');
                        saveChanges();
                    };
                }
            };

            const enableDragOnRows = () => {
                const rows = doc.querySelectorAll('tr');
                rows.forEach(row => {
                    row.setAttribute('draggable', 'true');
                    row.style.cursor = 'grab';
                });
            };
            enableDragOnRows();

            const handleMouseOver = (e) => {
                const row = e.target.closest('tr');
                if (row && !row.draggable) {
                    row.setAttribute('draggable', 'true');
                    row.style.cursor = 'grab';
                }
            };

            doc.body.addEventListener('click', handleClick);
            doc.body.addEventListener('dragstart', handleDragStart);
            doc.body.addEventListener('dragend', handleDragEnd);
            doc.body.addEventListener('dragover', handleDragOver);
            doc.body.addEventListener('dragleave', handleDragLeave);
            doc.body.addEventListener('drop', handleDrop);
            doc.body.addEventListener('mouseover', handleMouseOver);

            return () => {
                doc.body.removeEventListener('click', handleClick);
                doc.body.removeEventListener('dragstart', handleDragStart);
                doc.body.removeEventListener('dragend', handleDragEnd);
                doc.body.removeEventListener('dragover', handleDragOver);
                doc.body.removeEventListener('dragleave', handleDragLeave);
                doc.body.removeEventListener('drop', handleDrop);
                doc.body.removeEventListener('mouseover', handleMouseOver);
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
