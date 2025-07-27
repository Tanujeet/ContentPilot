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
    const { templateId, inputs } = await req.json();

    // 1. Get the template
    const template = await prisma.template.findFirst({
      where: {
        id: templateId,
        userId,
      },
    });

    if (!template) {
      return new NextResponse("Template not found", { status: 404 });
    }

    // 2. Format prompt
    let prompt = template.prompt;
    for (const key in inputs) {
      prompt = prompt.replace(`{${key}}`, inputs[key]);
    }

    // 3. Call Cohere API
    const cohereRes = await fetch(COHERE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${COHERE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "command", // or use "command-light", depending on your pricing tier
        prompt,
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    const cohereData = await cohereRes.json();

    const output = cohereData.generations?.[0]?.text?.trim();
    if (!output) {
      return new NextResponse("No output generated", { status: 500 });
    }

    // 4. Save generation
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
