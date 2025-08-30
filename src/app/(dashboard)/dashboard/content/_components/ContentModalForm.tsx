"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CalendarIcon, Loader2, Plus, Upload, X } from "lucide-react";
import Image from "next/image";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa6";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { ErrorBoundary } from "react-error-boundary";
import { RichTextEditorHeading } from "@/components/ui/RichTextEditor";
import { ContentItem } from "./ContentDataType";

// Define interfaces
interface Content {
  id?: string;
  image2?: string[];
  tags?: string[];
  author: string;
  meta_description?: string;
  meta_title?: string;
  heading: string;
  sub_heading: string;
  body1: string;
  date: string | Date;
  category_id?: string;
  subcategory_id?: string;
}

interface MutationResponse {
  status: boolean;
  message?: string;
  data?: Content;
}

interface ContentFormModalProps {
  initialContent?: ContentItem | null | undefined;
  categoryId: string | string[];
  subcategoryId: string | string[];
  onSuccess?: () => void;
  onCancel?: () => void;
  setEditingContent?: React.Dispatch<React.SetStateAction<ContentItem | null>>;
  setShowForm?: React.Dispatch<React.SetStateAction<boolean>>;
}

// Zod Schema
const formSchema = z.object({
  image2: z
    .array(z.string().min(1, "Image name or URL is required"))
    .min(0, "At least one image is required")
    .max(10, "Maximum 10 images allowed"),
  tags: z.array(z.string().min(1)).max(10, "Max 10 tags"),
  author: z.string().min(2, "Author must be at least 2 characters"),
  meta_title: z.string().min(2, "Meta title must be at least 2 characters"),
  meta_description: z
    .string()
    .min(2, "Meta description must be at least 2 characters"),
  heading: z.string().min(2, "Heading must be at least 2 characters"),
  sub_heading: z.string().min(2, "Sub Heading must be at least 2 characters"),
  body1: z.string().min(2, "Body must be at least 2 characters"),
  date: z
    .date({
      required_error: "Please select a date",
      invalid_type_error: "Invalid date",
    })
    .refine((date) => date <= new Date(), {
      message: "Date cannot be in the future",
    }),
});

interface FormData {
  date: Date;
  tags: string[];
  author: string;
  meta_title: string;
  meta_description: string;
  heading: string;
  sub_heading: string;
  body1: string;
  image2: string[];
}

const ErrorFallback = ({ error }: { error: Error }) => (
  <div className="p-4 bg-red-100 text-red-700 rounded">
    <p>Something went wrong: {error.message}</p>
    <Button onClick={() => window.location.reload()}>Try again</Button>
  </div>
);

