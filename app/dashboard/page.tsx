"use client";

import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { error } from "console";

const Page = () => {
  const { user } = useUser();
  const username = user?.firstName || "User";
const [stats, setStats] = useState({
  totalPost: "...",
  totalTemplates: "...",
  totalGen: "...",
});
const statArray = [
  { title: "Total Post", num: stats.totalPost },
  { title: "Templates", num: stats.totalTemplates },
  { title: "Generations", num: stats.totalGen },
];
const [recentActivity, setrecentActivity] = useState([]);

useEffect(() => {
  const fetchStats = async () => {
    try {
      const res = await axiosInstance.get("/Stats");
      setStats(res.data);
    } catch (e) {
      console.error("Failed to fetch stats:", e);
    }
  };
  fetchStats();
}, []);
useEffect(() => {
  const fetchActivity = async () => {
    const res = await axiosInstance.get("/recent-activity");
    setrecentActivity(res.data);
  };
  fetchActivity();
}, []);
return (
  <main>
    <section>
      <div>
        <h1 className="text-3xl font-bold ml-10 mt-10">
          Welcome back , {username}
        </h1>
        <div className=" flex-grid grid grid-cols-3 gap-6 mt-10 ">
          {statArray.map((stat, idx) => (
            <Card key={idx} className="bg-[#1A1325]  text-white h-fit">
              <CardHeader>
                <CardTitle>{stat.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <h1 className="text-2xl">{stat.num}</h1>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
    <section className="mt-20 ml-10 text-white">
      <div>
        <h1 className="text-3xl font-bold">Recent Activity</h1>
        <Table className="mt-4 border border-black rounded-2xl ">
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Title</TableHead>
              <TableHead>Status</TableHead>

              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">INV001</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Credit Card</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </section>
  </main>
);
};

export default Page;
