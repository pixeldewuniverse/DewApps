"use client";

import { register } from "@/lib/actions/auth";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await register(formData);
      toast.success("Account created! Please login.");
      router.push("/login");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-8">
      <h1 className="text-3xl text-center">REGISTER</h1>
      <form onSubmit={handleSubmit} className="border-4 border-black bg-white p-8 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">NAME</Label>
          <Input id="name" name="name" type="text" required className="border-4 border-black font-body text-lg" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">EMAIL</Label>
          <Input id="email" name="email" type="email" required className="border-4 border-black font-body text-lg" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">PASSWORD</Label>
          <Input id="password" name="password" type="password" required className="border-4 border-black font-body text-lg" />
        </div>
        <Button disabled={loading} className="pixel-button w-full bg-cyan text-black hover:bg-black hover:text-white">
          {loading ? "CREATING ACCOUNT..." : "REGISTER"}
        </Button>
      </form>
      <p className="text-center font-body text-lg">
        ALREADY HAVE AN ACCOUNT?{" "}
        <Link href="/login" className="text-teal hover:underline font-cta">
          LOGIN
        </Link>
      </p>
    </div>
  );
}
