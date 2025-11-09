import { NextResponse } from "next/server";
import Stripe from "stripe";
export const runtime = "nodejs";
export async function POST(req: Request) {
  const body = await req.json();
  const { q1, q2, q3 } = body || {};
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecret)
    return NextResponse.json({ error: "STRIPE_SECRET_KEY ausente" }, { status: 500 });
  const stripe = new Stripe(stripeSecret, { apiVersion: "2024-06-20" });
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "brl",
          product_data: { name: "Previsão 2050 — PDF + Imagem HD" },
          unit_amount: 390,
        },
        quantity: 1,
      },
    ],
    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/result`,
    metadata: { q1, q2, q3 },
  });
  return NextResponse.json({ url: session.url });
}
