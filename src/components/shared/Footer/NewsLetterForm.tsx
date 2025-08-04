"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

const FormSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
});

const NewsLetterForm = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["subsribe"],
    mutationFn: (data: z.infer<typeof FormSchema>) =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then((res) => res.json()),
    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data?.message || "Something went wrong");
        return;
      }
      toast.success(data?.message || "Subscribed successfully");
      form.reset();
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    mutate(data);
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex items-center"
        >
          <div className=" ">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="w-full h-[40px] rounded-l-[8px] rounded-r-none bg-white text-base text-black leading-normal placeholder:text-black"
                      placeholder="Enter Your Email..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="">
            <button
              disabled={isPending}
              className="w-[127px] h-[40px] bg-[#0253F7] text-[#F2F2F2] rounded-r-[8px] text-lg font-bold  leading-normal "
              type="submit"
            >
              {isPending ? "Subscribing..." : "Subscribe"}
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewsLetterForm;
