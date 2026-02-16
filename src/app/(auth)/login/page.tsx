"use client";

import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid credentials");
      } else {
        toast.success("Logged in successfully!");
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-8">
      <h1 className="text-3xl text-center">LOGIN</h1>
      <form onSubmit={handleSubmit} className="border-4 border-black bg-white p-8 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">EMAIL</Label>
          <Input id="email" name="email" type="email" required className="border-4 border-black font-body text-lg" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">PASSWORD</Label>
          <Input id="password" name="password" type="password" required className="border-4 border-black font-body text-lg" />
        </div>
        <Button disabled={loading} className="pixel-button w-full bg-cyan text-black hover:bg-black hover:text-white">
          {loading ? "AUTHENTICATING..." : "LOGIN"}
        </Button>
      </form>
      <p className="text-center font-body text-lg">
        DON&apos;T HAVE AN ACCOUNT?{" "}
        <Link href="/register" className="text-teal hover:underline font-cta">
          REGISTER
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center font-heading">LOADING...</div>}>
      <LoginForm />
    </Suspense>
  );
}
