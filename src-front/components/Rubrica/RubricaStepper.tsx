interface RubricaStepperProps {
  activeStep: number;
  steps: string[];
}

const RubricaStepper = ({ activeStep, steps }: RubricaStepperProps) => {
  return (
    <div className="flex items-center justify-between gap-4">
      {steps.map((step, index) => {
        const isCompleted = index < activeStep;
        const isActive = index === activeStep;
        const isLast = index === steps.length - 1;

        return (
          <div key={step} className="flex-1 min-w-0">
            <div className="flex items-center">
              <div
                className={`mr-3 flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors duration-200 ${
                  isCompleted
                    ? 'border-primary bg-primary text-white'
                    : isActive
                    ? 'border-primary bg-primary text-white'
                    : 'border-stroke bg-white text-meta-3 dark:border-strokedark dark:bg-boxdark dark:text-meta-2'
                }`}
              >
                {isCompleted ? '✓' : index + 1}
              </div>

              {!isLast && (
                <div
                  className={`h-0.5 flex-1 ${
                    isCompleted
                      ? 'bg-primary'
                      : 'bg-stroke dark:bg-strokedark'
                  }`}
                />
              )}
            </div>

            <div className="mt-3 text-center text-xs font-medium uppercase tracking-[0.08em] text-meta-3 dark:text-meta-2">
              <span className={`${isActive ? 'text-primary font-semibold' : isCompleted ? 'text-primary' : ''}`}>
                {step}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RubricaStepper;
