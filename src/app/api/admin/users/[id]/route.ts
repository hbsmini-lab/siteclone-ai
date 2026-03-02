import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const userId = params.id;
    const body = await req.json();
    const { role, addCredits, plan } = body;

    // Build update data
    const updateData: any = {};
    
    if (role !== undefined) {
      updateData.role = role;
    }
    
    if (plan !== undefined) {
      updateData.plan = plan;
    }
    
    // Handle credits addition or removal
    if (addCredits !== undefined) {
      if (addCredits > 0) {
        // Add credits
        updateData.credits = { increment: addCredits };
        
        // Create activity record
        await prisma.activity.create({
          data: {
            type: "admin",
            description: `Admin added ${addCredits} credits`,
            metadata: JSON.stringify({ addedCredits: addCredits, adminId: (session.user as any).id }),
            userId,
          },
        });
      } else if (addCredits < 0) {
        // Remove credits (ensure it doesn't go below 0)
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { credits: true },
        });
        
        if (user) {
          const creditsToRemove = Math.min(Math.abs(addCredits), user.credits);
          updateData.credits = { decrement: creditsToRemove };
          
          // Create activity record
          await prisma.activity.create({
            data: {
              type: "admin",
              description: `Admin removed ${creditsToRemove} credits`,
              metadata: JSON.stringify({ removedCredits: creditsToRemove, adminId: (session.user as any).id }),
              userId,
            },
          });
        }
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
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

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Admin user update error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const userId = params.id;

    // Prevent deleting yourself
    if (userId === (session.user as any).id) {
      return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Admin user delete error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
