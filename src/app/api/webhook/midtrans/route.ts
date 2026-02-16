import { db } from "@/db";
import { orders, payments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Verify signature
    const serverKey = process.env.MIDTRANS_SERVER_KEY!;
    const signatureStr = body.order_id + body.status_code + body.gross_amount + serverKey;
    const signature = crypto.createHash("sha512").update(signatureStr).digest("hex");

    if (signature !== body.signature_key) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
    }

    const orderId = body.order_id;
    const transactionStatus = body.transaction_status;
    const fraudStatus = body.fraud_status;

    let status: "PENDING" | "PAID" | "FAILED" | "EXPIRED" = "PENDING";

    if (transactionStatus === "capture") {
      if (fraudStatus === "challenge") {
        status = "PENDING";
      } else if (fraudStatus === "accept") {
        status = "PAID";
      }
    } else if (transactionStatus === "settlement") {
      status = "PAID";
    } else if (transactionStatus === "cancel" || transactionStatus === "deny" || transactionStatus === "expire") {
      status = "FAILED";
    } else if (transactionStatus === "pending") {
      status = "PENDING";
    }

    // Update order status
    await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, orderId));

    // Record payment
    await db.insert(payments).values({
      orderId: orderId,
      provider: "midtrans",
      providerRef: body.transaction_id,
      status: transactionStatus,
      raw: JSON.stringify(body),
    });

    return NextResponse.json({ message: "OK" });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
