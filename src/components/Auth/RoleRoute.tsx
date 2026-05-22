import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { UserRole } from '../../models/UserRole';

interface RoleRouteProps {
  allowedRoles: UserRole[];
}

const HOME_BY_ROLE: Record<UserRole, string> = {
  [UserRole.ADMIN]:   '/',
  [UserRole.TEACHER]: '/',
  [UserRole.STUDENT]: '/',
};

const RoleRoute = ({ allowedRoles }: RoleRouteProps) => {
  const user = useSelector((state: RootState) => state.user.user);

  if (!user) {
    return <Navigate to="/auth/signin" replace />;
  }

  if (!user.role || !allowedRoles.includes(user.role)) {
    const fallback = user.role ? HOME_BY_ROLE[user.role] : '/';
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
};

export default RoleRoute;