import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const user = await currentUser();
    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { courseId } = await params;
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        isPublished: true,
      },
    });
    if (!course) return new NextResponse("Not found", { status: 404 });
    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId,
        },
      },
    });
    if (purchase) return new NextResponse("Already purchased", { status: 400 });
    //use stripe
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency: "USD",
          product_data: {
            name: course.title,
            description: course.description!,
          },
          unit_amount: Math.round(course.price! * 100),
        },
      },
    ];

    let stripeCustomer = await db.stripeCustomer.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        stripeCustomerId: true,
      },
    });
    if (!stripeCustomer) {
      //create stripe customer when the user first purchase
      const customer = await stripe.customers.create({
        email: user.emailAddresses[0].emailAddress,
      });
      stripeCustomer = await db.stripeCustomer.create({
        data: {
          userId: user.id,
          stripeCustomerId: customer.id,
        },
      });
    }
    //pay
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomer.stripeCustomerId,
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}?canceled=1`,
      //我们不知道用户什么时候会支付，这里只是创建了一个customer和session，并没有真正的支付
      metadata: {
        courseId,
        userId: user.id,
      },
    });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.log("[COURSES_ID_CHECKOUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
