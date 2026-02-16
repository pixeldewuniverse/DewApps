import { auth } from "@/auth";
import { db } from "@/db";
import { orders, orderItems, productFiles, products } from "@/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getSignedUrl } from "@/lib/s3";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function LibraryPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Get all paid orders for the user
  const paidOrders = await db
    .select({ id: orders.id })
    .from(orders)
    .where(and(eq(orders.userId, session.user.id), eq(orders.status, "PAID")));

  if (paidOrders.length === 0) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl">MY LIBRARY</h1>
        <div className="border-4 border-black bg-white p-12 text-center space-y-4">
          <p className="font-body text-xl">Your library is empty. Start your collection today!</p>
          <Button asChild className="pixel-button bg-cyan text-black">
            <Link href="/shop">BROWSE ASSETS</Link>
          </Button>
        </div>
      </div>
    );
  }

  const orderIds = paidOrders.map((o) => o.id);

  // Get all product IDs from those orders
  const items = await db
    .select({ productId: orderItems.productId })
    .from(orderItems)
    .where(inArray(orderItems.orderId, orderIds));

  const productIds = Array.from(new Set(items.map((i) => i.productId).filter(Boolean))) as string[];

  if (productIds.length === 0) {
     return <div>No products found in your orders.</div>;
  }

  // Get products and their files
  const purchasedProducts = await db
    .select()
    .from(products)
    .where(inArray(products.id, productIds));

  const files = await db
    .select()
    .from(productFiles)
    .where(inArray(productFiles.productId, productIds));

  // Pre-generate signed URLs for all files (valid for 1 hour)
  const filesWithUrls = await Promise.all(
    files.map(async (file) => ({
      ...file,
      downloadUrl: await getSignedUrl(file.fileUrl),
    }))
  );

  return (
    <div className="space-y-8">
      <h1 className="text-3xl">MY LIBRARY</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {purchasedProducts.map((product) => (
          <div key={product.id} className="border-4 border-black bg-white overflow-hidden flex flex-col">
            <div className="relative aspect-video w-full border-b-4 border-black">
              <Image
                src={product.coverImageUrl}
                alt={product.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="p-4 flex-grow space-y-4">
              <h3 className="font-cta text-lg uppercase">{product.title}</h3>
              <div className="space-y-2">
                {filesWithUrls
                  .filter((f) => f.productId === product.id)
                  .map((file) => (
                    <Button
                      key={file.id}
                      asChild
                      variant="outline"
                      className="w-full border-2 border-black rounded-none justify-start font-body h-auto py-2"
                    >
                      <a href={file.downloadUrl} download={file.fileName} target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" />
                        <span className="truncate">{file.fileName}</span>
                      </a>
                    </Button>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
