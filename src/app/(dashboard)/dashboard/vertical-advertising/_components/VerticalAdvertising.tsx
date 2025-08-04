"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
import { Textarea } from "@/components/ui/textarea";
import FileUpload from "@/components/ui/FileUpload";
import { toast } from "react-toastify";

export type AdvertisingSetting = {
  success: boolean;
  message: string;
  data: {
    id: number;
    link: string | null;
    image: string | null;
    code: string | null;
    created_at: string;
    updated_at: string;
    slug: string;
  };
};

const formSchema = z
  .object({
    link: z.string().optional(),
    code: z.string().optional(),
  })
  .refine(
    (data) => {
      const hasImageData = data.link && data.link.length >= 2;
      const hasEmbedData = data.code && data.code.length >= 2;
      return (hasImageData && !hasEmbedData) || (!hasImageData && hasEmbedData);
    },
    {
      message: "Provide either link + image OR embed code, but not both.",
      path: ["root"],
    }
  );

export default function VerticalAdvertising() {
  const [image, setImage] = useState<File | null>(null);
  const [leftSideActive, setLeftSideActive] = useState(false);
  const [rightSideActive, setRightSideActive] = useState(false);

  const session = useSession();
  const token = (session?.data?.user as { token?: string })?.token;
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      link: "",
      code: "",
    },
  });

  const { data } = useQuery<AdvertisingSetting>({
    queryKey: ["vertical-ads"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/advertising/vertical`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json()),
    enabled: !!token,
  });

  useEffect(() => {
    if (data?.data) {
      form.reset({
        link: data.data.link || "",
        code: data.data.code || "",
      });
      setImage(null);
    }
  }, [data, form]);

  const watchLink = form.watch("link");
  const watchCode = form.watch("code");

  useEffect(() => {
    const hasImageContent = (watchLink && watchLink.length >= 2) || image;
    const hasEmbedContent = watchCode && watchCode.length >= 2;

    setLeftSideActive(!!hasImageContent);
    setRightSideActive(!!hasEmbedContent);
  }, [watchLink, watchCode, image]);

  useEffect(() => {
    if (leftSideActive && rightSideActive) {
      form.setValue("code", "");
    }
  }, [leftSideActive, rightSideActive, form]);

  const handleEmbedCodeChange = (value: string) => {
    if (value.length >= 2 && leftSideActive) {
      form.setValue("link", "");
      setImage(null);
    }
  };

  const handleImageUrlChange = (value: string) => {
    if (value.length >= 2 && rightSideActive) {
      form.setValue("code", "");
    }
  };

  const handleFileChange = (file: File | null) => {
    setImage(file);
    if (file && rightSideActive) {
      form.setValue("code", "");
    }
  };

  const { mutate, isPending } = useMutation({
    mutationKey: ["vertical-ads"],
    mutationFn: (formData: FormData) =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/advertising/vertical`, {
        method: "POST", // Change to PUT or PATCH if needed
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }).then((res) => res.json()),
    onSuccess: (res) => {
      if (!res.success) {
        toast.error(res.message || "Failed to update ad");
        return;
      }
      form.reset();
      setImage(null);
      toast.success(res.message || "Ad updated successfully");
      queryClient.invalidateQueries({ queryKey: ["vertical-ads"] });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();

    // ✅ Include ID for update
    if (data?.data?.id) formData.append("id", String(data.data.id));

    if (values.link) formData.append("link", values.link);
    if (values.code) formData.append("code", values.code);

    if (image) {
      formData.append("image", image);
    } else if (data?.data?.image) {
      formData.append("existingImage", data.data.image); // Optional: Only if backend expects existing image path
    }

    mutate(formData);
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex items-center justify-between bg-white p-6 rounded-[10px] shadow-lg">
            {/* Left: Link + Image */}
            <div
              className={`w-2/5 border rounded-[10px] px-4 py-8 bg-white shadow-xl transition-opacity duration-200 ${
                rightSideActive
                  ? "opacity-50 pointer-events-none"
                  : "opacity-100"
              }`}
            >
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold text-black">
                      Ads Link
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="text-black"
                        placeholder="Enter ads link"
                        {...field}
                        disabled={rightSideActive}
                        onChange={(e) => {
                          field.onChange(e);
                          handleImageUrlChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="mt-5">
                <FileUpload
                  type="image"
                  label="Upload Ads Image"
                  file={image}
                  setFile={handleFileChange}
                  disabled={rightSideActive}
                  existingUrl={
                    !image && leftSideActive && data?.data?.image
                      ? `${data?.data?.image}`
                      : undefined
                  }
                />
              </div>
            </div>

            <div className="w-1/5 flex items-center justify-center">
              <h2 className="text-3xl font-bold text-black dark:text-black">OR</h2>
            </div>

            {/* Right: Embed Code */}
            <div
              className={`w-2/5 border rounded-[10px] p-4 bg-white shadow-xl transition-opacity duration-200 ${
                leftSideActive
                  ? "opacity-50 pointer-events-none"
                  : "opacity-100"
              }`}
            >
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold text-black">
                      Embed Code
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="h-[150px] w-full text-black dark:text-black"
                        placeholder="Enter Embed Code"
                        {...field}
                        disabled={leftSideActive}
                        onChange={(e) => {
                          field.onChange(e);
                          handleEmbedCodeChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Form error */}
          {form.formState.errors.root && (
            <div className="text-red-500 text-sm">
              {form.formState.errors.root.message}
            </div>
          )}

          <div>
            <Button className="text-white" type="submit" disabled={isPending}>
              {isPending ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
