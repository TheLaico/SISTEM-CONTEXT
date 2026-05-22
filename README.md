
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ARQUITECTURA EN CAPAS — ORDEN OBLIGATORIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Page / Component  →  Hook  →  Business  →  Service  →  Interceptor  →  API

1. PAGE / COMPONENT  (src/pages/**, src/components/**)
   - Solo renderiza JSX y maneja eventos de usuario (onClick, onChange).
   - Llama al hook correspondiente para obtener estado y handlers.
   - NO hace llamadas a servicios directamente.
   - NO contiene lógica de negocio ni validaciones complejas.
   - NO usa localStorage, Redux ni el interceptor directamente.
   - El estado local permitido es únicamente el de UI pura
     (ej: isModalOpen, activeTab).

2. HOOK  (src/hooks/use*.ts)
   - Maneja todo el estado de la feature (useState, useEffect, useMemo).
   - Llama a funciones del Business para validar y construir payloads.
   - Llama a funciones del Service para persistir o leer datos.
   - Maneja errores y mensajes de feedback (toast, setError).
   - NO contiene lógica de negocio (cálculos, validaciones, transformaciones).
   - NO llama al interceptor ni a axios/fetch directamente.

3. BUSINESS  (src/business/**Business.ts)
   - Contiene toda la lógica de negocio pura (sin efectos secundarios).
   - Valida formularios y retorna string | null (null = válido).
   - Construye payloads para enviar al backend.
   - Transforma y mapea datos para la vista (ej: mapUsersToTableRows).
   - Realiza cálculos derivados (ej: calcularTotalPeso, calcularPuntaje).
   - Puede llamar a funciones de Service cuando necesita orquestar
     múltiples llamadas API en secuencia
     (ej: crear rúbrica → criterios → escalas).
   - NO conoce React, hooks, ni el DOM.
   - Exporta una instancia singleton
     (ej: export const userBusiness = new UserBusiness())
     o funciones puras nombradas con verbos claros.

4. SERVICE  (src/services/**Service.ts)
   - Solo se comunica con el backend.
   - SIEMPRE usa la instancia `api` del interceptor:
       import { api } from '../interceptors/authInterceptor';
   - NUNCA usa fetch() nativo, axios directamente, ni construye
     headers manualmente con localStorage.getItem('token').
     (Los servicios actuales como rubricaService.ts y calificacionService.ts
     usan fetch() directamente — esto es deuda técnica que debe corregirse
     en cuanto se toque un servicio.)
   - Cada método extrae y retorna `response.data.data` del ApiResponse<T>.
   - Lanza errores (throw) en lugar de retornar null silenciosamente,
     para que el hook pueda capturarlos y mostrar feedback al usuario.
     Excepción: métodos que por diseño pueden no encontrar un recurso
     pueden retornar null (ej: getUserById).
   - NO contiene lógica de negocio ni validaciones.

5. INTERCEPTOR  (src/interceptors/authInterceptor.ts)
   - No se modifica salvo para cambios de autenticación globales.
   - Es el único lugar donde se inyecta el token en los headers.
   - Maneja globalmente el 401 (redirige a /auth/signin) y el 403.
   - Exporta `api` como instancia única de uso en todos los servicios.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ESTADO GLOBAL — REDUX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- El usuario autenticado vive únicamente en Redux (src/store/userSlice.ts).
- Para leer el usuario en cualquier componente o hook:
    const user = useSelector((state: RootState) => state.user.user);
- NUNCA leer el usuario desde localStorage directamente en componentes,
  hooks ni páginas. Solo authService y el store pueden tocarlo.
- ProtectedRoute y RoleRoute leen el rol desde Redux, no desde localStorage.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RUTAS Y PROTECCIÓN DE ACCESO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Toda ruta en src/routes/index.ts DEBE tener allowedRoles definido.
  Ninguna ruta queda sin restricción de rol.
- Los roles disponibles son: UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT.
- Usa las constantes del archivo de rutas:
    const ADMIN           = [UserRole.ADMIN];
    const TEACHER         = [UserRole.TEACHER];
    const STUDENT         = [UserRole.STUDENT];
    const TEACHER_STUDENT = [UserRole.TEACHER, UserRole.STUDENT];
    const ALL_ROLES       = [UserRole.ADMIN, UserRole.TEACHER, UserRole.STUDENT];
- El sidebar muestra solo los enlaces del rol del usuario autenticado.
  El componente Sidebar lee el rol desde Redux y renderiza
  AdminMenu | TeacherMenu | StudentMenu según corresponda.
- Las páginas de desarrollo o de prueba (Demo, ImageEditor, etc.)
  no se registran en routes/index.ts del proyecto productivo.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MODELOS Y TIPOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Los modelos de dominio van en src/models/ y reflejan exactamente las
  entidades del backend (User, Teacher, Student, Career, Semester,
  Subject, StudyPlan, Group, Registration, Enrollment, Rubric,
  Criterion, Scale, Evaluation, Grade, GradeDetail).
  Son interfaces de solo datos, sin lógica.
- Los tipos auxiliares de formularios y payloads van en src/types/
  (ej: rubrica.ts con RubricCreatePayload, GradePayload, etc.).
- Los tipos de filas de tabla o de vista (ej: UserTableRow) van en el
  Business correspondiente, junto a la lógica que los construye.
- NO duplicar tipos: si ya existe en models/ no se redefine en types/.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MANEJO DE ERRORES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Los servicios lanzan errores con throw, no los silencian con
  console.error y return null (excepto cuando null es un valor de
  negocio válido).
- Los hooks capturan los errores con try/catch y los exponen como
  estado (setError) o como feedback de UI (toast.error).
- Los componentes y páginas NO tienen try/catch propios; delegan al hook.
- El mensaje de error siempre se extrae así:
    const message = err instanceof Error ? err.message : 'Mensaje genérico';
- El backend retorna errores como { "message": "..." }; el interceptor
  ya convierte el error HTTP en un Error de JS con ese mensaje.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STORAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- NUNCA usar localStorage.getItem / setItem directamente en el código.
- Siempre usar LocalStorageProvider (src/storage/LocalStorageProvider.ts)
  que implementa StorageProvider.
- Solo authService y el interceptor acceden al storage para tokens.
- El resto del código lee el usuario desde Redux.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONVENCIONES DE CÓDIGO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Nombres de archivos:
    Páginas y componentes: PascalCase  (ej: ListUsers.tsx)
    Hooks:                 camelCase con prefijo use  (ej: useRubricaForm.ts)
    Business:              PascalCase con sufijo Business  (ej: RubricaBusiness.ts)
    Services:              camelCase con sufijo Service  (ej: rubricaService.ts)
    Modelos:               PascalCase  (ej: Rubric.ts)
    Tipos:                 camelCase  (ej: rubrica.ts)

- Cada feature nueva sigue esta estructura mínima:
    src/pages/FeatureName/           → página(s)
    src/hooks/useFeatureName.ts      → hook
    src/business/FeatureBusiness.ts  (si hay lógica de negocio)
    src/services/featureService.ts
    src/models/Feature.ts            (si hay modelo nuevo)

- Los console.log de depuración se eliminan antes de hacer commit.
  Solo se permite console.error en los servicios para errores
  no esperados, y console.warn en el interceptor para el 403.

- No se crean contextos de React (Context API) para manejar estado
  global de la aplicación. Redux es la única fuente de verdad global.
  La excepción son contextos puramente de UI (ej: tema oscuro/claro).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEUDA TÉCNICA CONOCIDA (corregir al tocar esos archivos)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Los siguientes archivos incumplen las reglas actuales. Al modificarlos,
migrarlos al estándar:

  - rubricaService.ts      → usa fetch() + localStorage en lugar de `api`
  - evaluacionService.ts   → usa fetch() + localStorage en lugar de `api`
  - calificacionService.ts → usa fetch() + localStorage en lugar de `api`
  - userService.ts         → usa axios directamente sin el interceptor;
                             silencia errores con return null en lugar de throw
  - securityService.ts     → mezcla responsabilidades; el login debe pasar
                             por authService usando `api`