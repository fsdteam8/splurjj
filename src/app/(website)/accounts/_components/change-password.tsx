"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useSession } from "next-auth/react";

const passwordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirm_new_password: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    message: "Passwords don't match",
    path: ["confirm_new_password"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;



export default function ChangePassword() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const session = useSession();
  const token = (session?.data?.user as { token: string })?.token



  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_new_password: "",
    },
  });

    const { mutate, isPending } = useMutation({
      mutationKey: ["change-password"],
      mutationFn: (values: PasswordFormValues) =>
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update-password`, {
          method: "PUT",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        }).then((res) => res.json()),
      onSuccess: (data) => {
        if (!data?.success) {
          toast.error(data?.message || "Something went wrong");
          return;
        }
        toast.success(data?.message || "Password changed successfully");
        form.reset();
      },
    });

  function onSubmit(data: PasswordFormValues) {
    console.log(data)
    mutate(data)
    
  }

  return (
    <div>
      <div className="flex items-center justify-end mb-6 md:mb-8 lg:mb-10">
        <Button
          className="w-[160px] h-[51px] bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-2 px-4 text-base font-extrabold uppercase text-white"
          onClick={form.handleSubmit(onSubmit)}
          disabled={isPending}
        >
          {isPending ? "Saving..." : "Save"}
        </Button>
      </div>
      <div className="flex justify-between items-center my-6 md:my-8">
        <h2 className="text-xl md:text-[22px] lg:text-2xl font-semibold text-[#131313] leading-[120%] tracking-[0%] ">
          Change password
        </h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="current_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base md:text-[17px] lg:text-lg  font-medium leading-[120%] tracking-[0%] text-[#131313] dark:text-white">
                  Current Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="##############"
                      {...field}
                      className="w-full h-[56px] border border-[#645949] rounded-[8px] text-base font-normal  leading-[150%] tracking-[0%] text-[#131313] dark:text-white placeholder:text-[#616161]"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-4"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                    >
                      {showCurrentPassword ? <Eye /> : <EyeOff />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="new_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base md:text-[17px] lg:text-lg  font-medium leading-[120%] tracking-[0%] text-[#131313] dark:text-white">
                    New Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="##############"
                        {...field}
                        className="w-full h-[56px] border border-[#645949] rounded-[8px] text-base font-normal  leading-[150%] tracking-[0%] text-[#131313] dark:text-white placeholder:text-[#616161]"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-4"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <Eye /> : <EyeOff />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirm_new_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base md:text-[17px] lg:text-lg  font-medium leading-[120%] tracking-[0%] text-[#131313] dark:text-white">
                    Confirm New Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmNewPassword ? "text" : "password"}
                        placeholder="##############"
                        {...field}
                        className="w-full h-[56px] border border-[#645949] rounded-[8px] text-base font-normal  leading-[150%] tracking-[0%] text-[#131313] dark:text-white placeholder:text-[#616161]"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-4"
                        onClick={() =>
                          setShowConfirmNewPassword(!showConfirmNewPassword)
                        }
                      >
                        {showConfirmNewPassword ? <Eye /> : <EyeOff />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  );
}
