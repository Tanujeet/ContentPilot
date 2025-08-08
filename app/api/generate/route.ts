import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const COHERE_API_KEY = process.env.COHERE_API_KEY;
const COHERE_URL = "https://api.cohere.ai/v1/generate";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { idea, contentType, tone, tags } = await req.json();
    if (!idea || !contentType || !tone) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // ✅ Ensure user exists in DB
    const userInDB = await prisma.user.findUnique({ where: { id: userId } });
    if (!userInDB) {
      const clerkUser = await currentUser();
      await prisma.user.create({
        data: {
          id: userId,
          email:
            clerkUser?.emailAddresses?.[0]?.emailAddress ||
            "unknown@example.com",
        },
      });
    }

    // Build prompt
    const prompt = `
Generate a ${contentType} in a ${tone} tone about the following idea:
"${idea} in about 100 words only"

Make sure to incorporate these keywords if possible: ${tags || "none"}.

Return the result as plain text.
`.trim();

    // Call Cohere API
    const cohereRes = await fetch(COHERE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${COHERE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "command-r-plus",
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

    // Parse JSON if present
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

    // Save generation
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
