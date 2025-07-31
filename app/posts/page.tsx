import { Input } from "@/components/ui/input";

const Page = () => {
  return (
    <main className="p-10">
      <section>
        <h1 className="text-4xl font-bold mb-6">Post</h1>
        <Input placeholder="Search" className="text-white" />
      </section>
    </main>
  );
};

export default Page;
