import { lazy } from 'react';
import { UserRole } from '../models/UserRole';
import DeactivateUser from '../pages/Users/DeactivateUser';
import ViewUserPage from '../pages/Users/ViewUser';

// ── Páginas compartidas ───────────────────────────────────────────────────────
const Profile = lazy(() => import('../pages/Profile'));
const Settings = lazy(() => import('../pages/Settings'));
const Calendar = lazy(() => import('../pages/Calendar'));

// ── Admin: Usuarios y Roles ───────────────────────────────────────────────────
const UserList = lazy(() => import('../pages/Users/ListUsers'));
const UserCreate = lazy(() => import('../pages/Users/Create'));
const UserUpdate = lazy(() => import('../pages/Users/Update'));
const RoleList = lazy(() => import('../pages/Roles/List'));
const StudyPlanDetail = lazy(() => import('../pages/PlanEstudios/StudyPlanDetailPage'));
const AdminStudyPlans = lazy(() => import('../pages/PlanEstudios/PlanEstudios'));
const EnrollStudentGroupPage = lazy(() => import('../pages/Inscripciones/EnrollStudentGroupPage'));
const AsignarDocente = lazy(() => import('../pages/Group/AsignarDocente'));

// ── Admin: Académico ──────────────────────────────────────────────────────────
const ListCarreras = lazy(() => import('../pages/careers/ListCarrers'));
const CreateCarrera = lazy(() => import('../pages/careers/CreateCareers'));
const EditCarrera = lazy(() => import('../pages/careers/EditCareer'));
const DetailCarrera = lazy(() => import('../pages/careers/DetailCareer'));
const ListSemestres = lazy(() => import('../pages/semester/ListSemester'));
const CreateSemestre = lazy(() => import('../pages/semester/CreateSemester'));
const EditSemestre = lazy(() => import('../pages/semester/EditSemester'));
const DetailSemestre = lazy(() => import('../pages/semester/DetailSemester'));
const SubjectDashboard = lazy(() => import('../pages/Subjects/SubjectDashboardPage'));
const CreateAsignatura = lazy(() => import('../pages/Subjects/CreaterSubject'));
const ListGrupos = lazy(() => import('../pages/Group/ListGroup'));
const CreateGrupo = lazy(() => import('../pages/Group/CreateGroup'));
const ListMatriculas = lazy(() => import('../pages/enrollment/ListEnrollment'));
const CreateMatricula = lazy(() => import('../pages/enrollment/CreateEnrollment'));
const ListInscripciones = lazy(() => import('../pages/inscripciones/ListInscripciones'));
const CreateInscripcion = lazy(() => import('../pages/inscripciones/CreateInscripcion'));
const EnrollStudentInGroup = lazy(() => import('../pages/enrollstudentingroup'));
const CreateStudyPlan = lazy(() => import('../pages/StudyPlan/CreateStudyPlan'));
const StudyPlanDashboard = lazy(() => import('../pages/StudyPlan/StudyPlanDashboardPage'));
const StudyPlanVersions = lazy(() => import('../pages/StudyPlan/VersionHistory'));
const PlanEstudios = lazy(() => import('../pages/PlanEstudios/PlanEstudios'));
const AcademicPage = lazy(() => import('../pages/Academic'));
const ListRegistrations = lazy(() => import('../pages/Registration/ListRegistration'));
const CreateRegistration = lazy(() => import('../pages/Registration/CreateRegistration'));

// ── Profesor ──────────────────────────────────────────────────────────────────
const RubricaCreate = lazy(() => import('../pages/Rubricas/Create'));
const MisRubricas = lazy(() => import('../pages/Rubricas/MisRubricas'));
const Evaluaciones = lazy(() => import('../pages/Evaluaciones/Index'));
const CrearEvaluacion = lazy(() => import('../pages/Evaluaciones/CrearEvaluacion'));
const AsociarRubrica = lazy(() => import('../pages/Evaluaciones/AsociarRubrica'));
const CalificarEstudiante = lazy(() => import('../pages/Evaluaciones/CalificarEstudiante'));
const MisAsignaturas = lazy(() => import('../pages/MisAsignaturas/MisAsignaturas'));
const MisEvaluaciones = lazy(() => import('../pages/MisEvaluaciones/MisEvaluaciones'));
const ConsultarRubrica = lazy(() => import('../pages/MisEvaluaciones/ConsultarRubrica'));
const MisNotas = lazy(() => import('../pages/MisNotas/MisNotas'));

// ── Profesor: Grupos ──────────────────────────────────────────────────────────
const MisGrupos = lazy(() => import('../pages/Group/MisGrupos'));
const DetalleGrupo = lazy(() => import('../pages/Group/DetalleGrupo'));

const ADMIN = [UserRole.ADMIN];
const TEACHER = [UserRole.TEACHER];
const STUDENT = [UserRole.STUDENT];
const ALL_ROLES = [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT];

