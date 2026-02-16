"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export type CartItem = {
  productId: string;
  qty: number;
};

export async function getCart(): Promise<CartItem[]> {
  const cookieStore = await cookies();
  const cartJson = cookieStore.get("cart")?.value;
  if (!cartJson) return [];
  try {
    return JSON.parse(cartJson);
  } catch {
    return [];
  }
}

export async function addToCart(formData: FormData) {
  const productId = formData.get("productId") as string;
  if (!productId) return;

  const cookieStore = await cookies();
  const cart = await getCart();

  const existingItem = cart.find((item) => item.productId === productId);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ productId, qty: 1 });
  }

  cookieStore.set("cart", JSON.stringify(cart), { path: "/" });
  revalidatePath("/cart");
}

export async function removeFromCart(productId: string) {
  const cookieStore = await cookies();
  let cart = await getCart();
  cart = cart.filter((item) => item.productId !== productId);
  cookieStore.set("cart", JSON.stringify(cart), { path: "/" });
  revalidatePath("/cart");
}

export async function updateCartQty(productId: string, qty: number) {
  if (qty < 1) return removeFromCart(productId);

  const cookieStore = await cookies();
  const cart = await getCart();
  const item = cart.find((item) => item.productId === productId);
  if (item) {
    item.qty = qty;
  }
  cookieStore.set("cart", JSON.stringify(cart), { path: "/" });
  revalidatePath("/cart");
}

export async function clearCart() {
  const cookieStore = await cookies();
  cookieStore.delete("cart");
  revalidatePath("/cart");
}