export default function ContentAddEditForm({
  initialContent,
  categoryId,
  subcategoryId,
  onSuccess,
  onCancel,
  setEditingContent,
  setShowForm,
}: ContentFormModalProps) {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [newImageLink, setNewImageLink] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState<Date | undefined>(undefined);
  const [isDragging, setIsDragging] = useState(false);

  const session = useSession();
  const token = (session?.data?.user as { token: string })?.token;
  const queryClient = useQueryClient();

  function convertToCDNUrl(image2?: string): string {
    const image2BaseUrl = "https://s3.amazonaws.com/splurjjimages/images";
    const cdnBaseUrl = "https://dsfua14fu9fn0.cloudfront.net/images";

    if (typeof image2 === "string" && image2.startsWith(image2BaseUrl)) {
      return image2.replace(image2BaseUrl, cdnBaseUrl);
    }

    return image2 || "";
  }

  function getImageUrl(image2?: string) {
    if (!image2) return "";

    try {
      const parsed = JSON.parse(image2);
      if (parsed?.image2) {
        return convertToCDNUrl(parsed.image2);
      }
    } catch {
      return convertToCDNUrl(image2);
    }

    return "";
  }

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image2: [],
      tags: [],
      author: "",
      meta_title: "",
      meta_description: "",
      date: new Date(),
      heading: "",
      sub_heading: "",
      body1: "",
    },
  });

  useEffect(() => {
    if (initialContent) {
      const initialImages = (initialContent?.image2 || []).map((img: string) =>
        getImageUrl(img)
      );

      form.reset({
        image2: initialImages,
        tags: initialContent.tags || [],
        author: initialContent.author || "",
        meta_title: initialContent.meta_title || "",
        meta_description: initialContent.meta_description || "",
        heading: initialContent.heading || "",
        sub_heading: initialContent.sub_heading || "",
        body1: initialContent.body1 || "",
        date: initialContent.date ? new Date(initialContent.date) : new Date(),
      });

      setImagePreviews(initialImages);
      setImageFiles([]); // No files for URLs from backend
    }

    return () => {
      imagePreviews.forEach((preview) => {
        if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
      });
    };
  }, [initialContent, form]);

  const { watch, setValue } = form;
  const tags = watch("tags");

  const handleFileUpload = (files: FileList | null) => {
    if (files && files.length > 0) {
      const validFiles = Array.from(files).filter((file) => {
        const validType = [
          "image/png",
          "image/jpeg",
          "image/gif",
          "image/jpg",
          "image/webp",
          "image/avif",
        ].includes(file.type);
        const validSize = file.size <= 10 * 1024 * 1024; // 10MB
        return validType && validSize;
      });

      if (validFiles.length === 0) {
        toast.error(
          "Invalid file type or size (max 10MB, PNG/JPG/GIF/WEBP/AVIF)"
        );
        return;
      }

      const newFileNames = validFiles.map((file) => file.name);
      const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
      const currentImages = form.getValues("image2") || [];
      const updatedImages = [...currentImages, ...newFileNames].slice(0, 10);
      form.setValue("image2", updatedImages);
      setImagePreviews((prev) => [...prev, ...newPreviews].slice(0, 10));
      setImageFiles((prev) => [...prev, ...validFiles].slice(0, 10));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const removeImage = (index: number) => {
    const currentImages = form.getValues("image2");
    const updatedImages = currentImages.filter((_, i) => i !== index);
    form.setValue("image2", updatedImages);

    if (imagePreviews[index]?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreviews[index]);
    }
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    const newTag = tagInput.trim();
    const currentTags = watch("tags");

    if (newTag && !currentTags.includes(newTag)) {
      const updatedTags = [...currentTags, newTag].slice(0, 10);
      setValue("tags", updatedTags);
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    const currentTags = watch("tags");
    const updatedTags = currentTags.filter((_, i) => i !== index);
    setValue("tags", updatedTags);
  };

  const handleCloseForm = () => {
    if (setShowForm) setShowForm(false);
    if (setEditingContent) setEditingContent(null);
  };

  const url = initialContent
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contents/${initialContent?.id}?_method=PUT`
    : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contents`;

  const { mutate, isPending, error } = useMutation<
    MutationResponse,
    Error,
    FormData
  >({
    mutationKey: ["add-content-and-edit-content"],
    mutationFn: async (formData: FormData) => {
      const formDataToSend = new FormData();
      formDataToSend.append("category_id", categoryId.toString());
      formDataToSend.append("subcategory_id", subcategoryId.toString());
      formDataToSend.append("heading", formData.heading);
      formDataToSend.append("author", formData.author);
      formDataToSend.append("meta_title", formData.meta_title);
      formDataToSend.append("meta_description", formData.meta_description);
      formDataToSend.append("date", formData.date.toISOString().split("T")[0]);
      formDataToSend.append("sub_heading", formData.sub_heading);
      formDataToSend.append("body1", formData.body1);
      formDataToSend.append("tags", JSON.stringify(formData.tags));

      formData.image2.forEach((image, index) => {
        const file = imageFiles.find((f) => f.name === image);
        if (file) {
          formDataToSend.append(`image2[${index}]`, file);
        } else {
          formDataToSend.append(`image2[${index}]`, image);
        }
      });

      if (initialContent) {
        formDataToSend.append("_method", "PUT");
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to submit content");
      }
      return data;
    },
    onSuccess: (data: MutationResponse) => {
      if (!data.status) {
        toast.error(data.message || "Something went wrong");
        return;
      }
      form.reset();
      setImageFiles([]);
      setImagePreviews([]);
      toast.success(data.message || "Content operation successful");
      queryClient.invalidateQueries({ queryKey: ["all-contents"] });
      onSuccess?.();
      handleCloseForm();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to submit content");
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("content data", data);
    mutate(data);
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="shadow p-7 rounded-lg bg-white">
        {isPending && (
          <div className="h-screen w-full flex items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        )}
        {error && <div className="text-red-500 mb-4">{error.message}</div>}
        {!isPending && (
          <>
            <div className="flex items-center justify-between pb-6">
              <h2 className="text-2xl font-bold text-black dark:text-black">
                {initialContent ? "Edit Content" : "Add New Content"}
              </h2>
              <Button
                variant="outline"
                onClick={handleCloseForm}
                className="bg-white text-[#0253F7] dark:text-[#0253F7] text-lg font-bold leading-normal border-2 border-[#0253F7]"
              >
                <FaArrowLeft className="text-[#0253F7] " /> Back to List
              </Button>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Heading */}
                <FormField
                  control={form.control}
                  name="heading"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-bold text-black">
                        Heading
                      </FormLabel>
                      <FormControl>
                        <RichTextEditorHeading
                          content={field.value}
                          onChange={field.onChange}
                          placeholder="Heading ...."
                        />
                      </FormControl>
                      <FormMessage className="text-red-500"/>
                    </FormItem>
                  )}
                />

                {/* Sub Heading */}
                <FormField
                  control={form.control}
                  name="sub_heading"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-bold text-black">
                        Sub Heading
                      </FormLabel>
                      <FormControl>
                        <RichTextEditorHeading
                          content={field.value}
                          onChange={field.onChange}
                          placeholder="Sub Heading ...."
                        />
                      </FormControl>
                      <FormMessage className="text-red-500"/>
                    </FormItem>
                  )}
                />

                {/* Author */}
                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-bold text-black">
                        Author
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="text-black bg-white border border-gray-300 rounded-lg p-4"
                          placeholder="Author name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500"/>
                    </FormItem>
                  )}
                />

                {/* Date */}
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-lg font-bold text-black">
                        Date
                      </FormLabel>
                      <div className="relative flex gap-2">
                        <FormControl>
                          <Input
                            value={field.value.toLocaleDateString("en-US", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })}
                            onChange={(e) => {
                              const parsed = new Date(e.target.value);
                              if (!isNaN(parsed.getTime())) {
                                field.onChange(parsed);
                                setMonth(parsed);
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "ArrowDown") {
                                e.preventDefault();
                                setOpen(true);
                              }
                            }}
                            className="bg-white border border-gray-300 text-black rounded-lg p-4"
                            placeholder="Select date"
                          />
                        </FormControl>

                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                            >
                              <CalendarIcon className="size-3.5 dark:text-black" />
                              <span className="sr-only dark:text-black">
                                Select date
                              </span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto overflow-hidden p-0 bg-white"
                            align="end"
                          >
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(date) => {
                                if (date) {
                                  field.onChange(date);
                                  setOpen(false);
                                  setMonth(date);
                                }
                              }}
                              month={month}
                              onMonthChange={setMonth}
                              captionLayout="dropdown"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <FormMessage className="text-red-500"/>
                    </FormItem>
                  )}
                />

                {/* Tags */}
                <div>
                  <FormLabel className="text-lg font-bold text-black">
                    Tags
                  </FormLabel>
                  <div className="flex items-center gap-2 mb-3 mt-2 relative">
                    <Input
                      className="text-black bg-white border border-gray-300 rounded-lg p-4"
                      placeholder="Add a tag"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="shrink-0 absolute top-1/2 right-3 -translate-y-1/2 bg-none"
                    >
                      <Plus className="h-6 w-6 text-gray-500" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {tags?.map((tag, i) => (
                      <div
                        key={i}
                        className="h-[30px] flex items-center gap-1 bg-gray-200 text-black pl-4 pr-1 py-1 rounded-full text-sm"
                      >
                        {tag}
                        <Button
                          size="icon"
                          variant="ghost"
                          className="p-0.5"
                          onClick={() => removeTag(i)}
                          type="button"
                        >
                          <X className="h-3 w-3 text-black" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Meta Title */}
                <FormField
                  control={form.control}
                  name="meta_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-bold text-black">
                        Meta Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="text-black bg-white border border-gray-300 rounded-lg p-4"
                          placeholder="Meta title"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500"/>
                    </FormItem>
                  )}
                />

                {/* Meta Description */}
                <FormField
                  control={form.control}
                  name="meta_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-bold text-black">
                        Meta Description
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="text-black bg-white border border-gray-300 rounded-lg p-4"
                          placeholder="Meta description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500"/>
                    </FormItem>
                  )}
                />

                {/* Body Text */}
                <FormField
                  control={form.control}
                  name="body1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-bold text-black">
                        Body Text
                      </FormLabel>
                      <FormControl>
                        <RichTextEditor
                          content={field.value}
                          onChange={field.onChange}
                          placeholder="Description...."
                        />
                      </FormControl>
                      <FormMessage className="text-red-500"/>
                    </FormItem>
                  )}
                />

                {/* Images */}
                <FormField
                  control={form.control}
                  name="image2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-bold text-black">
                        Images
                      </FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {field.value?.map((image, index) => (
                              <div key={index} className="relative group">
                                <div className="w-full h-48 relative">
                                  <Image
                                    src={imagePreviews[index] || image}
                                    alt={`Preview ${index + 1}`}
                                    fill
                                    className="object-cover rounded-lg border"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                            {(!field.value || field.value.length < 10) && (
                              <label
                                className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                                  isDragging
                                    ? "bg-blue-100 border-blue-500"
                                    : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                                }`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                              >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <Upload className="w-8 h-8 text-gray-500" />
                                  <p className="mb-2 text-sm text-gray-500 dark:text-black">
                                    Drag and drop or click to upload images
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-black">
                                    PNG, JPG, GIF, WEBP, AVIF (MAX. 10MB)
                                  </p>
                                </div>
                                <input
                                  type="file"
                                  multiple
                                  accept="image/*"
                                  onChange={(e) => handleFileUpload(e.target.files)}
                                  className="hidden"
                                />
                              </label>
                            )}
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex-1 h-px bg-gray-300" />
                            <span className="text-gray-500">OR</span>
                            <div className="flex-1 h-px bg-gray-300" />
                          </div>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Paste image URL"
                              className="flex-1 dark:text-black bg-white border border-gray-300"
                              value={newImageLink}
                              onChange={(e) => setNewImageLink(e.target.value)}
                            />
                            <Button
                              type="button"
                              className="text-white bg-[#0253F7]"
                              onClick={() => {
                                if (newImageLink) {
                                  const currentImages = field.value || [];
                                  field.onChange([
                                    ...currentImages,
                                    newImageLink,
                                  ]);
                                  setImagePreviews((prev) => [
                                    ...prev,
                                    newImageLink,
                                  ]);
                                  setNewImageLink("");
                                }
                              }}
                              disabled={
                                !newImageLink ||
                                (field.value && field.value.length >= 10)
                              }
                            >
                              Add Link
                            </Button>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500"/>
                    </FormItem>
                  )}
                />

                {/* Submit Buttons */}
                <div className="flex gap-4 justify-center pt-8">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="bg-white text-gray-600 dark:text-black border-gray-300 px-8 py-3 rounded-lg text-lg font-medium"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-primary text-white px-8 py-3 rounded-lg text-lg font-medium"
                    disabled={isPending}
                  >
                    {isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Submit
                  </Button>
                </div>
              </form>
            </Form>
          </>
        )}
      </div>
    </ErrorBoundary>
  );
}




// update code 2

// "use client";

// import type React from "react";
// import { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { CalendarIcon, Loader2, Plus, Upload, X } from "lucide-react";
// import Image from "next/image";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { useSession } from "next-auth/react";
// import { toast } from "react-toastify";
// import { FaArrowLeft } from "react-icons/fa6";
// import { RichTextEditor } from "@/components/ui/rich-text-editor";
// import { ErrorBoundary } from "react-error-boundary";
// import { RichTextEditorHeading } from "@/components/ui/RichTextEditor";
// import { ContentItem } from "./ContentDataType";

// // Define interfaces
// interface Content {
//   id?: string;
//   image2?: string[];
//   tags?: string[];
//   author: string;
//   meta_description?: string;
//   meta_title?: string;
//   heading: string;
//   sub_heading: string;
//   body1: string;
//   date: string | Date;
//   category_id?: string;
//   subcategory_id?: string;
// }

// interface MutationResponse {
//   status: boolean;
//   message?: string;
//   data?: Content;
// }

// interface ContentFormModalProps {
//   initialContent?: ContentItem | null | undefined;
//   categoryId: string | string[];
//   subcategoryId: string | string[];
//   onSuccess?: () => void;
//   onCancel?: () => void;
//   setEditingContent?: React.Dispatch<React.SetStateAction<ContentItem | null>>;
//   setShowForm?: React.Dispatch<React.SetStateAction<boolean>>;
// }

// // Zod Schema
// const formSchema = z.object({
//   image2: z
//     .array(z.string().min(1, "Image name or URL is required"))
//     .min(1, "At least one image is required")
//     .max(10, "Maximum 10 images allowed"),
//   tags: z.array(z.string().min(1)).max(10, "Max 10 tags"),
//   author: z.string().min(2, "Author must be at least 2 characters"),
//   meta_title: z.string().min(2, "Meta title must be at least 2 characters"),
//   meta_description: z
//     .string()
//     .min(2, "Meta description must be at least 2 characters"),
//   heading: z.string().min(2, "Heading must be at least 2 characters"),
//   sub_heading: z.string().min(2, "Sub Heading must be at least 2 characters"),
//   body1: z.string().min(2, "Body must be at least 2 characters"),
//   date: z
//     .date({
//       required_error: "Please select a date",
//       invalid_type_error: "Invalid date",
//     })
//     .refine((date) => date <= new Date(), {
//       message: "Date cannot be in the future",
//     }),
// });

// interface FormData {
//   date: Date;
//   tags: string[];
//   author: string;
//   meta_title: string;
//   meta_description: string;
//   heading: string;
//   sub_heading: string;
//   body1: string;
//   image2: string[];
// }

// const ErrorFallback = ({ error }: { error: Error }) => (
//   <div className="p-4 bg-red-100 text-red-700 rounded">
//     <p>Something went wrong: {error.message}</p>
//     <Button onClick={() => window.location.reload()}>Try again</Button>
//   </div>
// );

// export default function ContentAddEditForm({
//   initialContent,
//   categoryId,
//   subcategoryId,
//   onSuccess,
//   onCancel,
//   setEditingContent,
//   setShowForm,
// }: ContentFormModalProps) {
//   const [imagePreviews, setImagePreviews] = useState<string[]>([]);
//   const [imageFiles, setImageFiles] = useState<File[]>([]);
//   const [newImageLink, setNewImageLink] = useState("");
//   const [tagInput, setTagInput] = useState("");
//   const [open, setOpen] = useState(false);
//   const [month, setMonth] = useState<Date | undefined>(undefined);

//   const session = useSession();
//   const token = (session?.data?.user as { token: string })?.token;
//   const queryClient = useQueryClient();

//   function convertToCDNUrl(image2?: string): string {
//     const image2BaseUrl = "https://s3.amazonaws.com/splurjjimages/images";
//     const cdnBaseUrl = "https://dsfua14fu9fn0.cloudfront.net/images";

//     if (typeof image2 === "string" && image2.startsWith(image2BaseUrl)) {
//       return image2.replace(image2BaseUrl, cdnBaseUrl);
//     }

//     return image2 || "";
//   }

//   function getImageUrl(image2?: string) {
//     if (!image2) return "";

//     try {
//       const parsed = JSON.parse(image2);
//       if (parsed?.image2) {
//         return convertToCDNUrl(parsed.image2);
//       }
//     } catch {
//       return convertToCDNUrl(image2);
//     }

//     return "";
//   }

//   console.log(initialContent);

//   const form = useForm<FormData>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       image2: [],
//       tags: [],
//       author: "",
//       meta_title: "",
//       meta_description: "",
//       date: new Date(),
//       heading: "",
//       sub_heading: "",
//       body1: "",
//     },
//   });

//   useEffect(() => {
//     if (initialContent) {
//       const initialImages = (initialContent?.image2 || []).map((img: string) =>
//         getImageUrl(img)
//       );
//       // const initialImages = initialContent.image2 || [];

//       form.reset({
//         image2: initialImages,
//         tags: initialContent.tags || [],
//         author: initialContent.author || "",
//         meta_title: initialContent.meta_title || "",
//         meta_description: initialContent.meta_description || "",
//         heading: initialContent.heading || "",
//         sub_heading: initialContent.sub_heading || "",
//         body1: initialContent.body1 || "",
//         date: initialContent.date ? new Date(initialContent.date) : new Date(),
//       });

//       setImagePreviews(initialImages);
//       setImageFiles([]); // No files for URLs from backend
//     }

//     return () => {
//       imagePreviews.forEach((preview) => {
//         if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
//       });
//     };
//   }, [initialContent, form]);

//   const { watch, setValue } = form;
//   const tags = watch("tags");

//   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const files = event.target.files;
//     if (files && files.length > 0) {
//       const validFiles = Array.from(files).filter((file) => {
//         const validType = [
//           "image/png",
//           "image/jpeg",
//           "image/gif",
//           "image/jpg",
//           "image/webp",
//           "image/avif",
//         ].includes(file.type);
//         const validSize = file.size <= 10 * 1024 * 1024; // 10MB
//         return validType && validSize;
//       });

//       if (validFiles.length === 0) {
//         toast.error(
//           "Invalid file type or size (max 10MB, PNG/JPG/GIF/WEBP/AVIF)"
//         );
//         return;
//       }

//       const newFileNames = validFiles.map((file) => file.name);
//       const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
//       const currentImages = form.getValues("image2") || [];
//       const updatedImages = [...currentImages, ...newFileNames].slice(0, 10);
//       form.setValue("image2", updatedImages);
//       setImagePreviews((prev) => [...prev, ...newPreviews].slice(0, 10));
//       setImageFiles((prev) => [...prev, ...validFiles].slice(0, 10));
//     }
//   };

//   const removeImage = (index: number) => {
//     const currentImages = form.getValues("image2");
//     const updatedImages = currentImages.filter((_, i) => i !== index);
//     form.setValue("image2", updatedImages);

//     if (imagePreviews[index]?.startsWith("blob:")) {
//       URL.revokeObjectURL(imagePreviews[index]);
//     }
//     setImagePreviews((prev) => prev.filter((_, i) => i !== index));
//     setImageFiles((prev) => prev.filter((_, i) => i !== index));
//   };

//   const addTag = () => {
//     const newTag = tagInput.trim();
//     const currentTags = watch("tags");

//     if (newTag && !currentTags.includes(newTag)) {
//       const updatedTags = [...currentTags, newTag].slice(0, 10);
//       setValue("tags", updatedTags);
//       setTagInput("");
//     }
//   };

//   const removeTag = (index: number) => {
//     const currentTags = watch("tags");
//     const updatedTags = currentTags.filter((_, i) => i !== index);
//     setValue("tags", updatedTags);
//   };

//   const handleCloseForm = () => {
//     if (setShowForm) setShowForm(false);
//     if (setEditingContent) setEditingContent(null);
//   };

//   const url = initialContent
//     ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contents/${initialContent?.id}?_method=PUT`
//     : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contents`;

//   // const method = initialContent ? "POST" : "POST";

//   const { mutate, isPending, error } = useMutation<
//     MutationResponse,
//     Error,
//     FormData
//   >({
//     mutationKey: ["add-content-and-edit-content"],
//     mutationFn: async (formData: FormData) => {
//       const formDataToSend = new FormData();
//       formDataToSend.append("category_id", categoryId.toString());
//       formDataToSend.append("subcategory_id", subcategoryId.toString());
//       formDataToSend.append("heading", formData.heading);
//       formDataToSend.append("author", formData.author);
//       formDataToSend.append("meta_title", formData.meta_title);
//       formDataToSend.append("meta_description", formData.meta_description);
//       formDataToSend.append("date", formData.date.toISOString().split("T")[0]);
//       formDataToSend.append("sub_heading", formData.sub_heading);
//       formDataToSend.append("body1", formData.body1);
//       formDataToSend.append("tags", JSON.stringify(formData.tags));

//       // Handle images: append existing URLs and new files
//       formData.image2.forEach((image, index) => {
//         const file = imageFiles.find((f) => f.name === image);
//         if (file) {
//           formDataToSend.append(`image2[${index}]`, file);
//         } else {
//           formDataToSend.append(`image2[${index}]`, image);
//         }
//       });

//       // Explicitly append _method=PUT for updates
//       if (initialContent) {
//         formDataToSend.append("_method", "PUT");
//       }

//       const response = await fetch(url, {
//         method: "POST", // Always use POST, as _method=PUT handles updates
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formDataToSend,
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.message || "Failed to submit content");
//       }
//       return data;
//     },
//     onSuccess: (data: MutationResponse) => {
//       if (!data.status) {
//         toast.error(data.message || "Something went wrong");
//         return;
//       }
//       form.reset();
//       setImageFiles([]);
//       setImagePreviews([]);
//       toast.success(data.message || "Content operation successful");
//       queryClient.invalidateQueries({ queryKey: ["all-contents"] });
//       onSuccess?.();
//       handleCloseForm();
//     },
//     onError: (error: Error) => {
//       toast.error(error.message || "Failed to submit content");
//     },
//   });

//   const onSubmit = (data: FormData) => {
//     console.log("content data", data);
//     mutate(data);
//   };

//   return (
//     <ErrorBoundary FallbackComponent={ErrorFallback}>
//       <div className="shadow p-7 rounded-lg bg-white">
//         {isPending && (
//           <div className="h-screen w-full flex items-center justify-center">
//             <Loader2 className="h-10 w-10 animate-spin text-primary" />
//           </div>
//         )}
//         {error && <div className="text-red-500 mb-4">{error.message}</div>}
//         {!isPending && (
//           <>
//             <div className="flex items-center justify-between pb-6">
//               <h2 className="text-2xl font-bold text-black dark:text-black">
//                 {initialContent ? "Edit Content" : "Add New Content"}
//               </h2>
//               <Button
//                 variant="outline"
//                 onClick={handleCloseForm}
//                 className="bg-white text-[#0253F7] dark:text-[#0253F7] text-lg font-bold leading-normal border-2 border-[#0253F7]"
//               >
//                 <FaArrowLeft className="text-[#0253F7] " /> Back to List
//               </Button>
//             </div>

//             <Form {...form}>
//               <form
//                 onSubmit={form.handleSubmit(onSubmit)}
//                 className="space-y-6"
//               >
//                 {/* Heading */}
//                 <FormField
//                   control={form.control}
//                   name="heading"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-lg font-bold text-black">
//                         Heading
//                       </FormLabel>
//                       <FormControl>
//                         <RichTextEditorHeading
//                           content={field.value}
//                           onChange={field.onChange}
//                           placeholder="Heading ...."
//                         />
//                       </FormControl>
//                       <FormMessage className="text-red-500"/>
//                     </FormItem>
//                   )}
//                 />

//                 {/* Sub Heading */}
//                 <FormField
//                   control={form.control}
//                   name="sub_heading"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-lg font-bold text-black">
//                         Sub Heading
//                       </FormLabel>
//                       <FormControl>
//                         <RichTextEditorHeading
//                           content={field.value}
//                           onChange={field.onChange}
//                           placeholder="Sub Heading ...."
//                         />
//                       </FormControl>
//                       <FormMessage className="text-red-500"/>
//                     </FormItem>
//                   )}
//                 />

//                 {/* Author */}
//                 <FormField
//                   control={form.control}
//                   name="author"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-lg font-bold text-black">
//                         Author
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           className="text-black bg-white border border-gray-300 rounded-lg p-4"
//                           placeholder="Author name"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage className="text-red-500"/>
//                     </FormItem>
//                   )}
//                 />

//                 {/* Date */}
//                 <FormField
//                   control={form.control}
//                   name="date"
//                   render={({ field }) => (
//                     <FormItem className="flex flex-col">
//                       <FormLabel className="text-lg font-bold text-black">
//                         Date
//                       </FormLabel>
//                       <div className="relative flex gap-2">
//                         <FormControl>
//                           <Input
//                             value={field.value.toLocaleDateString("en-US", {
//                               day: "2-digit",
//                               month: "long",
//                               year: "numeric",
//                             })}
//                             onChange={(e) => {
//                               const parsed = new Date(e.target.value);
//                               if (!isNaN(parsed.getTime())) {
//                                 field.onChange(parsed);
//                                 setMonth(parsed);
//                               }
//                             }}
//                             onKeyDown={(e) => {
//                               if (e.key === "ArrowDown") {
//                                 e.preventDefault();
//                                 setOpen(true);
//                               }
//                             }}
//                             className="bg-white border border-gray-300 text-black rounded-lg p-4"
//                             placeholder="Select date"
//                           />
//                         </FormControl>

//                         <Popover open={open} onOpenChange={setOpen}>
//                           <PopoverTrigger asChild>
//                             <Button
//                               type="button"
//                               variant="ghost"
//                               className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
//                             >
//                               <CalendarIcon className="size-3.5 dark:text-black" />
//                               <span className="sr-only dark:text-black">
//                                 Select date
//                               </span>
//                             </Button>
//                           </PopoverTrigger>
//                           <PopoverContent
//                             className="w-auto overflow-hidden p-0 bg-white"
//                             align="end"
//                           >
//                             <Calendar
//                               mode="single"
//                               selected={field.value}
//                               onSelect={(date) => {
//                                 if (date) {
//                                   field.onChange(date);
//                                   setOpen(false);
//                                   setMonth(date);
//                                 }
//                               }}
//                               month={month}
//                               onMonthChange={setMonth}
//                               captionLayout="dropdown"
//                             />
//                           </PopoverContent>
//                         </Popover>
//                       </div>
//                       <FormMessage className="text-red-500"/>
//                     </FormItem>
//                   )}
//                 />

//                 {/* Tags */}
//                 <div>
//                   <FormLabel className="text-lg font-bold text-black">
//                     Tags
//                   </FormLabel>
//                   <div className="flex items-center gap-2 mb-3 mt-2 relative">
//                     <Input
//                       className="text-black bg-white border border-gray-300 rounded-lg p-4"
//                       placeholder="Add a tag"
//                       value={tagInput}
//                       onChange={(e) => setTagInput(e.target.value)}
//                       onKeyDown={(e) => {
//                         if (e.key === "Enter") {
//                           e.preventDefault();
//                           addTag();
//                         }
//                       }}
//                     />
//                     <button
//                       type="button"
//                       onClick={addTag}
//                       className="shrink-0 absolute top-1/2 right-3 -translate-y-1/2 bg-none"
//                     >
//                       <Plus className="h-6 w-6 text-gray-500" />
//                     </button>
//                   </div>

//                   <div className="flex flex-wrap gap-2">
//                     {tags?.map((tag, i) => (
//                       <div
//                         key={i}
//                         className="h-[30px] flex items-center gap-1 bg-gray-200 text-black pl-4 pr-1 py-1 rounded-full text-sm"
//                       >
//                         {tag}
//                         <Button
//                           size="icon"
//                           variant="ghost"
//                           className="p-0.5"
//                           onClick={() => removeTag(i)}
//                           type="button"
//                         >
//                           <X className="h-3 w-3 text-black" />
//                         </Button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* meta title */}
//                 <FormField
//                   control={form.control}
//                   name="meta_title"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-lg font-bold text-black">
//                         Meta Title
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           className="text-black bg-white border border-gray-300 rounded-lg p-4"
//                           placeholder="meta title"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage className="text-red-500"/>
//                     </FormItem>
//                   )}
//                 />
//                 {/* meta description */}
//                 <FormField
//                   control={form.control}
//                   name="meta_description"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-lg font-bold text-black">
//                         Meta Description
//                       </FormLabel>
//                       <FormControl>
//                         <Input
//                           className="text-black bg-white border border-gray-300 rounded-lg p-4"
//                           placeholder="meta description"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage className="text-red-500"/>
//                     </FormItem>
//                   )}
//                 />

//                 {/* Body Text */}
//                 <FormField
//                   control={form.control}
//                   name="body1"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-lg font-bold text-black">
//                         Body Text
//                       </FormLabel>
//                       <FormControl>
//                         <RichTextEditor
//                           content={field.value}
//                           onChange={field.onChange}
//                           placeholder="Description...."
//                         />
//                       </FormControl>
//                       <FormMessage className="text-red-500"/>
//                     </FormItem>
//                   )}
//                 />

//                 {/* Images */}
//                 <FormField
//                   control={form.control}
//                   name="image2"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-lg font-bold text-black">
//                         Images
//                       </FormLabel>
//                       <FormControl>
//                         <div className="space-y-4">
//                           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                             {field.value?.map((image, index) => (
//                               <div key={index} className="relative group">
//                                 <div className="w-full h-48 relative">
//                                   <Image
//                                     src={imagePreviews[index] || image}
//                                     alt={`Preview ${index + 1}`}
//                                     fill
//                                     className="object-cover rounded-lg border"
//                                   />
//                                 </div>
//                                 <button
//                                   type="button"
//                                   onClick={() => removeImage(index)}
//                                   className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
//                                 >
//                                   <X className="w-4 h-4" />
//                                 </button>
//                               </div>
//                             ))}
//                             {(!field.value || field.value.length < 10) && (
//                               <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
//                                 <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                                   <Upload className="w-8 h-8 text-gray-500" />
//                                   <p className="mb-2 text-sm text-gray-500 dark:text-black">
//                                     Click to upload
//                                   </p>
//                                   <p className="text-xs text-gray-500 dark:text-black">
//                                     PNG, JPG, GIF, WEBP, AVIF (MAX. 10MB)
//                                   </p>
//                                 </div>
//                                 <input
//                                   type="file"
//                                   multiple
//                                   accept="image/*"
//                                   onChange={handleFileUpload}
//                                   className="hidden"
//                                 />
//                               </label>
//                             )}
//                           </div>
//                           <div className="flex items-center gap-4">
//                             <div className="flex-1 h-px bg-gray-300" />
//                             <span className="text-gray-500">OR</span>
//                             <div className="flex-1 h-px bg-gray-300" />
//                           </div>
//                           <div className="flex gap-2">
//                             <Input
//                               placeholder="Paste image URL"
//                               className="flex-1 dark:text-black bg-white border border-gray-300"
//                               value={newImageLink}
//                               onChange={(e) => setNewImageLink(e.target.value)}
//                             />
//                             <Button
//                               type="button"
//                               className="text-white bg-[#0253F7]"
//                               onClick={() => {
//                                 if (newImageLink) {
//                                   const currentImages = field.value || [];
//                                   field.onChange([
//                                     ...currentImages,
//                                     newImageLink,
//                                   ]);
//                                   setImagePreviews((prev) => [
//                                     ...prev,
//                                     newImageLink,
//                                   ]);
//                                   setNewImageLink("");
//                                 }
//                               }}
//                               disabled={
//                                 !newImageLink ||
//                                 (field.value && field.value.length >= 10)
//                               }
//                             >
//                               Add Link
//                             </Button>
//                           </div>
//                         </div>
//                       </FormControl>
//                       <FormMessage className="text-red-500"/>
//                     </FormItem>
//                   )}
//                 />

//                 {/* Submit Buttons */}
//                 <div className="flex gap-4 justify-center pt-8">
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={onCancel}
//                     className="bg-white text-gray-600 dark:text-black border-gray-300 px-8 py-3 rounded-lg text-lg font-medium"
//                   >
//                     Cancel
//                   </Button>
//                   <Button
//                     type="submit"
//                     className="bg-primary text-white px-8 py-3 rounded-lg text-lg font-medium"
//                     disabled={isPending}
//                   >
//                     {isPending && (
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     )}
//                     Submit
//                   </Button>
//                 </div>
//               </form>
//             </Form>
//           </>
//         )}
//       </div>
//     </ErrorBoundary>
//   );
// }
