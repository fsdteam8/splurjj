"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import ContentTable from "../../_components/content-table";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import SplurjjPagination from "@/components/ui/SplurjjPagination";
import ContentAddEditForm from "../../_components/ContentModalForm";
import { ConfirmationModal } from "@/components/shared/modals/ConfirmationModal";
import type {
  ContentDashboardResponse,
  ContentItem,
} from "../../_components/ContentDataType";

export default function SubcategoryContentPage() {
  const params = useParams();
  const categoryId = params?.catId;
  const subcategoryId = params?.subCatId;
  const [editingContent, setEditingContent] = useState<ContentItem | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contentToDelete, setContentToDelete] = useState<number | null>(null);

  const session = useSession();
  const token = (session?.data?.user as { token: string })?.token;
  const queryClient = useQueryClient();

  // Fetch all content with improved error handling
  const { data, isLoading, error, isError } =
    useQuery<ContentDashboardResponse>({
      queryKey: ["all-contents", categoryId, subcategoryId, currentPage],
      queryFn: async () => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/content-dashbaord/${categoryId}/${subcategoryId}?paginate_count=7&page=${currentPage}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch content: ${response.statusText}`);
        }

        return response.json();
      },
      enabled: !!token && !!categoryId && !!subcategoryId,
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });

  // Delete content mutation
  const { mutate: deleteContent, isPending: isDeleting } = useMutation({
    mutationKey: ["delete-content"],
    mutationFn: async (contentId: number) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contents/${contentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete content: ${response.statusText}`);
      }

      return response.json();
    },
    onSuccess: (data) => {
      if (!data?.status) {
        toast.error(data?.message || "Failed to delete content");
        return;
      }

      toast.success(data?.message || "Content deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["all-contents"] });
      setShowDeleteModal(false);
      setContentToDelete(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete content");
      setShowDeleteModal(false);
      setContentToDelete(null);
    },
  });

  const handleDeleteClick = (contentId: number) => {
    setContentToDelete(contentId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (contentToDelete) {
      deleteContent(contentToDelete);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setContentToDelete(null);
  };

  const handleAddContent = () => {
    setEditingContent(null);
    setShowForm(true);
  };

  const handleEditContent = (content: ContentItem) => {
    setEditingContent(content);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingContent(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingContent(null);
    queryClient.invalidateQueries({ queryKey: ["all-contents"] });
  };

  // Error state
  if (isError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Error loading content</h3>
          <p className="text-red-600 text-sm mt-1">
            {error?.message ||
              "Something went wrong while loading the content."}
          </p>
          <Button
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ["all-contents"] })
            }
            className="mt-3"
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const contentData = data?.data?.data || [];
  const categoryName = contentData[0]?.category_name || "Content";
  const subcategoryName = contentData[0]?.sub_category_name || "Items";

  return (
    <div className="p-6">
      {/* Header */}
      <div>
        {!showForm && (
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                {categoryName} Lists
              </h1>
              <nav className="text-base text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="hover:underline hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  Dashboard
                </Link>
                <ChevronRight className="w-5 h-5" />
                <span>{categoryName}</span>
                <ChevronRight className="w-5 h-5" />
                <span className="text-gray-700 dark:text-gray-300">
                  {subcategoryName}
                </span>
              </nav>
            </div>

            <Button
              className="bg-[#0253F7] hover:bg-[#0253F7]/90 text-white w-[156px] h-[48px] rounded-lg flex items-center gap-2 transition-colors"
              onClick={handleAddContent}
              disabled={showForm}
            >
              <Plus className="h-5 w-5" />
              Add Post
            </Button>
          </div>
        )}
      </div>

      {/* Main Content */}
      {showForm ? (
        <div className="space-y-4">
          <ContentAddEditForm
            initialContent={editingContent}
            categoryId={categoryId!}
            subcategoryId={subcategoryId!}
            onSuccess={handleFormSuccess}
            onCancel={handleCloseForm}
            setEditingContent={setEditingContent}
            setShowForm={setShowForm}
          />
        </div>
      ) : (
        <>
          {/* Content Table */}
          <ContentTable
            contents={contentData}
            loading={isLoading}
            onDelete={handleDeleteClick}
            onEdit={handleEditContent}
          />

          {/* Pagination */}
          {data && data.total_pages > 1 && (
            <div className="mt-8 pb-[108px]">
              <div className="flex justify-between items-center">
                <p className="font-normal text-base text-gray-600 dark:text-gray-400">
                  Showing {(currentPage - 1) * data.per_page + 1} to{" "}
                  {Math.min(currentPage * data.per_page, data.total)} of{" "}
                  {data.total} results
                </p>
                <SplurjjPagination
                  currentPage={currentPage}
                  totalPages={data.total_pages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Post"
        description="Are you sure you want to delete this content? This action cannot be undone."
        confirmText={isDeleting ? "Deleting..." : "Yes, Delete"}
        cancelText="Cancel"
      />
    </div>
  );
}
