import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TechnicianPage.css';
import Logout from '../components/Logout';

function TechnicianPage({ setIsLoggedIn }) {
  const [clients, setClients] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/clients`);
        setClients(data);
        setError('');
      } catch (err) {
        setError('Error fetching clients');
      }
    };
    fetchClients();
  }, []);

  const handleClientClick = (clientId, status) => {
    if (status !== 'complete') {
      navigate(`/client/${clientId}`);
    }
  };
  return (
    <div className="technician-container">
      <Logout setIsLoggedIn={setIsLoggedIn} />
      <h2>Technician Page</h2>
      {error && <div className="error-message">{error}</div>}
      <div className="client-list">
        {clients.map((client) => (
          <div key={client._id} className={`client-card ${client.status === 'complete' ? 'complete-card' : ''}`} onClick={() => handleClientClick(client._id, client.status)}>
            <h4 className="client-name">{client.customerName}</h4>
            <p className="car-model">Model - {client.carModel}</p>
            <button
              className={`button-status ${client.status === 'complete' ? 'complete' : 'not-complete'}`}
              disabled
            >
              {client.status === 'complete' ? '' : ''}
            </button>
          </div>
        ))}
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default TechnicianPage;
