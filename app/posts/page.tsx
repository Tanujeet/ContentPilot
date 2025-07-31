import { Input } from "@/components/ui/input";
const Page = () => {
  return (
    <main>
      <section>
        <div>
          <h1 className="text-4xl font-bold ml-10 mt-10">Post</h1>
        </div>
        <Input className="ml-10 mt-5 text-white" placeholder="Search" />
      </section>
    </main>
  );
};

export default Page;
