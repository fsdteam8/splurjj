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
// import type { Content } from "./ContentDataType";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { useSession } from "next-auth/react";
// import { toast } from "react-toastify";
// import { FaArrowLeft } from "react-icons/fa6";
// // import QuillEditor from "@/components/ui/quill-editor";
// import { RichTextEditor } from "@/components/ui/rich-text-editor";

// // Zod Schema
// const formSchema = z
//   .object({
//     image1: z.union([z.instanceof(File), z.string()]).optional(),
//     imageLink: z.string().url().optional().or(z.literal("")),
//     advertising_image: z.union([z.instanceof(File), z.string()]).optional(),
//     advertisingLink: z.string().url().optional().or(z.literal("")),
//     tags: z.array(z.string()).max(10, "Max 10 tags"),
//     author: z.string().min(2, {
//       message: "Author must be at least 2 characters.",
//     }),
//     heading: z.string().min(2, {
//       message: "Heading must be at least 2 characters.",
//     }),
//     sub_heading: z.string().min(2, {
//       message: "Sub Heading must be at least 2 characters.",
//     }),
//     body1: z.string().min(2, {
//       message: "Body must be at least 2 characters.",
//     }),
//     date: z.date({
//       required_error: "Please select a date.",
//       invalid_type_error: "Invalid date.",
//     }),
//   })
//   .refine((data) => data.image1 || data.imageLink, {
//     message: "Please provide an image file or link",
//     path: ["image1"],
//   });

// type FormData = z.infer<typeof formSchema>;

// interface ContentFormModalProps {
//   initialContent?: Content | null | undefined;
//   categoryId: string | string[];
//   subcategoryId: string | string[];
//   onSuccess?: () => void;
//   onCancel?: () => void;
//   setEditingContent?: React.Dispatch<React.SetStateAction<Content | null>>;
//   setShowForm?: React.Dispatch<React.SetStateAction<boolean>>;
// }

// export default function ContentAddEditForm({
//   initialContent,
//   categoryId,
//   subcategoryId,
//   onSuccess,
//   onCancel,
//   setEditingContent,
//   setShowForm,
// }: ContentFormModalProps) {
//   const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
//   const [tagInput, setTagInput] = useState("");
//   const [open, setOpen] = useState(false);
//   const [month, setMonth] = useState<Date | undefined>(undefined);

//   const session = useSession();
//   const token = (session?.data?.user as { token: string })?.token;
//   const queryClient = useQueryClient();

//   console.log(categoryId, subcategoryId);
//   console.log({ initialContent });

//   console.log("initialContent", initialContent);

//   const form = useForm<FormData>({
//     resolver: zodResolver(formSchema),

//     defaultValues: {
//       image1: "",
//       imageLink: "",
//       tags: [],
//       author: "",
//       date: new Date(),
//       heading: "",
//       sub_heading: "",
//       body1: "",
//     },
//   });

//   useEffect(() => {
//     if (initialContent) {
//       form.reset({
//         image1: initialContent.image1 || undefined,
//         imageLink: initialContent.imageLink || "",
//         advertising_image: initialContent.advertising_image || undefined,
//         advertisingLink: initialContent.advertisingLink || "",
//         tags: initialContent.tags || [],
//         author: initialContent.author || "",
//         heading: initialContent.heading || "",
//         sub_heading: initialContent.sub_heading || "",
//         body1: initialContent.body1 || "",
//         date: initialContent.date ? new Date(initialContent.date) : new Date(),
//       });
//     } else {
//       form.reset({
//         image1: undefined,
//         imageLink: "",
//         advertising_image: undefined,
//         advertisingLink: "",
//         tags: [],
//         author: "",
//         heading: "",
//         sub_heading: "",
//         body1: "",
//         date: new Date(),
//       });
//     }
//   }, [initialContent, form]);

//   const { watch, setValue } = form;
//   const image1 = watch("image1");
//   const imageLink = watch("imageLink");
//   const tags = watch("tags");

//   // Preview URLs
//   useEffect(() => {
//     if (image1 instanceof File) {
//       const url = URL.createObjectURL(image1);
//       setImagePreviewUrl(url);
//       return () => URL.revokeObjectURL(url);
//     } else if (typeof image1 === "string" && image1) {
//       // If it's a string (existing image URL), use it directly
//       setImagePreviewUrl(image1);
//     } else {
//       setImagePreviewUrl(null);
//     }
//   }, [image1]);

