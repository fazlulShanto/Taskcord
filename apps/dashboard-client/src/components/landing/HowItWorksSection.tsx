import { motion } from 'framer-motion';
import { MessageSquare, RefreshCcw, BarChart3, ArrowRight } from 'lucide-react';
import { useInView } from '@/hooks/use-in-view';

export function HowItWorksSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const steps = [
    {
      icon: MessageSquare,
      number: '01',
      title: 'Work in Discord',
      description: 'Use intuitive slash commands to create, assign, and update tasks. No need to open another app.',
      commands: ['/task create', '/task assign', '/board view'],
      gradient: 'from-purple-500 to-blue-500',
    },
    {
      icon: RefreshCcw,
      number: '02',
      title: 'Auto-Sync with GitHub',
      description: 'GitHub issues and PRs automatically become tasks. Comments, status changes, and labels sync instantly.',
      commands: ['Issues → Tasks', 'PRs → Tasks', 'Comments sync'],
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: BarChart3,
      number: '03',
      title: 'Visualize on Web',
      description: 'See your Kanban board, timelines, burndown charts, and team analytics in a beautiful dashboard.',
      commands: ['Kanban boards', 'Timeline view', 'Analytics'],
      gradient: 'from-cyan-500 to-teal-500',
    },
  ];

  return (
    <section ref={ref} className="relative bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Three Tools.{' '}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              One Workflow.
            </span>{' '}
            Zero Friction.
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            Here's how Task Waku brings it all together in seconds.
          </p>
        </motion.div>

        {/* Steps Flow */}
        <div className="mt-20 space-y-16 lg:space-y-24">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 0;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`grid gap-8 lg:grid-cols-2 lg:gap-16 ${isEven ? '' : 'lg:grid-flow-dense'}`}
              >
                {/* Content */}
                <div className={`flex flex-col justify-center ${isEven ? '' : 'lg:col-start-2'}`}>
                  <div className="mb-6 flex items-center gap-4">
                    <span className={`bg-gradient-to-r ${step.gradient} bg-clip-text text-6xl font-bold text-transparent`}>
                      {step.number}
                    </span>
                    <div className={`rounded-2xl bg-gradient-to-r ${step.gradient} p-4`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
                    {step.title}
                  </h3>
                  
                  <p className="mb-6 text-lg text-gray-400">
                    {step.description}
                  </p>

                  {/* Feature tags */}
                  <div className="flex flex-wrap gap-3">
                    {step.commands.map((command, cmdIndex) => (
                      <span
                        key={cmdIndex}
                        className="rounded-lg bg-white/5 px-4 py-2 font-mono text-sm text-gray-300 backdrop-blur-sm"
                      >
                        {command}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Visual */}
                <div className={`relative ${isEven ? '' : 'lg:col-start-1 lg:row-start-1'}`}>
                  <div className={`absolute -inset-4 rounded-3xl bg-gradient-to-r ${step.gradient} opacity-20 blur-3xl`} />
                  <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gray-800/50 p-6 backdrop-blur-sm">
                    {/* Placeholder for step illustration */}
                    <div className="aspect-square rounded-lg bg-gradient-to-br from-gray-700 to-gray-800">
                      <div className="flex h-full items-center justify-center text-gray-500">
                        Step {step.number} Illustration
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Flow Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="inline-flex items-center gap-4 rounded-full border border-white/10 bg-white/5 px-8 py-4 backdrop-blur-sm">
            <span className="text-lg font-semibold text-white">Discord</span>
            <ArrowRight className="h-5 w-5 text-blue-400" />
            <span className="text-lg font-semibold text-white">GitHub</span>
            <ArrowRight className="h-5 w-5 text-blue-400" />
            <span className="text-lg font-semibold text-white">Web Dashboard</span>
            <ArrowRight className="h-5 w-5 text-blue-400" />
            <span className="bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-lg font-bold text-transparent">
              ✨ Unified
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
