import { useState, useEffect } from 'react';

const PHASES = [
    { label: 'Uploading image...', duration: 3000 },
    { label: 'Analyzing layout...', duration: 8000 },
    { label: 'Building layout structure...', duration: 10000 },
    { label: 'Generating HTML...', duration: 30000 },
    { label: 'Finalizing preview...', duration: 9000 },
];

const LoadingScreen = () => {
    const [progress, setProgress] = useState(0);
    const [phaseIndex, setPhaseIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);

    useEffect(() => {
        const totalDuration = PHASES.reduce((acc, phase) => acc + phase.duration, 0);
        const startTime = Date.now();

        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const newProgress = Math.min((elapsed / totalDuration) * 100, 99); // Max 99% until actually done

            setProgress(newProgress);
            setTimeLeft(Math.max(0, Math.ceil((totalDuration - elapsed) / 1000)));

            // Calculate current phase
            let accumulatedTime = 0;
            let currentPhase = 0;
            for (let i = 0; i < PHASES.length; i++) {
                accumulatedTime += PHASES[i].duration;
                if (elapsed < accumulatedTime) {
                    currentPhase = i;
                    break;
                }
                currentPhase = i; // Cap at last phase
            }
            setPhaseIndex(currentPhase);

        }, 100);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="loading-container">
            <div className="loader-box">
                <div className="spinner-ring"></div>
                <h3 className="loading-title">Creating your Newsletter</h3>

                <div className="progress-container">
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                <div className="loading-status">
                    <span className="phase-text">{PHASES[phaseIndex]?.label || 'Processing...'}</span>
                    <span className="eta-text">{timeLeft > 0 ? `${timeLeft}s remaining` : 'Almost there...'}</span>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;
