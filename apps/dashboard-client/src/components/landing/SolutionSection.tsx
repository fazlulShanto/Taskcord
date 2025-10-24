import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useInView } from '@/hooks/use-in-view';
import { Button } from '@/components/ui/button';

export function SolutionSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const benefits = [
    'No more switching between tools',
    'Single source of truth for your team',
    'Two-way sync that actually works',
    'Built for developers, by developers',
    'Open source and transparent',
    'Setup in under 5 minutes',
  ];

  return (
    <section ref={ref} className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <h2 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Task Waku:{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Your Project Command Center,
              </span>{' '}
              Right in Discord.
            </h2>
            
            <p className="mb-6 text-xl text-gray-300">
              A minimal yet powerful project management application that unifies your workflow.
            </p>

            <div className="mb-8 space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 rounded-full bg-blue-500/10 p-1">
                  <CheckCircle2 className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Dedicated Discord Bot as Primary Interface</h3>
                  <p className="text-gray-400">
                    Turn Discord into a command center. Manage everything without ever leaving your chat.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 rounded-full bg-blue-500/10 p-1">
                  <CheckCircle2 className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Deep, Two-Way GitHub Synchronization</h3>
                  <p className="text-gray-400">
                    Your code and tasks stay perfectly aligned. Issues, PRs, comments—all synced in real-time.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 rounded-full bg-blue-500/10 p-1">
                  <CheckCircle2 className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Beautiful, Minimal Web Dashboard</h3>
                  <p className="text-gray-400">
                    Visual Kanban boards, timeline views, and analytics—all without the bloat.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-8 grid grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-gray-300">{benefit}</span>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="group gap-2 bg-blue-600 hover:bg-blue-700">
                Get Started Free
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
                View Demo
              </Button>
            </div>
          </motion.div>

          {/* Right: Visual/Graphic */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-8 rounded-3xl bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 opacity-20 blur-3xl" />
            <div className="relative">
              {/* This would be your product screenshot or illustration */}
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-gray-900/50 p-4 backdrop-blur-sm">
                <div className="aspect-[4/3] rounded-lg bg-gradient-to-br from-blue-900/50 to-purple-900/50">
                  {/* Placeholder for product image */}
                  <div className="flex h-full items-center justify-center text-gray-400">
                    Product Demo Visualization
                  </div>
                </div>
              </div>

              {/* Floating stat cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="absolute -bottom-6 -left-6 rounded-xl border border-white/10 bg-gray-900/90 p-4 backdrop-blur-sm"
              >
                <div className="text-3xl font-bold text-blue-400">10x</div>
                <div className="text-sm text-gray-400">Faster sync</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 1 }}
                className="absolute -right-6 -top-6 rounded-xl border border-white/10 bg-gray-900/90 p-4 backdrop-blur-sm"
              >
                <div className="text-3xl font-bold text-green-400">99.9%</div>
                <div className="text-sm text-gray-400">Uptime</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative gradient */}
      <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 blur-3xl" />
    </section>
  );
}
