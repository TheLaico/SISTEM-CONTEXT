// src/pages/inscripciones/CreateInscripcion.tsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import Breadcrumb from '../../components/Breadcrumb'
import useInscribirEstudiante from '../../hooks/useInscribirEstudiante'
// import { Enrollment } from '../../models/Enrollment'

// ─── Helpers visuales ─────────────────────────────────────────────────────────

const StepBadge = ({ n, current, label }: { n: number; current: number; label: string }) => {
  const done    = current > n
  const active  = current === n
  return (
    <div className="flex items-center gap-2">
      <span className={`
        flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold
        ${done   ? 'bg-success text-white' :
          active ? 'bg-primary text-white' :
                   'bg-stroke text-body dark:bg-strokedark dark:text-bodydark'}
      `}>
        {done ? '✓' : n}
      </span>
      <span className={`hidden sm:block text-sm font-medium ${active ? 'text-primary' : done ? 'text-success' : 'text-body dark:text-bodydark'}`}>
        {label}
      </span>
    </div>
  )
}

const StatusBadge = ({ ok, label }: { ok: boolean; label: string }) => (
  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold
    ${ok ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
    {ok ? '●' : '●'} {label}
  </span>
)

const CreditBar = ({ used, max }: { used: number; max: number }) => {
  const pct = Math.min(100, (used / max) * 100)
  const over = used > max
  return (
    <div className="w-full">
      <div className="h-2 w-full rounded-full bg-stroke dark:bg-strokedark">
        <div className={`h-2 rounded-full transition-all duration-300 ${over ? 'bg-danger' : 'bg-primary'}`}
          style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────

const CreateInscripcion = () => {
  const navigate = useNavigate()
  const h = useInscribirEstudiante()
  // results stored via Swal only

  // Advertencia fuera del plan
  useEffect(() => {
    if (!h.outOfPlanWarning) return
    const row = h.grupoRows.find(r => String(r.group.id) === String(h.pendingGroupId))
    if (!row) return
    Swal.fire({
      title:             'Asignatura fuera del plan',
      html:              `<p class="text-sm">La asignatura <b>${row.subjectName} (${row.subjectCode})</b> 
                          no pertenece al plan de estudios de la carrera del estudiante.<br><br>
                          ¿Deseas continuar con la inscripción de este grupo?</p>`,
      icon:              'warning',
      showCancelButton:  true,
      confirmButtonText: 'Continuar igualmente',
      cancelButtonText:  'No inscribir',
      confirmButtonColor:'#F59E0B',
    }).then(res => res.isConfirmed ? h.confirmOutOfPlan() : h.rejectOutOfPlan())
  }, [h.outOfPlanWarning])

  const handleConfirmar = async () => {
    const { value: confirmed } = await Swal.fire({
      title:    'Confirmar inscripción',
      html:
        `<p class="mb-3 text-sm">Se crearán <b>${h.selectedGroupIds.size}</b> inscripción(es) 
         para <b>${h.selectedStudent?.first_name} ${h.selectedStudent?.last_name}</b>.</p>` +
        [...h.selectedGroupIds].map(id => {
          const row = h.grupoRows.find(r => String(r.group.id) === String(id))
          return row
            ? `<div class="flex justify-between text-sm py-1 border-b border-stroke">
                <span>${row.subjectName}</span>
                <span class="font-semibold">${row.credits} cr.</span></div>`
            : ''
        }).join('') +
        `<div class="flex justify-between text-sm font-bold pt-2">
          <span>Total créditos</span>
          <span>${h.validation.creditosSeleccionados}</span></div>`,
      icon:              'question',
      showCancelButton:  true,
      confirmButtonText: 'Confirmar inscripción',
      cancelButtonText:  'Cancelar',
      confirmButtonColor:'#3C50E0',
    })
    if (!confirmed) return

    try {
      const results = await h.confirmar()
      Swal.fire({
        title:             'Inscripción exitosa',
        html:
          `<div class="text-sm">
            <p class="mb-2">Se crearon <b>${results.length}</b> inscripción(es) para 
            <b>${h.selectedStudent?.first_name} ${h.selectedStudent?.last_name}</b>.</p>
            <div class="flex justify-between text-xs text-body">
              <span>Fecha: ${new Date().toLocaleDateString('es-CO')}</span>
              <span>Semestre: ${h.semestre?.name ?? '—'}</span>
            </div>
          </div>`,
        icon:              'success',
        confirmButtonText: 'Continuar',
        confirmButtonColor:'#3C50E0',
      }).then(() => h.reset())
    } catch (err: any) {
      Swal.fire('Error', err.message ?? 'No se pudo crear la inscripción', 'error')
    }
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-screen-2xl px-4 pb-10">
      <Breadcrumb
        pageName="Inscribir estudiante en grupo"
        items={[
          { label: 'Inicio', to: '/' },
          { label: 'Académico' },
          { label: 'Inscripciones', to: '/inscripciones/list' },
          { label: 'Inscribir estudiante' },
        ]}
      />

      {/* ── Alerta semestre inactivo ── */}
      {h.semestreError && (
        <div className="mb-4 flex items-center gap-3 rounded-md border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          <span className="text-lg">⚠</span>
          {h.semestreError}
        </div>
      )}

      {/* ── Stepper ── */}
      <div className="mb-6 flex items-center justify-between gap-2 overflow-x-auto rounded-md border border-stroke bg-white px-4 py-3 dark:border-strokedark dark:bg-boxdark">
        {(['Buscar estudiante','Revisar matrícula','Seleccionar grupos','Confirmar','Resultado'] as const)
          .map((label, i) => (
            <div key={label} className="flex items-center gap-1">
              <StepBadge n={i + 1} current={h.step} label={label} />
              {i < 4 && <span className="hidden text-stroke sm:block">›</span>}
            </div>
          ))
        }
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">

        {/* ═══════════════════════════════════════════════════════════════════════
            COL 1–2: Área principal
        ═══════════════════════════════════════════════════════════════════════ */}
        <div className="xl:col-span-2 space-y-5">

          {/* ── PASO 1: Buscar estudiante ── */}
          <div className="rounded-md border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
            <h3 className="mb-1 text-base font-semibold text-black dark:text-white">
              <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white">1</span>
              Buscar estudiante
            </h3>
            <p className="mb-4 text-sm text-body dark:text-bodydark">Busca un estudiante activo en el sistema.</p>

            <div className="relative mb-4">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-body">🔍</span>
              <input
                className="w-full rounded-md border border-stroke bg-gray-2 py-2.5 pl-9 pr-4 text-sm focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                placeholder="Buscar por nombre, apellido o cédula..."
                value={h.searchQuery}
                onChange={e => h.setSearchQuery(e.target.value)}
              />
            </div>

            {h.searchLoading && (
              <p className="py-2 text-center text-sm text-body dark:text-bodydark">Buscando...</p>
            )}

            {h.searchResults.length > 0 && (
              <div className="overflow-x-auto rounded-md border border-stroke dark:border-strokedark">
                <table className="w-full text-sm">
                  <thead className="bg-gray-2 dark:bg-meta-4">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-black dark:text-white">Estudiante</th>
                      <th className="px-4 py-3 text-left font-medium text-black dark:text-white">Cédula</th>
                      <th className="px-4 py-3 text-left font-medium text-black dark:text-white">Carrera</th>
                      <th className="px-4 py-3 text-left font-medium text-black dark:text-white">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {h.searchResults.map(student => {
                      const isSelected = String(student.id) === String(h.selectedStudent?.id)
                      return (
                        <tr
                          key={student.id}
                          onClick={() => h.selectStudent(student)}
                          className={`cursor-pointer border-t border-stroke transition-colors dark:border-strokedark
                            ${isSelected ? 'bg-primary/5' : 'hover:bg-gray-2 dark:hover:bg-meta-4'}`}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {isSelected && <span className="h-2 w-2 rounded-full bg-primary" />}
                              <span className="font-medium text-black dark:text-white">
                                {student.first_name} {student.last_name}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-body dark:text-bodydark">{student.identification ?? '—'}</td>
                          <td className="px-4 py-3 text-body dark:text-bodydark">{(student as any).career ?? '—'}</td>
                          <td className="px-4 py-3">
                            <StatusBadge ok={student.user?.is_active !== false} label={student.user?.is_active !== false ? 'Activo' : 'Inactivo'} />
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ── PASO 2: Matrícula activa ── */}
          {h.selectedStudent && (
            <div className="rounded-md border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
              <h3 className="mb-4 text-base font-semibold text-black dark:text-white">
                <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white">2</span>
                Matrícula activa del estudiante
              </h3>

              {h.matriculaError && (
                <div className="mb-3 flex items-start gap-3 rounded-md border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
                  <span>⊗</span>
                  <div>
                    <p className="font-semibold">Sin matrícula activa</p>
                    <p>{h.matriculaError}</p>
                    <button
                      className="mt-2 underline"
                      onClick={() => navigate('/enrollments/create')}
                    >
                      Ir a Matrículas (CU-05) →
                    </button>
                  </div>
                </div>
              )}

              {h.matricula && (
                <>
                  <div className="mb-4 flex items-start gap-4 rounded-md border border-success/30 bg-success/5 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-success/20 text-xl">👤</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-base font-bold text-black dark:text-white">
                          {h.selectedStudent.first_name} {h.selectedStudent.last_name}
                        </p>
                        <StatusBadge ok label="Activa" />
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                        <p><span className="text-body dark:text-bodydark">Carrera:</span> <b className="text-black dark:text-white">{h.matricula.career?.name ?? h.matricula.career_id}</b></p>
                        <p><span className="text-body dark:text-bodydark">Período ingreso:</span> <b className="text-black dark:text-white">{h.matricula.admission_period}</b></p>
                        <p><span className="text-body dark:text-bodydark">Estado académico:</span> <b className="text-black dark:text-white">{h.matricula.academic_status}</b></p>
                        <p><span className="text-body dark:text-bodydark">Cédula:</span> <b className="text-black dark:text-white">{h.selectedStudent.identification ?? '—'}</b></p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3 rounded-md border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                    ℹ Solo se muestran grupos del semestre activo cuyas asignaturas pertenezcan al plan de estudios de la carrera del estudiante.
                  </div>

                  {h.semestre && (
                    <button
                      onClick={h.loadGrupos}
                      disabled={h.gruposLoading}
                      className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90 disabled:opacity-60"
                    >
                      {h.gruposLoading ? '⏳ Cargando grupos...' : '→ Seleccionar grupos'}
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {/* ── PASO 3: Tabla de grupos ── */}
          {h.grupoRows.length > 0 && (
            <div className="rounded-md border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
              <h3 className="mb-4 text-base font-semibold text-black dark:text-white">
                <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white">3</span>
                Seleccionar grupos para inscribir
              </h3>
              <p className="mb-4 text-sm text-body dark:text-bodydark">
                Seleccione los grupos del semestre activo. <b>{h.semestre?.name}</b>
              </p>

              {/* Filtros */}
              <div className="mb-4 flex flex-wrap gap-3">
                <input
                  className="min-w-[200px] flex-1 rounded-md border border-stroke bg-gray-2 py-2 px-3 text-sm focus:border-primary focus:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                  placeholder="Buscar por asignatura, grupo o docente..."
                  value={h.filterSearch}
                  onChange={e => h.setFilterSearch(e.target.value)}
                />
              </div>

              {/* Leyenda de estados */}
              <div className="mb-3 flex flex-wrap items-center gap-3 text-xs">
                <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-primary/20" /> Seleccionado</span>
                <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-danger/20" /> Sin cupo</span>
                <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-success/20" /> Ya inscrito</span>
                <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-warning/20" /> Fuera del plan</span>
              </div>

              {h.gruposError && (
                <p className="mb-3 text-sm text-danger">{h.gruposError}</p>
              )}

              <div className="overflow-x-auto rounded-md border border-stroke dark:border-strokedark">
                <table className="w-full text-sm">
                  <thead className="bg-gray-2 dark:bg-meta-4">
                    <tr>
                      <th className="w-10 px-3 py-3">
                        <input
                          type="checkbox"
                          className="tableCheckbox"
          onChange={_e => {}}
                        />
                      </th>
                      {['Grupo','Asignatura','Código','Docente','Cupos','Créditos','Plan','Estado'].map(col => (
                        <th key={col} className="px-3 py-3 text-left font-medium text-black dark:text-white">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {h.filteredRows.length === 0 && (
                      <tr>
                        <td colSpan={9} className="py-8 text-center text-body dark:text-bodydark">
                          No se encontraron grupos.
                        </td>
                      </tr>
                    )}
                    {h.filteredRows.map(row => {
                      const id        = String(row.group.id)
                      const selected  = h.selectedGroupIds.has(id)
                      const disabled  = row.yaInscrito || row.sinCupo

                      let rowBg = ''
                      if (row.yaInscrito)        rowBg = 'bg-success/5'
                      else if (row.sinCupo)       rowBg = 'bg-danger/5'
                      else if (selected)          rowBg = 'bg-primary/5'
                      else if (!row.inPlan)       rowBg = 'bg-warning/5'

                      return (
                        <tr
                          key={id}
                          onClick={() => !disabled && h.toggleGroup(row)}
                          className={`border-t border-stroke transition-colors dark:border-strokedark
                            ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:bg-gray-2 dark:hover:bg-meta-4'}
                            ${rowBg}`}
                        >
                          <td className="px-3 py-3 text-center">
                            <input
                              type="checkbox"
                              className="tableCheckbox"
                              checked={selected || row.yaInscrito}
                              disabled={disabled}
                              readOnly
                            />
                          </td>
                          <td className="px-3 py-3 font-medium text-black dark:text-white">{row.group.group_code}</td>
                          <td className="px-3 py-3 text-black dark:text-white">{row.subjectName}</td>
                          <td className="px-3 py-3 text-body dark:text-bodydark">{row.subjectCode}</td>
                          <td className="px-3 py-3 text-body dark:text-bodydark">{row.teacherName}</td>
                          <td className="px-3 py-3">
                            <span className={`font-semibold ${row.sinCupo ? 'text-danger' : row.cuposDisp <= 5 ? 'text-warning' : 'text-success'}`}>
                              {row.cuposDisp}
                            </span>
                            <span className="text-body dark:text-bodydark"> / {row.cuposTotal}</span>
                          </td>
                          <td className="px-3 py-3 font-semibold text-black dark:text-white">{row.credits}</td>
                          <td className="px-3 py-3">
                            {row.inPlan
                              ? <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-semibold text-success">Sí</span>
                              : <span className="rounded-full bg-warning/10 px-2 py-0.5 text-xs font-semibold text-warning">No</span>
                            }
                          </td>
                          <td className="px-3 py-3">
                            {row.yaInscrito
                              ? <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-semibold text-success">Ya inscrito</span>
                              : row.sinCupo
                              ? <span className="rounded-full bg-danger/10 px-2 py-0.5 text-xs font-semibold text-danger">Sin cupo</span>
                              : <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">Disponible</span>
                            }
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Errores de validación */}
              {h.validation.excedeLimite && (
                <div className="mt-3 flex items-center gap-2 rounded-md border border-danger/30 bg-danger/5 px-4 py-2.5 text-sm text-danger">
                  ⊗ <b>Créditos exceden el límite.</b>&nbsp;
                  Total seleccionado: {h.validation.creditosSeleccionados} cr. / Máximo: {h.MAX_CREDITS} cr.
                </div>
              )}
              {h.validation.gruposSinCupo.length > 0 && (
                <div className="mt-2 flex items-center gap-2 rounded-md border border-danger/30 bg-danger/5 px-4 py-2.5 text-sm text-danger">
                  ⊗ Grupos sin cupo seleccionados: <b>{h.validation.gruposSinCupo.join(', ')}</b>
                </div>
              )}
              {h.validation.gruposYaInscritos.length > 0 && (
                <div className="mt-2 flex items-center gap-2 rounded-md border border-warning/30 bg-warning/5 px-4 py-2.5 text-sm text-warning">
                  ⚠ Ya inscrito en: <b>{h.validation.gruposYaInscritos.join(', ')}</b>
                </div>
              )}
              {h.validation.gruposFueraPlan.length > 0 && (
                <div className="mt-2 flex items-center gap-2 rounded-md border border-warning/30 bg-warning/5 px-4 py-2.5 text-sm text-warning">
                  ⚠ Fuera del plan: <b>{h.validation.gruposFueraPlan.join(', ')}</b>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════
            COL 3: Panel lateral
        ═══════════════════════════════════════════════════════════════════════ */}
        <div className="space-y-5">

          {/* Semestre activo */}
          {h.semestre && (
            <div className="rounded-md border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
              <p className="mb-3 text-sm font-semibold text-black dark:text-white">Información del semestre activo</p>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-body dark:text-bodydark">Semestre:</span>
                  <span className="flex items-center gap-1 font-semibold text-black dark:text-white">
                    {h.semestre.name}
                    <span className="rounded-full bg-success/10 px-1.5 py-0.5 text-xs font-semibold text-success">Activo</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-body dark:text-bodydark">Fecha inicio:</span>
                  <span className="text-black dark:text-white">{h.semestre.start_date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-body dark:text-bodydark">Fecha fin:</span>
                  <span className="text-black dark:text-white">{h.semestre.end_date}</span>
                </div>
              </div>
            </div>
          )}

          {/* Resumen de créditos */}
          {h.selectedStudent && h.matricula && (
            <div className="rounded-md border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
              <p className="mb-1 text-sm font-semibold text-black dark:text-white">Límite de créditos por estudiante</p>
              <p className="mb-4 text-xs text-body dark:text-bodydark">Máximo permitido: <b className="text-black dark:text-white">{h.MAX_CREDITS} créditos</b></p>

              <CreditBar used={h.validation.creditosSeleccionados} max={h.MAX_CREDITS} />

              <div className="mt-3 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-body dark:text-bodydark">Créditos seleccionados:</span>
                  <span className={`font-bold ${h.validation.excedeLimite ? 'text-danger' : 'text-black dark:text-white'}`}>
                    {h.validation.creditosSeleccionados}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-body dark:text-bodydark">Créditos disponibles:</span>
                  <span className="font-semibold text-black dark:text-white">{h.MAX_CREDITS}</span>
                </div>
                <div className="flex justify-between border-t border-stroke pt-1.5 dark:border-strokedark">
                  <span className="text-body dark:text-bodydark">Créditos restantes:</span>
                  <span className={`font-bold ${h.validation.creditosRestantes < 0 ? 'text-danger' : 'text-primary'}`}>
                    {Math.max(0, h.validation.creditosRestantes)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Validaciones en tiempo real */}
          {h.grupoRows.length > 0 && (
            <div className="rounded-md border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
              <p className="mb-3 text-sm font-semibold text-black dark:text-white">Validaciones en tiempo real</p>
              <div className="space-y-2 text-xs">
                <div className={`flex items-start gap-2 ${h.validation.excedeLimite ? 'text-danger' : 'text-success'}`}>
                  <span>{h.validation.excedeLimite ? '⊗' : '✓'}</span>
                  <span>Total de créditos seleccionados no excede el límite permitido.</span>
                </div>
                <div className={`flex items-start gap-2 ${h.validation.gruposSinCupo.length > 0 ? 'text-danger' : 'text-success'}`}>
                  <span>{h.validation.gruposSinCupo.length > 0 ? '⊗' : '✓'}</span>
                  <span>Los grupos seleccionados tienen cupo disponible.</span>
                </div>
                <div className={`flex items-start gap-2 ${h.validation.gruposYaInscritos.length > 0 ? 'text-warning' : 'text-success'}`}>
                  <span>{h.validation.gruposYaInscritos.length > 0 ? '⚠' : '✓'}</span>
                  <span>No hay inscripciones activas previas en los grupos seleccionados.</span>
                </div>
              </div>

              {h.selectedGroupIds.size > 0 && (
                <div className="mt-4 border-t border-stroke pt-4 dark:border-strokedark">
                  <p className="mb-1 text-xs font-semibold text-body dark:text-bodydark">Total créditos seleccionados</p>
                  <p className={`text-3xl font-bold ${h.validation.excedeLimite ? 'text-danger' : 'text-primary'}`}>
                    {h.validation.creditosSeleccionados}
                    <span className="text-base font-normal text-body dark:text-bodydark"> / {h.MAX_CREDITS}</span>
                  </p>
                  {!h.validation.excedeLimite && (
                    <p className="mt-1 text-xs text-body dark:text-bodydark">
                      Puede seleccionar hasta {h.validation.creditosRestantes} créditos más.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Botón confirmar */}
          {h.grupoRows.length > 0 && (
            <div className="flex flex-col gap-2">
              <button
                onClick={handleConfirmar}
                disabled={!h.validation.puedeConfirmar || h.submitting}
                className="w-full rounded-md bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {h.submitting ? 'Creando inscripciones...' : `Confirmar inscripción (${h.selectedGroupIds.size} grupo${h.selectedGroupIds.size !== 1 ? 's' : ''})`}
              </button>
              <button
                onClick={() => navigate('/inscripciones/list')}
                className="w-full rounded-md border border-stroke py-2.5 text-sm font-medium text-body transition hover:bg-gray-2 dark:border-strokedark dark:text-bodydark dark:hover:bg-meta-4"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CreateInscripcion