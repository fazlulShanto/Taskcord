import { motion } from 'framer-motion';
import { Github, Heart, Users, Code2, Shield, TrendingUp } from 'lucide-react';
import { useInView } from '@/hooks/use-in-view';
import { Button } from '@/components/ui/button';

export function OpenSourceSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const benefits = [
    {
      icon: Shield,
      title: 'Transparent & Trustworthy',
      description: 'Every line of code is open for review. No hidden tracking, no vendor lock-in.',
    },
    {
      icon: Users,
      title: 'Community-Driven',
      description: 'Built with input from 100+ contributors. Your feedback shapes the roadmap.',
    },
    {
      icon: Code2,
      title: 'Self-Host Ready',
      description: 'Deploy on your infrastructure with full control over your data and privacy.',
    },
    {
      icon: TrendingUp,
      title: 'Rapid Innovation',
      description: 'New features ship weekly. Security patches deployed within hours, not days.',
    },
  ];

  const stats = [
    { label: 'GitHub Stars', value: '1.2k+' },
    { label: 'Contributors', value: '100+' },
    { label: 'Commits', value: '5,000+' },
    { label: 'Community Members', value: '2,500+' },
  ];

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-b from-gray-900 via-slate-900 to-gray-900 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 self-start rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2">
              <Heart className="h-4 w-4 fill-pink-500 text-pink-500" />
              <span className="text-sm font-semibold text-purple-300">Open Source</span>
            </div>

            <h2 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Transparent,{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Community-Driven,
              </span>{' '}
              and Free
            </h2>

            <p className="mb-8 text-lg text-gray-300">
              Task Waku is built on open-source principles. We believe in transparency, community
              collaboration, and giving you complete control over your project management tools.
            </p>

            {/* Benefits Grid */}
            <div className="mb-8 grid gap-6 sm:grid-cols-2">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    className="flex gap-3"
                  >
                    <div className="flex-shrink-0">
                      <div className="rounded-lg bg-purple-500/10 p-2">
                        <Icon className="h-5 w-5 text-purple-400" />
                      </div>
                    </div>
                    <div>
                      <h3 className="mb-1 font-semibold text-white">{benefit.title}</h3>
                      <p className="text-sm text-gray-400">{benefit.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                size="lg"
                className="group gap-2 border border-white/20 bg-white/5 text-white hover:bg-white/10"
              >
                <Github className="h-5 w-5" />
                Star on GitHub
              </Button>
              <Button size="lg" className="group gap-2 bg-purple-600 hover:bg-purple-700">
                <svg className="h-5 w-5" viewBox="0 0 71 55" fill="currentColor">
                  <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.655 45.5182 70.6885 45.459 70.6941 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" />
                </svg>
                Join Discord Community
              </Button>
            </div>
          </motion.div>

          {/* Right: Stats & Visual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  className="group relative"
                >
                  <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="relative rounded-2xl border border-white/10 bg-gray-800/50 p-6 backdrop-blur-sm">
                    <div className="mb-2 text-4xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* GitHub Activity Visualization */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-8"
            >
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-gray-800/50 p-6 backdrop-blur-sm">
                <div className="mb-4 flex items-center gap-3">
                  <Github className="h-6 w-6 text-white" />
                  <div>
                    <div className="font-semibold text-white">fazlulShanto/task-waku</div>
                    <div className="text-sm text-gray-400">Public repository</div>
                  </div>
                </div>

                {/* Contribution graph placeholder */}
                <div className="space-y-2">
                  <div className="flex gap-1">
                    {Array.from({ length: 52 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-3 w-3 rounded-sm ${
                          Math.random() > 0.3
                            ? 'bg-green-500/80'
                            : Math.random() > 0.5
                              ? 'bg-green-500/50'
                              : 'bg-gray-700'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">
                    Active development & community contributions
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Decorative gradient */}
      <div className="absolute top-0 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-3xl" />
    </section>
  );
}
