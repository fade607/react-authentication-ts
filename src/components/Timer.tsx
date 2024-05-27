import React, { useState, useEffect } from 'react';

interface TimerProps {
    initialMinutes?: number;
    initialSeconds?: number;
    onResend: () => void;
}

const Timer: React.FC<TimerProps> = ({ initialMinutes = 3, initialSeconds = 0, onResend }) => {
    const [[minutes, seconds], setTime] = useState([initialMinutes, initialSeconds]);

    useEffect(() => {
        const tick = () => {
            if (minutes === 0 && seconds === 0) {
                onResend();  // Call the resend function
                return;
            } else if (seconds === 0) {
                setTime([minutes - 1, 59]);
            } else {
                setTime([minutes, seconds - 1]);
            }
        };

        const timerId = setInterval(tick, 1000);
        return () => clearInterval(timerId);
    }, [minutes, seconds, onResend]);

    return (
        <div>
            <p className='small-text' >
                  {`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
            </p>
        </div>
    );
};

export default Timer;
