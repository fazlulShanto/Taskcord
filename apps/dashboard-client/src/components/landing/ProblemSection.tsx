import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, Search, Zap } from 'lucide-react';
import { useInView } from '@/hooks/use-in-view';

export function ProblemSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const problems = [
    {
      icon: RefreshCw,
      title: 'Constant Context Switching',
      description: 'Jump between Discord, GitHub, and your PM tool dozens of times a day. Each switch kills your focus and productivity.',
      stat: '23% of time wasted',
    },
    {
      icon: Search,
      title: 'Information Gets Lost',
      description: 'Critical task updates buried in Discord chat history. Important GitHub discussions disconnected from your board.',
      stat: '13 context switches/day',
    },
    {
      icon: AlertCircle,
      title: 'Superficial Integrations',
      description: 'Existing tools offer one-way syncs or complex third-party connectors like Zapier. Nothing truly unifies your workflow.',
      stat: '3+ tools to manage',
    },
    {
      icon: Zap,
      title: 'Steep Learning Curves',
      description: 'Bloated PM tools with features you\'ll never use. Your team spends more time learning the tool than actually working.',
      stat: '2+ hours onboarding',
    },
  ];

  return (
    <section ref={ref} className="relative bg-gradient-to-b from-gray-900 to-slate-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Tired of Juggling{' '}
            <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              Three Tools
            </span>{' '}
            to Manage One Project?
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            You're not alone. Modern development teams are drowning in tool sprawl, and it's killing productivity.
          </p>
        </motion.div>

        {/* Problem Grid */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-red-500/20 to-orange-500/20 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative h-full rounded-2xl border border-white/5 bg-gray-800/50 p-6 backdrop-blur-sm transition-all group-hover:border-white/10">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="rounded-lg bg-red-500/10 p-3">
                      <Icon className="h-6 w-6 text-red-400" />
                    </div>
                    <span className="text-sm font-semibold text-red-400">{problem.stat}</span>
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-white">{problem.title}</h3>
                  <p className="text-gray-400">{problem.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Dramatic Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-2xl font-semibold text-gray-300">
            Teams rely on a patchwork of tools: a PM tool, GitHub for code, and Discord for chat.
          </p>
          <p className="mt-4 text-xl text-gray-400">
            This forces constant context switching, leading to lost focus and missed information.
          </p>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute left-0 top-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-red-500/10 blur-3xl" />
      <div className="absolute right-0 top-1/4 h-96 w-96 translate-x-1/2 rounded-full bg-orange-500/10 blur-3xl" />
    </section>
  );
}
