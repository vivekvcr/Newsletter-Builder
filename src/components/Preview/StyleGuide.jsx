import { FaPalette, FaFont } from 'react-icons/fa';

const StyleGuide = ({ colors = [], fonts = [] }) => {
    return (
        <div style={{
            width: '300px',
            background: 'var(--bg-panel)',
            borderLeft: '1px solid var(--border-color)',
            padding: 'var(--spacing-4)',
            overflowY: 'auto'
        }}>
            <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--spacing-2)' }}>
                Style Guide
            </h3>

            <div style={{ marginTop: 'var(--spacing-4)' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaPalette /> Colors
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))', gap: '8px' }}>
                    {colors.map((c, i) => (
                        <div key={i} style={{ textAlign: 'center' }}>
                            <div
                                style={{
                                    width: '100%',
                                    height: '40px',
                                    backgroundColor: c,
                                    borderRadius: '4px',
                                    border: '1px solid var(--border-color)'
                                }}
                            />
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c}</span>
                        </div>
                    ))}
                    {colors.length === 0 && <p style={{ fontSize: '0.875rem' }}>No colors detected</p>}
                </div>
            </div>

            <div style={{ marginTop: 'var(--spacing-6)' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaFont /> Fonts
                </h4>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {fonts.map((f, i) => (
                        <li key={i} style={{
                            padding: '8px',
                            borderBottom: '1px solid var(--border-color)',
                            fontSize: '0.9rem'
                        }}>
                            {f}
                        </li>
                    ))}
                    {fonts.length === 0 && <p style={{ fontSize: '0.875rem' }}>No fonts detected</p>}
                </ul>
            </div>
        </div>
    );
};

export default StyleGuide;
