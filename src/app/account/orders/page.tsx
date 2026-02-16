import { auth } from "@/auth";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, session.user.id))
    .orderBy(desc(orders.createdAt));

  return (
    <div className="space-y-8">
      <h1 className="text-3xl">MY ORDERS</h1>
      <div className="border-4 border-black bg-white overflow-x-auto">
        <table className="w-full text-left font-body text-lg">
          <thead className="border-b-4 border-black bg-gray-100 font-cta text-sm uppercase">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Date</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black">
            {userOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="p-4 font-mono text-xs">{order.id}</td>
                <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="p-4">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(Number(order.total))}
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 font-cta text-xs uppercase ${
                      order.status === "PAID"
                        ? "bg-green-200 text-green-800"
                        : order.status === "FAILED"
                        ? "bg-red-200 text-red-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
            {userOrders.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center">
                  You haven&apos;t placed any orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
