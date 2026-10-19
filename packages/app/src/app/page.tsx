import Link from "next/link";
import { messages } from "@/messages/pl";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-8 px-6 py-16">
      <p className="text-sm font-semibold tracking-wide">fleet-platform</p>
      <div className="space-y-5">
        <p className="text-sm text-muted-foreground">{messages.status}</p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">{messages.title}</h1>
        <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">{messages.introduction}</p>
      </div>
      <Link className="w-fit rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-4" href="/admin">
        {messages.adminLink}
      </Link>
    </main>
  );
}
