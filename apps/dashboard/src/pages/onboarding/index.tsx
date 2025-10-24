import { CheckCircle } from 'lucide-react';
import { ProjectDetails } from './CreateProject';
import { Stepper } from '@/components/extended-ui/stepper/stepper';
import { useState } from 'react';
import { ConnectGithub } from './ConnectGithub';
import { InviteBot } from './InviteBot';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { GreetingsStep } from './GreetingsStep';
import { ScrollArea } from '@/components/ui/scroll-area';

const steps = [
  {
    title: 'Greetings',
    isDone: false,
    icon: CheckCircle,
    content: GreetingsStep,
  },
  {
    title: 'Project Informations',
    isDone: false,
    icon: CheckCircle,
    content: ProjectDetails,
  },
  {
    title: 'Add Bot to Server',
    isDone: false,
    icon: CheckCircle,
    content: InviteBot,
  },
  {
    title: 'Connect Github',
    isDone: false,
    icon: CheckCircle,
    content: ConnectGithub,
  },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [stepCompleted, setStepCompleted] = useState(0);
  const [formSteps, setFormSteps] = useState(steps.map((s, idx) => ({ ...s, id: idx + 1 })));

  const handleStep = () => {
    setCurrentStep(currentStep + 1);
    setStepCompleted(Math.max(stepCompleted, currentStep));
    setFormSteps(
      formSteps.map((step) => {
        if (step.id === currentStep) {
          return { ...step, isDone: true };
        }
        return step;
      })
    );
  };

  const renderStep = () => {
    const Content = formSteps.find((step) => step.id === currentStep)?.content;
    if (!Content) {
      return null;
    }
    return <Content onNext={handleStep} />;
  };

  return (
    <Dialog open modal={false}>
      <DialogContent className="flex h-[80vh] max-w-4xl gap-0 overflow-hidden p-0 [&>button]:hidden">
        <div className="border-r-borderPrimary-disable min-w-fit border-0 p-3 sm:border-r">
          <Stepper
            steps={formSteps}
            currentStep={currentStep}
            stepCompleted={stepCompleted}
            onStepSelect={setCurrentStep}
          />
        </div>
        <ScrollArea className="flex w-full flex-col gap-4">{renderStep()}</ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
