import { db } from "@/app/lib/db";

export default async function Home() {
  // await db.set("hello", "hello");

  return <div className="text-red-500">Hello World</div>;
}
