import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Logo from '../images/logo/logo.svg';
import { RootState } from '../store/store';
import { UserRole } from '../models/UserRole';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;

  const user = useSelector((state: RootState) => state.user.user);
  const role = user?.role;

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  const renderMenu = () => {
    switch (role) {
      case UserRole.ADMIN:
        return <AdminMenu pathname={pathname} />;
      case UserRole.TEACHER:
        return <TeacherMenu pathname={pathname} />;
      case UserRole.STUDENT:
        return <StudentMenu pathname={pathname} />;
      default:
        return null;
    }
  };

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-60 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
    >
      {/* SIDEBAR HEADER */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <NavLink to="/">
          <img src={Logo} alt="Logo" />
        </NavLink>
        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg className="fill-current" width="20" height="18" viewBox="0 0 20 18" fill="none">
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          {renderMenu()}
        </nav>
      </div>
    </aside>
  );
};

/* ─────────────────────────── HELPER: clases de enlace activo ─────────────────────────── */
const linkClass = (pathname: string, match: string | ((p: string) => boolean)) => {
  const isActive = typeof match === 'function' ? match(pathname) : pathname.includes(match);
  return `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${isActive ? 'bg-graydark dark:bg-meta-4' : ''
    }`;
};

/* ─────────────────────────── ÍCONOS ─────────────────────────── */
const IcoHome = () => (
  <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M15.75 6.75L9 1.5L2.25 6.75V15.75H6.75V11.25H11.25V15.75H15.75V6.75Z" fill="" />
  </svg>
);
const IcoBook = () => (
  <svg className="fill-current" width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);
const IcoGrid = () => (
  <svg className="fill-current" width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
    <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
    <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
    <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);
