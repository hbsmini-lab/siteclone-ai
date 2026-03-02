import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET - List all packages
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const packages = await prisma.package.findMany({
      orderBy: { price: "asc" },
    });

    return NextResponse.json({ packages });
  } catch (error) {
    console.error("Packages fetch error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST - Create new package
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { name, slug, description, price, credits, features, isPopular, duration } = body;

    if (!name || !slug || !price || !credits) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existing = await prisma.package.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json({ error: "Package slug already exists" }, { status: 400 });
    }

    const pkg = await prisma.package.create({
      data: {
        name,
        slug,
        description: description || "",
        price: Number(price),
        credits: Number(credits),
        features: JSON.stringify(features || []),
        isPopular: isPopular || false,
        duration: duration || 30,
      },
    });

    return NextResponse.json({ package: pkg });
  } catch (error) {
    console.error("Package create error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PUT - Update package
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { id, name, slug, description, price, credits, features, isPopular, duration } = body;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = Number(price);
    if (credits !== undefined) updateData.credits = Number(credits);
    if (features !== undefined) updateData.features = JSON.stringify(features);
    if (isPopular !== undefined) updateData.isPopular = isPopular;
    if (duration !== undefined) updateData.duration = Number(duration);

    const pkg = await prisma.package.update({
      where: { slug },
      data: updateData,
    });

    return NextResponse.json({ package: pkg });
  } catch (error) {
    console.error("Package update error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE - Delete package
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    await prisma.package.delete({
      where: { slug },
    });

    return NextResponse.json({ message: "Package deleted successfully" });
  } catch (error) {
    console.error("Package delete error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
