"use client";

import { useUser } from "@clerk/nextjs";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Page = () => {
  const stats = [
    { title: "Total Post", num: "120" },
    { title: "Templates", num: "34" },
    { title: "Generations", num: "300" },
  ];
  const { user } = useUser();
  const username = user?.firstName || "User";
  return (
    <main>
      <section>
        <div>
          <h1 className="text-3xl font-bold ml-10 mt-10">
            Welcome back , {username}
          </h1>
          <div className=" flex-grid grid grid-cols-3 gap-6 mt-10">
            {stats.map((stat, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle>{stat.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{stat.num}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Page;