const IcoCalendar = () => (
  <svg className="fill-current" width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
    <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const IcoUsers = () => (
  <svg className="fill-current" width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);
const IcoUser = () => (
  <svg className="fill-current" width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);
const IcoGraduate = () => (
  <svg className="fill-current" width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M6 12v5c0 2.21 2.686 4 6 4s6-1.79 6-4v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);
const IcoIdCard = () => (
  <svg className="fill-current" width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="8" cy="12" r="2" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M14 9h4M14 12h4M14 15h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const IcoBarChart = () => (
  <svg className="fill-current" width="18" height="18" viewBox="0 0 24 24" fill="none">
    <line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const IcoSettings = () => (
  <svg className="fill-current" width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);
const IcoDoc = () => (
  <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M3.25 2.75H14.75C15.4404 2.75 16 3.30964 16 4V14C16 14.6904 15.4404 15.25 14.75 15.25H3.25C2.55964 15.25 2 14.6904 2 14V4C2 3.30964 2.55964 2.75 3.25 2.75Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M5.5 6.5H12.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M5.5 9H9.75" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M5.5 11.5H11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
const IcoCheck = () => (
  <svg className="fill-current" width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);
const IcoLink = () => (
  <svg className="fill-current" width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);
const IcoNewFile = () => (
  <svg className="fill-current" width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <line x1="12" y1="18" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="9" y1="15" x2="15" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const IcoMyBooks = () => (
  <svg className="fill-current" width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);
const IcoProfile = () => (
  <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M9.0002 7.79065C11.0814 7.79065 12.7689 6.1594 12.7689 4.1344C12.7689 2.1094 11.0814 0.478149 9.0002 0.478149C6.91895 0.478149 5.23145 2.1094 5.23145 4.1344C5.23145 6.1594 6.91895 7.79065 9.0002 7.79065Z" fill="" />
    <path d="M10.8283 9.05627H7.17207C4.16269 9.05627 1.71582 11.5313 1.71582 14.5406V16.875C1.71582 17.2125 1.99707 17.5219 2.3627 17.5219C2.72832 17.5219 3.00957 17.2407 3.00957 16.875V14.5406C3.00957 12.2344 4.89394 10.3219 7.22832 10.3219H10.8564C13.1627 10.3219 15.0752 12.2063 15.0752 14.5406V16.875C15.0752 17.2125 15.3564 17.5219 15.7221 17.5219C16.0877 17.5219 16.3689 17.2407 16.3689 16.875V14.5406C16.2846 11.5313 13.8377 9.05627 10.8283 9.05627Z" fill="" />
  </svg>
);
const IcoChevronUp = () => (
  <svg className="fill-current" width="16" height="16" viewBox="0 0 24 24" fill="none">
    <polyline points="18 15 12 9 6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);
const IcoChevronDown = () => (
  <svg className="fill-current" width="16" height="16" viewBox="0 0 24 24" fill="none">
    <polyline points="6 9 12 15 18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

/* ───────────────────────────── MENÚ ADMINISTRADOR ───────────────────────────── */
const AdminMenu = ({ pathname }: { pathname: string }) => {
  const location = useLocation();
  const isCarrerasActive =
    location.pathname.startsWith('/admin/carreras') || location.pathname.startsWith('/carreras');
  const isGruposActive =
    location.pathname.startsWith('/admin/grupos') || location.pathname.startsWith('/grupos');
  const isMatriculasActive =
    location.pathname.startsWith('/admin/matriculas') ||
    location.pathname.startsWith('/enrollments') ||
    location.pathname.startsWith('/inscripciones');

  const [isCarrerasOpen, setIsCarrerasOpen] = useState<boolean>(isCarrerasActive);
  const [isGruposOpen, setIsGruposOpen] = useState<boolean>(isGruposActive);
  const [isMatriculasOpen, setIsMatriculasOpen] = useState<boolean>(isMatriculasActive);

  return (
    <>
      <div>
        <ul className="mb-6 flex flex-col gap-1.5">
          <li>
            <NavLink to="/" className={linkClass(pathname, (p) => p === '/')}>
              <IcoHome />
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/users/list" className={linkClass(pathname, '/users/list')}>
              <IcoUsers />
              Usuarios
            </NavLink>
          </li>
{/* ── Carreras (submenú) ───────────────────────────────────────── */}
<li>
  <button
    onClick={() => setIsCarrerasOpen((prev) => !prev)}
    className={`group relative flex w-full items-center justify-between gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
      isCarrerasActive || isCarrerasOpen ? 'bg-graydark dark:bg-meta-4' : ''
    }`}
  >
    <span className="flex items-center gap-2.5">
      <IcoBook />
      Carreras
    </span>
    {isCarrerasOpen ? <IcoChevronUp /> : <IcoChevronDown />}
  </button>

  {isCarrerasOpen && (
    <ul className="mt-1 ml-4 flex flex-col gap-1 border-l border-graydark pl-3">
      <li>
        <NavLink
          to="/admin/carreras"
          className={({ isActive }) =>
            `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
              isActive ? 'bg-graydark text-white dark:bg-meta-4' : 'text-bodydark1'
            }`
          }
        >
          Ver carreras
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/carreras/create"
          className={({ isActive }) =>
            `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
              isActive ? 'bg-graydark text-white dark:bg-meta-4' : 'text-bodydark1'
            }`
          }
        >
          Crear carrera
        </NavLink>
      </li>
    </ul>
  )}
</li>
          <li>
            <NavLink to="/admin/semestres" className={linkClass(pathname, '/admin/semestres')}>
              <IcoCalendar />
              Semestres
            </NavLink>
          </li>
          <li>
            <NavLink to="/plan-estudios" className={linkClass(pathname, '/study-plans')}>
              <IcoBook />
              Planes de estudio
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/asignaturas" className={linkClass(pathname, '/admin/asignaturas')}>
              <IcoBook />
              Asignaturas
            </NavLink>
          </li>

          {/* ── Grupos (submenú) ─────────────────────────────────────────── */}
          <li>
            <button
              onClick={() => setIsGruposOpen((prev) => !prev)}
              className={`group relative flex w-full items-center justify-between gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                isGruposActive || isGruposOpen ? 'bg-graydark dark:bg-meta-4' : ''
              }`}
            >
              <span className="flex items-center gap-2.5">
                <IcoGrid />
                Grupos
              </span>
              {isGruposOpen ? <IcoChevronUp /> : <IcoChevronDown />}
            </button>

            {isGruposOpen && (
              <ul className="mt-1 ml-4 flex flex-col gap-1 border-l border-graydark pl-3">
                <li>
                  <NavLink
                    to="/grupos/create"
                    className={({ isActive }) =>
                      `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                        isActive ? 'bg-graydark text-white dark:bg-meta-4' : 'text-bodydark1'
                      }`
                    }
                  >
                    Crear grupo
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/groups/assign-teacher"
                    className={({ isActive }) =>
                      `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                        isActive ? 'bg-graydark text-white dark:bg-meta-4' : 'text-bodydark1'
                      }`
                    }
                  >
                    Asignar docente
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/admin/enrollments/groups"
                    className={({ isActive }) =>
                      `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                        isActive ? 'bg-graydark text-white dark:bg-meta-4' : 'text-bodydark1'
                      }`
                    }
                  >
                    Inscribir estudiantes
                  </NavLink>
                </li>
              </ul>
            )}
          </li>

          {/* ── Matrículas (submenú) ─────────────────────────────────────── */}
          <li>
            <button
              onClick={() => setIsMatriculasOpen((prev) => !prev)}
              className={`group relative flex w-full items-center justify-between gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                isMatriculasActive || isMatriculasOpen ? 'bg-graydark dark:bg-meta-4' : ''
              }`}
            >
              <span className="flex items-center gap-2.5">
                <IcoIdCard />
                Matrículas
              </span>
              {isMatriculasOpen ? <IcoChevronUp /> : <IcoChevronDown />}
            </button>

            {isMatriculasOpen && (
              <ul className="mt-1 ml-4 flex flex-col gap-1 border-l border-graydark pl-3">
                <li>
                  <NavLink
                    to="/enrollments/create"
                    className={({ isActive }) =>
                      `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                        isActive ? 'bg-graydark text-white dark:bg-meta-4' : 'text-bodydark1'
                      }`
                    }
                  >
                    Matricular carrera
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/inscripciones/create"
                    className={({ isActive }) =>
                      `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                        isActive ? 'bg-graydark text-white dark:bg-meta-4' : 'text-bodydark1'
                      }`
                    }
                  >
                    Inscribir en grupo
                  </NavLink>
                </li>
              </ul>
            )}
          </li>

          <li>
            <NavLink to="/admin/reportes" className={linkClass(pathname, '/admin/reportes')}>
              <IcoBarChart />
              Reportes
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  );
};

/* ───────────────────────────── MENÚ DOCENTE ───────────────────────────── */
const TeacherMenu = ({ pathname }: { pathname: string }) => {
  const location = useLocation();
  const isGruposActive = location.pathname.startsWith('/teacher/grupos');
  const [isGruposOpen, setIsGruposOpen] = useState<boolean>(false);

  return (
    <>
      <div>
        <ul className="mb-6 flex flex-col gap-1.5">
          <li>
            <NavLink to="/" className={linkClass(pathname, (p) => p === '/')}>
              <IcoHome />
              Inicio
            </NavLink>
          </li>
        </ul>
      </div>

      <div>
        <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">MI CLASE</h3>
        <ul className="mb-6 flex flex-col gap-1.5">

          {/* ── Botón "Grupos" con toggle desplegable ─────────────────────── */}
          <li>
            <button
              onClick={() => setIsGruposOpen((prev) => !prev)}
              className={`group relative flex w-full items-center justify-between gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${isGruposActive || isGruposOpen ? 'bg-graydark dark:bg-meta-4' : ''
                }`}
            >
              <span className="flex items-center gap-2.5">
                <IcoGrid />
                Grupos
              </span>
              {isGruposOpen ? (
                <IcoChevronUp />
              ) : (
                <IcoChevronDown />
              )}
            </button>

            {/* Submenú colapsable */}
            {isGruposOpen && (
              <ul className="mt-1 ml-4 flex flex-col gap-1 border-l border-graydark pl-3">
                <li>
                  <NavLink
                    to="/teacher/grupos"
                    end
                    className={({ isActive }) =>
                      `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${isActive
                        ? 'bg-graydark text-white dark:bg-meta-4'
                        : 'text-bodydark1'
                      }`
                    }
                  >
                    Mis grupos
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/teacher/grupos/detalle"
                    className={({ isActive }) =>
                      `group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${isActive
                        ? 'bg-graydark text-white dark:bg-meta-4'
                        : 'text-bodydark1'
                      }`
                    }
                  >
                    Detalle del grupo
                  </NavLink>
                </li>
              </ul>
            )}
          </li>
          {/* ── FIN botón "Grupos" ─────────────────────────────────────────── */}

          <li>
            <NavLink to="/users/list" className={linkClass(pathname, '/users')}>
              <IcoUser />
              Estudiantes
            </NavLink>
          </li>
          <li>
            <NavLink to="/evaluaciones" className={linkClass(pathname, (p) => p === '/evaluaciones')}>
              <IcoDoc />
              Evaluaciones
            </NavLink>
          </li>
          <li>
            <NavLink to="/calificaciones" className={linkClass(pathname, '/calificaciones')}>
              <IcoCheck />
              Calificaciones
            </NavLink>
          </li>
        </ul>
      </div>

      {/* ── El resto de las secciones queda exactamente igual ── */}
      <div>
        <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">RUBRICAS</h3>
        <ul className="mb-6 flex flex-col gap-1.5">
          <li>
            <NavLink to="/rubricas/create" className={linkClass(pathname, (p) => p === '/rubricas/create')}>
              <IcoNewFile />
              Nueva rúbrica
            </NavLink>
          </li>
          <li>
            <NavLink to="/rubricas/mis-rubricas" className={linkClass(pathname, '/mis-rubricas')}>
              <IcoMyBooks />
              Mis rúbricas
            </NavLink>
          </li>
          <li>
            <NavLink to="/evaluaciones/asociar-rubrica" className={linkClass(pathname, '/asociar-rubrica')}>
              <IcoLink />
              Asociar a evaluación
            </NavLink>
          </li>
        </ul>
      </div>

      <div>
        <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">EVALUACIONES</h3>
        <ul className="mb-6 flex flex-col gap-1.5">
          <li>
            <NavLink to="/evaluaciones" className={linkClass(pathname, (p) => p === '/evaluaciones')}>
              <IcoDoc />
              Calificar
            </NavLink>
          </li>
        </ul>
      </div>

      <div>
        <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">RECURSOS</h3>
        <ul className="mb-6 flex flex-col gap-1.5">
          <li>
            <NavLink to="/escalas" className={linkClass(pathname, '/escalas')}>
              <IcoBarChart />
              Escalas
            </NavLink>
          </li>
          <li>
            <NavLink to="/biblioteca" className={linkClass(pathname, '/biblioteca')}>
              <IcoMyBooks />
              Biblioteca
            </NavLink>
          </li>
        </ul>
      </div>

      <div>
        <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">CONFIGURACIÓN</h3>
        <ul className="mb-6 flex flex-col gap-1.5">
          <li>
            <NavLink to="/profile" className={linkClass(pathname, '/profile')}>
              <IcoProfile />
              Perfil
            </NavLink>
          </li>
          <li>
            <NavLink to="/settings" className={linkClass(pathname, '/settings')}>
              <IcoSettings />
              Preferencias
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  );
};
/* ───────────────────────────── MENÚ ESTUDIANTE ───────────────────────────── */
const StudentMenu = ({ pathname }: { pathname: string }) => (
  <>
    <div>
      <ul className="mb-6 flex flex-col gap-1.5">
        <li>
          <NavLink to="/" className={linkClass(pathname, (p) => p === '/')}>
            <IcoHome />
            Inicio
          </NavLink>
        </li>
      </ul>
    </div>

    <div>
      <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">MI ESPACIO</h3>
      <ul className="mb-6 flex flex-col gap-1.5">
        <li>
          <NavLink to="/mis-asignaturas" className={linkClass(pathname, '/mis-asignaturas')}>
            <IcoBook />
            Mis asignaturas
          </NavLink>
        </li>
        <li>
          <NavLink to="/mis-evaluaciones" className={linkClass(pathname, '/mis-evaluaciones')}>
            <IcoDoc />
            Mis evaluaciones
          </NavLink>
        </li>
        <li>
          <NavLink to="/mis-notas" className={linkClass(pathname, '/mis-notas')}>
            <IcoCheck />
            Mis notas
          </NavLink>
        </li>
        <li>
          <NavLink to="/calendar" className={linkClass(pathname, '/calendar')}>
            <IcoCalendar />
            Calendario
          </NavLink>
        </li>
      </ul>
    </div>

    <div>
      <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">RECURSOS</h3>
      <ul className="mb-6 flex flex-col gap-1.5">
        <li>
          <NavLink to="/mis-evaluaciones" className={linkClass(pathname, '/mis-evaluaciones')}>
            <IcoDoc />
            Rubricas
          </NavLink>
        </li>
        <li>
          <NavLink to="/material-apoyo" className={linkClass(pathname, '/material-apoyo')}>
            <IcoMyBooks />
            Material de apoyo
          </NavLink>
        </li>
      </ul>
    </div>
  </>
);

export default Sidebar;