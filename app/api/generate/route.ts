import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const COHERE_API_KEY = process.env.COHERE_API_KEY;
const COHERE_URL = "https://api.cohere.ai/v1/generate";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { name, description, category, audience } = await req.json();

    if (!name || !description || !category) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // 1. Build Prompt
    const prompt = `
Generate a complete landing page copy for the following:

Startup Name: ${name}
One-Liner: ${description}
Category: ${category}
Target Audience: ${audience}

Return the result in structured JSON:
{
  "hero": { "heading": "", "subheading": "", "cta": "" },
  "features": [ { "title": "", "desc": "" }, ... ],
  "about": "",
  "cta": "",
  "meta": { "title": "", "description": "" }
}
    `.trim();

    // 2. Call Cohere API
    const cohereRes = await fetch(COHERE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${COHERE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "command",
        prompt,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const cohereData = await cohereRes.json();
    const output = cohereData.generations?.[0]?.text?.trim();

    if (!output) {
      return new NextResponse("No output generated", { status: 500 });
    }

    // 3. Save to DB
    const saved = await prisma.generation.create({
      data: {
        prompt,
        response: output,
        model: "cohere-command",
        userId,
      },
    });

    return NextResponse.json(saved);
  } catch (error) {
    console.error("Generation error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
