import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Page = () => {
  return (
    <main>
      <section>
        <div className="ml-10 mt-15">
          <h1 className="text-4xl font-bold">Your idea</h1>
          <div className="mt-10">
            <Select>
              <h3>Tone</h3>
              <SelectTrigger className="w-[180px]">
                <SelectValue
                  placeholder="Professional"
                  className="text-white"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dark">Professional</SelectItem>
                <SelectItem value="light">Friendly</SelectItem>
                <SelectItem value="system">Casual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Page;
