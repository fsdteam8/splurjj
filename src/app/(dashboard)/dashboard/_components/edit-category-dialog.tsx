// // "use client"

// // import { useState, useEffect } from "react"
// // import { Button } from "@/components/ui/button"
// // import { Input } from "@/components/ui/input"
// // import { Label } from "@/components/ui/label"
// // import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// // interface Category {
// //   category_id: number
// //   category_name: string
// //   subcategories: Array<{
// //     id: number
// //     name: string
// //   }>
// // }

// // interface EditCategoryDialogProps {
// //   category: Category | null
// //   isOpen: boolean
// //   onClose: () => void
// //   onEdit: (categoryId: number, categoryName: string) => Promise<void>
// // }

// // export default function EditCategoryDialog({ category, isOpen, onClose, onEdit }: EditCategoryDialogProps) {
// //   const [categoryName, setCategoryName] = useState("")
// //   const [isLoading, setIsLoading] = useState(false)

// //   useEffect(() => {
// //     if (category) {
// //       setCategoryName(category.category_name)
// //     }
// //   }, [category])

// //   const handleEdit = async () => {
// //     if (!categoryName.trim() || !category) return

// //     setIsLoading(true)
// //     try {
// //       await onEdit(category.category_id, categoryName.trim())
// //       onClose()
// //     } catch (error) {
// //       console.error("Error editing category:", error)
// //     } finally {
// //       setIsLoading(false)
// //     }
// //   }

// //   return (
// //     <Dialog open={isOpen} onOpenChange={onClose} >
// //       <DialogContent className="bg-white shadow-lg">
// //         <DialogHeader>
// //           <DialogTitle className="dark:text-[#131313]">Edit Category</DialogTitle>
// //         </DialogHeader>
// //         <div className="space-y-4">
// //           <div className="space-y-2">
// //             <Label className="dark:text-[#131313]" htmlFor="editCategoryName">Category Name</Label>
// //             <Input
// //             className="dark:text-[#131313]"
// //               id="editCategoryName"
// //               value={categoryName}
// //               onChange={(e) => setCategoryName(e.target.value)}
// //               placeholder="Enter category name"
// //               onKeyDown={(e) => {
// //                 if (e.key === "Enter") {
// //                   handleEdit()
// //                 }
// //               }}
// //             />
// //           </div>
// //           <div className="flex justify-end gap-2">
// //             <Button className="dark:text-[#131313]" variant="outline" onClick={onClose} disabled={isLoading}>
// //               Cancel
// //             </Button>
// //             <Button onClick={handleEdit} disabled={isLoading} className="text-white">
// //               {isLoading ? "Saving..." : "Save Changes"}
// //             </Button>
// //           </div>
// //         </div>
// //       </DialogContent>
// //     </Dialog>
// //   )
// // }

// "use client";

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import FileUpload from "@/components/ui/FileUpload";

// interface Category {
//   category_id: number;
//   category_name: string;
//   subcategories: Array<{
//     id: number;
//     name: string;
//   }>;
// }

// interface EditCategoryDialogProps {
//   category: Category | null;
//   isOpen: boolean;
//   onClose: () => void;
//   onEdit: (categoryId: number, categoryName: string) => Promise<void>;
// }

// // Define the form schema using Zod
// const formSchema = z.object({
//   categoryName: z
//     .string()
//     .min(1, { message: "Category name is required" })
//     .max(50, { message: "Category name must be less than 50 characters" })
//     .trim(),
// });

// export default function EditCategoryDialog({
//   category,
//   isOpen,
//   onClose,
//   onEdit,
// }: EditCategoryDialogProps) {
//   const [isLoading, setIsLoading] = useState(false);
//   const [icon, setIcon] = useState<File | null>(null);

//   // Initialize the form with react-hook-form and zod resolver
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       categoryName: "",
//     },
//   });

//   // Update form values when category changes
//   useEffect(() => {
//     if (category) {
//       form.reset({ categoryName: category.category_name });
//     }
//   }, [category, form]);

//   const handleEdit = async (values: z.infer<typeof formSchema>) => {
//     if (!category) return;

//     setIsLoading(true);
//     try {
//       await onEdit(category.category_id, values.categoryName);
//       onClose();
//     } catch (error) {
//       console.error("Error editing category:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="bg-white shadow-lg">
//         <DialogHeader>
//           <DialogTitle className="dark:text-[#131313]">
//             Edit Category
//           </DialogTitle>
//         </DialogHeader>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(handleEdit)} className="space-y-4">
//             <FormField
//               control={form.control}
//               name="categoryName"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="dark:text-[#131313]">
//                     Category Name
//                   </FormLabel>
//                   <FormControl>
//                     <Input
//                       id="editCategoryName"
//                       placeholder="Enter category name"
//                       className="dark:text-[#131313]"
//                       {...field}
//                       onKeyDown={(e) => {
//                         if (e.key === "Enter") {
//                           e.preventDefault();
//                           form.handleSubmit(handleEdit)();
//                         }
//                       }}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             {/* icon  */}
//             <div>
//               <FileUpload
//                 type="image"
//                 label="Add Icon"
//                 file={icon}
//                 setFile={setIcon}
//                 // existingUrl={
//                 //   data?.data?.icon
//                 //     ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${data.data.icon}`
//                 //     : undefined
//                 // }
//               />
//             </div>
//             <div className="flex justify-end gap-2">
//               <Button
//                 type="button"
//                 className="dark:text-[#131313]"
//                 variant="outline"
//                 onClick={onClose}
//                 disabled={isLoading}
//               >
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={isLoading} className="text-white">
//                 {isLoading ? "Saving..." : "Save Changes"}
//               </Button>
//             </div>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import FileUpload from "@/components/ui/FileUpload";

interface Category {
  category_id: number;
  category_name: string;
  category_icon?: string;
  subcategories: Array<{
    id: number;
    name: string;
  }>;
}

interface EditCategoryDialogProps {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (categoryId: number, categoryName: string, icon?: File | null) => Promise<void>;
}

const formSchema = z.object({
  categoryName: z
    .string()
    .min(1, { message: "Category name is required" })
    .max(50, { message: "Category name must be less than 50 characters" })
    .trim(),
});

export default function EditCategoryDialog({
  category,
  isOpen,
  onClose,
  onEdit,
}: EditCategoryDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [icon, setIcon] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryName: "",
    },
  });

  useEffect(() => {
    if (category) {
      form.reset({ categoryName: category.category_name });
      setIcon(null); // Reset icon when category changes
    }
  }, [category, form]);

  const handleEdit = async (values: z.infer<typeof formSchema>) => {
    if (!category) return;

    setIsLoading(true);
    try {
      await onEdit(category.category_id, values.categoryName, icon);
      onClose();
    } catch (error) {
      console.error("Error editing category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white shadow-lg">
        <DialogHeader>
          <DialogTitle className="dark:text-[#131313]">
            Edit Category
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleEdit)} className="space-y-4">
            <FormField
              control={form.control}
              name="categoryName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark:text-[#131313]">
                    Category Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter category name"
                      className="dark:text-[#131313]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
              <FileUpload
                type="image"
                label="Change Icon"
                file={icon}
                setFile={setIcon}
                existingUrl={category?.category_icon}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="dark:text-[#131313]"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="text-white"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}