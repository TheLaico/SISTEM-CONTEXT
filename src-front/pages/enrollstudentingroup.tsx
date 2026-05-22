import { useMemo, useState } from 'react';
import { useEnrollStudentInGroup } from '../hooks/useEnrollStudentInGroup';
import { Group } from '../models/Group';

const EnrollStudentInGroup = () => {
  const { state, searchResults, actions, derived } = useEnrollStudentInGroup();

  const [searchQuery, setSearchQuery] = useState('');
  const [studentPage, setStudentPage] = useState(1);
  const [groupSearch, setGroupSearch] = useState('');
  const [programFilter, setProgramFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [groupPage, setGroupPage] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [selectedWarningGroup, setSelectedWarningGroup] = useState<Group | null>(null);
  const [dontShowWarningAgain, setDontShowWarningAgain] = useState(false);
  const [dismissedWarnings, setDismissedWarnings] = useState<Set<string>>(new Set());
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [toastDismissed, setToastDismissed] = useState<Set<number>>(new Set());

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setStudentPage(1);
    if (query.length > 2) {
      await actions.searchStudents(query);
    }
  };

  const studentsPerPage = 5;
  const totalStudentPages = Math.max(1, Math.ceil(searchResults.length / studentsPerPage));
  const displayedStudents = useMemo(
    () => searchResults.slice((studentPage - 1) * studentsPerPage, studentPage * studentsPerPage),
    [searchResults, studentPage]
  );

  const filteredGroupRows = useMemo(() => {
    const query = groupSearch.toLowerCase().trim();
    return derived.groupTableRows.filter((row) => {
      const matchesSearch =
        query === '' ||
        row.groupCode.toLowerCase().includes(query) ||
        row.subjectName.toLowerCase().includes(query) ||
        row.subjectCode.toLowerCase().includes(query) ||
        row.teacherName.toLowerCase().includes(query) ||
        row.careerName.toLowerCase().includes(query);
      const matchesProgram = programFilter === 'all' || row.careerName === programFilter;
      const matchesSubject = subjectFilter === 'all' || row.subjectName === subjectFilter;
      return matchesSearch && matchesProgram && matchesSubject;
    });
  }, [derived.groupTableRows, groupSearch, programFilter, subjectFilter]);

  const groupsPerPage = 5;
  const totalGroupPages = Math.max(1, Math.ceil(filteredGroupRows.length / groupsPerPage));
  const displayedGroupRows = useMemo(
    () => filteredGroupRows.slice((groupPage - 1) * groupsPerPage, groupPage * groupsPerPage),
    [filteredGroupRows, groupPage]
  );

  const studentName = `${state.selectedStudent?.first_name || state.selectedStudent?.user?.profile?.first_name || ''} ${state.selectedStudent?.last_name || state.selectedStudent?.user?.profile?.last_name || ''}`.trim();
  const remainingCredits = Math.max(0, 20 - (derived.enrollmentSummary?.totalCredits || 0));
  const studentStart = searchResults.length > 0 ? (studentPage - 1) * studentsPerPage + 1 : 0;
  const studentEnd = Math.min(studentPage * studentsPerPage, searchResults.length);
  const groupStart = filteredGroupRows.length > 0 ? (groupPage - 1) * groupsPerPage + 1 : 0;
  const groupEnd = Math.min(groupPage * groupsPerPage, filteredGroupRows.length);
  const currentCareerName = state.studentRegistration?.career?.name || 'Ingeniería de Sistemas';

  const handleSelectStudent = async (student: any) => {
    await actions.selectStudent(student);
  };

  const handleToggleGroup = (group: Group) => {
    const subjectNotInPlan =
      group.subject_id &&
      state.studyPlanSubjects &&
      !state.studyPlanSubjects.some((subject) => subject.subject_id?.toString() === group.subject_id?.toString());

    if (subjectNotInPlan && !dismissedWarnings.has(group.id)) {
      setSelectedWarningGroup(group);
      setShowWarningModal(true);
      return;
    }

    actions.toggleGroup(group);
  };

  const handleConfirmWarning = () => {
    if (selectedWarningGroup) {
      actions.toggleGroup(selectedWarningGroup);
      if (dontShowWarningAgain) {
        setDismissedWarnings((prev) => new Set([...Array.from(prev), selectedWarningGroup.id]));
      }
    }
    setDontShowWarningAgain(false);
    setShowWarningModal(false);
    setSelectedWarningGroup(null);
  };

  const handleContinueToGroups = () => {
    actions.moveToStep(3);
    setGroupPage(1);
  };

  const handleStepClick = (step: number) => {
    if (step <= state.currentStep) {
      actions.moveToStep(step as 1 | 2 | 3 | 4 | 5);
    }
  };

  const handleOpenConfirmModal = () => {
    setShowConfirmModal(true);
    actions.moveToStep(4);
  };

  const steps = [
    { step: 1, label: 'Buscar estudiante' },
    { step: 2, label: 'Revisar matrícula' },
    { step: 3, label: 'Seleccionar grupos' },
    { step: 4, label: 'Confirmar' },
    { step: 5, label: 'Resultado' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Inscribir estudiante en grupo
            </h1>
            <p className="text-gray-600 mt-1">
              Inscribe a un estudiante en los grupos de las asignaturas del semestre activo.
            </p>
          </div>
          <div className="text-right text-sm text-gray-600">
            Inicio &gt; Académico &gt; Inscripciones &gt; Inscribir estudiante
          </div>
        </div>
      </div>

      <div className="px-8 py-6 bg-white border-b border-gray-200">
        <div className="grid grid-cols-12 gap-4 items-center">
          {steps.map((step, idx) => {
            const completed = step.step < state.currentStep;
            const active = step.step === state.currentStep;
            const enabled = step.step <= state.currentStep;
            return (
              <div key={step.step} className="col-span-12 lg:col-span-2">
                <button
                  type="button"
                  onClick={() => handleStepClick(step.step)}
                  disabled={!enabled}
                  className="w-full text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold transition ${completed || active ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
                      {completed ? '✓' : step.step}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${active ? 'text-green-700' : 'text-gray-600'}`}>{step.label}</p>
                    </div>
                  </div>
                </button>
                {idx < steps.length - 1 && <div className={`mt-3 h-0.5 rounded-full ${completed ? 'bg-green-500' : 'bg-gray-300'}`} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-8">
        {state.errors.length > 0 && !state.isSuccess && (
          <div className="mb-6 space-y-2">
            {state.errors.slice(0, 3).map((err, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg ${err.severity === 'error' ? 'bg-red-50 border border-red-200 text-red-800' : 'bg-yellow-50 border border-yellow-200 text-yellow-800'}`}
              >
                <p className="text-sm font-medium">{err.message}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 xl:col-span-5 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Buscar estudiante</h3>
                  <p className="text-sm text-gray-600">Busca un estudiante activo en el sistema.</p>
                </div>
                <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" />
                  </svg>
                  Filtros
                </button>
              </div>

              <div className="relative mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Buscar por nombre, apellido o cédula..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" />
                  </svg>
                </div>
              </div>

              {searchResults.length > 0 && (
                <div className="overflow-x-auto mb-4">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-3 text-left font-semibold text-gray-600"> </th>
                        <th className="px-3 py-3 text-left font-semibold text-gray-600">Estudiante</th>
                        <th className="px-3 py-3 text-left font-semibold text-gray-600">Cédula</th>
                        <th className="px-3 py-3 text-left font-semibold text-gray-600">Carrera</th>
                        <th className="px-3 py-3 text-left font-semibold text-gray-600">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {displayedStudents.map((student) => {
                        const studentId = student.id || student.user_id || student.user?.id || student.user?.profile?.id || '';
                        const selected = state.selectedStudent?.id === studentId || state.selectedStudent?.user_id === studentId;
                        const firstName = student.first_name || student.user?.profile?.first_name || '';
                        const lastName = student.last_name || student.user?.profile?.last_name || '';
                        const identification = student.identification || student.user?.profile?.identification || '—';
                        const isActive = student.user?.is_active ?? true;
                        const careerName = state.studentRegistration?.career?.name || 'Ingeniería de Sistemas';

                        return (
                          <tr key={studentId || `${firstName}-${lastName}-${identification}`} className={`${selected ? 'bg-green-50' : ''} hover:bg-gray-50 transition-colors`}>
                            <td className="px-3 py-3">
                              <input
                                type="radio"
                                name="student"
                                checked={selected}
                                onChange={() => handleSelectStudent(student)}
                                className="h-4 w-4 accent-green-500"
                              />
                            </td>
                            <td className="px-3 py-3 font-medium">{`${firstName} ${lastName}`}</td>
                            <td className="px-3 py-3">{identification}</td>
                            <td className="px-3 py-3">{careerName}</td>
                            <td className="px-3 py-3">
                              <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {isActive ? 'Activo' : 'Inactivo'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                <span>Mostrando {studentStart} a {studentEnd} de {searchResults.length} estudiantes</span>
                <div className="inline-flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setStudentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={studentPage === 1}
                    className="rounded border border-gray-200 px-2 py-1 text-gray-600 disabled:opacity-50"
                  >&lt;</button>
                  {Array.from({ length: totalStudentPages }, (_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setStudentPage(index + 1)}
                      className={`rounded px-2 py-1 ${studentPage === index + 1 ? 'bg-green-500 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setStudentPage((prev) => Math.min(prev + 1, totalStudentPages))}
                    disabled={studentPage === totalStudentPages}
                    className="rounded border border-gray-200 px-2 py-1 text-gray-600 disabled:opacity-50"
                  >&gt;</button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Seleccionar grupos para inscribir</h3>
                  <p className="text-sm text-gray-600">Seleccione los grupos del semestre activo.</p>
                </div>
                <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 12a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM3 20a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" />
                  </svg>
                  Filtros
                </button>
              </div>

              <div className="grid gap-3 lg:grid-cols-3 mb-4">
                <div className="relative lg:col-span-3">
                  <input
                    type="text"
                    value={groupSearch}
                    onChange={(e) => {
                      setGroupSearch(e.target.value);
                      setGroupPage(1);
                    }}
                    placeholder="Buscar por asignatura, grupo o docente..."
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" />
                    </svg>
                  </div>
                </div>
                <select
                  value={programFilter}
                  onChange={(e) => {
                    setProgramFilter(e.target.value);
                    setGroupPage(1);
                  }}
                  className="rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">Todos los programas</option>
                  {Array.from(new Set(derived.groupTableRows.map((row) => row.careerName))).map((program) => (
                    <option key={program} value={program}>{program}</option>
                  ))}
                </select>
                <select
                  value={subjectFilter}
                  onChange={(e) => {
                    setSubjectFilter(e.target.value);
                    setGroupPage(1);
                  }}
                  className="rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">Todas las asignaturas</option>
                  {Array.from(new Set(derived.groupTableRows.map((row) => row.subjectName))).map((subject) => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              {state.selectedStudent ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600"> </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Grupo</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Asignatura</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Código</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Programa</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Docente</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Cupos (Disp.)</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">Créditos</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {displayedGroupRows.length > 0 ? (
                        displayedGroupRows.map((row) => {
                          const isSelected = state.selectedGroups.some((g) => g.id === row.id);
                          const group = state.availableGroups.find((g) => g.id === row.id);
                          const available = row.availableCapacity;
                          return (
                            <tr key={row.id} className={`${isSelected ? 'bg-blue-50' : ''} hover:bg-gray-50`}>
                              <td className="px-3 py-2">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  disabled={available <= 0}
                                  onChange={() => group && handleToggleGroup(group)}
                                  className="h-4 w-4 accent-green-500"
                                />
                              </td>
                              <td className="px-3 py-2 font-medium">{row.groupCode}</td>
                              <td className="px-3 py-2">{row.subjectName}</td>
                              <td className="px-3 py-2">{row.subjectCode}</td>
                              <td className="px-3 py-2">{row.careerName || currentCareerName}</td>
                              <td className="px-3 py-2">{row.teacherName}</td>
                              <td className="px-3 py-2">
                                <span className={`font-medium ${available > 5 ? 'text-green-600' : available === 0 ? 'text-red-600' : 'text-orange-600'}`}>
                                  {row.totalCapacity} ({available})
                                </span>
                              </td>
                              <td className="px-3 py-2 font-medium">{row.credits}</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={8} className="px-3 py-8 text-center text-gray-500">No hay grupos disponibles</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-16 text-center text-gray-500">Seleccione un estudiante y avance al paso 2 para ver los grupos disponibles.</div>
              )}

              <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                <span>Mostrando {groupStart} a {groupEnd} de {filteredGroupRows.length} grupos</span>
                <div className="inline-flex items-center gap-1">
                  <button type="button" onClick={() => setGroupPage((prev) => Math.max(prev - 1, 1))} disabled={groupPage === 1} className="rounded border border-gray-200 px-2 py-1 text-gray-600 disabled:opacity-50">&lt;</button>
                  {Array.from({ length: totalGroupPages }, (_, index) => (
                    <button key={index} type="button" onClick={() => setGroupPage(index + 1)} className={`rounded px-2 py-1 ${groupPage === index + 1 ? 'bg-green-500 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>{index + 1}</button>
                  ))}
                  <button type="button" onClick={() => setGroupPage((prev) => Math.min(prev + 1, totalGroupPages))} disabled={groupPage === totalGroupPages} className="rounded border border-gray-200 px-2 py-1 text-gray-600 disabled:opacity-50">&gt;</button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 h-fit space-y-4">
              <h3 className="text-lg font-semibold mb-2">Validaciones en tiempo real</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start gap-3">
                  <span className="mt-1 text-green-600">✅</span>
                  <p>Total de créditos seleccionados no excede el límite permitido.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-1 text-green-600">✅</span>
                  <p>Los grupos seleccionados tienen cupo disponible.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-1 text-green-600">✅</span>
                  <p>No hay inscripciones activas previas en los grupos seleccionados.</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <p className="text-sm font-medium">Total créditos seleccionados</p>
                <p className="text-3xl font-bold text-gray-900">{derived.enrollmentSummary?.totalCredits || 0} / 20</p>
                <p className="text-sm text-gray-500 mt-1">Puede seleccionar hasta {remainingCredits} créditos más.</p>
              </div>
              <button type="button" onClick={handleOpenConfirmModal} disabled={state.selectedGroups.length === 0 || state.currentStep < 3} className="w-full rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:bg-gray-300">Confirmar inscripción</button>
              <button type="button" onClick={() => setShowCancelModal(true)} className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50">Cancelar inscripción (alternativo)</button>
            </div>
          </div>

          <div className="col-span-12 xl:col-span-4">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Matrícula activa del estudiante</h3>
              {state.selectedStudent && state.studentRegistration ? (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 text-lg font-bold">
                      {(state.selectedStudent.first_name || state.selectedStudent.user?.profile?.first_name || 'M').charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-lg text-gray-900">{studentName || 'Estudiante seleccionado'}</p>
                      <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">Activa</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-gray-600">Carrera</p>
                      <p className="font-medium">{state.studentRegistration.career?.name || state.studentRegistration.career_id || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Periodo de ingreso</p>
                      <p className="font-medium">{state.studentRegistration.admission_period || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Estado académico</p>
                      <p className="font-medium">{state.studentRegistration.academic_status || 'Activo'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Fecha de matrícula</p>
                      <p className="font-medium">{state.studentRegistration.created_at ? new Date(state.studentRegistration.created_at).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded p-3 text-sm text-green-800 mb-4">
                    El estudiante tiene matrícula activa y puede inscribirse en grupos.
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm text-yellow-800 mb-4">
                    <p className="font-semibold">Importante</p>
                    <p>Solo se muestran grupos del semestre activo cuyas asignaturas pertenecen al plan de estudios de la carrera del estudiante.</p>
                  </div>

                  <button onClick={handleContinueToGroups} className="w-full rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600">Continuar a seleccionar grupos</button>
                </div>
              ) : (
                <p className="text-center py-10 text-gray-500 text-sm">Seleccione un estudiante para revisar su matrícula activa.</p>
              )}
            </div>
          </div>

          <div className="col-span-12 xl:col-span-3">
            <div className="sticky top-6 space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-3">Información del semestre activo</h3>
                {state.activeSemester ? (
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-center justify-between">
                      <span>Semestre</span>
                      <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">Activo</span>
                    </div>
                    <div>
                      <p className="text-gray-600">Nombre</p>
                      <p className="font-medium">{state.activeSemester.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Fecha inicio</p>
                      <p className="font-medium">{new Date(state.activeSemester.start_date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Fecha fin</p>
                      <p className="font-medium">{state.activeSemester.end_date ? new Date(state.activeSemester.end_date).toLocaleDateString() : 'N/A'}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Cargando semestre...</p>
                )}
              </div>

              <div className="bg-blue-50 rounded-lg shadow p-6">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-white p-2 text-blue-600">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a7 7 0 100 14A7 7 0 009 2zm0 10a1 1 0 110-2 1 1 0 010 2zm1-5a1 1 0 10-2 0v3a1 1 0 102 0V7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-blue-900">Límite de créditos por estudiante</p>
                    <p className="text-sm text-blue-700">Máximo permitido: <span className="font-semibold text-green-700">20 créditos</span></p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="text-base font-semibold mb-3">Resumen de créditos</h4>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Créditos seleccionados</span>
                    <span className="font-semibold">{derived.enrollmentSummary?.totalCredits || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Créditos disponibles</span>
                    <span className="font-semibold">20</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Créditos restantes</span>
                    <span className="font-semibold text-green-700">{remainingCredits}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="text-base font-semibold mb-4">Validaciones en tiempo real</h4>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 text-green-600">✅</span>
                    <p>Total de créditos seleccionados no excede el límite permitido.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-1 text-green-600">✅</span>
                    <p>Los grupos seleccionados tienen cupo disponible.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-1 text-green-600">✅</span>
                    <p>No hay inscripciones activas previas en los grupos seleccionados.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-sm font-medium text-gray-600">Total créditos seleccionados</p>
                <p className="text-4xl font-bold text-gray-900 my-3">{derived.enrollmentSummary?.totalCredits || 0} / 20</p>
                <p className="text-sm text-gray-500">Puede seleccionar hasta {remainingCredits} créditos más.</p>
                <button
                  type="button"
                  onClick={handleOpenConfirmModal}
                  disabled={state.selectedGroups.length === 0 || state.currentStep < 3}
                  className="mt-6 w-full rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:bg-gray-300"
                >
                  Confirmar inscripción
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showConfirmModal && derived.enrollmentSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-xl">
            <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Confirmar inscripción</h2>
                <p className="mt-1 text-sm text-gray-600">Se crearán {derived.enrollmentSummary.selectedGroups.length} inscripciones para el estudiante seleccionado.</p>
              </div>
              <button onClick={() => setShowConfirmModal(false)} className="text-gray-500 hover:text-gray-900">×</button>
            </div>
            <div className="px-6 py-4">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">Grupo</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">Asignatura</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">Créditos</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {derived.enrollmentSummary.selectedGroups.map((group) => (
                      <tr key={group.groupId}>
                        <td className="px-4 py-3 font-medium">{group.groupCode}</td>
                        <td className="px-4 py-3">{group.subjectName}</td>
                        <td className="px-4 py-3">{group.credits}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 border-t pt-4 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Total créditos:</span>
                  <span className="font-semibold">{derived.enrollmentSummary.totalCredits}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
              <button onClick={() => setShowConfirmModal(false)} className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100">Cancelar</button>
              <button
                onClick={async () => {
                  await actions.confirmEnrollment();
                  setShowConfirmModal(false);
                }}
                disabled={state.isConfirming}
                className="flex-1 rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:opacity-50"
              >
                {state.isConfirming ? 'Confirmando...' : 'Confirmar inscripción'}
              </button>
            </div>
          </div>
        </div>
      )}

      {state.isSuccess && state.successDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-xl">
            <div className="px-6 py-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Inscripciones creadas correctamente</h2>
              <p className="mt-2 text-sm text-gray-600">Se han creado {state.successDetails.enrollmentsCreated} inscripción(es) para el estudiante {studentName || 'seleccionado'}.</p>
            </div>
            <div className="bg-gray-50 px-6 py-5">
              <div className="grid grid-cols-3 gap-4 text-sm text-gray-700">
                <div className="rounded-2xl bg-white p-4">
                  <p className="text-xs text-gray-500">Inscripciones creadas</p>
                  <p className="mt-2 font-semibold text-gray-900">{state.successDetails.enrollmentsCreated}</p>
                </div>
                <div className="rounded-2xl bg-white p-4">
                  <p className="text-xs text-gray-500">Fecha</p>
                  <p className="mt-2 font-semibold text-gray-900">{state.successDetails.enrollmentDate}</p>
                </div>
                <div className="rounded-2xl bg-white p-4">
                  <p className="text-xs text-gray-500">Semestre</p>
                  <p className="mt-2 font-semibold text-gray-900">{state.successDetails.semesterName}</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-5">
              <button
                onClick={() => actions.resetForm()}
                className="w-full rounded-lg bg-green-500 px-4 py-3 text-white hover:bg-green-600"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Cancelar inscripción</h2>
                <p className="mt-1 text-sm text-gray-600">Cancela una inscripción antes del cierre del semestre.</p>
              </div>
              <button onClick={() => setShowCancelModal(false)} className="text-gray-500 hover:text-gray-900">×</button>
            </div>
            <div className="px-6 py-6 space-y-4 text-sm text-gray-700">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500">Grupo</p>
                  <p className="font-medium">{state.selectedGroups[0]?.group_code || 'ING-SIS-01'} - {state.selectedGroups[0]?.subject?.name || 'Programación I'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Docente</p>
                  <p className="font-medium">{state.selectedGroups[0]?.teacher ? `${state.selectedGroups[0].teacher.first_name || ''} ${state.selectedGroups[0].teacher.last_name || ''}`.trim() : 'Carlos Andrés Pérez'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Fecha inscripción</p>
                  <p className="font-medium">10/04/2024</p>
                </div>
                <div>
                  <p className="text-gray-500">Estado actual</p>
                  <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">Activa</span>
                </div>
              </div>
              <div>
                <label className="text-gray-600 text-sm">Nuevo estado</label>
                <select className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option>Cancelado</option>
                </select>
              </div>
              <div>
                <label className="text-gray-600 text-sm">Motivo (opcional)</label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="El estudiante solicita cancelación."
                  className="mt-2 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <div className="flex gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
              <button onClick={() => setShowCancelModal(false)} className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100">Cancelar</button>
              <button
                onClick={() => {
                  actions.resetForm();
                  setShowCancelModal(false);
                  setCancelReason('');
                }}
                className="flex-1 rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                Confirmar cancelación
              </button>
            </div>
          </div>
        </div>
      )}

      {showWarningModal && selectedWarningGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 p-4">
          <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-xl">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Advertencia de asignatura fuera del plan</h2>
              <p className="mt-1 text-sm text-gray-600">La asignatura seleccionada no pertenece al plan de estudios del estudiante.</p>
            </div>
            <div className="px-6 py-4 space-y-4 text-sm text-gray-700">
              <div className="flex items-center gap-3 text-orange-600">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v4m0 4h.01" />
                </svg>
                <p>La asignatura {selectedWarningGroup.subject?.name || 'desconocida'} ({selectedWarningGroup.subject?.code || 'N/A'}) no pertenece al plan de estudios de {currentCareerName}. ¿Desea continuar?</p>
              </div>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500">Grupo</span>
                  <span className="font-medium">{selectedWarningGroup.group_code}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500">Programa/Carrera</span>
                  <span className="font-medium">{currentCareerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Asignatura</span>
                  <span className="font-medium">{selectedWarningGroup.subject?.name || 'N/A'} ({selectedWarningGroup.subject?.code || 'N/A'})</span>
                </div>
              </div>
              <label className="mt-4 flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={dontShowWarningAgain}
                  onChange={(e) => setDontShowWarningAgain(e.target.checked)}
                  className="h-4 w-4 accent-yellow-500"
                />
                No volver a mostrar esta advertencia en esta sesión.
              </label>
            </div>
            <div className="flex gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
              <button onClick={() => setShowWarningModal(false)} className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100">No inscribir</button>
              <button onClick={handleConfirmWarning} className="flex-1 rounded-lg bg-orange-500 px-4 py-2 text-white hover:bg-orange-600">Continuar igualmente</button>
            </div>
          </div>
        </div>
      )}

      {state.errors.length > 0 && !state.isSuccess && (
        <div className="fixed bottom-4 left-1/2 z-50 flex w-full max-w-3xl -translate-x-1/2 flex-col gap-3 px-4 pointer-events-none">
          {state.errors.map((error, index) => {
            if (toastDismissed.has(index)) return null;
            const isError = error.severity === 'error';
            const title = error.type === 'CREDITS_EXCEEDED'
              ? 'Créditos exceden el límite'
              : error.type === 'NO_CAPACITY'
                ? 'Sin cupo disponible'
                : error.type === 'NO_ACTIVE_REGISTRATION'
                  ? 'Sin matrícula activa'
                  : error.type === 'NOT_IN_STUDY_PLAN'
                    ? 'Asignatura fuera del plan'
                    : error.type === 'ALREADY_ENROLLED'
                      ? 'Ya inscrito'
                      : 'Atención';

            return (
              <div key={index} className={`pointer-events-auto rounded-2xl border p-4 shadow-sm ${isError ? 'border-red-200 bg-red-50 text-red-800' : 'border-yellow-200 bg-yellow-50 text-yellow-800'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className={`mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full ${isError ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                      {isError ? '🔴' : '🟡'}
                    </span>
                    <div>
                      <p className="font-semibold">{title}</p>
                      <p className="text-sm">{error.message}</p>
                    </div>
                  </div>
                  <button onClick={() => setToastDismissed((prev) => new Set(prev).add(index))} className="text-current/70 hover:text-current">×</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EnrollStudentInGroup;
