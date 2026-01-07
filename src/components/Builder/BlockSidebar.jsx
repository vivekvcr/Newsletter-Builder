import { FaHeading, FaParagraph, FaRegSquare, FaImage, FaMinus, FaArrowsAltV, FaVideo, FaCode, FaCheckSquare } from 'react-icons/fa';

const blocks = [
    { id: 'heading', label: 'Heading', icon: <FaHeading />, description: 'A section title' },
    { id: 'paragraph', label: 'Paragraph', icon: <FaParagraph />, description: 'Body text' },
    { id: 'button', label: 'Button', icon: <FaRegSquare />, description: 'Call to action' },
    { id: 'divider', label: 'Divider', icon: <FaMinus />, description: 'Separator line' },
    { id: 'spacer', label: 'Spacer', icon: <FaArrowsAltV />, description: 'Empty space' },
    { id: 'image', label: 'Image', icon: <FaImage />, description: 'Picture' },
];

const BlockSidebar = () => {
    const handleDragStart = (e, type) => {
        e.dataTransfer.setData('application/email-block', type);
        e.dataTransfer.effectAllowed = 'copy';
    };

    return (
        <div style={{
            width: '280px',
            borderRight: '1px solid var(--border-color)',
            background: '#fff',
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
        }}>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Content Blocks</h3>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#666' }}>Drag blocks onto the canvas</p>
            </div>

            <div style={{
                padding: '16px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
                overflow: 'auto'
            }}>
                {blocks.map((block) => (
                    <div
                        key={block.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, block.id)}
                        style={{
                            padding: '16px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'grab',
                            background: '#fff',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.borderColor = '#ff6600';
                            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.borderColor = '#e2e8f0';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <div style={{ fontSize: '24px', color: '#4a5568' }}>{block.icon}</div>
                        <span style={{ fontSize: '13px', fontWeight: 500, color: '#2d3748' }}>{block.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlockSidebar;
