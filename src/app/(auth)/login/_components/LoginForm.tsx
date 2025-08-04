"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
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
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// ✅ Zod Schema
const loginFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export function LogingForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

    const handelLogin = async (provider: string) => {
    if (provider === "google") {
      await signIn("google", { callbackUrl: "/" });
    } else {
      await signIn("facebook", { callbackUrl: "/" });
    }
  };

  // ✅ Handle submit
  async function onSubmit(data: LoginFormValues) {
    try {
      setIsLoading(true);

      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (res?.error) {
        throw new Error(res.error);
      }

      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error((error as Error).message);
    } finally {
      setIsLoading(false);
    }
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
                  {/* <Mail className="absolute left-3 top-3.5 w-5 h-5 text-black" /> */}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <div className="mt-4">
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
                      autoComplete="current-password"
                      className="border border-[#616161] h-[49px] bg-white text-[#131313]
placeholder:text-[#929292] font-medium  
leading-[120%] p-4 outline-none ring-0 focus:outline-none focus:ring-0"
                    />
                    {/* <Lock className="absolute left-3 top-3.5 w-5 h-5 text-black" /> */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-4 text-gray-400"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-black dark:text-black" />
                      ) : (
                        <Eye className="w-5 h-5 text-black dark:text-black" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Remember Me / Forgot Password */}
        <div className="flex items-center justify-between mt-[16px] mb-6 md:mb-8">
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <label
                  htmlFor="rememberMe"
                  className="text-sm  font-normal leading-[120%] tracking-[0%] text-[#131313] dark:text-white"
                >
                  Remember me
                </label>
              </div>
            )}
          />

          <div>
            <Link
              href="/forgot-password"
              className="text-sm font-normal  leading-[120%] text-[#131313] dark:text-white tracking-[0%]"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {/* Submit Button */}
        <div className="">
          <button
            type="submit"
            className="w-full h-[51px] bg-[#0253F7] rounded-[8px] text-base font-bold tracking-[0%]  text-white "
            disabled={isLoading}
          >
            {isLoading ? "Logging..." : "Login"}
          </button>
        </div>

        <div className="flex gap-5 mt-5">
          {/* Google */}
          <Button
            type="button"
            variant="outline"
            onClick={() => handelLogin("google")}
            className="w-full flex items-center justify-center gap-2 text-sm border-gray-300"
          >
            <Image
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              width={20}
              height={20}
            />
            Google
          </Button>

          {/* Facebook */}
          {/* <Button
            type="button"
            variant="outline"
            onClick={() => handelLogin("facebook")}
            className="w-full flex bg-[#3b5998] text-white items-center justify-center gap-2 text-sm border-gray-300"
          >
            <Image src="/assets/images/facebook.svg" alt="Facebook" width={20} height={20} />
            Facebook
          </Button> */}
        </div>

        {/* sign up link  */}
        <div className="text-center mt-6 md:mt-8 ">
          <p className="text-base text-[#272727] dark:text-white  font-normal leading-[150%] tracking-[0%]">
            <span className="text-[#272727] dark:text-white">
              Don’t have an account?
            </span>
            <Link
              href="/sign-up"
              className="text-[#0253F7]  hover:underline font-medium pl-2"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
}
