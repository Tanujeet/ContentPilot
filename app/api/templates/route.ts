import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorised", { status: 401 });
  }

  try {
    const fetchTemplates = await prisma.template.findMany({
      where: { userId },
    });
    return NextResponse.json(fetchTemplates);
  } catch (e) {
    console.error("Failed to fetch templates", e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { title, description, content, type } = await req.json();

  if (!title || !description || !content) {
    return new NextResponse("Title, description, and content are required", {
      status: 400,
    });
  }

  try {
    const newTemplate = await prisma.template.create({
      data: {
        name: title,
        prompt: `${description}\n\n${content}`,
        userId,
        type: type || "BLOG", // fallback to default if type not provided
      },
    });

    return NextResponse.json(newTemplate);
  } catch (error) {
    console.error("Failed to create template:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorised", { status: 401 });
  }

  try {
    const { id } = await req.json();

    if (!id) {
      return new NextResponse("Template ID is required", { status: 400 });
    }

    const deletedTemplate = await prisma.template.deleteMany({
      where: { id },
    });

    return NextResponse.json(deletedTemplate);
  } catch (e) {
    console.error("Failed to delete template", e);
    return new NextResponse("Internal server error", { status: 404 });
  }
}
