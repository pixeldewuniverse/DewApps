import { getCart, removeFromCart, updateCartQty } from "@/lib/actions/cart";
import { db } from "@/db";
import { products } from "@/db/schema";
import { inArray } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus } from "lucide-react";

export default async function CartPage() {
  const cart = await getCart();

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 py-20 text-center">
        <h1 className="text-3xl">YOUR CART IS EMPTY</h1>
        <p className="font-body text-xl">Looks like you haven&apos;t added any pixel magic yet.</p>
        <Button asChild className="pixel-button bg-cyan text-black">
          <Link href="/shop">START SHOPPING</Link>
        </Button>
      </div>
    );
  }

  const productIds = cart.map((item) => item.productId);
  const cartProducts = await db
    .select()
    .from(products)
    .where(inArray(products.id, productIds));

  const itemsWithDetails = cart.map((item) => {
    const product = cartProducts.find((p) => p.id === item.productId);
    return { ...item, product };
  });

  const total = itemsWithDetails.reduce((acc, item) => {
    return acc + Number(item.product?.price || 0) * item.qty;
  }, 0);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl">YOUR CART</h1>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {itemsWithDetails.map((item) => (
            <div
              key={item.productId}
              className="flex flex-col gap-4 border-4 border-black bg-white p-4 sm:flex-row sm:items-center"
            >
              <div className="h-24 w-24 flex-shrink-0 border-4 border-black bg-gray-100">
                <img
                  src={item.product?.coverImageUrl}
                  alt={item.product?.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-grow">
                <h3 className="font-cta text-lg uppercase">{item.product?.title}</h3>
                <p className="font-body text-lg text-teal">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(Number(item.product?.price || 0))}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-4 border-black">
                  <form action={updateCartQty.bind(null, item.productId, item.qty - 1)}>
                    <button type="submit" className="px-2 py-1 hover:bg-gray-100">
                      <Minus size={16} />
                    </button>
                  </form>
                  <span className="w-8 text-center font-body text-lg">{item.qty}</span>
                  <form action={updateCartQty.bind(null, item.productId, item.qty + 1)}>
                    <button type="submit" className="px-2 py-1 hover:bg-gray-100">
                      <Plus size={16} />
                    </button>
                  </form>
                </div>
                <form action={removeFromCart.bind(null, item.productId)}>
                  <button type="submit" className="text-red-600 hover:text-red-800">
                    <Trash2 size={24} />
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>

        <div className="border-4 border-black bg-mint p-6 h-fit space-y-6">
          <h2 className="text-xl">SUMMARY</h2>
          <div className="flex justify-between font-body text-xl">
            <span>Subtotal</span>
            <span>
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(total)}
            </span>
          </div>
          <div className="border-t-2 border-black pt-4 flex justify-between font-cta text-xl">
            <span>TOTAL</span>
            <span>
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(total)}
            </span>
          </div>
          <Button asChild className="pixel-button w-full bg-black text-white hover:bg-white hover:text-black py-4 h-auto text-xl">
            <Link href="/checkout">CHECKOUT</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
