import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

// Helper function with proper typing
export async function getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  const response = await stripe.subscriptions.retrieve(subscriptionId);
  // Force cast to proper type
  return response as any as Stripe.Subscription;
}

export async function createCheckoutSession(params: Stripe.Checkout.SessionCreateParams) {
  return await stripe.checkout.sessions.create(params);
}
