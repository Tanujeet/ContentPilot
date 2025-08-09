-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('WEB', 'TWITTER', 'LINKEDIN', 'MEDIUM');

-- CreateEnum
CREATE TYPE "ScheduleStatus" AS ENUM ('PENDING', 'PUBLISHED', 'FAILED');

-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('BLOG', 'TWEET', 'THREAD', 'LINKEDIN', 'EMAIL');

-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'PUBLISHED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "ContentType" NOT NULL DEFAULT 'BLOG',
    "tone" TEXT,
    "tags" TEXT,
    "status" "PostStatus" NOT NULL DEFAULT 'DRAFT',
    "generated" BOOLEAN NOT NULL DEFAULT false,
    "scheduledAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Generation" (
    "id" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Generation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "platform" "Platform" NOT NULL DEFAULT 'WEB',
    "status" "ScheduleStatus" NOT NULL DEFAULT 'PENDING',
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ContentType" NOT NULL DEFAULT 'BLOG',
    "prompt" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Generation" ADD CONSTRAINT "Generation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
