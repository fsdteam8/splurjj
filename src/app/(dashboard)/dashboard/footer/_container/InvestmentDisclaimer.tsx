"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import QuillEditor from "@/components/ui/quill-editor";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { useEffect } from "react";

const formSchema = z.object({
  investment_disclaimer: z.string().min(2, {
    message: "body must be at least 2 characters.",
  }),
});

type InvestmentPolicyResponse = {
  status: "success";
  investment_disclaimer: string;
  message: string;
};

const InvestmentDisclaimer = () => {
  const queryClient = new QueryClient();
  const session = useSession();
  const token = (session?.data?.user as { token: string })?.token;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      investment_disclaimer: "",
    },
  });

  // get api
  const { data } = useQuery<InvestmentPolicyResponse>({
    queryKey: ["get-investment-disclaimer"],
    queryFn: () => {
      return fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/investment-disclaimer`
      ).then((res) => res.json());
    },
  });

  // console.log(data);

  useEffect(() => {
    if (data) {
      form.reset({
        investment_disclaimer: data?.investment_disclaimer,
      });
    }
  }, [data, form]);

  // post api
  const { mutate } = useMutation({
    mutationKey: ["update-investment-disclaimer"],
    mutationFn: (values: z.infer<typeof formSchema>) =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/investment-disclaimer`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      }).then((res) => res.json()),
    onSuccess: (data) => {
      if (!data?.status) {
        toast.error(data?.message || "Something went wrong");
        return;
      }
      toast.success(data?.message || "Investment Disclaimer updated successfully");
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["get-investment-disclaimer"] });
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    mutate(values);
  }
  return (
    <div className="pb-10">
      <div className="bg-white shadow-lg rounded-[12px] p-5 border">
        <h2 className="text-3xl font-bold text-black leading-normal text-center">
          Investment Disclaimer
        </h2>
        <div className="pb-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="investment_disclaimer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium text-black tracking-normal leading-normal">
                      Body
                    </FormLabel>
                    <FormControl>
                      <QuillEditor
                        id="sub_heading"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-center pt-6">
                <Button
                  className="text-white text-base font-medium leading-normal tracking-normal "
                  type="submit"
                >
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default InvestmentDisclaimer;
