"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";

// ✅ Zod Schema
const signUpFormSchema = z
  .object({
    first_name: z.string().min(2, "First name must be at least 2 characters"),
    last_name: z.string().min(2, "Last name must be at least 2 characters"),
    company_name: z
      .string()
      .min(2, "Company name must be at least 2 characters"),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().optional(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      }),
    confirm_password: z.string().min(1, "Please confirm your password"),
    termsAndConditions: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

type SignUpFormValues = z.infer<typeof signUpFormSchema>;

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      company_name: "",
      email: "",
      phone: "",
      password: "",
      confirm_password: "",
      termsAndConditions: false,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["sign-up"],
    mutationFn: (data: SignUpFormValues) =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/register`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      }).then((res) => res.json()),
    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data?.message || "Something went wrong");
        return;
      }
      toast.success(data?.message || "User registered successfully");
      router.push("/login");
    },
  });

  async function onSubmit(data: SignUpFormValues) {
    // console.log(data);
    mutate(data);
  }

  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          {/* First & Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#131313] dark:text-white font-medium text-base md:text-[17px] lg:text-lg  leading-[120%] tracking-[0%]">
                    First Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your first name"
                      className="border border-[#272727] h-[49px] bg-white text-[#131313]
placeholder:text-[#929292] font-medium  
leading-[120%] p-4 outline-none ring-0 focus:outline-none focus:ring-0"
                    />
                  </FormControl>
                  <FormMessage className="text-[#DB0000]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#131313] dark:text-white font-medium text-base md:text-[17px] lg:text-lg  leading-[120%] tracking-[0%]">
                    Last Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your last name"
                      className="border border-[#272727] h-[49px] bg-white text-[#131313]
placeholder:text-[#929292] font-medium  
leading-[120%] p-4 outline-none ring-0 focus:outline-none focus:ring-0"
                    />
                  </FormControl>
                  <FormMessage className="text-[#DB0000]" />
                </FormItem>
              )}
            />
          </div>

          {/* Company Name */}
          <FormField
            control={form.control}
            name="company_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#131313] dark:text-white font-medium text-base md:text-[17px] lg:text-lg  leading-[120%] tracking-[0%]">
                  Company Name
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter your company name"
                    className="border border-[#272727] h-[49px] bg-white text-[#131313]
placeholder:text-[#929292] font-medium  
leading-[120%] p-4 outline-none ring-0 focus:outline-none focus:ring-0"
                  />
                </FormControl>
                <FormMessage className="text-[#DB0000]" />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#131313] dark:text-white font-medium text-base md:text-[17px] lg:text-lg  leading-[120%] tracking-[0%]">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter your email"
                    type="email"
                    className="border border-[#272727] h-[49px] bg-white text-[#131313]
placeholder:text-[#929292] font-medium  
leading-[120%] p-4 outline-none ring-0 focus:outline-none focus:ring-0"
                  />
                </FormControl>
                <FormMessage className="text-[#DB0000]" />
              </FormItem>
            )}
          />

          {/* Phone Number */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#131313] dark:text-white font-medium text-base md:text-[17px] lg:text-lg  leading-[120%] tracking-[0%]">
                  Phone Number
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter your phone number"
                    type="tel"
                    className="border border-[#272727] h-[49px] bg-white text-[#131313]
placeholder:text-[#929292] font-medium  
leading-[120%] p-4 outline-none ring-0 focus:outline-none focus:ring-0"
                  />
                </FormControl>
                <FormMessage className="text-[#DB0000]" />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#131313] dark:text-white font-medium text-base md:text-[17px] lg:text-lg  leading-[120%] tracking-[0%]">
                  Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      className="border border-[#272727] h-[49px] bg-white text-[#131313]
placeholder:text-[#929292] font-medium  
leading-[120%] p-4 outline-none ring-0 focus:outline-none focus:ring-0"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-black/60 hover:text-black"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-[#DB0000]" />
              </FormItem>
            )}
          />

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name="confirm_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#131313] dark:text-white font-medium text-base md:text-[17px] lg:text-lg  leading-[120%] tracking-[0%]">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      placeholder="Confirm your password"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      className="border border-[#272727] h-[49px] bg-white text-[#131313]
placeholder:text-[#929292] font-medium  
leading-[120%] p-4 outline-none ring-0 focus:outline-none focus:ring-0"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-3.5 text-black/60 hover:text-black"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-[#DB0000]" />
              </FormItem>
            )}
          />

          {/* Terms and Conditions */}
          <FormField
            control={form.control}
            name="termsAndConditions"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-medium leading-[120%] tracking-[0%] text-[#131313] dark:text-white">
                    I agree to the Terms and Conditions
                  </FormLabel>
                  <FormMessage className="text-[#DB0000]" />
                </div>
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <div className="py-[14px]">
            <Button
              type="submit"
              className="w-full h-[51px] bg-[#0253F7] hover:bg-[#2891d4] rounded-lg text-base font-normal  leading-[120%] tracking-[0%] text-white"
              disabled={isPending}
            >
              {isPending ? "Creating Account..." : "Sign Up"}
            </Button>
          </div>

          {/* Sign In Link */}
          <div className="text-center mt-6 md:mt-8 ">
            <p className="text-base text-[#272727] dark:text-white  font-normal leading-[150%] tracking-[0%]">
              <span className="text-[#272727] dark:text-white">
                Already have an account?
              </span>
              <Link
                href="/login"
                className="text-[#0253F7]  hover:underline font-medium pl-2"
              >
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}
