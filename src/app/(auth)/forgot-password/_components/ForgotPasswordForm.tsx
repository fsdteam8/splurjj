"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";

// ✅ Zod Schema
const loginFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export function ForgotPasswordForm() {
  const router = useRouter();
  const { theme } = useTheme();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: (email: string) =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/password/email`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ email }),
      }).then((res) => res.json()),
    onSuccess: (data, email) => {
      if (!data?.success) {
        toast.error(data?.message || "Something went wrong");
        return;
      }
      toast.success(data?.message || "Email sent Successfully");
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    },
  });

  // ✅ Handle submit
  async function onSubmit(data: LoginFormValues) {
    // console.log(data);
    mutate(data.email);
  }

  return (
    <div>
      <div className="w-full flex justify-center items-center">
        <Link href="/">
          <Image
            src={
              theme === "dark"
                ? "/assets/images/white-logo.jpg"
                : "/assets/images/black-logo.png"
            }
            alt="sign in"
            width={1900}
            height={1200}
            className="w-[100px] h-[60px] object-cover"
          />
        </Link>
      </div>
      <div className="pb-[30px] w-full md:w-[570px] pt-4">
        <h1 className=" text-[32px] md:text-[36px] ld:text-[40px] font-bold leading-[120%] text-[#131313] tracking-[0%]">
          Forgot Password
        </h1>
        <p className=" text-base font-bold leading-[150%] text-[#424242] pt-[5px] tracking-[0%]">
          Enter your registered email address. we’ll send you a code to reset
          your password.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#131313] dark:text-white font-medium text-base md:text-[17px] lg:text-lg  leading-[120%] tracking-[0%]">
                  Email Address
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      placeholder="Enter your email"
                      type="email"
                      className="border border-[#616161] h-[49px] bg-white text-[#131313]
placeholder:text-[#929292] font-medium  
leading-[120%] p-4 outline-none ring-0 focus:outline-none focus:ring-0"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <div className="mt-6 md:mt-8">
            <button
              type="submit"
              className="w-full h-[51px] bg-[#0253F7] rounded-[8px] text-base font-bold tracking-[0%]  text-white "
              disabled={isPending}
            >
              {isPending ? "Sending..." : "Send OTP"}
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
}
