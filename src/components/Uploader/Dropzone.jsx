import { useState, useRef } from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { fileToBase64 } from '../../utils/file-helpers';
import { generateEmailCode } from '../../services/openai';
import LoadingScreen from '../UI/LoadingScreen';

const Uploader = ({ onGenerate }) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const processFile = async (file) => {
        if (!file) return;

        console.log("Processing file:", file.name, file.type);

        if (!file.type.startsWith('image/')) {
            alert(`Please upload an image file. (Detected type: ${file.type || 'unknown'})`);
            return;
        }

        setLoading(true);
        try {
            const base64 = await fileToBase64(file);
            // Call AI Service
            const result = await generateEmailCode(base64);
            onGenerate(result, base64); // Pass result and original image
        } catch (err) {
            console.error(err);
            alert('Failed to generate template. Check API Key or try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files[0];
        processFile(file);
    };

    const handleChange = (e) => {
        const file = e.target.files[0];
        processFile(file);
    };

    return (
        <div
            style={{
                flex: 1,
                display: 'flex',
                position: 'relative', // Ensure loader is contained
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '50px',
                border: '2px dashed var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                margin: 'var(--spacing-6)',
                backgroundColor: isDragOver ? 'var(--bg-app)' : 'var(--bg-panel)',
                color: 'var(--text-muted)',
                transition: 'all 0.2s',
                overflow: 'hidden' // Clipped corners for loader
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <input
                type="file"
                hidden
                ref={fileInputRef}
                onChange={handleChange}
                accept="image/*"
            />

            {loading ? (
                <LoadingScreen />
            ) : (
                <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => fileInputRef.current.click()}>
                    <FaCloudUploadAlt size={64} style={{ marginBottom: 'var(--spacing-4)', color: 'var(--color-primary)' }} />
                    <h2 style={{ color: 'var(--text-main)' }}>Drop your design here</h2>
                    <p>or click to browse</p>
                    <p style={{ fontSize: '0.875rem', marginTop: 'var(--spacing-2)' }}>Supports PNG, JPG, WebP</p>
                </div>
            )}
        </div>
    );
};

export default Uploader;
