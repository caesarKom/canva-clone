'use client';

import { useState } from 'react';
import { Check, Sparkles, Zap, Crown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface PricingTier {
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
  buttonText: string;
  buttonVariant?: 'default' | 'outline' | 'secondary';
  priceId?: {
    monthly: string;
    yearly: string;
  };
  gradient?: string;
  borderColor?: string;
}

const pricingTiers: PricingTier[] = [
  {
    name: 'Starter',
    description: 'Perfect for getting started',
    monthlyPrice: 0,
    yearlyPrice: 0,
    icon: <Sparkles className="size-6" />,
    features: [
      '5 projects',
      'Basic templates',
      'Export to PNG',
      'Community support',
      '1GB storage',
      'Basic analytics',
    ],
    buttonText: 'Start for Free',
    buttonVariant: 'outline',
    gradient: 'from-slate-500 to-slate-600',
    borderColor: 'border-slate-200 dark:border-slate-800',
  },
  {
    name: 'Pro',
    description: 'For creative professionals',
    monthlyPrice: 19,
    yearlyPrice: 190,
    popular: true,
    icon: <Zap className="size-6" />,
    features: [
      'Unlimited projects',
      'All premium templates',
      'Export to PNG, SVG, PDF',
      'Advanced animations & effects',
      'Priority support',
      'No watermarks',
      '50GB storage',
      'Advanced analytics',
      'Custom fonts',
      'Team collaboration (up to 5)',
    ],
    buttonText: 'Get Pro',
    buttonVariant: 'default',
    priceId: {
      monthly: 'price_monthly_pro',
      yearly: 'price_yearly_pro',
    },
    gradient: 'from-purple-600 via-violet-600 to-indigo-600',
    borderColor: 'border-purple-500/50',
  },
  {
    name: 'Enterprise',
    description: 'For teams and organizations',
    monthlyPrice: 49,
    yearlyPrice: 490,
    icon: <Crown className="size-6" />,
    features: [
      'Everything in Pro',
      'Unlimited team members',
      'Unlimited storage',
      'API access',
      'Dedicated account manager',
      'SSO & advanced security',
      'Custom integrations',
      'White-label options',
      'SLA guarantee',
      'Custom training',
      'Advanced permissions',
    ],
    buttonText: 'Contact Sales',
    buttonVariant: 'secondary',
    priceId: {
      monthly: 'price_monthly_enterprise',
      yearly: 'price_yearly_enterprise',
    },
    gradient: 'from-amber-500 via-orange-500 to-red-500',
    borderColor: 'border-amber-500/50',
  },
];

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const calculateYearlySavings = (monthlyPrice: number, yearlyPrice: number) => {
    if (monthlyPrice === 0) return { savings: 0, percentage: 0 };
    const monthlyCost = monthlyPrice * 12;
    const savings = monthlyCost - yearlyPrice;
    const percentage = Math.round((savings / monthlyCost) * 100);
    return { savings, percentage };
  };

  const handlePurchase = async (tier: PricingTier) => {
    if (tier.monthlyPrice === 0) {
      window.location.href = '/auth/register';
      return;
    }

    if (tier.name === 'Enterprise') {
      window.location.href = '/contact';
      return;
    }

    setIsLoading(tier.name);

    try {
      const priceId = isYearly ? tier.priceId?.yearly : tier.priceId?.monthly;
      
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          billingPeriod: isYearly ? 'yearly' : 'monthly',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      window.location.href = url;
      
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to initiate payment. Please try again.');
      setIsLoading(null);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/40 dark:from-slate-950 dark:via-purple-950/20 dark:to-indigo-950/20">
      {/* Animated gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 size-96 rounded-full bg-gradient-to-br from-purple-400/30 to-indigo-400/30 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 size-96 rounded-full bg-gradient-to-tr from-violet-400/30 to-purple-400/30 blur-3xl animate-pulse animation-delay-1000" />
      </div>

      <div className="relative container mx-auto px-4 py-24 sm:py-32">
        {/* Header */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium mb-4 animate-fade-in">
            <Sparkles className="size-4" />
            Simple, transparent pricing
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 dark:from-white dark:via-purple-200 dark:to-white bg-clip-text text-transparent animate-fade-in-up">
            Choose Your Plan
          </h1>
          
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
            Start free, upgrade as you grow. No hidden fees, cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 pt-8 animate-fade-in-up animation-delay-300">
            <Label 
              htmlFor="billing-toggle" 
              className={cn(
                "text-base transition-all cursor-pointer",
                !isYearly ? 'font-semibold text-slate-900 dark:text-white scale-105' : 'text-slate-600 dark:text-slate-400'
              )}
            >
              Monthly
            </Label>
            <Switch
              id="billing-toggle"
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-600 data-[state=checked]:to-indigo-600"
            />
            <Label 
              htmlFor="billing-toggle" 
              className={cn(
                "text-base transition-all cursor-pointer",
                isYearly ? 'font-semibold text-slate-900 dark:text-white scale-105' : 'text-slate-600 dark:text-slate-400'
              )}
            >
              Yearly
            </Label>
            {isYearly && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-semibold shadow-lg shadow-green-500/30 animate-slide-in-left">
                <Sparkles className="size-3" />
                Save up to 20%
              </span>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {pricingTiers.map((tier, index) => {
            const price = isYearly ? tier.yearlyPrice : tier.monthlyPrice;
            const savings = calculateYearlySavings(tier.monthlyPrice, tier.yearlyPrice);

            return (
              <Card
                key={tier.name}
                className={cn(
                  "relative overflow-hidden transition-all duration-300 hover:shadow-2xl backdrop-blur-sm",
                  tier.popular 
                    ? 'border-2 lg:scale-105 shadow-2xl shadow-purple-500/20 dark:shadow-purple-500/10' 
                    : 'hover:scale-[1.02]',
                  tier.borderColor,
                  "bg-white/80 dark:bg-slate-900/80",
                  "animate-fade-in-up"
                )}
                style={{
                  animationDelay: `${400 + index * 100}ms`,
                }}
              >
                {/* Popular Badge */}
                {tier.popular && (
                  <div className="absolute top-10 left-2/3 -translate-x-2/3 z-10">
                    <div className={cn(
                      "flex items-center gap-2 px-6 py-2 rounded-full shadow-lg text-white text-sm font-bold",
                      `bg-gradient-to-r ${tier.gradient}`
                    )}>
                      <Zap className="size-4 fill-current" />
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Gradient Background Effect */}
                {tier.popular && (
                  <div className={cn(
                    "absolute inset-0 opacity-5",
                    `bg-gradient-to-br ${tier.gradient}`
                  )} />
                )}

                <CardHeader className="space-y-6 pt-8 pb-6">
                  {/* Icon */}
                  <div className={cn(
                    "inline-flex items-center justify-center size-14 rounded-2xl shadow-lg",
                    `bg-gradient-to-br ${tier.gradient}`,
                    "text-white"
                  )}>
                    {tier.icon}
                  </div>

                  <div>
                    <CardTitle className="text-2xl mb-2">{tier.name}</CardTitle>
                    <CardDescription className="text-base">
                      {tier.description}
                    </CardDescription>
                  </div>

                  {/* Price */}
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                        ${price}
                      </span>
                      <span className="text-slate-600 dark:text-slate-400 text-lg">
                        /{isYearly ? 'year' : 'month'}
                      </span>
                    </div>
                    {isYearly && tier.monthlyPrice > 0 && (
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">
                        💰 Save {savings.percentage}% (${savings.savings}/year)
                      </p>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 pb-8">
                  {/* CTA Button */}
                  <Button
                    className={cn(
                      "w-full h-12 text-base font-semibold transition-all group relative overflow-hidden",
                      tier.popular && "bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:shadow-xl hover:shadow-purple-500/50 hover:scale-105"
                    )}
                    variant={tier.buttonVariant}
                    onClick={() => handlePurchase(tier)}
                    disabled={isLoading === tier.name}
                  >
                    {isLoading === tier.name ? (
                      'Redirecting...'
                    ) : (
                      <>
                        {tier.buttonText}
                        <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>

                  {/* Features */}
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
                      Everything included:
                    </p>
                    <ul className="space-y-3">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm">
                          <div className={cn(
                            "flex-shrink-0 size-5 rounded-full flex items-center justify-center mt-0.5",
                            tier.popular 
                              ? `bg-gradient-to-br ${tier.gradient}` 
                              : 'bg-green-100 dark:bg-green-900/30'
                          )}>
                            <Check className={cn(
                              "size-3",
                              tier.popular ? "text-white" : "text-green-600 dark:text-green-400"
                            )} />
                          </div>
                          <span className="text-slate-700 dark:text-slate-300 leading-tight">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Trust Indicators */}
        <div className="mt-24 text-center space-y-8 animate-fade-in-up animation-delay-700">
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
            <p className="text-sm text-slate-600 dark:text-slate-400">Trusted by 10,000+ creators worldwide</p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Check className="size-4 text-green-600" />
              Cancel anytime
            </div>
            <div className="flex items-center gap-2">
              <Check className="size-4 text-green-600" />
              Money-back guarantee
            </div>
            <div className="flex items-center gap-2">
              <Check className="size-4 text-green-600" />
              Secure payment
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
