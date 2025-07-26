import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";


export async function PUT(req:NextRequest) {
    
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
