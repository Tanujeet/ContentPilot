import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorised", { status: 401 });
  }
  try {
    const fetchPost = await prisma.post.findMany({
      where: { userId },
    });
    return NextResponse.json(fetchPost);
  } catch (e) {
    console.error("Failed to fetch posts", e);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
