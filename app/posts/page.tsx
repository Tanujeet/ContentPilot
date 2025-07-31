import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
const Page = () => {
  const content = [
    { status: "Published", Title: "Tips and tricks", date: "30" },
  ];
  return (
    <main className="p-10">
      <section>
        <h1 className="text-4xl font-bold mb-6">Post</h1>
        <Input placeholder="Search" className="text-white" />
      </section>
      <section className="mt-10">
        <div>
          {content.map((contents, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle>{contents.status}</CardTitle>
                <CardTitle>{contents.Title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{contents.date}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Page;
