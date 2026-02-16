import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ShieldCheck } from "lucide-react";
import { addToCart } from "@/lib/actions/cart";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let product;
  try {
    const [result] = await db
      .select()
      .from(products)
      .where(eq(products.slug, slug))
      .limit(1);
    product = result;
  } catch (e) {
    console.error("Failed to fetch product", e);
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
      {/* Product Image */}
      <div className="border-4 border-black bg-white p-4">
        <div className="aspect-square w-full overflow-hidden border-4 border-black bg-gray-100">
          <img
            src={product.coverImageUrl}
            alt={product.title}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-8">
        <div>
          <span className="bg-black px-2 py-1 font-cta text-sm uppercase text-white">
            {product.category}
          </span>
          <h1 className="mt-4 text-4xl text-black">{product.title}</h1>
          <p className="mt-2 text-3xl font-body text-teal">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(Number(product.price))}
          </p>
        </div>

        <div className="prose prose-lg max-w-none font-body text-xl">
          <p>{product.description}</p>
        </div>

        <div className="border-4 border-black bg-cyan/20 p-4 space-y-2">
          <div className="flex items-center gap-2 font-cta text-sm uppercase">
            <ShieldCheck className="text-teal" size={20} />
            <span>Digital Assets License included</span>
          </div>
          <p className="font-body text-sm">
            You can use this asset in personal and commercial projects. No attribution required.
          </p>
        </div>

        <form action={addToCart}>
          <input type="hidden" name="productId" value={product.id} />
          <Button className="pixel-button w-full bg-cyan text-black hover:bg-black hover:text-white text-xl h-auto py-4">
            <ShoppingCart className="mr-2" />
            ADD TO CART
          </Button>
        </form>
      </div>
    </div>
  );
}
