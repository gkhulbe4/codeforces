import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const session = await auth();
  return new Response("Hello World");
}
