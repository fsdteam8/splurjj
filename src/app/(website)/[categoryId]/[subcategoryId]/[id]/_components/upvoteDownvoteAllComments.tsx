import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { MoveLeft, MoveRight } from "lucide-react";
import { useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast"; // Import react-hot-toast

interface Comment {
  id: number;
  name: string;
  comment: string;
  upvotes: number;
  downvotes: number;
  created_at: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data: Comment[];
}

interface ContentCommentsProps {
  blogId: number;
}

function ContentComments({ blogId }: ContentCommentsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = (session?.user as { token?: string })?.token;

  const { data, isLoading, isError, error } = useQuery<ApiResponse>({
    queryKey: ["comments", blogId],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/comment/content/${blogId}`
      );
      return response.data;
    },
  });

  const upvoteMutation = useMutation({
    mutationFn: async (commentId: number) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upvote-downvote/${commentId}/vote`,
        { vote: 1 },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", blogId] });
    },
    onError: (error) => {
      console.error("Upvote failed:", error);
      toast.error("Failed to upvote. Please try again.");
    },
  });

  const downvoteMutation = useMutation({
    mutationFn: async (commentId: number) => {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upvote-downvote/${commentId}/vote`,
        { vote: -1 },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", blogId] });
    },
    onError: (error) => {
      console.error("Downvote failed:", error);
      toast.error("Failed to downvote. Please try again.");
    },
  });

  const handlePrev = () => {
    if (!data?.data?.length) return;
    setCurrentIndex(
      (prev) => (prev - 1 + data.data.length) % data.data.length
    );
  };

  const handleNext = () => {
    if (!data?.data?.length) return;
    setCurrentIndex((prev) => (prev + 1) % data.data.length);
  };

  // Handle upvote click
  const handleUpvote = (commentId: number) => {
    if (!token) {
      toast.error("Please log in to upvote");
      return;
    }
    upvoteMutation.mutate(commentId);
  };

  // Handle downvote click
  const handleDownvote = (commentId: number) => {
    if (!token) {
      toast.error("Please log in to downvote");
      return;
    }
    downvoteMutation.mutate(commentId);
  };

  if (isLoading) {
    return <div className="text-center">Loading comments...</div>;
  }

  if (isError) {
    return (
      <div className="text-center text-red-500">
        Failed to load comments: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  if (!data?.success || !data?.data?.length) {
    return <div className="text-center"></div>;
  }

  const comment = data.data[currentIndex];

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <Toaster position="top-right" reverseOrder={false} /> {/* Add Toaster component */}
      <div className="w-full">
        <h4 className="text-lg md:text-xl font-semibold  leading-[120%] tracking-[0%] text-black uppercase text-left pb-3 md:pb-4">
          Comments
        </h4>
        <div className="border-b border-gray-200 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-semibold text-black">
                {comment.name}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(comment.created_at).toLocaleString()}
              </p>
            </div>
            <div className="flex gap-4">
              <button
                className="text-sm text-gray-600"
                onClick={() => handleUpvote(comment.id)}
                title={!token ? "Please log in to upvote" : ""}
              >
                👍 {comment.upvotes}
              </button>
              <button
                className="text-sm text-gray-600"
                onClick={() => handleDownvote(comment.id)}
                title={!token ? "Please log in to downvote" : ""}
              >
                👎 {comment.downvotes}
              </button>
            </div>
          </div>
          <p className="mt-2 text-base text-gray-700">{comment.comment}</p>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            className="flex items-center justify-center group text-white py-3 px-6  leading-[120%] tracking-[0%] bg-primary rounded-md"
            onClick={handlePrev}
          >
            <MoveLeft className="h-4 w-4 text-white" />
            <span className="sr-only">Previous</span>
          </button>
          <button
            className="flex items-center justify-center group text-white py-3 px-6  leading-[120%] tracking-[0%] bg-primary rounded-md"
            onClick={handleNext}
          >
            <MoveRight className="h-4 w-4 text-white" />
            <span className="sr-only">Next</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContentComments;