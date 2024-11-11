import { Navigate, Outlet, navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoutes = () => {
    const token = localStorage.getItem('token');
    let isAuthenticated = false;

    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            if (decodedToken.exp > currentTime) {
                isAuthenticated = true;
            } else {
                localStorage.removeItem('jwtToken');
                isAuthenticated = false;
            }
        } catch (error) {
            console.error("Error decoding JWT token", error);
            isAuthenticated = false;
        }
    }
    return isAuthenticated ? <Outlet /> : <Navigate to="/" />
}
export default ProtectedRoutes;