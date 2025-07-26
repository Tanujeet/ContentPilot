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
        const updatePost = await prisma.post.update({
        where: { id: id, userId: userId },

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
        return NextResponse.json(updatePost)
    } catch (e) {
        console.error("failed to update Post", e)
        return new NextResponse("Internal Server Error",{status:500})
        
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
}