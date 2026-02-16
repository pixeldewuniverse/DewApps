import Link from "next/link";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function Home() {
  let featuredProducts: (typeof products.$inferSelect)[] = [];
  try {
    featuredProducts = await db
      .select()
      .from(products)
      .where(eq(products.isActive, true))
      .orderBy(desc(products.createdAt))
      .limit(4);
  } catch (e) {
    console.error("Failed to fetch featured products", e);
  }

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center space-y-8 py-12 text-center">
        <h1 className="text-4xl md:text-6xl text-black">
          RETRO PIXEL <br /> <span className="text-teal">DIGITAL ASSETS</span>
        </h1>
        <p className="max-w-2xl text-xl font-body md:text-2xl">
          Collect, trade, and use the finest pixel art assets for your games, apps, and digital projects.
        </p>
        <Button asChild className="pixel-button bg-cyan text-black hover:bg-white text-xl px-8 py-6 h-auto">
          <Link href="/shop">ENTER SHOP</Link>
        </Button>
      </section>

      {/* Featured Products */}
      <section className="space-y-8">
        <h2 className="text-2xl text-black">FEATURED DROPS</h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
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
          {featuredProducts.length === 0 && (
            <p className="col-span-full text-center font-body text-xl py-12">
              No products found. Stay tuned!
            </p>
          )}
        </div>
      </section>

      {/* Categories / Banner */}
      <section className="border-4 border-black bg-yellow-200 p-8 text-center">
        <h2 className="mb-4 text-2xl text-black">JOIN THE PIXEL REVOLUTION</h2>
        <p className="mb-6 font-body text-xl">Get exclusive access to limited edition drops and pixel bundles.</p>
        <Button asChild className="pixel-button bg-black text-white hover:bg-white hover:text-black">
          <Link href="/register">SIGN UP NOW</Link>
        </Button>
      </section>
    </div>
  );
}
