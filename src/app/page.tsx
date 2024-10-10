import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <div>
      Hello World!
      <Button>Click me</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="muted">Muted</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="tertiary">Tertiary</Button>

      <Input />
      <p className="text-red-500 text-semibold">This is a red text</p>
    </div>
  );
}
