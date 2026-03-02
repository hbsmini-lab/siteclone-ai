import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const { credits, amount } = await req.json();

        if (!credits || credits <= 0) {
            return NextResponse.json({ error: "Invalid credits amount" }, { status: 400 });
        }

        // Update user credits
        await prisma.user.update({
            where: { id: userId },
            data: { credits: { increment: credits } },
        });

        // Create payment record
        await prisma.payment.create({
            data: {
                amount: amount || 0,
                currency: "USD",
                status: "completed",
                paymentMethod: "demo",
                packageName: `${credits} Credits Pack`,
                credits,
                userId,
            },
        });

        // Create activity record
        await prisma.activity.create({
            data: {
                type: "payment",
                description: `Purchased ${credits} credits`,
                metadata: JSON.stringify({ credits, amount }),
                userId,
            },
        });

        return NextResponse.json({ message: "Credits added successfully", credits });
    } catch (error) {
        console.error("Credits purchase error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
