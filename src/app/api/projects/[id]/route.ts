import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const project = await prisma.project.findUnique({
      where: { id },
      include: { versions: { orderBy: { version: "desc" }, take: 10 } },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.userId !== (session.user as any).id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { htmlContent, cssContent, name, status, sourceUrl, thumbnail } = await req.json();

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project || project.userId !== (session.user as any).id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        ...(htmlContent !== undefined && { htmlContent }),
        ...(cssContent !== undefined && { cssContent }),
        ...(name !== undefined && { name }),
        ...(status !== undefined && { status }),
        ...(sourceUrl !== undefined && { sourceUrl }),
        ...(thumbnail !== undefined && { thumbnail }),
      },
    });

    // Create new version if content changed
    if (htmlContent !== undefined) {
      const lastVersion = await prisma.projectVersion.findFirst({
        where: { projectId: id },
        orderBy: { version: "desc" },
      });

      await prisma.projectVersion.create({
        data: {
          version: (lastVersion?.version || 0) + 1,
          htmlContent,
          cssContent,
          changelog: "Manual save",
          projectId: id,
        },
      });
    }

    return NextResponse.json({ project: updated });
  } catch (error) {
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
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project || project.userId !== (session.user as any).id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.project.delete({ where: { id } });

    return NextResponse.json({ message: "Project deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
