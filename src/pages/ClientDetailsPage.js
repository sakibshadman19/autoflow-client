import React, { useEffect, useState } from 'react';
import Accordion from './Accordion';
import './ClientDetailsPage.css';
import axios from 'axios';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Logout from '../components/Logout';


function ClientDetailsPage({ setIsLoggedIn }) {
  const [selectedStatus, setSelectedStatus] = useState({});
  const [clientData, setClientData] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/clients/${id}`);
        setClientData(response.data);
      } catch (err) {
        console.error(err);
        setError('something went wrong');
      }
    };
    fetchClientData();
  }, [id]);

  const handleStatusChange = (accordionId, status) => {
    setSelectedStatus({ ...selectedStatus, [accordionId]: status });
  };

  const clearMessages = () => {
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };

  const handleComplete = async () => {
    try {
      setIsLoading(true);
      const response = await axios.put(`${process.env.REACT_APP_SERVER_URL}/api/clients/save`, {
        clientId: clientData._id,
        alignmentSteeringSuspension: clientData.alignmentSteeringSuspension,
        fluids: clientData.fluids,
        generalServiceItems: clientData.generalServiceItems,
        status: "complete",
        vehiclePictures: clientData.vehiclePictures,
      });
      setError('');
      setSuccessMessage('Inspection completed successfully!');
      clearMessages();
      setIsLoading(false);
      navigate('/technician');
    } catch (err) {
      console.error('Error saving data:', err);
      setIsLoading(true);
      setError('something went wrong');
    }
  };

  if (!clientData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="client-details-container">
      <Logout setIsLoggedIn={setIsLoggedIn} />
      <h2>Client Inspection</h2>
      <Accordion
        title="Vehicle Pictures"
        keys="vehiclePictures"
        clientData={clientData}
        setClientData={setClientData}
        onStatusChange={(status) => handleStatusChange('vehicle-pictures', status)}
      />
      <Accordion
        title="General Service Items"
        keys="generalServiceItems"
        clientData={clientData}
        setClientData={setClientData}
        onStatusChange={(status) => handleStatusChange('general-service-items', status)}
      />
      <Accordion
        title="Fluids"
        keys="fluids"
        clientData={clientData}
        setClientData={setClientData}
        onStatusChange={(status) => handleStatusChange('fluids', status)}
      />
      <Accordion
        title="Alignment / Steering / Suspension"
        keys="alignmentSteeringSuspension"
        clientData={clientData}
        setClientData={setClientData}
        onStatusChange={(status) => handleStatusChange('alignment', status)}
      />
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      <button onClick={handleComplete} className="complete-button"> {isLoading ? (
            <div className="loader"></div>
          ) : (
            'Click Here to Complete Inspection'
          )}</button>
    </div>
  );
}

export default ClientDetailsPage;
