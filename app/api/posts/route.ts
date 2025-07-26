import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  try {
    const fetchPost = await prisma.post.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(fetchPost);
  } catch (e) {
    console.error("Failed to fetch posts", e);
    return new NextResponse("Internal server error", { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorised", { status: 401 });
  }

  const { title, content, type, status, generated, scheduledAt } =
    await req.json();
  if (!title || !content || !type || !status) {
    return new NextResponse("Missing required fields", { status: 400 });
  }

  if (status === "SCHEDULED" && !scheduledAt) {
    return new NextResponse("Missing scheduledAt for scheduled post", {
      status: 400,
    });
  }

  try {
    const createPost = await prisma.post.create({
      data: {
        title: title,
        content: content,
        type: type,
        scheduledAt: scheduledAt,
        status: status,
        generated: generated,
        userId: userId,
      },
    });
    return NextResponse.json(createPost);
  } catch (e) {
    console.error("failed to create a post", e);
  }
}