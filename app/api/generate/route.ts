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
    const { idea, description, category, audience } = await req.json();

    if (!idea || !description || !category) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const prompt = `
Generate a complete landing page copy for the following:

Startup Name: ${idea}
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

    const cohereRes = await fetch(COHERE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${COHERE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "command-r-plus", // updated model name
        prompt,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!cohereRes.ok) {
      const errorText = await cohereRes.text();
      console.error(`Cohere API error (${cohereRes.status}):`, errorText);
      return new NextResponse("Cohere API error", { status: 500 });
    }

    const cohereData = await cohereRes.json();
    const output = cohereData.generations?.[0]?.text?.trim();

    if (!output) {
      return new NextResponse("No output generated", { status: 500 });
    }

    let structuredOutput;
    const jsonMatch = output.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        structuredOutput = JSON.parse(jsonMatch[0]);
      } catch {
        structuredOutput = { raw: output };
      }
    } else {
      structuredOutput = { raw: output };
    }

    const saved = await prisma.generation.create({
      data: {
        prompt,
        response: JSON.stringify(structuredOutput),
        model: "cohere-command-r-plus",
        userId,
      },
    });

    return NextResponse.json(saved);
  } catch (error) {
    console.error("Generation error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
