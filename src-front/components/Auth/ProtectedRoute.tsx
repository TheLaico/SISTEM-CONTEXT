import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const ProtectedRoute = () => {
  const user = useSelector((state: RootState) => state.user.user);
  return user ? <Outlet /> : <Navigate to="/auth/signin" replace />;
};

export default ProtectedRoute;