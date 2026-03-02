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

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        credits: true,
        plan: true,
        createdAt: true,
        _count: { select: { projects: true } },
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
