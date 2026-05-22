//este archivo y carpeta es temporal, para manejar el cambio de vista entre profesor y estudiante
//  en la sección de calificaciones. Se puede eliminar una vez que se implemente la lógica de roles 
// en toda la aplicación.
import { createContext, useContext, useState, ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { UserRole } from '../models/UserRole';

type ViewRole = 'TEACHER' | 'STUDENT';

interface RoleContextType {
  viewRole: ViewRole;
  toggleViewRole: () => void;
}

const RoleContext = createContext<RoleContextType>({
  viewRole: 'TEACHER',
  toggleViewRole: () => {},
});

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const user = useSelector((state: RootState) => state.user.user);

  const getInitialRole = (): ViewRole => {
    const stored = localStorage.getItem('view-role') as ViewRole | null;
    if (stored === 'TEACHER' || stored === 'STUDENT') return stored;
    return user?.role === UserRole.STUDENT ? 'STUDENT' : 'TEACHER';
  };

  const [viewRole, setViewRole] = useState<ViewRole>(getInitialRole);

  const toggleViewRole = () => {
    setViewRole((prev) => {
      const next: ViewRole = prev === 'TEACHER' ? 'STUDENT' : 'TEACHER';
      localStorage.setItem('view-role', next);
      return next;
    });
  };

  return (
    <RoleContext.Provider value={{ viewRole, toggleViewRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useViewRole = () => useContext(RoleContext);