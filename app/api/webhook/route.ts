import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.log("webhook error", error);
    return new NextResponse(`Webhook Error`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const userId = session?.metadata?.userId;
  const courseId = session?.metadata?.courseId;
  if (event.type === "checkout.session.completed") {
    if (!userId || !courseId) {
      return new NextResponse("Missing metadata", { status: 400 });
    }

    //create purchase
    await db.purchase.create({
      data: {
        userId,
        courseId,
      },
    });
  } else {
    console.log("Unhandled event type", event.type);
    return new NextResponse(`Unhandled event type: ${event.type}`, {
      status: 200,
    });
  }
  return new NextResponse(null, { status: 200 });
}
