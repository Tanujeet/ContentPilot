import { Input } from "@/components/ui/input";
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
  return (
    <main className="p-10">
      <section>
        <h1 className="text-4xl font-bold mb-6">Post</h1>
        <Input placeholder="Search" className="text-white" />
      </section>
      <section className="mt-10">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Card Content</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
};

export default Page;
