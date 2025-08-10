import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ContentType } from "@prisma/client";

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

    // Prompt with HTML formatting instructions
    const prompt = `
Generate a ${contentType} in a ${tone} tone about the following idea:
"${idea}" in about 100 words only.

Make sure to incorporate these keywords if possible: ${tags || "none"}.

Return ONLY HTML with:
- <h1> for the main title
- <h2> for subheadings
- <p> for paragraphs
- <ul><li> for bullet points if applicable
- No extra explanations, only valid HTML body content.
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

    // Clean HTML
    const cleanedOutput = output
      .replace(/\n+/g, "")
      .replace(/\s{2,}/g, " ")
      .trim();

    // Extract <h1> as title
   const titleMatch = cleanedOutput.match(/<h1[^>]*>(.*?)<\/h1>/i);
   const extractedTitle = titleMatch ? titleMatch[1].trim() : idea;

    // Save generation log
    await prisma.generation.create({
      data: {
        prompt,
        response: cleanedOutput,
        model: "cohere-command-r-plus",
        userId,
      },
    });

    const normalizedType = String(contentType).toUpperCase();

    if (
      !["BLOG", "TWEET", "THREAD", "LINKEDIN", "EMAIL"].includes(normalizedType)
    ) {
      return new NextResponse("Invalid content type", { status: 400 });
    }

    // Save as post
    const savedPost = await prisma.post.create({
      data: {
        title: extractedTitle,
        content: cleanedOutput,
        type: normalizedType as ContentType,
        tone,
        tags,
        status: "DRAFT",
        generated: true,
        userId,
      },
    });

    // Return saved post object
    return NextResponse.json(savedPost);
  } catch (error) {
    console.error("Generation error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
