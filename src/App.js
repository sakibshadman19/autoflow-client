// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;



import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import TechnicianPage from './pages/TechnicianPage';
import LoginPage from './pages/LoginPage';
import ClientDetailsPage from './pages/ClientDetailsPage';
import ProtectedRoutes from './utils/ProtectedRoutes';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />}
        />
        <Route element={<ProtectedRoutes />}>
          <Route path="/admin" element={<AdminPage setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/technician" element={<TechnicianPage setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/client/:id" element={<ClientDetailsPage setIsLoggedIn={setIsLoggedIn} />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
