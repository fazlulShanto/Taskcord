import { DiscordSignIn } from '@/components/common/discord-signin';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Github, Star } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-blue-900">
      {/* Animated background elements */}
      <div className="bg-grid-white/[0.02] absolute inset-0 bg-[size:50px_50px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center"
        >
          {/* Social Proof Badges */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6 flex flex-wrap items-center justify-center gap-3"
          >
            <Badge
              variant="secondary"
              className="gap-2 bg-white/10 px-4 py-2 text-sm backdrop-blur-sm"
            >
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>Open Source</span>
            </Badge>
            <Badge
              variant="secondary"
              className="gap-2 bg-white/10 px-4 py-2 text-sm backdrop-blur-sm"
            >
              <Github className="h-4 w-4" />
              <span>1.2k+ Stars</span>
            </Badge>
            <Badge variant="secondary" className="bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
              No Credit Card Required
            </Badge>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6 text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            Stop Switching.{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Start Unifying.
            </span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-4 text-xl text-gray-300 sm:text-2xl"
          >
            Your Entire Workflow in Discord.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-10 text-lg text-gray-400"
          >
            A minimal project management app natively built for Discord-centric, GitHub-powered
            teams.
            <br />
            Eliminate context switching and create a single source of truth.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button
              size="lg"
              className="group gap-2 bg-blue-600 px-8 py-6 text-lg font-semibold text-white hover:bg-blue-700"
            >
              <Github className="h-5 w-5" />
              Sign Up with GitHub
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>

            <DiscordSignIn className="rounded-md border border-gray-300 p-3" />
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400"
          >
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-400" />
              <span>Used by 500+ teams</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-400" />
              <span>50k+ tasks synced</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-400" />
              <span>Free forever</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Hero Visual/Demo */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-20"
        >
          <div className="relative mx-auto max-w-5xl">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 blur-3xl" />
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gray-900/50 p-2 backdrop-blur-sm">
              <img
                src="/api/placeholder/1200/700"
                alt="Task Waku Dashboard"
                className="w-full rounded-lg"
              />
              {/* Overlay badge */}
              <div className="absolute top-4 right-4 rounded-lg bg-black/50 px-4 py-2 backdrop-blur-sm">
                <span className="text-sm font-semibold text-white">✨ See it in action</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
