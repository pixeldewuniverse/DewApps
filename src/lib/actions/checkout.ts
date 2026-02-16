"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { orders, orderItems, products } from "@/db/schema";
import { getCart } from "./cart";
import { inArray } from "drizzle-orm";
// @ts-expect-error - midtrans-client lacks types
import midtransClient from "midtrans-client";

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

export async function createCheckout() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const cart = await getCart();
  if (cart.length === 0) {
    throw new Error("Cart is empty");
  }

  const productIds = cart.map((item) => item.productId);
  const cartProducts = await db
    .select()
    .from(products)
    .where(inArray(products.id, productIds));

  const total = cart.reduce((acc, item) => {
    const product = cartProducts.find((p) => p.id === item.productId);
    return acc + Number(product?.price || 0) * item.qty;
  }, 0);

  const [order] = await db
    .insert(orders)
    .values({
      userId: session.user.id,
      total: total.toString(),
      status: "PENDING",
    })
    .returning();

  const itemsToInsert = cart.map((item) => {
    const product = cartProducts.find((p) => p.id === item.productId);
    return {
      orderId: order.id,
      productId: item.productId,
      title: product?.title || "Unknown",
      price: (product?.price || 0).toString(),
      qty: item.qty,
    };
  });

  await db.insert(orderItems).values(itemsToInsert);

  const parameter = {
    transaction_details: {
      order_id: order.id,
      gross_amount: total,
    },
    customer_details: {
      first_name: session.user.name,
      email: session.user.email,
    },
    item_details: cart.map((item) => {
      const product = cartProducts.find((p) => p.id === item.productId);
      return {
        id: item.productId,
        price: Number(product?.price || 0),
        quantity: item.qty,
        name: product?.title,
      };
    }),
  };

  try {
    const transaction = await snap.createTransaction(parameter);
    return {
      token: transaction.token as string,
      redirect_url: transaction.redirect_url as string,
    };
  } catch (error) {
    console.error("Midtrans Error:", error);
    throw new Error("Failed to create payment transaction");
  }
}
