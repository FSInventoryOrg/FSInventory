import { Check } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';

interface PasswordChangedSuccessProps {
    redirectPath: {
        name: string,
        path: string
    },
    delay: number,
    skipWait: boolean,
}

const PasswordChangedSuccess = ({ redirectPath, skipWait,  delay = 5000}: PasswordChangedSuccessProps) => {
    const navigate = useNavigate();

    const [secondsLeft, setSecondsLeft] = useState(delay / 1000);

    useEffect(() => {
        const interval = setInterval(() => {
            setSecondsLeft(prev => prev - 1);
        }, 1000);

        const timer = setTimeout(() => {
           navigate(redirectPath.path)
        }, delay);

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [redirectPath.path, delay]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault()
        navigate(redirectPath.path)
    }
    return (
        <div className="flex flex-col justify-center items-center">
            <Check />
            <div className="grid justify-center gap-2">
                <h1 className='font-bold'>Password changed successfully!</h1>
                <p>You will be redirected to the {redirectPath.name} page in {secondsLeft} seconds.</p>
                {skipWait && <Button onClick={handleClick}>Proceed to {redirectPath.name}</Button>}
            </div>
        </div>
    );
};

export default PasswordChangedSuccess;