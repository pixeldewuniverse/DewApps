import { db } from "@/db";
import { products } from "@/db/schema";
import { createProduct, deleteProduct, toggleProductStatus } from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Power } from "lucide-react";

export default async function AdminProductsPage() {
  const allProducts = await db.select().from(products);

  return (
    <div className="space-y-12">
      <h1 className="text-3xl">MANAGE PRODUCTS</h1>

      {/* Add Product Form */}
      <section className="border-4 border-black bg-white p-8 space-y-6">
        <h2 className="text-xl">ADD NEW PRODUCT</h2>
        <form action={createProduct} className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">TITLE</Label>
            <Input id="title" name="title" required className="border-2 border-black" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">SLUG</Label>
            <Input id="slug" name="slug" required className="border-2 border-black" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">DESCRIPTION</Label>
            <Textarea id="description" name="description" required className="border-2 border-black" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">PRICE (IDR)</Label>
            <Input id="price" name="price" type="number" required className="border-2 border-black" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">CATEGORY</Label>
            <Input id="category" name="category" required className="border-2 border-black" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="coverImage">COVER IMAGE</Label>
            <Input id="coverImage" name="coverImage" type="file" accept="image/*" required className="border-2 border-black" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="productFile">PRODUCT FILE (.zip, .png, etc)</Label>
            <Input id="productFile" name="productFile" type="file" required className="border-2 border-black" />
          </div>
          <div className="md:col-span-2 pt-4">
            <Button type="submit" className="pixel-button bg-cyan text-black w-full">
              UPLOAD & CREATE
            </Button>
          </div>
        </form>
      </section>

      {/* Product List */}
      <section className="border-4 border-black bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-100 border-b-4 border-black font-cta">
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="font-body text-lg">
            {allProducts.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-bold">{p.title}</TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell>{p.price}</TableCell>
                <TableCell>
                  <span className={p.isActive ? "text-green-600" : "text-red-600"}>
                    {p.isActive ? "ACTIVE" : "INACTIVE"}
                  </span>
                </TableCell>
                <TableCell className="flex gap-2">
                  <form action={toggleProductStatus.bind(null, p.id, p.isActive)}>
                    <Button variant="outline" size="sm" className="border-2 border-black">
                      <Power size={16} />
                    </Button>
                  </form>
                  <form action={deleteProduct.bind(null, p.id)}>
                    <Button variant="destructive" size="sm" className="border-2 border-black">
                      <Trash2 size={16} />
                    </Button>
                  </form>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}