const routes = [
  // ── Compartidas ─────────────────────────────────────────────────────────────
  {
    path: '/profile',
    title: 'Perfil',
    component: Profile,
    allowedRoles: ALL_ROLES,
  },
  {
    path: '/settings',
    title: 'Configuración',
    component: Settings,
    allowedRoles: ALL_ROLES,
  },

  // ── Admin: Usuarios y Roles ──────────────────────────────────────────────────
  {
    path: '/users/list',
    title: 'Usuarios',
    component: UserList,
    allowedRoles: ADMIN,
  },
  {
    path: '/users/create',
    title: 'Crear usuario',
    component: UserCreate,
    allowedRoles: ADMIN,
  },
  {
    path: '/users/update/:id',
    title: 'Editar usuario',
    component: UserUpdate,
    allowedRoles: ADMIN,
  },
  {
    path: '/users/deactivate/:id',
    title: 'Desactivar usuario',
    component: DeactivateUser,
    allowedRoles: ADMIN,
  },
  {
    path: '/users/view/:id',
    title: 'Ver usuario',
    component: ViewUserPage,
    allowedRoles: ADMIN,
  },
  {
    path: '/roles-list',
    title: 'Roles',
    component: RoleList,
    allowedRoles: ADMIN,
  },

  // ── Admin: Carreras ──────────────────────────────────────────────────────────
  {
    path: '/admin/carreras',
    title: 'Carreras',
    component: ListCarreras,
    allowedRoles: ADMIN,
  },
  {
    path: '/carreras/list',
    title: 'Carreras',
    component: ListCarreras,
    allowedRoles: ADMIN,
  },
  {
    path: '/carreras/create',
    title: 'Crear Carrera',
    component: CreateCarrera,
    allowedRoles: ADMIN,
  },
  {
    path: '/carreras/edit/:id',
    title: 'Editar Carrera',
    component: EditCarrera,
    allowedRoles: ADMIN,
  },
  {
    path: '/carreras/detail/:id',
    title: 'Detalle de Carrera',
    component: DetailCarrera,
    allowedRoles: ADMIN,
  },

  // ── Admin: Semestres ─────────────────────────────────────────────────────────
  {
    path: '/admin/semestres',
    title: 'Semestres',
    component: ListSemestres,
    allowedRoles: ADMIN,
  },
  {
    path: '/semestres/list',
    title: 'Semestres',
    component: ListSemestres,
    allowedRoles: ADMIN,
  },
  {
    path: '/semestres/create',
    title: 'Crear Semestre',
    component: CreateSemestre,
    allowedRoles: ADMIN,
  },
  {
    path: '/semestres/edit/:id',
    title: 'Editar Semestre',
    component: EditSemestre,
    allowedRoles: ADMIN,
  },
  {
    path: '/semestres/detail/:id',
    title: 'Detalle de Semestre',
    component: DetailSemestre,
    allowedRoles: ADMIN,
  },

  // ── Admin: Asignaturas ───────────────────────────────────────────────────────
  {
    path: '/admin/asignaturas',
    title: 'Asignaturas',
    component: SubjectDashboard,
    allowedRoles: ADMIN,
  },
  {
    path: '/asignaturas/list',
    title: 'Asignaturas',
    component: SubjectDashboard,
    allowedRoles: ADMIN,
  },
  {
    path: '/asignaturas/create',
    title: 'Crear Asignatura',
    component: CreateAsignatura,
    allowedRoles: ADMIN,
  },

  // ── Admin: Grupos ────────────────────────────────────────────────────────────
  {
    path: '/admin/grupos',
    title: 'Grupos',
    component: ListGrupos,
    allowedRoles: ADMIN,
  },
  {
    path: '/grupos/list',
    title: 'Grupos',
    component: ListGrupos,
    allowedRoles: ADMIN,
  },
  {
    path: '/grupos/create',
    title: 'Crear Grupo',
    component: CreateGrupo,
    allowedRoles: ADMIN,
  },
  {
  path: '/admin/groups/assign-teacher',
  title: 'Asignar Docente a Grupo',
  component: AsignarDocente,
  allowedRoles: ADMIN,
},

  // ── Admin: Matrículas ────────────────────────────────────────────────────────
  {
    path: '/admin/matriculas',
    title: 'Matrículas',
    component: ListMatriculas,
    allowedRoles: ADMIN,
  },
  {
    path: '/enrollments/list',
    title: 'Matrículas',
    component: ListMatriculas,
    allowedRoles: ADMIN,
  },
  {
    path: '/enrollments/create',
    title: 'Crear Matrícula',
    component: CreateMatricula,
    allowedRoles: ADMIN,
  },

  // ── Admin: Planes de Estudio ─────────────────────────────────────────────────
  {
    path: '/admin/plan-estudios',
    title: 'Plan de Estudios',
    component: StudyPlanDashboard,
    allowedRoles: ADMIN,
  },
  {
    path: '/plan-estudios',
    title: 'Plan de estudios',
    component: PlanEstudios,
    allowedRoles: ADMIN,
  },
  {
    path: '/study-plans/list',
    title: 'Planes de Estudio',
    component: StudyPlanDashboard,
    allowedRoles: ADMIN,
  },
  {
    path: '/study-plans/create',
    title: 'Crear Plan de Estudio',
    component: CreateStudyPlan,
    allowedRoles: ADMIN,
  },
  {
    path: '/study-plans/versions',
    title: 'Historial de versiones',
    component: StudyPlanVersions,
    allowedRoles: ADMIN,
  },
  {
  path: '/admin/study-plans',
  title: 'Planes de Estudio',
  component: AdminStudyPlans,
  allowedRoles: ADMIN,
},
{
  path: '/admin/study-plans/:id',
  title: 'Detalle del Plan',
  component: StudyPlanDetail,
  allowedRoles: ADMIN,
},
{
  path: '/admin/study-plans/edit/:id',
  title: 'Editar Plan',
  component: StudyPlanDetail,  // Ya importado arriba como StudyPlanDetail
  allowedRoles: ADMIN,
},

  // ── Admin: Inscripciones y Registros ─────────────────────────────────────────
  {
    path: '/inscripciones/list',
    title: 'Inscripciones',
    component: ListInscripciones,
    allowedRoles: ADMIN,
  },
  {
    path: '/inscripciones/create',
    title: 'Crear Inscripción',
    component: CreateInscripcion,
    allowedRoles: ADMIN,
  },
  {
    path: '/inscripciones/enroll-student-in-group',
    title: 'Inscribir estudiante en grupo',
    component: EnrollStudentInGroup,
    allowedRoles: ADMIN,
  },
  {
    path: '/registrations/list',
    title: 'Registros',
    component: ListRegistrations,
    allowedRoles: ADMIN,
  },
  {
    path: '/registrations/create',
    title: 'Crear Registro',
    component: CreateRegistration,
    allowedRoles: ADMIN,
  },
  {
  path: '/admin/enrollments/groups',
  title: 'Inscribir Estudiante en Grupo',
  component: EnrollStudentGroupPage,
  allowedRoles: ADMIN,
},

  // ── Admin: Académico (dashboard general) ─────────────────────────────────────
  {
    path: '/academic',
    title: 'Académico',
    component: AcademicPage,
    allowedRoles: ADMIN,
  },

  // ── Profesor ─────────────────────────────────────────────────────────────────
  {
    path: '/rubricas/create',
    title: 'Crear Rúbrica',
    component: RubricaCreate,
    allowedRoles: TEACHER,
  },
  {
    path: '/rubricas/mis-rubricas',
    title: 'Mis Rúbricas',
    component: MisRubricas,
    allowedRoles: TEACHER,
  },
  {
    path: '/evaluaciones',
    title: 'Evaluaciones',
    component: Evaluaciones,
    allowedRoles: TEACHER,
  },
  {
    path: '/evaluaciones/crear',
    title: 'Crear Evaluación',
    component: CrearEvaluacion,
    allowedRoles: TEACHER,
  },
  {
    path: '/evaluaciones/asociar-rubrica',
    title: 'Asociar Rúbrica',
    component: AsociarRubrica,
    allowedRoles: TEACHER,
  },
  {
    path: '/evaluaciones/:evaluationId/:groupId/calificar',
    title: 'Calificar Estudiante',
    component: CalificarEstudiante,
    allowedRoles: TEACHER,
  },
  {
    path: '/teacher/grupos',
    title: 'Mis grupos',
    component: MisGrupos,
    allowedRoles: TEACHER,
  },
  {
    path: '/teacher/grupos/detalle',
    title: 'Detalle del grupo',
    component: DetalleGrupo,
    allowedRoles: TEACHER,
  },
  // ── Profesor: Grupos ──────────────────────────────────────────────────────────
  {
    path: '/teacher/grupos',
    title: 'Mis grupos',
    component: MisGrupos,
    allowedRoles: TEACHER,
  },
  {
    path: '/teacher/grupos/detalle',
    title: 'Detalle del grupo',
    component: DetalleGrupo,
    allowedRoles: TEACHER,
  },

  // ── Estudiante ───────────────────────────────────────────────────────────────
  {
    path: '/calendar',
    title: 'Calendario',
    component: Calendar,
    allowedRoles: STUDENT,
  },
  {
    path: '/mis-asignaturas',
    title: 'Mis asignaturas',
    component: MisAsignaturas,
    allowedRoles: STUDENT,
  },
  {
    path: '/mis-evaluaciones',
    title: 'Mis evaluaciones',
    component: MisEvaluaciones,
    allowedRoles: STUDENT,
  },
  {
    path: '/mis-evaluaciones/:id/rubrica',
    title: 'Consultar rúbrica',
    component: ConsultarRubrica,
    allowedRoles: STUDENT,
  },
  {
    path: '/mis-notas',
    title: 'Mis notas',
    component: MisNotas,
    allowedRoles: STUDENT,
  },
];

export default routes;