import { motion } from 'framer-motion';
import { ArrowRight, Github, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-blue-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
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
            <Badge variant="secondary" className="gap-2 bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>Open Source</span>
            </Badge>
            <Badge variant="secondary" className="gap-2 bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
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
            A minimal project management app natively built for Discord-centric, GitHub-powered teams.
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
              className="group gap-2 bg-blue-600 px-8 py-6 text-lg font-semibold hover:bg-blue-700"
            >
              <Github className="h-5 w-5" />
              Sign Up with GitHub
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="gap-2 border-white/20 bg-white/5 px-8 py-6 text-lg font-semibold text-white backdrop-blur-sm hover:bg-white/10"
            >
              <svg className="h-5 w-5" viewBox="0 0 71 55" fill="currentColor">
                <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.655 45.5182 70.6885 45.459 70.6941 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" />
              </svg>
              Add to Discord
            </Button>
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
              <div className="absolute right-4 top-4 rounded-lg bg-black/50 px-4 py-2 backdrop-blur-sm">
                <span className="text-sm font-semibold text-white">✨ See it in action</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
