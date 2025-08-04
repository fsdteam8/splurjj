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
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import dynamic from "next/dynamic";
import { useCallback, useState } from "react";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});
import "react-quill/dist/quill.snow.css";
import { CloudUpload, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["application/pdf", "text/html", "text/plain"];

const formSchema = z.object({
  subject: z.string().min(2, {
    message: "Subject must be at least 2 characters.",
  }),
  message: z.string().min(2, {
    message: "Message must be at least 2 characters.",
  }),
  file: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "File size must be less than 5MB",
    })
    .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), {
      message: "Only PDF, HTML, and text files are allowed",
    })
    .optional(),
});

// Quill modules configuration
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ size: ["small", false, "large", "huge"] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ direction: "rtl" }],
    [{ align: [] }],
    ["link", "image", "video"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "script",
  "blockquote",
  "code-block",
  "list",
  "bullet",
  "indent",
  "direction",
  "align",
  "link",
  "image",
  "video",
];

const SubscriberForm = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const session = useSession();
  const token = (session?.data?.user as { token: string })?.token;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      message: "",
      file: undefined,
    },
  });

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setFileName(file.name);
        form.setValue("file", file);
      }
    },
    [form]
  );


  const {mutate, isPending} = useMutation({
    mutationKey : ["send-message"],
    mutationFn : (formData : FormData)=>fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/newsletters`, {
      method : "POST",
      headers : {
        // "content-type" : "application/json",
        // "content-type" : "multipart/form-data",
        Authorization : `Bearer ${token}`
      },
      body : formData
    }).then((res)=>res.json()),
    onSuccess: (data)=>{
      if(!data.success){
        toast.error(data.message || "Something went wrong");
        return;
      }
      form.reset();
      onOpenChange(false);
      toast.success(data.message || "Message sent successfully");
      
    }
  })
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const formData = new FormData();
    formData.append("subject", values.subject);
    formData.append("message", values.message);
    if (values.file) {
      formData.append("file", values.file);
    }
    mutate(formData);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white w-full max-w-[800px] lg:max-w-[1200px] p-5">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-[40px] font-bold text-black leading-[120%]">
            Compose Mail
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 border border-[#B6B6B6] rounded-[8px] p-6"
            encType="multipart/form-data"
          >
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-2xl font-bold text-black leading-[120%]">
                    Subject Title:
                  </FormLabel>
                  <div className="mt-4">
                    <FormControl>
                      <Input
                        className="h-[53px] border border-[#E7E7E7] bg-white rounded-[8px] py-[27px] px-[18px] dark:text-black"
                        placeholder="Write title"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-2xl font-bold text-black leading-[120%]">
                    Write Text:
                  </FormLabel>
                  <div className="mt-3">
                    <div className="border border-[#E7E7E7] rounded-md overflow-hidden">
                      <ReactQuill
                        className="dark:text-black"
                        theme="snow"
                        value={field.value}
                        onChange={field.onChange}
                        modules={modules}
                        formats={formats}
                        placeholder="Write your message here..."
                        style={{
                          height: "200px",
                        }}
                      />
                    </div>
                  </div>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="file"
              render={() => (
                <FormItem>
                  <FormLabel className="text-2xl font-bold text-black leading-[120%]">
                    Attach File:
                  </FormLabel>
                  <div className="mt-4">
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <label className="flex flex-col items-center justify-center w-full border border-[#E7E7E7] bg-white rounded-[8px] cursor-pointer">
                          <div className="flex flex-col items-center justify-center py-2 px-4">
                            {!fileName && (
                              <span className="py-3">
                                <CloudUpload className="text-gray-500 w-10 h-10" />
                              </span>
                            )}
                            <p className="text-sm text-gray-500 pt-1">
                              {fileName ||
                                "Upload your file (PDF, HTML, or plain text)"}
                            </p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.html,.txt"
                            onChange={handleFileChange}
                          />
                        </label>
                        {fileName && (
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                              setFileName(null);
                              form.setValue("file", undefined);
                            }}
                            className="text-red-500  border border-red-500"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </div>
                </FormItem>
              )}
            />
            <div className="w-full flex items-center justify-end pt-6">
              <Button
                disabled={isPending}
                className="py-3 px-[29px] rounded-[8px] bg-[#34A1E8] text-base font-normal leading-[120%] text-[#F4F4F4]"
                type="submit"
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Email
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
      <style jsx global>{`
        .ql-editor {
          min-height: 300px !important;
          font-family: inherit;
        }
        .ql-toolbar {
          border-top: none !important;
          border-left: none !important;
          border-right: none !important;
          border-bottom: 1px solid #e7e7e7 !important;
        }
        .ql-container {
          border-bottom: none !important;
          border-left: none !important;
          border-right: none !important;
        }
        .ql-snow .ql-tooltip {
          z-index: 1000;
        }
      `}</style>
    </Dialog>
  );
};

export default SubscriberForm;
