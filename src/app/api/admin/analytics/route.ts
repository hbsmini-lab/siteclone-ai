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

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Total counts
    const totalUsers = await prisma.user.count();
    const totalProjects = await prisma.project.count();
    const totalPayments = await prisma.payment.count({
      where: { status: "completed" },
    });
    const totalCredits = await prisma.user.aggregate({
      _sum: { credits: true },
    });

    // New users stats
    const newUsersToday = await prisma.user.count({
      where: { createdAt: { gte: today } },
    });
    const newUsersThisWeek = await prisma.user.count({
      where: { createdAt: { gte: thisWeek } },
    });
    const newUsersThisMonth = await prisma.user.count({
      where: { createdAt: { gte: thisMonth } },
    });

    // Active projects
    const activeProjects = await prisma.project.count({
      where: { status: "published" },
    });

    // Revenue this month
    const revenueThisMonth = await prisma.payment.aggregate({
      where: {
        status: "completed",
        createdAt: { gte: thisMonth },
      },
      _sum: { amount: true },
    });

    // Top plans
    const planCounts = await prisma.user.groupBy({
      by: ["plan"],
      _count: { plan: true },
    });

    // Daily stats for last 30 days
    const dailyStats = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const [users, projects, payments] = await Promise.all([
        prisma.user.count({
          where: {
            createdAt: {
              gte: date,
              lt: nextDate,
            },
          },
        }),
        prisma.project.count({
          where: {
            createdAt: {
              gte: date,
              lt: nextDate,
            },
          },
        }),
        prisma.payment.count({
          where: {
            status: "completed",
            createdAt: {
              gte: date,
              lt: nextDate,
            },
          },
        }),
      ]);

      dailyStats.push({
        date: date.toISOString().split("T")[0],
        users,
        projects,
        payments,
      });
    }

    return NextResponse.json({
      totalUsers,
      totalProjects,
      totalPayments,
      totalCredits: totalCredits._sum.credits || 0,
      newUsersToday,
      newUsersThisWeek,
      newUsersThisMonth,
      activeProjects,
      revenueThisMonth: revenueThisMonth._sum.amount || 0,
      userGrowth: 12,
      topPlans: planCounts.map((p) => ({ name: p.plan, count: p._count.plan })),
      dailyStats,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
