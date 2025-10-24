import { motion } from 'framer-motion';
import {
  MessageSquare,
  GitBranch,
  LayoutDashboard,
  Bell,
  TrendingUp,
  Zap,
  Lock,
  Rocket,
} from 'lucide-react';
import { useInView } from '@/hooks/use-in-view';

export function FeaturesSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const features = [
    {
      icon: MessageSquare,
      title: 'Deep Discord Integration',
      subtitle: 'Manage Your Project Without Leaving Your Chat',
      description:
        'Create, assign, and update tasks using simple slash commands. View Kanban boards and project progress directly in Discord channels.',
      highlights: [
        'Slash commands',
        'In-channel boards',
        'Thread-based discussions',
        'Inline updates',
      ],
      gradient: 'from-purple-500 to-blue-500',
    },
    {
      icon: GitBranch,
      title: 'Real-Time GitHub Sync',
      subtitle: 'Keep Your Code and Tasks in Perfect Sync',
      description:
        'A robust, two-way synchronization where GitHub issues and PRs automatically appear as tasks. Comments and status changes are mirrored in real-time.',
      highlights: ['Two-way sync', 'Auto-create tasks', 'Comment mirroring', 'Label mapping'],
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: LayoutDashboard,
      title: 'Minimal, Powerful PM',
      subtitle: 'All the Power You Need. None of the Bloat',
      description:
        'A clean, visual Kanban-style board with essential features like assignees, due dates, and milestone tracking. No steep learning curve.',
      highlights: ['Kanban boards', 'Timeline view', 'Drag & drop', 'Quick filters'],
      gradient: 'from-cyan-500 to-teal-500',
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      subtitle: 'Stay in the Loop, Without the Noise',
      description:
        'Get intelligent Discord notifications when tasks are assigned, deadlines approach, or PRs need review. No more missed updates buried in DMs.',
      highlights: ['Smart alerts', 'Digest mode', 'Custom triggers', 'Mention routing'],
      gradient: 'from-teal-500 to-green-500',
    },
    {
      icon: TrendingUp,
      title: 'Analytics & Insights',
      subtitle: "Understand Your Team's Velocity",
      description:
        'Built-in burndown charts, cycle time tracking, and productivity insights. See bottlenecks, sprint progress, and team performance at a glance.',
      highlights: ['Burndown charts', 'Cycle time', 'Velocity tracking', 'Sprint analytics'],
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      subtitle: 'Optimized for Speed and Performance',
      description:
        'Real-time updates across all platforms. Changes sync instantly between Discord, GitHub, and the web dashboard with zero lag.',
      highlights: ['< 100ms sync', 'Offline support', 'Optimistic UI', 'Edge caching'],
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Lock,
      title: 'Secure by Design',
      subtitle: 'Enterprise-Grade Security',
      description:
        'End-to-end encryption, OAuth-only authentication, and granular permissions. Your data is encrypted at rest and in transit.',
      highlights: ['E2E encryption', 'OAuth 2.0', 'RBAC', 'Audit logs'],
      gradient: 'from-red-500 to-pink-500',
    },
    {
      icon: Rocket,
      title: 'Self-Host Ready',
      subtitle: 'Your Infrastructure, Your Control',
      description:
        'Open-source core means you can deploy on your own infrastructure. Docker compose files and one-click deployment scripts included.',
      highlights: ['Docker ready', 'One-click deploy', 'Cloud agnostic', 'Full control'],
      gradient: 'from-pink-500 to-purple-500',
    },
  ];

  return (
    <section
      ref={ref}
      className="relative bg-gradient-to-b from-slate-900 to-gray-900 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Everything You Need.{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Nothing You Don't.
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            Powerful features designed for modern development teams. No bloat, no complexity.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative"
              >
                {/* Hover gradient border */}
                <div
                  className={`absolute -inset-px rounded-3xl bg-gradient-to-r ${feature.gradient} opacity-0 transition-opacity group-hover:opacity-100`}
                />

                <div className="relative h-full rounded-3xl border border-white/10 bg-gray-800/50 p-8 backdrop-blur-sm transition-all group-hover:border-transparent">
                  {/* Icon */}
                  <div
                    className={`mb-6 inline-flex rounded-2xl bg-gradient-to-r ${feature.gradient} p-4`}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="mb-2 text-2xl font-bold text-white">{feature.title}</h3>
                  <p className="mb-4 text-sm font-semibold text-blue-400">{feature.subtitle}</p>

                  {/* Description */}
                  <p className="mb-6 text-gray-400">{feature.description}</p>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2">
                    {feature.highlights.map((highlight, hIndex) => (
                      <span
                        key={hIndex}
                        className="rounded-lg bg-white/5 px-3 py-1 text-xs text-gray-300"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Decorative gradients */}
      <div className="absolute top-1/4 left-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute right-0 bottom-1/4 h-96 w-96 translate-x-1/2 rounded-full bg-purple-500/10 blur-3xl" />
    </section>
  );
}
