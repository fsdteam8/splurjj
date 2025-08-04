// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Plus } from "lucide-react";

// interface AddCategoryDialogProps {
//   onAdd: (categoryName: string) => Promise<void>;
// }

// export default function AddCategoryDialog({ onAdd }: AddCategoryDialogProps) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [categoryName, setCategoryName] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleAdd = async () => {
//     if (!categoryName.trim()) return;

//     setIsLoading(true);
//     try {
//       await onAdd(categoryName.trim());
//       setCategoryName("");
//       setIsOpen(false);
//     } catch (error) {
//       console.error("Error adding category:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogTrigger asChild>
//         <Button className="bg-blue-500 hover:bg-blue-600 text-white">
//           <Plus className="h-4 w-4 mr-2" />
//           Add Category
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="bg-white shadow-lg">
//         <DialogHeader>
//           <DialogTitle className="dark:text-[#131313]">
//             Add New Category
//           </DialogTitle>
//         </DialogHeader>
//         <div className="space-y-4">

//           <div className="space-y-2">
//             <Label className="dark:text-[#131313]" htmlFor="categoryName">
//               Category Name
//             </Label>
//             <Input
//               className="dark:text-[#131313]"
//               id="categoryName"
//               value={categoryName}
//               onChange={(e) => setCategoryName(e.target.value)}
//               placeholder="Enter category name"
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") {
//                   handleAdd();
//                 }
//               }}
//             />
//           </div>

//           <div className="flex justify-end gap-2">
//             <Button
//               className="dark:text-[#131313]"
//               variant="outline"
//               onClick={() => setIsOpen(false)}
//               disabled={isLoading}
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={handleAdd}
//               disabled={isLoading}
//               className="text-white"
//             >
//               {isLoading ? "Adding..." : "Add Category"}
//             </Button>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }



"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
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
import { toast } from "react-toastify";

interface AddCategoryDialogProps {
  onAdd: (categoryName: string, category_icon: File) => Promise<void>;
}

const formSchema = z.object({
  categoryName: z
    .string()
    .min(1, { message: "Category name is required" })
    .max(50, { message: "Category name must be less than 50 characters" })
    .trim(),
});

export default function AddCategoryDialog({ onAdd }: AddCategoryDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [category_icon, setIcon] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryName: ""
    },
  });

  const handleAdd = async (values: z.infer<typeof formSchema>) => {
    if (!category_icon) {
      alert("Please select an icon");
      return;
    }

    setIsLoading(true);
    try {
      await onAdd(values.categoryName, category_icon);
      toast.success("Category added successfully");
      form.reset();
      setIcon(null);
      setIsOpen(false);
    } catch (error) {
      console.error("Error adding category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 hover:bg-blue-600 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white shadow-lg">
        <DialogHeader>
          <DialogTitle className="dark:text-[#131313]">
            Add New Category
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAdd)} className="space-y-4">
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
                      id="categoryName"
                      placeholder="Enter category name"
                      className="dark:text-[#131313]"
                      {...field}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          form.handleSubmit(handleAdd)();
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <FileUpload
                type="image"
                label="Upload Icon"
                file={category_icon}
                setFile={setIcon}
                // accept="image/*"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                className="dark:text-[#131313]"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="text-white">
                {isLoading ? "Adding..." : "Add Category"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

