import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// PUT — Update a template
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorised", { status: 401 });

  const { id } = params;
  const { title, description, content, type } = await req.json();

  if (!title || !description || !content) {
    return new NextResponse("Missing required fields", { status: 400 });
  }

  try {
    const existingTemplate = await prisma.template.findUnique({
      where: { id },
    });

    if (!existingTemplate || existingTemplate.userId !== userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const updatedTemplate = await prisma.template.update({
      where: { id },
      data: {
        name: title,
        prompt: `${description}\n\n${content}`,
        type: type || "BLOG",
      },
    });

    return NextResponse.json(updatedTemplate);
  } catch (e) {
    console.error("Failed to update template:", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// DELETE — Delete a template
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorised", { status: 401 });

  const { id } = params;

  try {
    const existingTemplate = await prisma.template.findUnique({
      where: { id },
    });

    if (!existingTemplate || existingTemplate.userId !== userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const deletedTemplate = await prisma.template.delete({
      where: { id },
    });

    return NextResponse.json(deletedTemplate);
  } catch (e) {
    console.error("Failed to delete template:", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
