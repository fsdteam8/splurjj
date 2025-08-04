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

// ✅ Zod Schema
const loginFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export function ForgotPasswordForm() {
  const router = useRouter();

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
  );
}
