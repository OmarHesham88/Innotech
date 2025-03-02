import { Navigate, Outlet } from 'react-router-dom';

const isAuthenticated = () => {
  const token = localStorage.getItem('Token');
  return !!token;
};

const PublicRoute = () => {
  return isAuthenticated() ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoute;
