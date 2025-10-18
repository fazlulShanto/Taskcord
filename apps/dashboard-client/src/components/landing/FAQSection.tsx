import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useInView } from '@/hooks/use-in-view';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

export function FAQSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const faqs = [
    {
      question: 'Do I need to host my own server?',
      answer: 'No! We offer a fully managed cloud solution at $2/member/month. But if you want complete control, our open-source version can be self-hosted on your own infrastructure with Docker or Kubernetes.',
    },
    {
      question: 'What happens to my data if I want to switch?',
      answer: 'You own your data, always. Export all your projects, tasks, and history anytime in JSON or CSV format. Our open-source nature means no vendor lock-in—you can even fork the code if needed.',
    },
    {
      question: 'How hard is the Discord bot setup?',
      answer: 'Super easy! Just click "Add to Discord," authorize the bot, and you\'re done. It takes about 30 seconds. Then use slash commands like /task create to start managing your projects.',
    },
    {
      question: 'Can I migrate from Trello, Linear, or Jira?',
      answer: 'Yes! We support CSV import for tasks and projects. For GitHub issues, they sync automatically once you connect your repo. We also offer migration assistance for teams on our Managed Cloud plan.',
    },
    {
      question: 'How does the GitHub sync work?',
      answer: 'It\'s a true two-way sync. When you create a task in Task Waku, it appears as a GitHub issue. When someone comments on that issue, the comment appears in your task. Labels, assignees, and status changes sync in real-time (< 100ms).',
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. We use end-to-end encryption, OAuth 2.0 authentication (we never see your passwords), and encrypt data at rest and in transit. We\'re working toward SOC 2 compliance for enterprise customers.',
    },
    {
      question: 'What\'s included in the free plan?',
      answer: 'Everything! Our open-source version has no feature limitations. The Managed Cloud plan adds hosting, backups, priority support, and advanced analytics. Small teams (up to 5 members) can use Managed Cloud free forever.',
    },
    {
      question: 'Can I use this for non-development projects?',
      answer: 'Definitely! While we\'re optimized for dev teams using Discord + GitHub, our Kanban boards and task management work great for any team—marketing, design, operations, you name it.',
    },
  ];

  return (
    <section ref={ref} className="relative bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            Everything you need to know about Task Waku. Can't find your answer?{' '}
            <a href="#" className="text-blue-400 hover:underline">
              Reach out to us
            </a>
            .
          </p>
        </motion.div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} faq={faq} index={index} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQItem({ 
  faq, 
  index, 
  inView 
}: { 
  faq: { question: string; answer: string }; 
  index: number; 
  inView: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="group rounded-2xl border border-white/10 bg-gray-800/50 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-gray-800/70">
          <CollapsibleTrigger className="flex w-full items-center justify-between p-6 text-left">
            <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
              {faq.question}
            </h3>
            <ChevronDown
              className={`h-5 w-5 flex-shrink-0 text-gray-400 transition-transform ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="border-t border-white/10 px-6 pb-6 pt-4">
              <p className="text-gray-400">{faq.answer}</p>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </motion.div>
  );
}
