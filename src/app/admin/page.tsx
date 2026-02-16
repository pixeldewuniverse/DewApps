import { db } from "@/db";
import { products, orders, users } from "@/db/schema";
import { sql } from "drizzle-orm";

export default async function AdminDashboard() {
  const [productCount] = await db.select({ count: sql<number>`count(*)` }).from(products);
  const [orderCount] = await db.select({ count: sql<number>`count(*)` }).from(orders);
  const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);

  const [totalRevenue] = await db
    .select({ sum: sql<number>`sum(total)` })
    .from(orders)
    .where(sql`status = 'PAID'`);

  const stats = [
    { label: "Products", value: productCount.count, color: "bg-cyan" },
    { label: "Orders", value: orderCount.count, color: "bg-mint" },
    { label: "Users", value: userCount.count, color: "bg-yellow-200" },
    {
      label: "Revenue",
      value: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(totalRevenue.sum || 0),
      color: "bg-teal text-white"
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl">DASHBOARD OVERVIEW</h1>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className={`border-4 border-black p-6 ${stat.color}`}>
            <h3 className="font-cta text-sm uppercase">{stat.label}</h3>
            <p className="mt-2 text-2xl font-heading truncate">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="border-4 border-black bg-white p-8">
        <h2 className="text-xl mb-4 uppercase">System Status</h2>
        <ul className="font-body text-lg space-y-2">
          <li>Database: <span className="text-green-600">CONNECTED</span></li>
          <li>Storage: <span className="text-green-600">ACTIVE</span></li>
          <li>Midtrans: <span className="text-blue-600">SANDBOX</span></li>
        </ul>
      </div>
    </div>
  );
}
