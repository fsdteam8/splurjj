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
import { ColorPicker } from "@/components/ui/color-picker";
import FileUpload from "@/components/ui/FileUpload";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useEffect } from "react";

const formSchema = z.object({
  color: z.string().min(6, {
    message: "Please pick a background color.",
  }),
  // border_color: z.string().min(6, {
  //   message: "Please pick a border color.",
  // }),
  menu_item_color: z.string().min(6, {
    message: "Please pick a menu color.",
  }),
  menu_item_active_color: z.string().min(6, {
    message: "Please pick a menu active color.",
  }),
});

export type HeaderResponse = {
  success: boolean;
  message: string;
  data: {
    logo: string | null;
    // border_color: string | null;
    bg_color: string | null;
    menu_item_color: string | null;
    menu_item_active_color: string | null;
  };
};

export function HeaderForm() {
  const [logo, setLogo] = useState<File | null>(null);

  const session = useSession();
  const token = (session?.data?.user as { token?: string })?.token;

  const { data } = useQuery<HeaderResponse>({
    queryKey: ["header"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/header`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json()),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      color: "#000000",
      // border_color: "#000000",
      menu_item_color: "#000000",
      menu_item_active_color: "#000000",
    },
  });

  useEffect(() => {
    if (data?.data) {
      form.reset({
        color: data?.data?.bg_color || "#000000",
        // border_color: data?.data?.border_color || "#000000",
        menu_item_color: data?.data?.menu_item_color || "#000000",
        menu_item_active_color: data?.data?.menu_item_active_color || "#000000",
      });
    }
  }, [data, form]);

  const { mutate, isPending } = useMutation({
    mutationKey: ["hearder-content"],
    mutationFn: (formData: FormData) =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/header/update`, {
        method: "POST",
        headers: {
          // "content-type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }).then((res) => res.json()),
    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data?.message || "Something went wrong");
        return;
      }
      toast.success(data?.message || "Footer updated successfully");
      form.reset();
      setLogo(null);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append("color", values?.color);
    // formData.append("border_color", values?.border_color);
    formData.append("menu_item_color", values?.menu_item_color);
    formData.append("menu_item_active_color", values?.menu_item_active_color);
    if (logo) {
      formData.append("logo", logo);
    }
    // console.log("Submitted Values:", values);
    mutate(formData);
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[20px]">
            {/* logo  */}
            <div>
              <FileUpload
                type="image"
                label="Add Logo"
                file={logo}
                setFile={setLogo}
                existingUrl={
                  data?.data?.logo
                    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${data.data.logo}`
                    : undefined
                }
              />
            </div>
            <div>
              {/* Color Picker */}
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold text-black">
                      Add Background Color
                    </FormLabel>
                    <FormControl>
                      <ColorPicker
                        selectedColor={field.value ?? "#FFFFFF"}
                        onColorChange={field.onChange}
                        // previousColor={"#000000"}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm font-medium" />
                  </FormItem>
                )}
              />
            </div>
            {/* <div>
              <FormField
                control={form.control}
                name="border_color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold text-black">
                      Add Border Color
                    </FormLabel>
                    <FormControl>
                      <ColorPicker
                        selectedColor={field.value ?? "#FFFFFF"}
                        onColorChange={field.onChange}
                        previousColor={"#000000"}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm font-medium" />
                  </FormItem>
                )}
              />
            </div> */}
            <div>
              {/* Color Picker */}
              <FormField
                control={form.control}
                name="menu_item_color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold text-black">
                      Add Menu Color
                    </FormLabel>
                    <FormControl>
                      <ColorPicker
                        selectedColor={field.value ?? "#FFFFFF"}
                        onColorChange={field.onChange}
                        // previousColor={"#000000"}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm font-medium" />
                  </FormItem>
                )}
              />
            </div>
            <div>
              {/* Color Picker */}
              <FormField
                control={form.control}
                name="menu_item_active_color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold text-black">
                      Add Menu Active Color
                    </FormLabel>
                    <FormControl>
                      <ColorPicker
                        selectedColor={field.value ?? "#FFFFFF"}
                        onColorChange={field.onChange}
                        // previousColor={"#000000"}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm font-medium" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-center items-center pt-5">
            <Button
              size={"lg"}
              disabled={isPending}
              type="submit"
              className="py-3 px-10 rounded-lg bg-primary text-white font-semibold leading-normal text-lg"
            >
              {isPending ? "Sending..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
