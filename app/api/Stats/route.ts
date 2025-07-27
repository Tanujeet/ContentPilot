import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { userId } = await auth()
    if (!userId) {
        return new NextResponse("Unauthorised",{status:401})
    }

try {
    const totalPost = await prisma.post.count({ where: { userId } })
    const totalTemplates = await prisma.template.count({ where: { userId } })
    const totalgen = await prisma.generation.count({ where: { userId } })
    
    return NextResponse.json({totalPost,totalTemplates,totalgen})
} catch (e) {
    console.error(e)
    return new NextResponse("Internal Server Error",{status:500})
    
}

}