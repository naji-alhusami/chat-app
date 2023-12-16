import { db } from "@/app/lib/db";
import Button from "./components/ui/Button";

export default async function Home() {
  // await db.set("hello", "hello");

  return (
    <div>
      <Button variant="ghost">Hello World</Button>
    </div>
  );
}
