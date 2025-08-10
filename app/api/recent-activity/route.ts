import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorised", { status: 401 });
  }
  try {
    const recentPosts = await prisma.post.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        title: true,
        status: true,
        createdAt: true,
      },
    });
    return NextResponse.json(recentPosts);
  } catch (e) {
    console.error("Failed to fetch recent Activiy:", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}