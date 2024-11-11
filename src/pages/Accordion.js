import React, { useEffect, useState } from 'react';
import './Accordion.css';
import axios from 'axios';

function Accordion({ title, clientData, keys, setClientData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [types, setTypes] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [notesValues, setNotesValues] = useState({});

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/types`);
        setTypes(data);
      } catch (err) {
        console.error('Error fetching types', err);
      }
    };
    fetchTypes();
  }, []);

  const handleFileChange = (e, typeId) => {
    const files = Array.from(e.target.files);
    const fileNames = files.map(file => file.name);

    setUploadedFiles((prevState) => ({
      ...prevState,
      [typeId]: files,
    }));

    setClientData({
      ...clientData,
      [keys]: {
        ...clientData[keys],
        media: fileNames,
      },
    });
  };


  const handleNotesChange = (e, typeId) => {
    const newNotes = e.target.value;

    setNotesValues((prevState) => ({
      ...prevState,
      [typeId]: newNotes,
    }));

    setClientData({
      ...clientData,
      [keys]: {
        ...clientData[keys],
        notes: newNotes,
      },
    });
  };

  const handleStatusChange = (typeId, status) => {
    setSelectedStatus((prevState) => ({
      ...prevState,
      [typeId]: status,
    }));

    setClientData({
      ...clientData,
      [keys]: {
        ...clientData[keys],
        stage: status,
      },
    });
  };

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };


  const filteredTypes = types.filter((type) => type.category === title);
  const handleSelectChange = (e, typeId) => {
    const selectedOption = e.target.value;
    let status, note;

    if (selectedOption.includes("right")) {
      status = 'right';
      note = `${selectedOption.split('-')[1]}`;
    } else if (selectedOption.includes("cross")) {
      status = 'cross';
      note = `${selectedOption.split('-')[1]}`;
    } else if (selectedOption.includes("exclamation")) {
      status = 'exclamation';
      note = `${selectedOption.split('-')[1]}`;
    }

    handleStatusChange(typeId, status);
    handleNotesChange({ target: { value: note } }, typeId);
  };

  return (
    <div className="accordion-container">
      <div className="accordion-header" onClick={toggleAccordion}>
        <h3>{title}</h3>
        <span>{isOpen ? '-' : '+'}</span>
      </div>
      {isOpen && (
        <div className="accordion-content">
          {filteredTypes.length > 0 ? (
            filteredTypes.map((type) => (
              <div key={type._id} className="type-item">
                <div className="title-container">
                  <h4>{type.name}</h4>
                  <div className="status-buttons">
                    <button
                      className={`status-button ${selectedStatus[type._id] === 'right' ? 'selected' : ''}`}
                      onClick={() => handleStatusChange(type._id, 'right')}
                    >
                      ✅
                    </button>
                    <button
                      className={`status-button ${selectedStatus[type._id] === 'cross' ? 'selected' : ''}`}
                      onClick={() => handleStatusChange(type._id, 'cross')}
                    >
                      ❌
                    </button>
                    <button
                      className={`status-button ${selectedStatus[type._id] === 'exclamation' ? 'selected' : ''}`}
                      onClick={() => handleStatusChange(type._id, 'exclamation')}
                    >
                      ⚠️
                    </button>
                  </div>
                </div>
                <select
                  onChange={(e) => handleSelectChange(e, type._id)}
                  defaultValue=""
                >
                  <option value="" disabled>Select Status</option>
                  <option value={`cross-bad`}>bad</option>
                  <option value={`cross-very bad`}>very bad</option>
                  <option value={`right-good`}>good</option>
                  <option value={`right-almost good`}>almost good</option>
                  <option value={`exclamation-critical`}>critical</option>
                  <option value={`exclamation-too critical`}>too critical</option>
                </select>

                <textarea
                  className="notes-input"
                  value={notesValues[type._id] || ""}
                  placeholder="Add your notes here..."
                  onChange={(e) => handleNotesChange(e, type._id)}
                />
                <input
                  type="file"
                  multiple
                  className="file-upload"
                  onChange={(e) => handleFileChange(e, type._id)}
                />

                {uploadedFiles[type._id] && (
                  <div className="uploaded-files">
                    <h5>Uploaded Files:</h5>
                    <ul>
                      {uploadedFiles[type._id].map((file, index) => (
                        <li key={index}>
                          {file.type.startsWith('image/') ? (
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Uploaded ${file.name}`}
                              width="100"
                            />
                          ) : file.type.startsWith('video/') ? (
                            <video width="150" controls>
                              <source src={URL.createObjectURL(file)} type={file.type} />
                              Your browser does not support the video tag.
                            </video>
                          ) : (
                            <span>{file.name}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <br />
                <hr />
                <br />
              </div>
            ))
          ) : (
            <p>No items found for this category.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Accordion;
