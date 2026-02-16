import { db } from "@/db";
import { orders, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AdminOrdersPage() {
  const allOrders = await db
    .select({
      id: orders.id,
      total: orders.total,
      status: orders.status,
      createdAt: orders.createdAt,
      userName: users.name,
      userEmail: users.email,
    })
    .from(orders)
    .leftJoin(users, eq(orders.userId, users.id))
    .orderBy(desc(orders.createdAt));

  return (
    <div className="space-y-8">
      <h1 className="text-3xl">MANAGE ORDERS</h1>
      <div className="border-4 border-black bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-100 border-b-4 border-black font-cta">
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="font-body text-lg">
            {allOrders.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-mono text-xs">{o.id}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{o.userName}</span>
                    <span className="text-xs text-gray-500">{o.userEmail}</span>
                  </div>
                </TableCell>
                <TableCell>{o.total}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 text-xs font-cta ${
                      o.status === "PAID"
                        ? "bg-green-200 text-green-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {o.status}
                  </span>
                </TableCell>
                <TableCell>{new Date(o.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
