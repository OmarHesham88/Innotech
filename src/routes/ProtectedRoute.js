import { Navigate, Outlet } from 'react-router-dom';
const ProtectedRoute = () => {
  const isAuthenticated = () => {
    const token = localStorage.getItem('Token');
    return !!token; 
  };
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
