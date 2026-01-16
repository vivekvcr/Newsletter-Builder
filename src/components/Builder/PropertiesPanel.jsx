import { FaBold, FaFont, FaPalette, FaArrowsAltV, FaTextHeight } from 'react-icons/fa';

const PropertiesPanel = ({ styles = {}, onClose, onChange }) => {

    const handleChange = (key, value) => {
        onChange(key, value);
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
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Edit Styles</h3>
                <button onClick={onClose} style={{ fontSize: '12px', color: '#666', border: '1px solid #ccc', borderRadius: '4px', padding: '2px 6px', cursor: 'pointer' }}>Close</button>
            </div>

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', overflow: 'auto' }}>

                {/* Colors */}
                <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '8px', color: '#4a5568' }}>Colors</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div>
                            <span style={{ fontSize: '11px', color: '#718096' }}>Text</span>
                            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '4px' }}>
                                <FaPalette style={{ color: '#aaa', marginRight: '8px', fontSize: '12px' }} />
                                <input
                                    type="color"
                                    value={styles.color || '#000000'}
                                    onChange={(e) => handleChange('color', e.target.value)}
                                    style={{ border: 'none', width: '100%', height: '20px', cursor: 'pointer' }}
                                />
                            </div>
                        </div>
                        <div>
                            <span style={{ fontSize: '11px', color: '#718096' }}>Background</span>
                            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '4px' }}>
                                <FaPalette style={{ color: '#aaa', marginRight: '8px', fontSize: '12px' }} />
                                <input
                                    type="color"
                                    value={styles.backgroundColor || '#ffffff'}
                                    onChange={(e) => handleChange('backgroundColor', e.target.value)}
                                    style={{ border: 'none', width: '100%', height: '20px', cursor: 'pointer' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Typography */}
                <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '8px', color: '#4a5568' }}>Typography</label>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FaFont style={{ color: '#aaa', fontSize: '12px' }} />
                                <span style={{ fontSize: '12px', color: '#4a5568' }}>Size (px)</span>
                            </div>
                            <input
                                type="number"
                                value={parseInt(styles.fontSize) || 16}
                                onChange={(e) => handleChange('fontSize', `${e.target.value}px`)}
                                style={{ width: '60px', padding: '4px', border: '1px solid #e2e8f0', borderRadius: '4px' }}
                            />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FaTextHeight style={{ color: '#aaa', fontSize: '12px' }} />
                                <span style={{ fontSize: '12px', color: '#4a5568' }}>Line Height</span>
                            </div>
                            <input
                                type="number"
                                step="0.1"
                                value={parseFloat(styles.lineHeight) || 1.5}
                                onChange={(e) => handleChange('lineHeight', e.target.value)}
                                style={{ width: '60px', padding: '4px', border: '1px solid #e2e8f0', borderRadius: '4px' }}
                            />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FaBold style={{ color: '#aaa', fontSize: '12px' }} />
                                <span style={{ fontSize: '12px', color: '#4a5568' }}>Weight</span>
                            </div>
                            <select
                                value={styles.fontWeight || '400'}
                                onChange={(e) => handleChange('fontWeight', e.target.value)}
                                style={{ width: '80px', padding: '4px', border: '1px solid #e2e8f0', borderRadius: '4px' }}
                            >
                                <option value="300">Light</option>
                                <option value="400">Normal</option>
                                <option value="600">Semi Bold</option>
                                <option value="700">Bold</option>
                            </select>
                        </div>

                        {/* Padding Controls */}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <FaArrowsAltV style={{ color: '#aaa', fontSize: '12px' }} />
                                <span style={{ fontSize: '12px', color: '#4a5568' }}>Padding (px)</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span style={{ fontSize: '10px', color: '#718096', width: '12px' }}>T</span>
                                    <input
                                        type="text"
                                        placeholder="Top"
                                        value={styles.paddingTop || ''}
                                        onChange={(e) => handleChange('paddingTop', e.target.value)}
                                        style={{ width: '100%', padding: '4px', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '12px' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span style={{ fontSize: '10px', color: '#718096', width: '12px' }}>R</span>
                                    <input
                                        type="text"
                                        placeholder="Right"
                                        value={styles.paddingRight || ''}
                                        onChange={(e) => handleChange('paddingRight', e.target.value)}
                                        style={{ width: '100%', padding: '4px', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '12px' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span style={{ fontSize: '10px', color: '#718096', width: '12px' }}>B</span>
                                    <input
                                        type="text"
                                        placeholder="Bottom"
                                        value={styles.paddingBottom || ''}
                                        onChange={(e) => handleChange('paddingBottom', e.target.value)}
                                        style={{ width: '100%', padding: '4px', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '12px' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span style={{ fontSize: '10px', color: '#718096', width: '12px' }}>L</span>
                                    <input
                                        type="text"
                                        placeholder="Left"
                                        value={styles.paddingLeft || ''}
                                        onChange={(e) => handleChange('paddingLeft', e.target.value)}
                                        style={{ width: '100%', padding: '4px', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '12px' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PropertiesPanel;
