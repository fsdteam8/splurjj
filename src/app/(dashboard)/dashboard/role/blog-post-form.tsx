// "use client";

// import type React from "react";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import TinyMCEEditor from "@/components/ui/tinymce-editor";

// interface BlogPost {
//   title: string;
//   content: string;
//   author: string;
// }

// export default function BlogPostForm() {
//   const [formData, setFormData] = useState<BlogPost>({
//     title: "",
//     content: "",
//     author: "",
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleInputChange = (field: keyof BlogPost, value: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       // Simulate API call
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       console.log("Blog post data:", formData);
//       alert("Blog post saved successfully!");

//       // Reset form
//       setFormData({
//         title: "",
//         content: "",
//         author: "",
//       });
//     } catch (error) {
//       console.error("Error saving blog post:", error);
//       alert("Error saving blog post");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <Card className="w-full max-w-4xl mx-auto">
//       <CardHeader>
//         <CardTitle className="text-2xl font-bold">
//           Create New Blog Post
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="title">Title</Label>
//               <Input
//                 id="title"
//                 type="text"
//                 placeholder="Enter blog post title"
//                 value={formData.title}
//                 onChange={(e) => handleInputChange("title", e.target.value)}
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="author">Author</Label>
//               <Input
//                 id="author"
//                 type="text"
//                 placeholder="Enter author name"
//                 value={formData.author}
//                 onChange={(e) => handleInputChange("author", e.target.value)}
//                 required
//               />
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="content">Content</Label>
//             <TinyMCEEditor
//               value={formData.content}
//               onEditorChange={(content) =>
//                 handleInputChange("content", content)
//               }
//               height={500}
//               placeholder="Write your blog post content here..."
//               disabled={isSubmitting}
//             />
//           </div>

//           <div className="flex justify-end space-x-4">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() =>
//                 setFormData({ title: "", content: "", author: "" })
//               }
//               disabled={isSubmitting}
//             >
//               Clear
//             </Button>
//             <Button
//               type="submit"
//               disabled={
//                 isSubmitting ||
//                 !formData.title ||
//                 !formData.content ||
//                 !formData.author
//               }
//             >
//               {isSubmitting ? "Saving..." : "Save Blog Post"}
//             </Button>
//           </div>
//         </form>
//       </CardContent>
//     </Card>
//   );
// }



"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import TinyMCEEditor from "@/components/ui/tinymce-editor";

// Define form schema
const formSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  author: z.string().min(1, "Author name is required").max(50),
  content: z.string().min(1, "Content is required"),
});

type BlogPostFormValues = z.infer<typeof formSchema>;

export default function BlogPostForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      author: "",
      content: "",
    },
  });

  const onSubmit = async (data: BlogPostFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Blog post data:", data);
      alert("Blog post saved successfully!");
      form.reset();
    } catch (error) {
      console.error("Error saving blog post:", error);
      alert("Error saving blog post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Create New Blog Post
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter blog post title"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter author name"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <TinyMCEEditor
                      value={field.value}
                      onEditorChange={field.onChange}
                      height={500}
                      placeholder="Write your blog post content here..."
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={isSubmitting}
              >
                Clear
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Blog Post"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}



// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Switch } from "@/components/ui/switch";
// import TinyMCEEditor from "@/components/ui/tinymce-editor";

// interface BlogPost {
//   title: string;
//   content: string;
//   author: string;
//   category: string;
//   featured: boolean;
//   metaDescription: string;
// }

// export default function BlogPostForm() {
//   const [formData, setFormData] = useState<BlogPost>({
//     title: "",
//     content: "",
//     author: "",
//     category: "technology",
//     featured: false,
//     metaDescription: "",
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleInputChange = (field: keyof BlogPost, value: string | boolean) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       // Simulate API call
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       console.log("Blog post data:", formData);
//       alert("Blog post saved successfully!");

//       // Reset form
//       setFormData({
//         title: "",
//         content: "",
//         author: "",
//         category: "technology",
//         featured: false,
//         metaDescription: "",
//       });
//     } catch (error) {
//       console.error("Error saving blog post:", error);
//       alert("Error saving blog post");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <Card className="w-full max-w-4xl mx-auto">
//       <CardHeader>
//         <CardTitle className="text-2xl font-bold">
//           Create New Blog Post
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="title">Title *</Label>
//               <Input
//                 id="title"
//                 type="text"
//                 placeholder="Enter blog post title"
//                 value={formData.title}
//                 onChange={(e) => handleInputChange("title", e.target.value)}
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="author">Author *</Label>
//               <Input
//                 id="author"
//                 type="text"
//                 placeholder="Enter author name"
//                 value={formData.author}
//                 onChange={(e) => handleInputChange("author", e.target.value)}
//                 required
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="category">Category</Label>
//               <Select
//                 value={formData.category}
//                 onValueChange={(value) => handleInputChange("category", value)}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select category" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="technology">Technology</SelectItem>
//                   <SelectItem value="business">Business</SelectItem>
//                   <SelectItem value="health">Health</SelectItem>
//                   <SelectItem value="education">Education</SelectItem>
//                   <SelectItem value="entertainment">Entertainment</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-2 flex items-center gap-4">
//               <Label htmlFor="featured">Featured Post</Label>
//               <Switch
//                 id="featured"
//                 checked={formData.featured}
//                 onCheckedChange={(checked) => handleInputChange("featured", checked)}
//               />
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="metaDescription">Meta Description</Label>
//             <Input
//               id="metaDescription"
//               type="text"
//               placeholder="Brief description for SEO"
//               value={formData.metaDescription}
//               onChange={(e) => handleInputChange("metaDescription", e.target.value)}
//             />
//             <p className="text-sm text-muted-foreground">
//               This will be used for search engine results.
//             </p>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="content">Content *</Label>
//             <TinyMCEEditor
//               value={formData.content}
//               onEditorChange={(content) =>
//                 handleInputChange("content", content)
//               }
//               height={600}
//               placeholder="Write your blog post content here..."
//               disabled={isSubmitting}
//             />
//             <div className="text-sm text-muted-foreground mt-2">
//               <p>Tip: Use the toolbar to add images, videos, tables, and format your text.</p>
//               <p>Supported media: JPG, PNG, GIF, MP4, YouTube links</p>
//             </div>
//           </div>

//           <div className="flex justify-end space-x-4">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() =>
//                 setFormData({
//                   title: "",
//                   content: "",
//                   author: "",
//                   category: "technology",
//                   featured: false,
//                   metaDescription: "",
//                 })
//               }
//               disabled={isSubmitting}
//             >
//               Clear
//             </Button>
//             <Button
//               type="submit"
//               disabled={
//                 isSubmitting ||
//                 !formData.title ||
//                 !formData.content ||
//                 !formData.author
//               }
//             >
//               {isSubmitting ? "Saving..." : "Publish Blog Post"}
//             </Button>
//           </div>
//         </form>
//       </CardContent>
//     </Card>
//   );
// }