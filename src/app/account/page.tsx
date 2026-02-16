import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Library, Package, User } from "lucide-react";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <h1 className="text-3xl text-black">ACCOUNT OVERVIEW</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="border-4 border-black bg-white p-8 flex flex-col items-center text-center space-y-4">
          <div className="h-20 w-20 bg-mint border-4 border-black flex items-center justify-center">
            <User size={40} />
          </div>
          <div>
            <h2 className="text-xl">{session.user.name}</h2>
            <p className="font-body text-lg text-gray-600">{session.user.email}</p>
            <p className="font-cta text-xs uppercase bg-black text-white px-2 py-1 mt-2">
              {session.user.role}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Link
            href="/account/library"
            className="border-4 border-black bg-cyan p-6 flex items-center justify-between hover:bg-black hover:text-white transition-all group"
          >
            <div className="flex items-center gap-4">
              <Library size={32} />
              <span className="text-xl font-cta uppercase">My Library</span>
            </div>
            <span className="text-2xl group-hover:translate-x-2 transition-transform">→</span>
          </Link>

          <Link
            href="/account/orders"
            className="border-4 border-black bg-mint p-6 flex items-center justify-between hover:bg-black hover:text-white transition-all group"
          >
            <div className="flex items-center gap-4">
              <Package size={32} />
              <span className="text-xl font-cta uppercase">Order History</span>
            </div>
            <span className="text-2xl group-hover:translate-x-2 transition-transform">→</span>
          </Link>
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <form action="/api/auth/signout" method="POST">
          <Button type="submit" variant="ghost" className="font-cta text-lg uppercase text-red-600 hover:text-red-800 hover:bg-transparent">
            LOGOUT
          </Button>
        </form>
      </div>
    </div>
  );
}
