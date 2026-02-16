import { auth } from "@/auth";
import { getCart } from "@/lib/actions/cart";
import { db } from "@/db";
import { products } from "@/db/schema";
import { inArray } from "drizzle-orm";
import { redirect } from "next/navigation";
import PaymentButton from "@/components/checkout/PaymentButton";

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/checkout");
  }

  const cart = await getCart();
  if (cart.length === 0) {
    redirect("/cart");
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
    <div className="mx-auto max-w-2xl space-y-8">
      <h1 className="text-3xl text-center">CHECKOUT</h1>

      <div className="border-4 border-black bg-white p-8 space-y-6">
        <h2 className="text-xl">ORDER SUMMARY</h2>
        <div className="divide-y-2 divide-black">
          {itemsWithDetails.map((item) => (
            <div key={item.productId} className="py-4 flex justify-between font-body text-lg">
              <span>
                {item.product?.title} x {item.qty}
              </span>
              <span>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(Number(item.product?.price || 0) * item.qty)}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t-4 border-black pt-4 flex justify-between font-cta text-2xl">
          <span>TOTAL</span>
          <span>
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(total)}
          </span>
        </div>

        <div className="pt-4">
          <PaymentButton />
        </div>
      </div>

      <p className="text-center font-body text-sm">
        Secure payment via Midtrans. Your digital assets will be available in your Library after payment.
      </p>
    </div>
  );
}
