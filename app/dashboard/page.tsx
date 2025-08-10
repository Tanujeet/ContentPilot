"use client";

import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";

type Activity = {
  title: string;
  status: string;
  createdAt: string;
};

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
  const [isLoading, setisLoding] = useState(false);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);

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
      try {
        setisLoding(true);
        const res = await axiosInstance.get("/recent-activity");
        setRecentActivity(res.data);
      } catch (err) {
        console.error("Error fetching recent activity", err);
      } finally {
        setisLoding(false);
      }
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
        <div className="bg-[#1A1325] p-6 rounded-2xl">
          <h1 className="text-3xl font-bold">Recent Activity</h1>
          <Table className="border-2 border-white rounded-2xl overflow-hidden">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]  text-white">Title</TableHead>
                <TableHead className=" text-white">Status</TableHead>

                <TableHead className="text-right  text-white">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : recentActivity.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    No recent activity
                  </TableCell>
                </TableRow>
              ) : (
                recentActivity.map((activity, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium">
                      {activity.title}
                    </TableCell>
                    <TableCell>{activity.status}</TableCell>
                    <TableCell className="text-right">
                      {new Date(activity.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </main>
  );
};

export default Page;
