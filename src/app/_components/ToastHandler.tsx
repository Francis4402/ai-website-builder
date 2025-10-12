"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export function ToastHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const error = searchParams.get("error");
    const status = searchParams.get("status");

    if (error === "unauthenticated") {
      toast.error("You are not logged in", {
        description: "Please log in to access this page",
      });
      
      // Remove the error parameter from URL
      const url = new URL(window.location.href);
      url.searchParams.delete("error");
      router.replace(url.pathname);
    } else if (error === "unauthorized") {
      toast.error("Access Denied", {
        description: "You don't have permission to access this page",
      });
      
      // Remove the error parameter from URL
      const url = new URL(window.location.href);
      url.searchParams.delete("error");
      router.replace(url.pathname);
    } else if (status === "logged_out") {
      toast.success("Logged out successfully", {
        description: "You have been signed out of your account",
      });
      
      // Remove the status parameter from URL
      const url = new URL(window.location.href);
      url.searchParams.delete("status");
      router.replace(url.pathname);
    } else if (status === "signed_in") {
        toast.success("Signed in successfully", {
          description: "You have successfully signed in",
        });
    }
  }, [searchParams, router]);

  return null;
}