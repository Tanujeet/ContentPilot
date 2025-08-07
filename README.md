# 🚀 ContentPilot – AI-Powered Social Media Content Planner

**ContentPilot** is an AI-driven tool that helps creators, marketers, and businesses generate, organize, and plan social media content across platforms like LinkedIn, Instagram, Twitter, and more.

🎯 Boost your productivity, maintain consistency, and let AI help you generate high-quality posts.

---

## ✨ Features

- 🔮 **AI-Powered Content Generator** – Use GPT-4 to generate captions and content ideas.
- 📅 **Content Calendar** – Visualize and manage your weekly/monthly posting schedule.
- ✍️ **Post Editor & Drafts** – Edit, regenerate, and manage all your content in one place.
- 🎯 **Multi-Platform Support** – Plan content for LinkedIn, Twitter, Instagram, and others.
- 📤 **Scheduling Options** – Set publish dates, and export content for use on your favorite tools.
- 📊 **Dashboard Analytics** – Track post stats, platforms used, and your content strategy.

---

## 🛠️ Tech Stack

| Layer       | Stack                              |
|------------|-------------------------------------|
| Frontend   | Next.js (App Router), Tailwind CSS  |
| Backend    | API Routes (REST), Prisma ORM       |
| Database   | PostgreSQL / Supabase               |
| Auth       | Clerk (or NextAuth.js)              |
| AI Engine  | OpenAI (GPT-4)                      |
| Optional   | Stripe (for Pro features), Uploadthing (if images), Cron jobs/Zapier for scheduling

---

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/contentpilot.git
   cd contentpilot


2.Install dependencies
  npm install

3.Set up environment variables
  DATABASE_URL=your_postgresql_connection_url
  OPENAI_API_KEY=your_openai_api_key
  CLERK_SECRET_KEY=your_clerk_secret_key
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

4.Push Prisma schema
  npx prisma db push


5.Run the dev server
  npm run dev


🤝 Contributing
Contributions are welcome! Please fork the repo and submit a PR with improvements or new features.


