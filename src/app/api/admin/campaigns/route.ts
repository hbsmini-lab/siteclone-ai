import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const campaigns = await prisma.campaign.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ campaigns });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await req.json();
    
    const campaign = await prisma.campaign.create({
      data: {
        title: data.title,
        description: data.description,
        code: data.code,
        discount: data.discount,
        maxUses: data.maxUses,
        expiresAt: new Date(data.expiresAt),
        isActive: true,
      },
    });

    return NextResponse.json({ campaign });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
