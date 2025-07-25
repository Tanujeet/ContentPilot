import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
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

export async function POST(req: Request) {}
export async function DELETE(req: Request) {}
