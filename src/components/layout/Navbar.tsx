"use client";

import Link from "next/link";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b-4 border-black bg-mint px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-heading text-black">
          PIXELDEW
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center space-x-8 md:flex">
          <Link href="/shop" className="font-cta text-lg uppercase hover:underline">
            Shop
          </Link>
          <Link href="/cart" className="relative font-cta text-lg uppercase hover:underline">
            <ShoppingCart className="inline-block mr-1" />
            Cart
          </Link>
          <Link href="/account" className="font-cta text-lg uppercase hover:underline">
            <User className="inline-block mr-1" />
            Account
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute left-0 top-[100%] w-full border-b-4 border-black bg-mint p-4 md:hidden">
          <div className="flex flex-col space-y-4">
            <Link
              href="/shop"
              className="font-cta text-xl uppercase"
              onClick={() => setIsOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/cart"
              className="font-cta text-xl uppercase"
              onClick={() => setIsOpen(false)}
            >
              Cart
            </Link>
            <Link
              href="/account"
              className="font-cta text-xl uppercase"
              onClick={() => setIsOpen(false)}
            >
              Account
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
