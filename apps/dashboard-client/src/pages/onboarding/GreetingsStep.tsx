import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Rocket, Bot, Server, Sparkles } from 'lucide-react';

export function AnimatedBot() {
  return (
    <motion.div
      animate={{ y: [0, -15, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="absolute right-2 top-0 -z-10 inline-block"
    >
      <Bot className="h-24 w-24 text-purple-600" />
    </motion.div>
  );
}

export function GreetingsStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="relative flex h-[600px] items-center justify-center">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-30" />
      <AnimatedBot />
      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="relative z-10 max-w-2xl space-y-8 px-4 text-center"
      >
        {/* Animated header */}
        <div className="overflow-hidden">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-5xl font-bold text-transparent md:text-5xl">
              <span className="text-primary"> Welcome to</span> {import.meta.env.VITE_APP_NAME}
            </h1>
          </motion.div>
        </div>

        {/* Animated subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mx-auto max-w-xl text-xl text-muted-foreground"
        >
          Transform your team's productivity with seamless Discord integration
        </motion.p>

        {/* Feature badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <div className="flex items-center gap-2 rounded-full border bg-background px-4 py-2 shadow-sm">
            <Bot className="h-5 w-5 text-purple-600" />
            <span className="text-sm">Smart Discord Bot</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border bg-background px-4 py-2 shadow-sm">
            <Server className="h-5 w-5 text-blue-600" />
            <span className="text-sm">Sync Data between platforms</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border bg-background px-4 py-2 shadow-sm">
            <Sparkles className="h-5 w-5 text-yellow-600" />
            <span className="text-sm text-muted-foreground">Kanban</span>
          </div>
        </motion.div>

        {/* Animated CTA button */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <Button
            size="lg"
            onClick={onNext}
            className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-lg hover:from-blue-700 hover:to-purple-700"
          >
            <span className="relative z-10 flex items-center gap-2 text-primary">
              Get Started
              <Rocket className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </span>
            {/* Button shine effect */}
            <div className="absolute inset-0 opacity-30 transition-opacity group-hover:opacity-30">
              <div className="animate-shine absolute -inset-8 bg-gradient-to-r from-white/40 via-white/0 to-white/40" />
            </div>
          </Button>
        </motion.div>

        {/* Floating demo preview */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative mx-auto mt-12 hidden max-w-3xl"
        >
          <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 blur-2xl" />
          <div className="rounded-xl border bg-background/50 p-4 shadow-2xl backdrop-blur-lg">
            <div className="flex gap-4">
              {/* Left side - Task list demo */}
              <div className="flex-1 space-y-4 text-left">
                <div className="h-4 w-3/4 rounded bg-muted" />
                <div className="space-y-2">
                  <div className="h-3 w-full rounded bg-muted" />
                  <div className="h-3 w-2/3 rounded bg-muted" />
                  <div className="h-3 w-1/2 rounded bg-muted" />
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-8 rounded-full bg-muted" />
                  <div className="h-8 w-20 rounded-lg bg-blue-600" />
                </div>
              </div>

              {/* Right side - Discord demo */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-muted" />
                  <div className="h-4 w-1/2 rounded bg-muted" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full rounded bg-muted" />
                  <div className="h-3 w-3/4 rounded bg-muted" />
                  <div className="h-3 w-2/3 rounded bg-muted" />
                </div>
                <div className="h-8 w-full rounded-lg bg-[#5865F2]" />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
