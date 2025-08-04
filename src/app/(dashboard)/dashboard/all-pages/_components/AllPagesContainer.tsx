"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import AddNewPage from "./AddNewPage";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Plus } from "lucide-react";

import { toast } from "react-hot-toast";

export interface PageData {
  id: number;
  name: string;
  body: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

const AllPagesContainer = () => {
  const { data: session } = useSession();
  const [addNewPageOpen, setAddNewPageOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<PageData | null>(null);
  const [allPagesData, setAllPagesData] = useState<PageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

  const token = session?.user?.token;

  // Fetch all pages
  const fetchPages = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAllPagesData(data);
      } else {
        console.error("Failed to fetch pages");
      }
    } catch (error) {
      console.error("Error fetching pages:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete page
  const handleDelete = async (id: number) => {

    try {
      setDeleteLoading(id);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pages/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setAllPagesData((prev) => prev.filter((page) => page.id !== id));
        toast.success("Page deleted successfully");
      } else {
        console.error("Failed to delete page");
        toast.error("Failed to delete page");
      }
    } catch (error) {
      console.error("Error deleting page:", error);
      toast.error("Error deleting page");
    } finally {
      setDeleteLoading(null);
    }
  };

  // Refresh pages after add/edit
  const handleSuccess = () => {
    fetchPages();
    setAddNewPageOpen(false);
    setSelectedPage(null);
  };

  useEffect(() => {
    if (token) {
      fetchPages();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading pages...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 pt-6 pb-20">
      <div className="flex justify-between items-center mb-6">
        <p className="text-2xl font-bold text-black dark:text-white">All Pages</p>
        <Button
          onClick={() => {
            setAddNewPageOpen(true);
            setSelectedPage(null);
          }}
          className="flex items-center gap-2 text-white "
        >
          <Plus className="h-4 w-4" />
          Add New Page
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
          <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
            <tr>
              {/* <th className="py-3 px-4 border-b">ID</th> */}
              <th className="py-3 px-4 border-b font-bold text-black text-lg leading-normal">Page Name</th>
              <th className="py-3 px-4 border-b font-bold text-black text-lg leading-normal">Body</th>
              <th className="py-3 px-4 border-b font-bold text-black text-lg leading-normal">Status</th>
              <th className="py-3 px-4 border-b font-bold text-black text-lg leading-normal">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-700">
            {allPagesData?.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 dark:bg-black">
                {/* <td className="py-2 px-4 border-b">{item.id}</td> */}
                <td className="py-2 px-4 border-b font-medium dark:text-white">{item.name}</td>
                <td className="py-2 px-4 border-b max-w-xs ">
                  <p
                    className="text-black dark:text-black"
                    dangerouslySetInnerHTML={{
                      __html:
                        item.body.substring(0, 100) +
                        (item.body.length > 100 ? "..." : ""),
                    }}
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      item.status === "Published"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {item.status || "Draft"}
                  </span>
                </td>
                <td className="py-2 px-4 border-b">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedPage(item);
                        setAddNewPageOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="h-4 w-4 text-blue-600 hover:text-blue-800" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      disabled={deleteLoading === item.id}
                      className="text-red-600 hover:text-red-800"
                    >
                      {deleteLoading === item.id ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-red-600 hover:text-red-800" />
                      )}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {allPagesData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No pages found. Create your first page!
        </div>
      )}

      {addNewPageOpen && (
        <AddNewPage
          initialData={selectedPage}
          isOpen={addNewPageOpen}
          setIsOpen={setAddNewPageOpen}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default AllPagesContainer;
