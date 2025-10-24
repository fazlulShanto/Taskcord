import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Interactive Demo Component
 * Shows the "aha moment" - Discord command → Task creation → GitHub sync
 * Can be embedded in Hero or as standalone section
 */
export function InteractiveDemo() {
  const [step, setStep] = useState(0);
  const [command, setCommand] = useState('');

  const demoSteps = [
    {
      title: 'Type a Discord command',
      placeholder: '/task create "Fix navigation bug"',
      action: 'Send',
    },
    {
      title: 'Task appears on your board',
      action: 'Next',
    },
    {
      title: 'Syncs to GitHub automatically',
      action: 'See it live',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < demoSteps.length - 1) {
      setStep(step + 1);
    }
  };

  const reset = () => {
    setStep(0);
    setCommand('');
  };

  return (
    <div className="mx-auto max-w-4xl">
      {/* Demo Header */}
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2">
          <span className="text-sm font-semibold text-blue-400">✨ Try it yourself</span>
        </div>
        <h3 className="mb-2 text-2xl font-bold text-white">See the Magic in Action</h3>
        <p className="text-gray-400">
          Watch how a single Discord command syncs across your entire workflow
        </p>
      </div>

      {/* Demo Container */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gray-900/50 p-8 backdrop-blur-sm">
        {/* Progress Indicator */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {demoSteps.map((_, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`h-2 w-2 rounded-full transition-all ${
                  index <= step ? 'bg-blue-500' : 'bg-gray-600'
                }`}
              />
              {index < demoSteps.length - 1 && (
                <div
                  className={`h-0.5 w-16 transition-all ${
                    index < step ? 'bg-blue-500' : 'bg-gray-600'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Demo Steps */}
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h4 className="mb-2 text-xl font-semibold text-white">{demoSteps[0].title}</h4>
              </div>

              {/* Mock Discord Interface */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="rounded-lg bg-gray-800/50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500" />
                    <span className="text-sm font-semibold text-gray-300">general</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={command}
                      onChange={(e) => setCommand(e.target.value)}
                      placeholder={demoSteps[0].placeholder}
                      className="flex-1 rounded-lg border border-white/10 bg-gray-700/50 px-4 py-3 text-white placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                    />
                    <Button
                      type="submit"
                      size="sm"
                      className="gap-2 bg-blue-600 hover:bg-blue-700"
                      disabled={!command}
                    >
                      <Send className="h-4 w-4" />
                      Send
                    </Button>
                  </div>
                </div>
              </form>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <div className="mb-4 inline-flex items-center gap-2 text-green-400">
                  <Check className="h-6 w-6" />
                  <span className="font-semibold">Task Created!</span>
                </div>
                <h4 className="mb-2 text-xl font-semibold text-white">{demoSteps[1].title}</h4>
              </div>

              {/* Mock Kanban Board */}
              <div className="rounded-lg bg-gray-800/50 p-6">
                <div className="mb-4 text-sm font-semibold text-gray-400">TO DO</div>
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-lg border border-white/10 bg-gray-700/50 p-4"
                >
                  <h5 className="mb-2 font-semibold text-white">Fix navigation bug</h5>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
                    <span className="text-sm text-gray-400">Just now</span>
                  </div>
                </motion.div>
              </div>

              <Button onClick={() => setStep(2)} className="w-full bg-blue-600 hover:bg-blue-700">
                Next
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <div className="mb-4 inline-flex items-center gap-2 text-green-400">
                  <Check className="h-6 w-6" />
                  <span className="font-semibold">Synced to GitHub!</span>
                </div>
                <h4 className="mb-2 text-xl font-semibold text-white">{demoSteps[2].title}</h4>
              </div>

              {/* Mock GitHub Issue */}
              <div className="rounded-lg bg-gray-800/50 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <svg className="h-6 w-6 text-white" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                  <div>
                    <div className="text-sm font-semibold text-white">#42 opened just now</div>
                    <div className="text-xs text-gray-400">your-repo/your-project</div>
                  </div>
                </div>
                <h5 className="mb-2 text-lg font-semibold text-white">Fix navigation bug</h5>
                <p className="text-sm text-gray-400">
                  Created automatically from Discord via Task Waku
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={reset}
                  variant="outline"
                  className="flex-1 border-white/20 bg-white/5 text-white hover:bg-white/10"
                >
                  Try Again
                </Button>
                <Button className="group flex-1 gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Sign Up Free
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating stats */}
        <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
          <div className="text-center">
            <div className="mb-1 text-2xl font-bold text-blue-400">{'<100ms'}</div>
            <div className="text-xs text-gray-400">Sync time</div>
          </div>
          <div className="text-center">
            <div className="mb-1 text-2xl font-bold text-green-400">100%</div>
            <div className="text-xs text-gray-400">Accurate</div>
          </div>
          <div className="text-center">
            <div className="mb-1 text-2xl font-bold text-purple-400">2-way</div>
            <div className="text-xs text-gray-400">Sync</div>
          </div>
        </div>
      </div>
    </div>
  );
}
