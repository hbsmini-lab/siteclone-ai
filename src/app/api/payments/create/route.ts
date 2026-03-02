import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

const planCredits: Record<string, number> = {
  Starter: 10,
  Pro: 50,
  Enterprise: 999,
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { packageName, amount, couponCode } = await req.json();

    let finalAmount = amount;
    let discount = 0;

    // Apply coupon if provided
    if (couponCode) {
      const campaign = await prisma.campaign.findUnique({
        where: { code: couponCode },
      });

      if (
        campaign &&
        campaign.isActive &&
        campaign.usedCount < campaign.maxUses &&
        new Date() < campaign.expiresAt
      ) {
        discount = campaign.discount;
        finalAmount = amount * (1 - discount / 100);

        await prisma.campaign.update({
          where: { id: campaign.id },
          data: { usedCount: { increment: 1 } },
        });
      }
    }

    const credits = planCredits[packageName] || 0;

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        amount: finalAmount,
        status: "completed", // In production, this would be "pending" until Stripe confirms
        packageName,
        credits,
        userId,
      },
    });

    // Update user credits and plan
    await prisma.user.update({
      where: { id: userId },
      data: {
        credits: { increment: credits },
        plan: packageName.toLowerCase(),
        planExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    // Log activity
    await prisma.activity.create({
      data: {
        type: "payment",
        description: `Purchased ${packageName} plan ($${finalAmount})`,
        metadata: JSON.stringify({ packageName, amount: finalAmount, credits }),
        userId,
      },
    });

    return NextResponse.json({
      message: "Payment successful",
      payment: { id: payment.id, credits, amount: finalAmount },
    });
  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json({ error: "Payment failed" }, { status: 500 });
  }
}
