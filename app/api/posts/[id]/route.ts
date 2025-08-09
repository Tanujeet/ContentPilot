import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";


export async function PUT(
  req: NextRequest,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorised", { status: 404 });
  }
  const { id } = await paramsPromise;
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
    const existingPost = await prisma.post.findUnique({ where: { id } });

    if (!existingPost || existingPost.userId !== userId) {
      return new NextResponse("Post not found or unauthorized", {
        status: 404,
      });
    }

    const updatePost = await prisma.post.update({
      where: { id },
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
    return NextResponse.json(updatePost);
  } catch (e) {
    console.error("failed to update Post", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorised", { status: 404 });
  }
  const { id } = await paramsPromise;
  try {
    const existingPost = await prisma.post.findUnique({ where: { id } });

    if (!existingPost || existingPost.userId !== userId) {
      return new NextResponse("Post not found or unauthorized", {
        status: 404,
      });
    }

    const deletePost = await prisma.post.delete({
      where: { id },
    });
    return NextResponse.json(deletePost);
  } catch (e) {
    console.error("failed to delete post", e);
    return new NextResponse("Internal server error", { status: 500 });
  }
}



export async function PATCH(
  req: NextRequest,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unautorised", { status: 404 });
  }
  const { id } = await paramsPromise;
  try {
    const updatedPost = await prisma.post.update({
      where: { id },
      data: { status: "PUBLISHED", publishedAt: new Date() }, // publishedAt optional
    });

    return NextResponse.json(updatedPost);
  } catch (e) {
    console.error(e);
    return new NextResponse("Failed to publish post", { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (userId) {
    return new NextResponse("Unauthorised", { status: 404 });
  }
  const { id } = await paramsPromise;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });
    if (!post || post.userId !== userId) {
      return new NextResponse("Not found", { status: 404 });
    }
    return NextResponse.json
  } catch (e) {
    console.error("Failed to fetch data", e);
  }
}