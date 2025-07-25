import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorised", { status: 401 });
  }

  try {
  } catch (e) {
    console.error("Failed to fetch templates", e);
  }
}

export async function POST(req: Request) {}
export async function DELETE(req: Request) {}
