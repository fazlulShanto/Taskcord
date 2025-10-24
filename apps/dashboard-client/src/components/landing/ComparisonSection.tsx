import { motion } from 'framer-motion';
import { Check, X, ArrowRight } from 'lucide-react';
import { useInView } from '@/hooks/use-in-view';
import { Button } from '@/components/ui/button';

export function ComparisonSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const features = [
    { name: 'Native Discord Bot', taskWaku: true, trello: false, linear: false, jira: false },
    { name: '2-Way GitHub Sync', taskWaku: true, trello: 'partial', linear: 'partial', jira: 'partial' },
    { name: 'Open Source', taskWaku: true, trello: false, linear: false, jira: false },
    { name: 'Self-Hostable', taskWaku: true, trello: false, linear: false, jira: 'enterprise' },
    { name: 'Setup Time', taskWaku: '< 5 min', trello: '30+ min', linear: '15 min', jira: '1+ hour' },
    { name: 'Learning Curve', taskWaku: 'Minimal', trello: 'Low', linear: 'Medium', jira: 'Steep' },
    { name: 'Price (per user)', taskWaku: '$2', trello: '$10+', linear: '$8+', jira: '$7.75+' },
    { name: 'Real-time Sync', taskWaku: '< 100ms', trello: 'Minutes', linear: 'Seconds', jira: 'Seconds' },
    { name: 'Offline Mode', taskWaku: true, trello: false, linear: false, jira: false },
    { name: 'API Access', taskWaku: true, trello: 'paid', linear: 'paid', jira: 'paid' },
  ];

  const renderCell = (value: boolean | string) => {
    if (value === true) {
      return (
        <div className="flex items-center justify-center">
          <div className="rounded-full bg-green-500/20 p-1">
            <Check className="h-5 w-5 text-green-400" />
          </div>
        </div>
      );
    }
    if (value === false) {
      return (
        <div className="flex items-center justify-center">
          <div className="rounded-full bg-red-500/20 p-1">
            <X className="h-5 w-5 text-red-400" />
          </div>
        </div>
      );
    }
    if (value === 'partial') {
      return (
        <div className="flex items-center justify-center">
          <span className="text-sm text-yellow-400">⚠️ Limited</span>
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center">
        <span className="text-sm text-gray-300">{value}</span>
      </div>
    );
  };

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
            Why{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Task Waku
            </span>{' '}
            Wins
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            Compare us to the tools you're currently using. The choice is clear.
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-4 text-left text-sm font-semibold text-gray-400">Feature</th>
                  <th className="relative p-4 text-center">
                    <div className="absolute -inset-x-4 -inset-y-2 rounded-2xl bg-gradient-to-b from-blue-500/20 to-purple-500/20" />
                    <div className="relative">
                      <div className="mb-1 text-lg font-bold text-white">Task Waku</div>
                      <div className="text-xs text-blue-400">Our Solution</div>
                    </div>
                  </th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-300">
                    <div>Trello</div>
                    <div className="text-xs font-normal text-gray-500">+ Zapier</div>
                  </th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-300">Linear</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-300">Jira</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                    className="border-b border-white/5 transition-colors hover:bg-white/5"
                  >
                    <td className="p-4 font-medium text-gray-300">{feature.name}</td>
                    <td className="relative p-4">
                      <div className="absolute inset-0 bg-blue-500/5" />
                      <div className="relative">{renderCell(feature.taskWaku)}</div>
                    </td>
                    <td className="p-4">{renderCell(feature.trello)}</td>
                    <td className="p-4">{renderCell(feature.linear)}</td>
                    <td className="p-4">{renderCell(feature.jira)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="mb-6 text-lg text-gray-300">
            Stop overpaying for tools that don't fit your workflow.
          </p>
          <Button size="lg" className="group gap-2 bg-blue-600 hover:bg-blue-700">
            Try Task Waku Free
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
    </section>
  );
}
