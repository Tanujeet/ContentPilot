import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";


export async function PUT(
  req: NextRequest,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorised", { status: 401 });
  }
  try {
    const { id } = await paramsPromise;
    const { title, description, content, type } = await req.json();
    if (!id || !title || !description || !content) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const updatedTemplate = await prisma.template.update({
      where: {
        id,
        userId,
      },
      data: {
        name: title,
        prompt: `${description}\n\n${content}`,
        type: type || "BLOG",
      },
    });
    return NextResponse.json(updatedTemplate);
  } catch (e) {
    console.error("Failed to edit template", e);
    return new NextResponse("Internal server error", { status: 404 });
  }
}


export async function DELETE(
  req: Request,
  { params: paramsPromise }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorised", { status: 401 });
  }

  try {
    const { id } = await paramsPromise;

    const deletedTemplate = await prisma.template.deleteMany({
      where: { id },
    });

    return NextResponse.json(deletedTemplate);
  } catch (e) {
    console.error("Failed to delete template", e);
    return new NextResponse("Internal server error", { status: 404 });
  }
}
