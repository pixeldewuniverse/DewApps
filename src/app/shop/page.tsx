import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, ilike, and, or } from "drizzle-orm";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;

  let allProducts: (typeof products.$inferSelect)[] = [];
  let categories: { category: string }[] = [];

  try {
    const where = and(
      eq(products.isActive, true),
      q ? or(ilike(products.title, `%${q}%`), ilike(products.description, `%${q}%`)) : undefined,
      category ? eq(products.category, category) : undefined
    );

    allProducts = await db.select().from(products).where(where);

    // Get unique categories for filter
    categories = (await db
      .select({ category: products.category })
      .from(products)
      .groupBy(products.category)) as { category: string }[];
  } catch (e) {
    console.error("Failed to fetch shop data", e);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-3xl text-black">THE SHOP</h1>

        <form className="flex w-full max-w-sm gap-2">
          <Input
            name="q"
            placeholder="Search assets..."
            defaultValue={q}
            className="border-4 border-black font-body text-lg focus-visible:ring-0"
          />
          <Button type="submit" className="pixel-button bg-cyan text-black">
            GO
          </Button>
        </form>
      </div>

      <div className="flex flex-wrap gap-4">
        <Link
          href="/shop"
          className={`border-4 border-black px-4 py-2 font-cta uppercase ${
            !category ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"
          }`}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.category}
            href={`/shop?category=${cat.category}${q ? `&q=${q}` : ""}`}
            className={`border-4 border-black px-4 py-2 font-cta uppercase ${
              category === cat.category ? "bg-black text-white" : "bg-white text-black hover:bg-gray-100"
            }`}
          >
            {cat.category}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {allProducts.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.slug}`}
            className="group border-4 border-black bg-white transition-all hover:-translate-y-2 hover:shadow-[8px_8px_0_0_rgba(0,0,0,1)]"
          >
            <div className="relative aspect-square w-full overflow-hidden border-b-4 border-black">
              <Image
                src={product.coverImageUrl}
                alt={product.title}
                fill
                className="object-cover transition-transform group-hover:scale-110"
                unoptimized
              />
            </div>
            <div className="p-4">
              <h3 className="mb-2 font-cta text-lg uppercase truncate">{product.title}</h3>
              <p className="font-body text-xl text-teal">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(Number(product.price))}
              </p>
            </div>
          </Link>
        ))}
        {allProducts.length === 0 && (
          <p className="col-span-full text-center font-body text-xl py-12">
            No products found matching your search.
          </p>
        )}
      </div>
    </div>
  );
}
