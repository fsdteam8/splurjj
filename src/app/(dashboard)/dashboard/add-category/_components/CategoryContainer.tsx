"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

import { useSession } from "next-auth/react";
import AddCategoryDialog from "../../_components/add-category-dialog";
import CategoryTable from "../../_components/category-table";
import EditCategoryDialog from "../../_components/edit-category-dialog";
  import { toast } from "react-toastify";

// Extend the User type to include 'token'
declare module "next-auth" {
  interface User {
    token?: string;
    role?: string;
  }
}

interface Category {
  category_id: number;
  category_name: string;
  subcategories: Array<{
    id: number;
    name: string;
  }>;
}

interface ApiResponse {
  success: boolean;
  data: Category[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export default function CategoryContainer() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: session } = useSession();
  const userRole = session?.user?.role;
  const token = session?.user?.token;

  const isAuthor = userRole === "author";

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`
      );
      const data: ApiResponse = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };


  // add category 

  const handleAddCategory = async (categoryName: string, category_icon: File) => {
  const formData = new FormData();
  formData.append("category_name", categoryName);
  formData.append("category_icon", category_icon);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (response.ok) {
    await fetchCategories();
     toast.success(`${categoryName} has been added successfully!`);
    window.location.reload();
    return response.json();
  }
  throw new Error("Failed to add category");
};


// edit category 


const handleEditCategory = async (
  categoryId: number,
  categoryName: string,
  icon?: File | null
) => {
  const formData = new FormData();
  formData.append("category_name", categoryName);
  
  if (icon) {
    formData.append("category_icon", icon);
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories/${categoryId}?_method=PUT`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update category");
    }

    const data = await response.json();
    await fetchCategories();
    
    toast.success(`${data.data.category_name} has been updated successfully!`);
    window.location.reload();
    return data;
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "Failed to update category");
    throw error;
  }
};


  // delete category 
  const handleDeleteCategory = async (categoryId: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this category? This will also delete all subcategories."
      )
    )
      return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories/${categoryId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        await fetchCategories();
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setIsEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setEditingCategory(null);
    setIsEditDialogOpen(false);
  };

  return (
    <div className="p-6">
      <div>
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            {/* <p className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
              Categories
            </p> */}
            <div className="text-lg font-semibold dark:text-white text-black">
              <Link href="/dashboard" className="">
                Dashboard
              </Link>
              <span className="mx-2">{">"}</span>
              <span>Categories</span>
            </div>
          </div>
          {!isAuthor && <AddCategoryDialog onAdd={handleAddCategory} />}
        </div>

        {/* Categories Table */}
        <Card className="bg-white backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">
              Category Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryTable
              categories={categories}
              loading={loading}
              onEdit={openEditDialog}
              onDelete={handleDeleteCategory}
            />
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <EditCategoryDialog
          category={editingCategory}
          isOpen={isEditDialogOpen}
          onClose={closeEditDialog}
          onEdit={handleEditCategory}
        />
        
      </div>
    </div>
  );
}
