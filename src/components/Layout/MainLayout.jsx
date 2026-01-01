import { useState, useEffect } from 'react';
import { FaMoon, FaSun, FaGithub } from 'react-icons/fa';

const MainLayout = ({ children }) => {
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <header style={{
                padding: 'var(--spacing-4) var(--spacing-6)',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'var(--bg-panel)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                    <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Newsletter Builder AI</h1>
                </div>

                <div style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
                    <button onClick={toggleTheme} className="btn-secondary" style={{ display: 'flex', alignItems: 'center' }}>
                        {theme === 'light' ? <FaMoon /> : <FaSun />}
                    </button>
                </div>
            </header>

            <main style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
                {children}
            </main>
        </div>
    );
};

export default MainLayout;
