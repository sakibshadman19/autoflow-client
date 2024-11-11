import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Logout.css';

function Logout({ setIsLoggedIn }) {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setIsLoggedIn(false);
        navigate('/');
    };

    return (
        <div className='logout-container'>
            <button onClick={handleLogout} className="logout-button">
                Logout
            </button>
        </div>
    );
}

export default Logout;
