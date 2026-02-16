import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="flex flex-col gap-8 md:flex-row">
      <aside className="w-full md:w-64 space-y-4">
        <h2 className="font-heading text-xl">ADMIN</h2>
        <nav className="flex flex-col gap-2 font-cta text-lg uppercase">
          <Link href="/admin" className="p-4 border-4 border-black hover:bg-cyan">
            Dashboard
          </Link>
          <Link href="/admin/products" className="p-4 border-4 border-black hover:bg-cyan">
            Products
          </Link>
          <Link href="/admin/orders" className="p-4 border-4 border-black hover:bg-cyan">
            Orders
          </Link>
        </nav>
      </aside>
      <main className="flex-grow">{children}</main>
    </div>
  );
}
