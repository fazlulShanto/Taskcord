import { Circle, CircleCheck } from 'lucide-react';
import './stepper.scss';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { cn } from '@/lib/utils';

interface StepperProps<T> {
  steps: T[];
  currentStep: number;
  stepCompleted: number;
  onStepSelect: (id: number) => void;
}

export const Stepper = <
  T extends {
    id: number;
    title: string;
    isDone: boolean;
    icon: React.ElementType;
  },
>({
  steps,
  currentStep,
  stepCompleted,
  onStepSelect,
}: StepperProps<T>) => {
  const renderStepStatusIcon = (step: T) => {
    if (step?.isDone) {
      return <CheckCircleIcon className="h-5 w-5 flex-shrink-0 text-green-600" />;
    }
    if (step?.id === currentStep) {
      return <CircleCheck className="h-5 w-5 flex-shrink-0 text-green-600" />;
    }
    return <Circle className="text-textPrimary-disable h-5 w-5 flex-shrink-0" />;
  };

  return (
    <div className="stepper-step-container relative bg-background">
      <div className="steps">
        {steps.map((step, _) => {
          const shouldDisableButton = !step?.isDone && step?.id !== stepCompleted + 1;

          return (
            <div
              key={step.id + _ + step.title}
              className={cn('single-step flex gap-3', {
                'step-done': !!step.isDone,
              })}
            >
              {renderStepStatusIcon(step)}
              <button
                onClick={() => onStepSelect(step?.id)}
                disabled={shouldDisableButton}
                className={cn('icon-btn w-full rounded px-3 py-2 hover:bg-accent', {
                  'bg-accent': currentStep === step?.id,
                  'cursor-not-allowed': shouldDisableButton,
                })}
              >
                <div
                  className={cn('flex h-full items-center gap-2', {
                    'text-textPrimary-disable': shouldDisableButton,
                  })}
                >
                  <step.icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{step.title}</span>
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
