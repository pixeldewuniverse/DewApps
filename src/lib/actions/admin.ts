"use server";

import { db } from "@/db";
import { products, productFiles } from "@/db/schema";
import { uploadFile } from "@/lib/s3";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

async function ensureAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Unauthorized: Admin access required");
  }
  return session;
}

export async function createProduct(formData: FormData) {
  await ensureAdmin();

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const price = formData.get("price") as string;
  const category = formData.get("category") as string;
  const coverImage = formData.get("coverImage") as File;
  const productFile = formData.get("productFile") as File;

  const coverImageBuffer = Buffer.from(await coverImage.arrayBuffer());
  const coverImageUrl = await uploadFile(
    coverImageBuffer,
    `covers/${Date.now()}-${coverImage.name}`,
    coverImage.type
  );

  const productFileBuffer = Buffer.from(await productFile.arrayBuffer());
  const productFileUrl = await uploadFile(
    productFileBuffer,
    `products/${Date.now()}-${productFile.name}`,
    productFile.type
  );

  const [product] = await db
    .insert(products)
    .values({
      title,
      slug,
      description,
      price,
      category,
      coverImageUrl,
    })
    .returning();

  await db.insert(productFiles).values({
    productId: product.id,
    fileName: productFile.name,
    fileUrl: productFileUrl,
  });

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  await ensureAdmin();
  await db.delete(products).where(eq(products.id, id));
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}

export async function toggleProductStatus(id: string, currentStatus: boolean) {
  await ensureAdmin();
  await db.update(products).set({ isActive: !currentStatus }).where(eq(products.id, id));
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}
