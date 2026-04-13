"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { signInSchema } from "@/schemas/signInSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// Assuming you've run: npx shadcn@latest add field
import {
  Field,
  FieldControl,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";

export default function SignInPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });

      if (result?.error) {
        toast.error("Login Failed", {
          description:
            result.error === "CredentialsSignin"
              ? "Incorrect username or password"
              : result.error,
        });
      }

      if (result?.url) {
        toast.success("Welcome back!");
        router.replace("/dashboard");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Sign in to access your secure messages.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Identity Field */}
          <Field name="identifier" invalid={!!errors.identifier}>
            <FieldLabel className="text-gray-700">Email or Username</FieldLabel>
            <FieldControl>
              <Input
                {...register("identifier")}
                placeholder="Enter your email"
                autoComplete="username"
              />
            </FieldControl>
            <FieldError>{errors.identifier?.message}</FieldError>
          </Field>

          {/* Password Field */}
          <Field name="password" invalid={!!errors.password}>
            <FieldLabel className="text-gray-700">Password</FieldLabel>
            <FieldControl>
              <Input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </FieldControl>
            <FieldError>{errors.password?.message}</FieldError>
          </Field>

          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 transition-all"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="text-center pt-2">
          <p className="text-sm text-gray-600">
            Need an account?{" "}
            <Link
              href="/sign-up"
              className="font-medium text-blue-600 hover:underline"
            >
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
