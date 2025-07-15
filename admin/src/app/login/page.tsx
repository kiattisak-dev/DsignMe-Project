"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import Cookies from "js-cookie";
import { LogoHeader } from "@/components/auth/LogoHeader";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/auth/LoginForm";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8081/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (response.ok) {
        Cookies.set("auth_token", data.token, { expires: 1 });
        toast({
          title: "Success",
          description: "You have successfully logged in.",
          variant: "default",
        });
        const redirect = searchParams.get("redirect");
        const validRedirects = [
          "/dashboard",
          "/dashboard/contacts",
          "/dashboard/projects",
          "/dashboard/projects/new",
        ];
        const target =
          redirect && validRedirects.includes(redirect)
            ? redirect
            : "/dashboard";
        router.push(target);
      } else {
        toast({
          title: "Error",
          description: data.error || "Invalid email or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to the server. Please try again later.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <LogoHeader />
        <AuthCard
          title="Admin Login"
          footer={
            <p className="w-full">Please use your registered credentials</p>
          }
        >
          <LoginForm onSubmit={onSubmit} isLoading={isLoading} />
        </AuthCard>
      </div>
    </div>
  );
}
