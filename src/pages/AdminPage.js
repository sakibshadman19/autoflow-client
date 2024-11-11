import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminPage.css';
import '../App.css';
import Logout from '../components/Logout';
import { useNavigate } from 'react-router-dom';

function AdminPage({ setIsLoggedIn }) {
    const [activeTab, setActiveTab] = useState('client');
    const [client, setClient] = useState({ email: '', customerName: '', phoneNumber: '', carModel: '' });
    const [type, setType] = useState({ name: '', category: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const navigate = useNavigate();
    useEffect(() => {
        const role = localStorage.getItem('role');
        if (role !== 'admin') {
            navigate('/technician');
        }
    }, [navigate]);

    const createClient = async () => {
        if (!validateClient()) return;
        setIsLoading(true);
        try {
            await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/clients/create`, client);
            setError('');
            setSuccessMessage('Client created successfully!');
            setClient({ email: '', customerName: '', phoneNumber: '', carModel: '' });
            setIsLoading(false);
            clearMessages();
        } catch (err) {
            setError('Error creating client');
            setIsLoading(false);
        }
    };

    const createType = async () => {
        if (!validateType()) return;
        setIsLoading(true);
        try {
            await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/types/create`, type);
            setError('');
            setSuccessMessage('Type created successfully!')
            setType({ name: '', category: '' });
            clearMessages();
            setIsLoading(false);
        } catch (err) {
            setError('Error creating type');
            setIsLoading(false);
            console.error(err);
        }
    };

    const validateClient = () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!client.email || !emailPattern.test(client.email)) {
            setError('Please provide a valid email.');
            return false;
        }
        if (client.customerName.length > 50) {
            setError('Customer name cannot exceed 50 characters.');
            return false;
        }
        if (client.phoneNumber.length > 15) {
            setError('Phone number cannot exceed 15 characters.');
            return false;
        }
        if (client.carModel.length > 30) {
            setError('Car model cannot exceed 30 characters.');
            return false;
        }
        if (!client.customerName || !client.phoneNumber || !client.carModel) {
            setError('All client fields are required.');
            return false;
        }
        return true;
    };

    const validateType = () => {
        if (type.name.length > 50) {
            setError('Type name cannot exceed 50 characters.');
            return false;
        }
        if (!type.category) {
            setError('Please select a category.');
            return false;
        }
        if (!type.name || !type.category) {
            setError('All type fields are required.');
            return false;
        }
        return true;
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setError('');
    };

    const clearMessages = () => {
        setTimeout(() => {
            setSuccessMessage('');
        }, 5000);
    };

    return (
        <div className="admin-container">
            <Logout setIsLoggedIn={setIsLoggedIn} />
            <h2>Admin Page</h2>

            {/* Tab navigation */}
            <div className="tab-buttons">
                <button
                    className={activeTab === 'client' ? 'active' : ''}
                    onClick={() => handleTabChange('client')}
                >
                    Create Client
                </button>
                <button
                    className={activeTab === 'type' ? 'active' : ''}
                    onClick={() => handleTabChange('type')}
                >
                    Create Type
                </button>
            </div>


            {/* Create Client Form */}
            {activeTab === 'client' && (
                <div className="form-container">
                    <h3>Create Client</h3>
                    <input
                        type="email"
                        placeholder="Email"
                        value={client.email}
                        onChange={(e) => setClient({ ...client, email: e.target.value })}
                        maxLength={50}
                    />
                    <input
                        placeholder="Customer Name"
                        value={client.customerName}
                        onChange={(e) => setClient({ ...client, customerName: e.target.value })}
                        maxLength={50}
                    />
                    <input
                        placeholder="Phone Number"
                        value={client.phoneNumber}
                        onChange={(e) => setClient({ ...client, phoneNumber: e.target.value })}
                        maxLength={15}
                    />
                    <input
                        placeholder="Car Model"
                        value={client.carModel}
                        onChange={(e) => setClient({ ...client, carModel: e.target.value })}
                        maxLength={30}
                    />
                    {error && <div className="error-message">{error}</div>}
                    {successMessage && <div className="success-message">{successMessage}</div>}
                    <button onClick={createClient}>{isLoading ? (
            <div className="loader"></div>
          ) : (
            'Create Client'
          )}</button>
                </div>
            )}

            {/* Create Type Form */}
            {activeTab === 'type' && (
                <div className="form-container">
                    <h3>Create Type</h3>
                    <input
                        placeholder="Name"
                        value={type.name}
                        onChange={(e) => setType({ ...type, name: e.target.value })}
                        maxLength={50}
                    />
                    <select
                        value={type.category}
                        onChange={(e) => setType({ ...type, category: e.target.value })}
                    >
                        <option value="">Select Category</option>
                        <option value="Vehicle Pictures">Vehicle Pictures</option>
                        <option value="General Service Items">General Service Items</option>
                        <option value="Fluids">Fluids</option>
                        <option value="Alignment / Steering / Suspension">Alignment / Steering / Suspension</option>
                    </select>
                    {error && <div className="error-message">{error}</div>}
                    {successMessage && <div className="success-message">{successMessage}</div>}
                    <button onClick={createType}>{isLoading ? (
            <div className="loader"></div>
          ) : (
            'Create Type'
          )}</button>
                </div>
            )}
        </div>
    );
}

export default AdminPage;
