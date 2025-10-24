import { motion } from 'framer-motion';
import { Briefcase, Code, Sparkles } from 'lucide-react';
import { useInView } from '@/hooks/use-in-view';

export function PersonaSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const personas = [
    {
      icon: Code,
      name: 'Alex',
      role: 'Engineering Team Lead',
      company: '15-person startup',
      problem: 'Frustrated with tool sprawl and clunky Trello-GitHub integration',
      quote: "I need a tool that fits our Discord-centric workflow, not one that fights it.",
      painPoints: [
        'Team already lives in Discord',
        'Trello feels disconnected from GitHub',
        'Zapier integrations break constantly',
        'Need something developer-friendly',
      ],
    },
    {
      icon: Briefcase,
      name: 'Sarah',
      role: 'Agile Product Manager',
      company: 'Remote marketing agency',
      problem: 'Lost tasks in Discord threads, no visibility into sprint progress',
      quote: "I can't get my team to open Jira. They just want to work in Discord.",
      painPoints: [
        'Team ignores traditional PM tools',
        'Hard to track sprint velocity',
        'Tasks get lost in chat',
        'Need lightweight solution',
      ],
    },
    {
      icon: Sparkles,
      name: 'Jamie',
      role: 'Solo Indie Developer',
      company: 'Building open-source projects',
      problem: 'Juggling GitHub issues, Discord community, and personal todos',
      quote: "I want to manage my GitHub issues without leaving Discord.",
      painPoints: [
        'Managing multiple repos',
        'Active Discord community',
        'Too many browser tabs',
        'Need simplicity and speed',
      ],
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
            Built for Teams That{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Live in Discord
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            Designed for small software teams, agile marketers, and indie creators who value Discord's collaborative community vibe.
          </p>
        </motion.div>

        {/* Persona Cards */}
        <div className="mt-20 grid gap-8 lg:grid-cols-3">
          {personas.map((persona, index) => {
            const Icon = persona.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="group relative"
              >
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-purple-500/20 to-pink-500/20 opacity-0 transition-opacity group-hover:opacity-100" />
                
                <div className="relative h-full rounded-2xl border border-white/10 bg-gray-800/50 p-8 backdrop-blur-sm">
                  {/* Avatar & Icon */}
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{persona.name}</h3>
                      <p className="text-sm text-gray-400">{persona.role}</p>
                      <p className="text-xs text-gray-500">{persona.company}</p>
                    </div>
                  </div>

                  {/* Problem */}
                  <div className="mb-6">
                    <h4 className="mb-2 text-sm font-semibold text-red-400">The Problem:</h4>
                    <p className="text-gray-400">{persona.problem}</p>
                  </div>

                  {/* Quote */}
                  <div className="mb-6 border-l-4 border-purple-500 bg-purple-500/10 p-4">
                    <p className="italic text-gray-300">"{persona.quote}"</p>
                  </div>

                  {/* Pain Points */}
                  <div>
                    <h4 className="mb-3 text-sm font-semibold text-gray-300">Pain Points:</h4>
                    <ul className="space-y-2">
                      {persona.painPoints.map((point, pIndex) => (
                        <li key={pIndex} className="flex items-start gap-2 text-sm text-gray-400">
                          <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-400" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-xl font-semibold text-white">
            Does this sound like you?
          </p>
          <p className="mt-2 text-gray-400">
            Join 500+ teams who've eliminated context switching and found their flow.
          </p>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute right-0 top-1/2 h-96 w-96 translate-x-1/2 rounded-full bg-purple-500/10 blur-3xl" />
    </section>
  );
}
