"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import PasswordChangeSuccessFullModal from "@/components/shared/modals/PasswordChangeSuccessFullModal";

// Password validation schema
const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function UpdatePasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const decodedEmail = decodeURIComponent(email || "");

  // Initialize form with React Hook Form and Zod validation
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["update-password"],
    mutationFn: (values: {
      password: string;
      password_confirmation: string;
      email: string;
    }) =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/password/reset`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(values),
      }).then((res) => res.json()),
    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data?.message || "Something went wrong");
        return;
      } else {
        // toast.success(data?.message || "Email sent successfully!");
        setSuccessModal(true);
      }
    },
  });

  // Form submission handler
  async function onSubmit(values: PasswordFormValues) {
    console.log(values);
    if (!decodedEmail) {
      toast.error("email is required");
      return;
    }
    mutate({
      password: values.password,
      password_confirmation: values.password_confirmation,
      email: decodedEmail,
    });
  }

  return (
    <div className="">
      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          {/* New Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#131313] dark:text-white font-medium text-base md:text-[17px] lg:text-lg  leading-[120%] tracking-[0%]">
                  New Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your New Password"
                      className="border border-[#272727] h-[49px] bg-white text-[#131313]
placeholder:text-[#929292] font-medium  
leading-[120%] p-4 outline-none ring-0 focus:outline-none focus:ring-0"
                      {...field}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-[#212121]" />
                      ) : (
                        <Eye className="h-5 w-5 text-[#212121]" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-xs mt-1" />
              </FormItem>
            )}
          />

          {/* Confirm Password Field */}
          <div className="my-6">
            <FormField
              control={form.control}
              name="password_confirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#131313] dark:text-white font-medium text-base md:text-[17px] lg:text-lg  leading-[120%] tracking-[0%]">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Enter your Confirm Password"
                        className="border border-[#272727] h-[49px] bg-white text-[#131313]
placeholder:text-[#929292] font-medium  
leading-[120%] p-4 outline-none ring-0 focus:outline-none focus:ring-0"
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-3 flex items-center"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-[#212121]" />
                        ) : (
                          <Eye className="h-5 w-5 text-[#212121]" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs mt-1" />
                </FormItem>
              )}
            />
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            className="w-full h-[51px] bg-[#0253F7] rounded-[8px] py-[16px] px-[81px] text-lg font-semibold  leading-[120%] tracking-[0%] text-[#F4F4F4]"
            disabled={isPending}
          >
            {isPending ? "Loading..." : "Continue"}
          </button>
        </form>
      </Form>

      {/* success modal  */}
      {successModal && (
        <PasswordChangeSuccessFullModal
          open={successModal}
          onOpenChange={setSuccessModal}
        />
      )}
    </div>
  );
}
