"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";

declare module "next-auth" {
  interface User {
    role?: string;
  }
  interface Session {
    user?: User;
  }
}

interface Category {
  category_id: number;
  category_name: string;
  category_icon?: string;
  subcategories: Array<{
    id: number;
    name: string;
  }>;
}

interface CategoryTableProps {
  categories: Category[];
  loading: boolean;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: number) => void;
}

export default function CategoryTable({
  categories,
  loading,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  const isAuthor = userRole === "author";

  if (loading) {
    return <div className="text-center py-8">Loading categories...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {/* <TableHead className="w-16">ID</TableHead> */}
          <TableHead className="text-base text-black dark:text-black">
            Category Icon
          </TableHead>
          <TableHead className="text-base text-black dark:text-black">
            Category Name
          </TableHead>
          <TableHead className="text-base w-32 text-black">Sub Categories</TableHead>
          {!isAuthor && (
            <TableHead className="text-base w-32 text-center text-black">
              Actions
            </TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category) => (
          <TableRow key={category.category_id}>
            {/* <TableCell className="font-medium">
              {category.category_id}
            </TableCell> */}
            <TableCell className="text-black dark:text-black">
              <Image
                src={category.category_icon || "/assets/images/no-images.jpg"}
                alt={category.category_name}
                width={40}
                height={40}
              />
            </TableCell>
            <TableCell className="text-black dark:text-black">
              {category.category_name}
            </TableCell>
            <TableCell>
              <span className="bg-blue-100 text-blue-800 dark:text-blue-800 px-2 py-1 rounded-full text-xs">
                {category.subcategories.length} items
              </span>
            </TableCell>
            {!isAuthor && (
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(category)}
                  >
                    <Edit2 className="h-4 w-4 text-black" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-500 hover:text-red-700 dark:text-red-500 hover:bg-red-50"
                    onClick={() => onDelete(category.category_id)}
                  >
                    <Trash2 className="h-4 w-4 dark:text-red-500" />
                  </Button>
                </div>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
