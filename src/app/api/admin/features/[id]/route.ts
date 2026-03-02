import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== "admin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const data = await req.json();

        const feature = await prisma.feature.update({
            where: { id },
            data,
        });

        return NextResponse.json({ feature });
    } catch (error) {
        console.error("Feature PUT error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || (session.user as any).role !== "admin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await prisma.feature.delete({ where: { id } });

        return NextResponse.json({ message: "Feature deleted" });
    } catch (error) {
        console.error("Feature DELETE error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
