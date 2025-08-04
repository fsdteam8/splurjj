// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";

// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import FileUpload from "@/components/ui/FileUpload";
// import { useState } from "react";
// import { Textarea } from "@/components/ui/textarea";

// const formSchema = z.object({
//   imageUrl: z.string().min(2, {
//     message: "image url must be at least 2 characters.",
//   }),
//    embedCode: z.string().min(2, {
//     message: "embed code must be at least 2 characters.",
//   }),
// });

// const AdvertisingForm = () => {
//   const [logo, setLogo] = useState<File | null>(null);
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       imageUrl: "",
//       embedCode: "",
//     },
//   });

//   // 2. Define a submit handler.
//   function onSubmit(values: z.infer<typeof formSchema>) {
   
//     console.log(values, logo);
//   }
//   return (
//     <div>
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//           <div className="flex items-center justify-between bg-white p-6 rounded-[10px] shadow-lg">
//             <div className="w-2/5 border rounded-[10px] p-4 bg-white shadow-xl">
//               <div>
//                 <FormField
//                   control={form.control}
//                   name="imageUrl"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-base font-bold text-black leading-normal">
//                         Ads Link
//                       </FormLabel>
//                       <FormControl>
//                         <Input placeholder="shadcn" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//               <div className="mt-5">
//                 <FileUpload
//                   type="image"
//                   label="Upload Ads Image"
//                   file={logo}
//                   setFile={setLogo}
//                   //   existingUrl={data?.data?.logo}
//                 />
//               </div>
//             </div>
//             <div className="w-1/5 flex items-center justify-center">
//                 <h2 className="text-3xl font-bold text-black leading-normal">OR</h2>
//             </div>
//             <div className="w-2/5 border rounded-[10px] p-4 bg-white shadow-xl">
//               <div>
//                 <FormField
//                   control={form.control}
//                   name="embedCode"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-base font-bold text-black leading-normal">
//                         Embed Code
//                       </FormLabel>
//                       <FormControl>
//                         <Textarea className="h-[120px] w-full" placeholder="Enter Embed Code" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//             </div>
//           </div>

//           <Button className="text-white" type="submit">Submit</Button>
//         </form>
//       </Form>
//     </div>
//   );
// };

// export default AdvertisingForm;




"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import FileUpload from "@/components/ui/FileUpload"

// Conditional schema that requires either imageUrl+file OR embedCode, but not both
const formSchema = z
  .object({
    imageUrl: z.string().optional(),
    embedCode: z.string().optional(),
  })
  .refine(
    (data) => {
      const hasImageData = data.imageUrl && data.imageUrl.length >= 2
      const hasEmbedData = data.embedCode && data.embedCode.length >= 2

      // Must have either image data OR embed data, but not both or neither
      return (hasImageData && !hasEmbedData) || (!hasImageData && hasEmbedData)
    },
    {
      message: "Please provide either ads link with image OR embed code, but not both.",
      path: ["root"], // This will show the error at form level
    },
  )

const AdvertisingForm = () => {
  const [logo, setLogo] = useState<File | null>(null)
  const [leftSideActive, setLeftSideActive] = useState(false)
  const [rightSideActive, setRightSideActive] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: "",
      embedCode: "",
    },
  })

  const watchImageUrl = form.watch("imageUrl")
  const watchEmbedCode = form.watch("embedCode")

  // Update active states based on form values and file upload
  useEffect(() => {
    const hasImageContent = (watchImageUrl && watchImageUrl.length >= 2) || logo
    const hasEmbedContent = watchEmbedCode && watchEmbedCode.length >= 2

    setLeftSideActive(!!hasImageContent)
    setRightSideActive(!!hasEmbedContent)
  }, [watchImageUrl, watchEmbedCode, logo])

  // Clear opposite side when one side becomes active
  useEffect(() => {
    if (leftSideActive && rightSideActive) {
      // If both become active, prioritize the most recent change
      // This shouldn't happen in normal use, but just in case
      form.setValue("embedCode", "")
    }
  }, [leftSideActive, rightSideActive, form])

  // Handle clearing left side when right side is filled
  const handleEmbedCodeChange = (value: string) => {
    if (value.length >= 2 && leftSideActive) {
      form.setValue("imageUrl", "")
      setLogo(null)
    }
  }

  // Handle clearing right side when left side is filled
  const handleImageUrlChange = (value: string) => {
    if (value.length >= 2 && rightSideActive) {
      form.setValue("embedCode", "")
    }
  }

  // Handle file upload clearing right side
  const handleFileChange = (file: File | null) => {
    setLogo(file)
    if (file && rightSideActive) {
      form.setValue("embedCode", "")
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values, logo)
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex items-center justify-between bg-white p-6 rounded-[10px] shadow-lg">
            {/* Left Side - Ads Link & Image Upload */}
            <div
              className={`w-2/5 border rounded-[10px] p-4 bg-white shadow-xl transition-opacity duration-200 ${
                rightSideActive ? "opacity-50 pointer-events-none" : "opacity-100"
              }`}
            >
              <div>
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-bold text-black leading-normal">Ads Link</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter ads link"
                          {...field}
                          disabled={rightSideActive}
                          onChange={(e) => {
                            field.onChange(e)
                            handleImageUrlChange(e.target.value)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mt-5">
                <FileUpload
                  type="image"
                  label="Upload Ads Image"
                  file={logo}
                  setFile={handleFileChange}
                  disabled={rightSideActive}
                />
              </div>
            </div>

            {/* Center OR */}
            <div className="w-1/5 flex items-center justify-center">
              <h2 className="text-3xl font-bold text-black leading-normal">OR</h2>
            </div>

            {/* Right Side - Embed Code */}
            <div
              className={`w-2/5 border rounded-[10px] p-4 bg-white shadow-xl transition-opacity duration-200 ${
                leftSideActive ? "opacity-50 pointer-events-none" : "opacity-100"
              }`}
            >
              <div>
                <FormField
                  control={form.control}
                  name="embedCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-bold text-black leading-normal">Embed Code</FormLabel>
                      <FormControl>
                        <Textarea
                          className="h-[120px] w-full"
                          placeholder="Enter Embed Code"
                          {...field}
                          disabled={leftSideActive}
                          onChange={(e) => {
                            field.onChange(e)
                            handleEmbedCodeChange(e.target.value)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Show form-level error if validation fails */}
          {form.formState.errors.root && (
            <div className="text-red-500 text-sm">{form.formState.errors.root.message}</div>
          )}

          <Button className="text-white" type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default AdvertisingForm
