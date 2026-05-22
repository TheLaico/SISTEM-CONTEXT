interface RubricaFooterActionsProps {
  totalPeso: number;
  canPublish: boolean;
  activeStep: number;
  isSubmitting: boolean;
  onCancel: () => void;
  onBack: () => void;
  onGuardarBorrador: () => void;
  onPublicar: () => void;
  onRevisarContinuar: () => void;
}

const RubricaFooterActions = ({
  totalPeso,
  canPublish,
  activeStep,
  isSubmitting,
  onCancel,
  onBack,
  onGuardarBorrador,
  onPublicar,
  onRevisarContinuar,
}: RubricaFooterActionsProps) => {
  const isTotalOk = totalPeso === 100;
  const isLastStep = activeStep === 3;

  return (
    <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        {/* Izquierda: Cancelar / Volver */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-md border border-stroke bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-gray disabled:cursor-not-allowed disabled:opacity-60 dark:border-strokedark dark:bg-boxdark dark:text-white dark:hover:bg-meta-4"
          >
            Cancelar
          </button>
          {activeStep > 0 && (
            <button
              type="button"
              onClick={onBack}
              disabled={isSubmitting}
              className="rounded-md border border-stroke bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-gray disabled:cursor-not-allowed disabled:opacity-60 dark:border-strokedark dark:bg-boxdark dark:text-white dark:hover:bg-meta-4"
            >
              ← Volver
            </button>
          )}
        </div>

        {/* Derecha: acciones principales */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {/* Indicador de peso — solo visible en paso 1 */}
          {activeStep === 1 && (
            <span
              className={`text-sm font-semibold ${
                isTotalOk
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              Total: {totalPeso}%
            </span>
          )}

          {/* Guardar borrador — visible en todos los pasos */}
          <button
            type="button"
            onClick={onGuardarBorrador}
            disabled={isSubmitting}
            className="rounded-md border border-primary bg-white px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar borrador'}
          </button>

          {/* Botón principal: avanzar o publicar */}
          {isLastStep ? (
            <button
              type="button"
              onClick={onPublicar}
              disabled={isSubmitting || !canPublish}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Publicando...' : '🚀 Publicar rúbrica'}
            </button>
          ) : (
            <button
              type="button"
              onClick={onRevisarContinuar}
              disabled={isSubmitting}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Revisar y continuar →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RubricaFooterActions;