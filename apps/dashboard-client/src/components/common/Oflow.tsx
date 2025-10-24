// components/onboarding/onboarding-flow.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, ChevronLeft } from 'lucide-react';
import * as React from 'react';

type Step = 'welcome' | 'project' | 'discord' | 'verification' | 'complete';

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = React.useState<Step>('welcome');
  const [progress, setProgress] = React.useState(20);

  const steps: Step[] = ['welcome', 'project', 'discord', 'verification', 'complete'];

  const handleNext = () => {
    const nextIndex = steps.indexOf(currentStep) + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
      setProgress((nextIndex / (steps.length - 1)) * 100);
    }
  };

  const handleBack = () => {
    const prevIndex = steps.indexOf(currentStep) - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
      setProgress((prevIndex / (steps.length - 1)) * 100);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] p-4">
      <Card className="w-full max-w-2xl overflow-hidden shadow-xl">
        <div className="bg-muted/50 p-4">
          <Progress value={progress} className="h-2 transition-all duration-500" />
        </div>

        <CardContent className="p-8">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 'welcome' && <WelcomeStep onNext={handleNext} />}
            {currentStep === 'project' && <ProjectStep onNext={handleNext} />}
            {currentStep === 'discord' && <DiscordStep onNext={handleNext} />}
            {currentStep === 'verification' && <VerificationStep onNext={handleNext} />}
            {currentStep === 'complete' && <CompleteStep />}
          </motion.div>

          {currentStep !== 'welcome' && currentStep !== 'complete' && (
            <div className="mt-8 flex justify-between">
              <Button variant="ghost" onClick={handleBack}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button onClick={handleNext}>Continue</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Welcome Step Component
function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="space-y-6 text-center">
      <div className="space-y-2">
        <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
          Welcome to TaskFlow
        </h1>
        <p className="text-muted-foreground">
          Let's create your perfect task management setup with Discord
        </p>
      </div>
      <Button size="lg" onClick={onNext}>
        Get Started
      </Button>
    </div>
  );
}

// Project Step Component
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const projectFormSchema = z.object({
  projectName: z.string().min(3).max(50),
  description: z.string().max(200).optional(),
});

function ProjectStep({ onNext }: { onNext: () => void }) {
  const form = useForm<z.infer<typeof projectFormSchema>>({
    resolver: zodResolver(projectFormSchema),
  });

  function onSubmit(values: z.infer<typeof projectFormSchema>) {
    console.log(values);
    onNext();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="projectName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="Acme Marketing Team" {...field} className="h-12 text-lg" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your project..."
                  {...field}
                  className="h-24 resize-none"
                />
              </FormControl>
              <div className="text-right text-sm text-muted-foreground">
                {field.value?.length || 0}/200
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Continue to Discord Setup
        </Button>
      </form>
    </Form>
  );
}

// Discord Step Component
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

function DiscordStep({ onNext }: { onNext: () => void }) {
  const [servers] = React.useState([
    { id: '1', name: 'Design Team', icon: '🎨' },
    { id: '2', name: 'Dev Squad', icon: '👨💻' },
  ]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Connect to Discord</h3>
        <p className="text-muted-foreground">Select your server to integrate with TaskFlow</p>
      </div>

      <Select>
        <SelectTrigger className="h-14">
          <SelectValue placeholder="Select a server" />
        </SelectTrigger>
        <SelectContent>
          {servers.map((server) => (
            <SelectItem key={server.id} value={server.id}>
              <div className="flex items-center gap-3">
                <span className="text-xl">{server.icon}</span>
                <span>{server.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4">
        <h4 className="mb-2 font-medium text-blue-800">Required Permissions</h4>
        <ul className="list-disc space-y-1 pl-5 text-sm text-blue-700">
          <li>Read Messages</li>
          <li>Send Messages</li>
          <li>Manage Channels</li>
        </ul>
      </div>

      <Button className="w-full bg-[#5865F2] hover:bg-[#4752C4]" onClick={onNext}>
        Authorize & Install Bot
      </Button>
    </div>
  );
}

// Verification Step Component
function VerificationStep({ onNext }: { onNext: () => void }) {
  const [status, setStatus] = React.useState<'loading' | 'success' | 'error'>('loading');

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setStatus('success');
      setTimeout(onNext, 1500);
    }, 2000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        {status === 'loading' && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100"
          >
            <div className="h-8 w-8 animate-pulse rounded-full bg-blue-500" />
          </motion.div>
        )}

        {status === 'success' && <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />}

        {status === 'error' && <AlertCircle className="mx-auto h-16 w-16 text-red-500" />}
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold">
          {status === 'loading' && 'Verifying Bot Installation...'}
          {status === 'success' && 'Verification Successful!'}
          {status === 'error' && 'Installation Failed'}
        </h3>
        <p className="text-muted-foreground">
          {status === 'loading' && 'This will just take a moment...'}
          {status === 'success' && 'Bot is now connected to your server'}
          {status === 'error' && 'Please check bot permissions and try again'}
        </p>
      </div>
    </div>
  );
}

// Complete Step Component
function CompleteStep() {
  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <CheckCircle2 className="h-24 w-24 text-green-500" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Setup Complete! 🎉</h1>
        <p className="text-muted-foreground">Your workspace is ready for action</p>
      </div>

      <div className="space-y-4">
        <Button className="w-full">Go to Dashboard</Button>
        <div className="text-sm text-muted-foreground">
          Next steps:
          <ul className="mt-2 space-y-1">
            <li>• Invite your team members</li>
            <li>• Configure notification settings</li>
            <li>• Create your first task</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
