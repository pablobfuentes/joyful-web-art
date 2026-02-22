import { useRegistryContent } from "@/contexts/RegistryContentContext";
import Navbar from "@/components/Navbar";

export default function Account() {
  const { getSectionContent } = useRegistryContent();
  const data = getSectionContent("account");
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-display text-2xl font-bold text-foreground">{data.title}</h1>
          <p className="mt-2 text-muted-foreground">{data.placeholder}</p>
        </div>
      </main>
    </div>
  );
}
