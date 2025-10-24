import { motion } from 'framer-motion';
import { Check, ArrowRight, Star, Sparkles } from 'lucide-react';
import { useInView } from '@/hooks/use-in-view';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function PricingSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const plans = [
    {
      name: 'Open Source',
      subtitle: 'Self-Hosted',
      price: 'Free',
      period: 'forever',
      description: 'Perfect for teams who want complete control over their infrastructure.',
      features: [
        'Full source code access',
        'Unlimited projects & tasks',
        'Discord & GitHub integration',
        'Self-host on your servers',
        'Community support',
        'Docker & Kubernetes ready',
        'No telemetry or tracking',
        'MIT License',
      ],
      cta: 'Star on GitHub',
      ctaVariant: 'outline' as const,
      popular: false,
      icon: Star,
    },
    {
      name: 'Managed Cloud',
      subtitle: 'Hassle-Free',
      price: '$2',
      period: 'per member / month',
      description: 'Zero-hassle managed solution. We handle hosting, updates, and backups.',
      features: [
        'Everything in Open Source',
        'Managed hosting & updates',
        '99.9% uptime SLA',
        'Automated backups',
        'Priority support',
        'Advanced analytics',
        'Custom integrations',
        'SSO (coming soon)',
      ],
      cta: 'Start Free Trial',
      ctaVariant: 'default' as const,
      popular: true,
      icon: Sparkles,
      badge: '25% off yearly',
    },
  ];

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-gray-900 to-slate-900 py-24 sm:py-32"
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
            Simple,{' '}
            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Transparent
            </span>{' '}
            Pricing
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            Start free. Scale as you grow. No hidden fees, no surprises.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="mt-16 grid gap-8 lg:grid-cols-2 lg:gap-12">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="group relative"
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                    <Badge className="gap-1 bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-1 text-white">
                      <Sparkles className="h-3 w-3" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                {/* Hover gradient border */}
                <div
                  className={`absolute -inset-px rounded-3xl bg-gradient-to-b ${
                    plan.popular
                      ? 'from-blue-500/50 to-purple-500/50'
                      : 'from-white/10 to-white/5 opacity-0 group-hover:opacity-100'
                  } transition-opacity`}
                />

                <div
                  className={`relative h-full rounded-3xl border ${
                    plan.popular ? 'border-blue-500/20' : 'border-white/10'
                  } bg-gray-800/50 p-8 backdrop-blur-sm lg:p-10`}
                >
                  {/* Icon */}
                  <div className="mb-4 inline-flex rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-3">
                    <Icon className="h-6 w-6 text-blue-400" />
                  </div>

                  {/* Plan Name */}
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                    {plan.badge && (
                      <Badge variant="secondary" className="bg-green-500/10 text-green-400">
                        {plan.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="mb-6 text-sm text-gray-400">{plan.subtitle}</p>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-white">{plan.price}</span>
                      {plan.period && <span className="text-gray-400">{plan.period}</span>}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mb-8 text-gray-400">{plan.description}</p>

                  {/* CTA Button */}
                  <Button
                    size="lg"
                    variant={plan.ctaVariant}
                    className={`mb-8 w-full gap-2 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                        : 'border-white/20 bg-white/5 text-white hover:bg-white/10'
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="h-5 w-5" />
                  </Button>

                  {/* Features List */}
                  <div className="space-y-4">
                    <p className="text-sm font-semibold text-gray-300">What's included:</p>
                    <ul className="space-y-3">
                      {plan.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-start gap-3">
                          <div className="mt-0.5 flex-shrink-0 rounded-full bg-green-500/10 p-0.5">
                            <Check className="h-4 w-4 text-green-400" />
                          </div>
                          <span className="text-sm text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-400">
            All plans include our core features.{' '}
            <span className="font-semibold text-white">No credit card required</span> to start.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Questions about pricing?{' '}
            <a href="#" className="text-blue-400 hover:underline">
              Contact our team
            </a>
          </p>
        </motion.div>
      </div>

      {/* Decorative gradients */}
      <div className="absolute top-1/2 left-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl" />
      <div className="absolute top-0 right-0 h-[600px] w-[600px] translate-x-1/2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-3xl" />
    </section>
  );
}
