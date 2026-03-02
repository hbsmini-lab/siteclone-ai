import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== "admin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const features = await prisma.feature.findMany({
            orderBy: { order: "asc" },
        });

        return NextResponse.json({ features });
    } catch (error) {
        console.error("Features GET error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== "admin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { title, description, icon } = await req.json();

        const maxOrder = await prisma.feature.findFirst({
            orderBy: { order: "desc" },
            select: { order: true },
        });

        const feature = await prisma.feature.create({
            data: {
                title,
                description: description || "",
                icon: icon || "zap",
                order: (maxOrder?.order || 0) + 1,
            },
        });

        return NextResponse.json({ feature });
    } catch (error) {
        console.error("Features POST error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
