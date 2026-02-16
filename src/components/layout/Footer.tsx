import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t-4 border-black bg-black p-8 text-white">
      <div className="container mx-auto grid grid-cols-1 gap-8 md:grid-cols-3">
        <div>
          <h3 className="mb-4 text-xl font-heading">PIXELDEW</h3>
          <p className="font-body text-lg">
            Retro-pixel digital assets for your next project.
          </p>
        </div>
        <div>
          <h4 className="mb-4 font-cta text-lg uppercase">Links</h4>
          <ul className="space-y-2 font-body text-lg">
            <li>
              <Link href="/shop" className="hover:text-cyan">Shop</Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-cyan">Cart</Link>
            </li>
            <li>
              <Link href="/account" className="hover:text-cyan">Account</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 font-cta text-lg uppercase">Admin</h4>
          <ul className="space-y-2 font-body text-lg">
            <li>
              <Link href="/admin" className="hover:text-cyan">Dashboard</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-8 border-t border-gray-800 pt-8 text-center font-body text-sm">
        &copy; {new Date().getFullYear()} PIXELDEW. ALL RIGHTS RESERVED.
      </div>
    </footer>
  );
}
