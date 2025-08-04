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
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

type PrivacyPolicyResponse = {
  status: "success";
  privacy_policy: string;
};

const formSchema = z.object({
  privacy_policy: z.string().min(2, {
    message: "body must be at least 2 characters.",
  }),
});

const PrivacyPolicy = () => {
  const queryClient = new QueryClient();
  const session = useSession();
  const token = (session?.data?.user as { token: string })?.token;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      privacy_policy: "",
    },
  });

  // get api
  const { data } = useQuery<PrivacyPolicyResponse>({
    queryKey: ["get-privacy-policy"],
    queryFn: () => {
      return fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/privacy-policy`
      ).then((res) => res.json());
    },
  });

  // console.log(data);

  useEffect(() => {
    if (data) {
      form.reset({
        privacy_policy: data?.privacy_policy,
      });
    }
  }, [data, form]);

  // post api
  const { mutate } = useMutation({
    mutationKey: ["update-privacy-policy"],
    mutationFn: (values: z.infer<typeof formSchema>) =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/privacy-policy`, {
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
      toast.success(data?.message || "Privacy Policy updated successfully");
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["get-privacy-policy"] });
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    mutate(values);
  }
  return (
    <div>
      <div className="bg-white shadow-lg rounded-[12px] p-5 border">
        <h2 className="text-3xl font-bold text-black leading-normal text-center">
          Privacy Policy
        </h2>
        <div className="pb-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="privacy_policy"
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

export default PrivacyPolicy;