//   const handleFileUpload = (
//     event: React.ChangeEvent<HTMLInputElement>,
//     type: "image"
//   ) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       if (type === "image") {
//         setValue("image1", file);
//         setValue("imageLink", "");
//       }
//     }
//   };

//   const removeFile = (type: "image") => {
//     if (type === "image") {
//       setValue("image1", undefined);
//       setImagePreviewUrl(null);
//     }
//   };

//   // Add tag
//   const addTag = () => {
//     const newTag = tagInput.trim();
//     const currentTags = watch("tags");

//     if (newTag && !currentTags.includes(newTag) && currentTags.length < 10) {
//       const updatedTags = [...currentTags, newTag];
//       setValue("tags", updatedTags);
//       setTagInput("");
//     }
//   };

//   // Remove tag
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

//   const method = initialContent ? "POST" : "POST";

//   const { mutate, isPending } = useMutation<FormData>({
//     mutationKey: ["add-content-and-edit-content"],

//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     mutationFn: (formData: any) =>
//       fetch(`${url}`, {
//         method: method,
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       }).then((res) => res.json()),
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     onSuccess: (data: any) => {
//       if (!data?.status) {
//         toast.error(data?.message || "Something went wrong");
//         form.reset();
//         return;
//       }
//       form.reset();
//       toast.success(data?.message || "Content added successfully");
//       queryClient.invalidateQueries({ queryKey: ["all-contents"] });
//       onSuccess?.(); // Call the success callback
//     },
//   });

//   if(isPending){
//     return (
//       <div className="h-screen w-full flex items-center justify-center">
//         <Loader2 className="h-10 w-10 animate-spin text-primary" />
//       </div>
//     );
//   }

//   const onSubmit = (data: FormData) => {
//     const formData = new FormData();
//     formData.append("category_id", categoryId.toString());
//     formData.append("subcategory_id", subcategoryId.toString());
//     formData.append("heading", data.heading);
//     formData.append("author", data.author);
//     formData.append("date", data.date.toISOString().split("T")[0]);

//     formData.append("sub_heading", data.sub_heading);
//     formData.append("body1", data.body1);
//     formData.append("image1", data.image1 || "");
//     formData.append("imageLink", data.imageLink || "");

//     formData.append("tags", JSON.stringify(data.tags));

//     // console.log("Submitted data:", data);
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     mutate(formData as any);
//   };

//   return (
//     <div className="shadow p-7 rounded-lg bg-white">
//       <div className="flex items-center justify-between pb-6">
//         <h2 className="text-2xl font-bold text-black dark:text-black">
//           {initialContent ? "Edit Content" : "Add New Content"}
//         </h2>
//         <Button
//           variant="outline"
//           onClick={handleCloseForm}
//           className="bg-white text-[#0253F7] dark:text-[#0253F7] text-lg font-bold leading-normal border-2 border-[#0253F7]"
//         >
//           <FaArrowLeft className="dark:text-[#0253F7]" /> Back to List
//         </Button>
//       </div>
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="">
//           {/* heading */}
//           <div className="">
//             <FormField
//               control={form.control}
//               name="heading"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-lg font-bold text-black leading-[120%] tracking-[0%] ">
//                     Heading
//                   </FormLabel>
//                   <FormControl className="">
//                     {/* <TinyMCEEditor
//                       value={field.value}
//                       onEditorChange={field.onChange}
//                       height={500}
//                       placeholder="Write your blog post content here..."
//                     /> */}
//                     <RichTextEditor
//                       content={field.value}
//                       onChange={field.onChange}
//                       placeholder="Heading ...."
//                       // height="50px"
//                     />
//                     {/* <QuillEditor
//                       id="heading"
//                       value={field.value}
//                       onChange={field.onChange}
//                     /> */}
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//           {/* sub heading  */}
//           <div className="py-4 ">
//             <FormField
//               control={form.control}
//               name="sub_heading"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-lg font-bold text-black leading-[120%] tracking-[0%] ">
//                     Write Sub Heading
//                   </FormLabel>
//                   <FormControl>
//                     {/* <QuillEditor
//                       id="sub_heading"
//                       value={field.value}
//                       onChange={field.onChange}
//                     /> */}
//                     <RichTextEditor
//                       content={field.value}
//                       onChange={field.onChange}
//                       placeholder="Sub Heading ...."
//                       height="50px"
//                     />
//                     {/* <TinyMCEEditor
//                       value={field.value}
//                       onEditorChange={field.onChange}
//                       height={500}
//                       placeholder="Write your blog post content here..."
//                       disabled={isPending}
//                     /> */}
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//           {/* author  */}
//           <div className="">
//             <FormField
//               control={form.control}
//               name="author"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-lg font-bold text-black leading-[120%] tracking-[0%] ">
//                     Author
//                   </FormLabel>
//                   <FormControl>
//                     <Input
//                       className="text-black"
//                       placeholder="Write Name"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//           {/* date  */}
//           <div className="py-4">
//             <FormField
//               control={form.control}
//               name="date"
//               render={({ field }) => (
//                 <FormItem className="flex flex-col">
//                   <FormLabel className="text-lg font-bold text-black leading-[120%] tracking-[0%] ">
//                     Date
//                   </FormLabel>
//                   <div className="relative flex gap-2 ">
//                     <FormControl>
//                       <Input
//                         value={field.value.toLocaleDateString("en-US", {
//                           day: "2-digit",
//                           month: "long",
//                           year: "numeric",
//                         })}
//                         onChange={(e) => {
//                           const parsed = new Date(e.target.value);
//                           if (!isNaN(parsed.getTime())) {
//                             field.onChange(parsed);
//                             setMonth(parsed);
//                           }
//                         }}
//                         onKeyDown={(e) => {
//                           if (e.key === "ArrowDown") {
//                             e.preventDefault();
//                             setOpen(true);
//                           }
//                         }}
//                         className="bg-background dark:bg-white pr-10 text-black"
//                         placeholder="June 01, 2025"
//                       />
//                     </FormControl>

//                     <Popover open={open} onOpenChange={setOpen}>
//                       <PopoverTrigger asChild>
//                         <Button
//                           type="button"
//                           variant="ghost"
//                           className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
//                         >
//                           <CalendarIcon className="size-3.5" />
//                           <span className="sr-only">Select date</span>
//                         </Button>
//                       </PopoverTrigger>
//                       <PopoverContent
//                         className="w-auto overflow-hidden p-0 bg-white"
//                         align="end"
//                         alignOffset={-8}
//                         sideOffset={10}
//                       >
//                         <Calendar
//                           mode="single"
//                           selected={field.value}
//                           onSelect={(date) => {
//                             if (date) {
//                               field.onChange(date);
//                               setOpen(false);
//                               setMonth(date);
//                             }
//                           }}
//                           month={month}
//                           onMonthChange={setMonth}
//                           captionLayout="dropdown"
//                         />
//                       </PopoverContent>
//                     </Popover>
//                   </div>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>

//           {/* Tags Input */}
//           <div>
//             <FormLabel className="text-lg font-bold text-black leading-[120%] tracking-[0%] ">
//               Tags
//             </FormLabel>
//             <div className="flex items-center gap-2 mb-3 mt-2 relative">
//               <Input
//                 className="text-black"
//                 placeholder="Add a tag"
//                 value={tagInput}
//                 onChange={(e) => setTagInput(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") {
//                     e.preventDefault();
//                     addTag();
//                   }
//                 }}
//               />
//               <button
//                 type="button"
//                 onClick={addTag}
//                 className="shrink-0 absolute top-1.5 right-3 bg-none"
//               >
//                 <Plus className="h-6 w-6" />
//               </button>
//             </div>

//             <div className="flex flex-wrap gap-2">
//               {tags?.map((tag, i) => (
//                 <div
//                   key={i}
//                   className="h-[30px] flex items-center gap-1 bg-gray-200 text-black pl-4 pr-1 py-1 rounded-full text-sm"
//                 >
//                   {tag}
//                   <Button
//                     size="icon"
//                     variant="ghost"
//                     className="p-0.5"
//                     onClick={() => removeTag(i)}
//                     type="button"
//                   >
//                     <X className="h-3 w-3 dark:text-black" />
//                   </Button>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* body text */}
//           <div className=" py-4">
//             <FormField
//               control={form.control}
//               name="body1"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-lg font-bold text-black leading-[120%] tracking-[0%] ">
//                     Write Body Text
//                   </FormLabel>
//                   <FormControl>
//                     <RichTextEditor
//                       content={field.value}
//                       onChange={field.onChange}
//                       placeholder="Description...."
//                       height="50px"
//                     />

//                     {/* <TinyMCEEditor
//                       value={field.value}
//                       onEditorChange={field.onChange}
//                       height={500}
//                       placeholder="Write your blog post content here..."
//                     /> */}
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>

//           {/* Image Upload */}
//           <div className="">
//             <h2 className="text-lg font-bold text-black leading-[120%] tracking-[0%]">
//               Image
//             </h2>
//             <div className="border border-[#e2e8f0] rounded-lg p-5 mt-2">
//               <FormField
//                 control={form.control}
//                 name="image1"
//                 render={() => (
//                   <FormItem>
//                     {imagePreviewUrl ||
//                     (typeof image1 === "string" && image1) ? (
//                       <div className="relative">
//                         <Image
//                           src={imagePreviewUrl || (image1 as string)}
//                           alt="Preview"
//                           width={400}
//                           height={400}
//                           className="w-full h-48 object-contain bg-white/10 rounded-lg p-2"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => removeFile("image")}
//                           className="absolute top-2 right-2 bg-black/50 text-black p-1 rounded-full hover:bg-black/70"
//                         >
//                           <X className="w-4 h-4 text-white" />
//                         </button>
//                       </div>
//                     ) : (
//                       <>
//                         <div className="flex items-center justify-center">
//                           <FormLabel className="w-full text-base text-center font-normal  text-black/60 leading-[120%] tracking-[0%] pb-2">
//                             Upload your image file
//                           </FormLabel>
//                         </div>
//                         <FormControl>
//                           <div className="relative flex items-center justify-center border rounded-[8px]">
//                             <input
//                               type="file"
//                               accept="image/*"
//                               onChange={(e) => handleFileUpload(e, "image")}
//                               disabled={!!imageLink}
//                               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer border text-black"
//                               id="image-upload"
//                             />
//                             <button
//                               type="button"
//                               className="text-black px-6 py-2 bg-white w-[115px] h-[89px]"
//                             >
//                               <label
//                                 htmlFor="image-upload"
//                                 className={`flex flex-col items-center gap-2 text-black md:text-black ${
//                                   imageLink
//                                     ? "opacity-50 pointer-events-none"
//                                     : ""
//                                 }`}
//                               >
//                                 <Upload className="w-8 h-8 text-black dark:text-black" />
//                                 Upload
//                               </label>
//                             </button>
//                           </div>
//                         </FormControl>
//                       </>
//                     )}
//                     <FormMessage className="text-white/90" />
//                   </FormItem>
//                 )}
//               />

//               {/* Rest of your code remains the same */}
//               <div className="flex items-center gap-4">
//                 <div className="flex-1 h-px bg-white/30" />
//                 <span className="text-black text-lg leading-normal font-semibold  pt-4 pb-2">
//                   Or
//                 </span>
//                 <div className="flex-1 h-px bg-white/30" />
//               </div>

//               <FormField
//                 control={form.control}
//                 name="imageLink"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-black text-sm">
//                       Embed image link
//                     </FormLabel>
//                     <FormControl>
//                       <Input
//                         type="url"
//                         placeholder="https://example.com/image.jpg"
//                         {...field}
//                         disabled={!!image1}
//                         className="border border-[#e2e8f0] text-black"
//                       />
//                     </FormControl>
//                     {field.value && (
//                       <p className="text-xs text-white/70 bg-white/10 p-2 rounded mt-1">
//                         Link added: {field.value}
//                       </p>
//                     )}
//                     <FormMessage className="text-white/90" />
//                   </FormItem>
//                 )}
//               />
//             </div>
//           </div>

//           {/* Submit */}
//           <div className="text-center pt-5 flex gap-4 justify-center">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={onCancel}
//               className="bg-white text-gray-600  dark:text-black border-gray-300 px-12 py-3 rounded-lg text-lg font-medium"
//             >
//               Cancel
//             </Button>
//             <Button
//               disabled={isPending}
//               type="submit"
//               className="bg-primary text-white px-12 py-3 rounded-lg text-lg font-medium"
//             >
//               {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//               Submit
//             </Button>
//           </div>
//         </form>
//       </Form>
//     </div>
//   );
// }

// update code 1

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

// // Define interfaces
// interface Content {
//   id?: string;
//   image2?: string | File | { file?: File; link?: string }[] | string[];
//   imageLink?: string;
//   tags?: string[];
//   author: string;
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
// }

// interface ContentFormModalProps {
//   initialContent?: Content | null | undefined;
//   categoryId: string | string[];
//   subcategoryId: string | string[];
//   onSuccess?: () => void;
//   onCancel?: () => void;
//   setEditingContent?: React.Dispatch<React.SetStateAction<Content | null>>;
//   setShowForm?: React.Dispatch<React.SetStateAction<boolean>>;
// }

// // Zod Schema
// const formSchema = z.object({
//   image2: z
//     .array(
//       z.object({
//         file: z.instanceof(File).optional(),
//         link: z
//           .string()
//           .url({ message: "Invalid URL format" })
//           .optional()
//           .or(z.literal("")),
//       })
//     )
//     .min(1, "At least one image is required")
//     .max(10, "Maximum 10 images allowed"),
//   tags: z.array(z.string().min(1)).max(10, "Max 10 tags"),
//   author: z.string().min(2, "Author must be at least 2 characters"),
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
//   heading: string;
//   sub_heading: string;
//   body1: string;
//   image2: { link?: string; file?: File }[];
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
//   const [imagePreviews, setImagePreviews] = useState<(string | null)[]>([]);
//   const [newImageLink, setNewImageLink] = useState("");
//   const [tagInput, setTagInput] = useState("");
//   const [open, setOpen] = useState(false);
//   const [month, setMonth] = useState<Date | undefined>(undefined);

//   const session = useSession();
//   const token = (session?.data?.user as { token: string })?.token;
//   const queryClient = useQueryClient();

//   const form = useForm<FormData>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       image2: [],
//       tags: [],
//       author: "",
//       date: new Date(),
//       heading: "",
//       sub_heading: "",
//       body1: "",
//     },
//   });

//   useEffect(() => {
//     if (initialContent) {
//       let initialImages: { file?: File; link?: string }[] = [];

//       if (initialContent.image2) {
//         if (Array.isArray(initialContent.image2)) {
//           initialImages = initialContent.image2.map((item) =>
//             typeof item === "string" ? { link: item } : item
//           );
//         } else if (typeof initialContent.image2 === "string") {
//           try {
//             // Parse JSON string if image2 is a JSON array
//             const parsedImages = JSON.parse(initialContent.image2);
//             if (Array.isArray(parsedImages)) {
//               initialImages = parsedImages.map((link: string) => ({ link }));
//             } else {
//               initialImages = [{ link: initialContent.image2 }];
//             }
//           } catch (e) {
//             console.error(e);
//             initialImages = [{ link: initialContent.image2 }];
//           }
//         } else if (initialContent.image2 instanceof File) {
//           initialImages = [{ file: initialContent.image2 }];
//         }
//       }

//       form.reset({
//         image2: initialImages,
//         tags: initialContent.tags || [],
//         author: initialContent.author || "",
//         heading: initialContent.heading || "",
//         sub_heading: initialContent.sub_heading || "",
//         body1: initialContent.body1 || "",
//         date: initialContent.date ? new Date(initialContent.date) : new Date(),
//       });

//       // Set image previews
//       const previews = initialImages.map((img) => {
//         if (img.file) return URL.createObjectURL(img.file);
//         if (img.link) return img.link;
//         return null;
//       });
//       setImagePreviews(previews.filter(Boolean) as string[]);
//     }

//     return () => {
//       imagePreviews.forEach((preview) => {
//         if (preview) URL.revokeObjectURL(preview);
//       });
//     };
//   }, [initialContent, form]);

//   const { watch, setValue } = form;
//   const tags = watch("tags");

//   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const files = event.target.files;
//     if (files && files.length > 0) {
//       const validFiles = Array.from(files).filter((file) => {
//         const validType = ["image/png", "image/jpeg", "image/gif"].includes(
//           file.type
//         );
//         const validSize = file.size <= 10 * 1024 * 1024; // 10MB
//         return validType && validSize;
//       });

//       if (validFiles.length === 0) {
//         toast.error("Invalid file type or size (max 10MB, PNG/JPG/GIF)");
//         return;
//       }

//       const newImages = validFiles.map((file) => ({
//         file,
//         link: "",
//       }));

//       const currentImages = form.getValues("image2") || [];
//       const updatedImages = [...currentImages, ...newImages].slice(0, 10);
//       form.setValue("image2", updatedImages);

//       const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
//       setImagePreviews((prev) => [...prev, ...newPreviews].slice(0, 10));
//     }
//   };

//   const removeImage = (index: number) => {
//     const currentImages = form.getValues("image2");
//     const updatedImages = currentImages.filter((_, i) => i !== index);
//     form.setValue("image2", updatedImages);

//     if (imagePreviews[index]) {
//       URL.revokeObjectURL(imagePreviews[index]!);
//     }
//     setImagePreviews((prev) => prev.filter((_, i) => i !== index));
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

//   const method = initialContent ? "POST" : "POST";

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
//       formDataToSend.append("date", formData.date.toISOString().split("T")[0]);
//       formDataToSend.append("sub_heading", formData.sub_heading);
//       formDataToSend.append("body1", formData.body1);

//       formData.image2.forEach((image, index) => {
//         if (image.file) {
//           formDataToSend.append(`image2[${index}]`, image.file);
//         } else if (image.link) {
//           formDataToSend.append(`image2[${index}]`, image.link);
//         }
//       });

//       formDataToSend.append("tags", JSON.stringify(formData.tags));

//       const response = await fetch(url, {
//         method,
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
//       toast.success(data.message || "Content added successfully");
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
//                       <FormMessage />
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
//                       <FormMessage />
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
//                       <FormMessage />
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
//                               <CalendarIcon className="size-3.5" />
//                               <span className="sr-only">Select date</span>
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
//                       <FormMessage />
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
//                       <FormMessage />
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
//                                 {imagePreviews[index] || image.link ? (
//                                   <div className="w-full h-48 relative">
//                                     <Image
//                                       src={
//                                         imagePreviews[index] || image.link || ""
//                                       }
//                                       alt={`Preview ${index + 1}`}
//                                       fill
//                                       className="object-cover rounded-lg border"
//                                     />
//                                   </div>
//                                 ) : (
//                                   <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
//                                     <span className="text-gray-500">
//                                       Image {index + 1}
//                                     </span>
//                                   </div>
//                                 )}
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
//                                     PNG, JPG, GIF (MAX. 10MB)
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
//                                     { link: newImageLink },
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
//                       <FormMessage />
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

// update code 2

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
    .min(1, "At least one image is required")
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

  const session = useSession();
  const token = (session?.data?.user as { token: string })?.token;
  const queryClient = useQueryClient();

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
      const initialImages = initialContent.image2 || [];

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
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

  // const method = initialContent ? "POST" : "POST";

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

      // Handle images: append existing URLs and new files
      formData.image2.forEach((image, index) => {
        const file = imageFiles.find((f) => f.name === image);
        if (file) {
          formDataToSend.append(`image2[${index}]`, file);
        } else {
          formDataToSend.append(`image2[${index}]`, image);
        }
      });

      // Explicitly append _method=PUT for updates
      if (initialContent) {
        formDataToSend.append("_method", "PUT");
      }

      const response = await fetch(url, {
        method: "POST", // Always use POST, as _method=PUT handles updates
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
                      <FormMessage />
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
                      <FormMessage />
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
                      <FormMessage />
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
                      <FormMessage />
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

                {/* meta title */}
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
                          placeholder="meta title"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* meta description */}
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
                          placeholder="meta description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
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
                      <FormMessage />
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
                              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <Upload className="w-8 h-8 text-gray-500" />
                                  <p className="mb-2 text-sm text-gray-500 dark:text-black">
                                    Click to upload
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-black">
                                    PNG, JPG, GIF, WEBP, AVIF (MAX. 10MB)
                                  </p>
                                </div>
                                <input
                                  type="file"
                                  multiple
                                  accept="image/*"
                                  onChange={handleFileUpload}
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
                      <FormMessage />
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
