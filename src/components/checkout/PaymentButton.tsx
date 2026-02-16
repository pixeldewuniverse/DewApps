"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { createCheckout } from "@/lib/actions/checkout";
import { clearCart } from "@/lib/actions/cart";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    snap: {
      pay: (token: string, options: object) => void;
    };
  }
}

export default function PaymentButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;

    let script = document.querySelector(`script[src="${midtransScriptUrl}"]`) as HTMLScriptElement;

    if (!script) {
      script = document.createElement("script");
      script.src = midtransScriptUrl;
      script.setAttribute("data-client-key", clientKey || "");
      document.body.appendChild(script);
    }
  }, []);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await createCheckout();

      window.snap.pay(res.token, {
        onSuccess: async function () {
          toast.success("Payment success!");
          await clearCart();
          router.push("/account/orders");
        },
        onPending: async function () {
          toast.info("Waiting for payment...");
          await clearCart();
          router.push("/account/orders");
        },
        onError: function () {
          toast.error("Payment failed!");
        },
        onClose: function () {
          toast.warning("You closed the popup without finishing the payment");
        },
      });
    } catch (error) {
      toast.error("Failed to initialize checkout");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={loading}
      className="pixel-button w-full bg-black text-white hover:bg-white hover:text-black py-4 h-auto text-xl"
    >
      {loading ? "PROCESSING..." : "PAY NOW"}
    </Button>
  );
}
