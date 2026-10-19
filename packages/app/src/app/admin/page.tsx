import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@fleet-platform/ui/components/card";
import { messages } from "@/messages/pl";

export default function Admin() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-6 px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">{messages.adminTitle}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{messages.status}</CardTitle>
          <CardDescription>{messages.adminDescription}</CardDescription>
        </CardHeader>
        <CardContent><p>{messages.adminBody}</p></CardContent>
      </Card>
      <Link className="w-fit text-sm underline underline-offset-4" href="/">{messages.back}</Link>
    </main>
  );
}
