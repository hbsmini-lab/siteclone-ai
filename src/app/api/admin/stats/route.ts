import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalUsers, totalProjects, totalRevenue, newUsersToday, clonesToday] =
      await Promise.all([
        prisma.user.count(),
        prisma.project.count(),
        prisma.payment.aggregate({
          _sum: { amount: true },
          where: { status: "completed" },
        }),
        prisma.user.count({ where: { createdAt: { gte: today } } }),
        prisma.activity.count({
          where: { type: "clone", createdAt: { gte: today } },
        }),
      ]);

    return NextResponse.json({
      totalUsers,
      totalProjects,
      totalRevenue: totalRevenue._sum.amount || 0,
      activeUsers: totalUsers,
      newUsersToday,
      clonesToday,
    });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
