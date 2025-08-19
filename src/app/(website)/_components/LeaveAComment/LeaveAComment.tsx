"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import axios from "axios"
import { MoveLeft, MoveRight } from "lucide-react"
import { useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

interface Comment {
  id: number
  name: string
  comment: string
  upvotes: number
  downvotes: number
  created_at: string
}

export interface ApiResponse {
  success: boolean
  message: string
  data: Comment[]
}

interface CommentPayload {
  email: string
  content_id: number
  comment: string
}

interface CommentSectionProps {
  UserEmail: string | null | undefined
  blogId: number
}

const FormSchema = z.object({
  comment: z.string().min(2, {
    message: "Comment must be at least 2 characters.",
  }),
})

export function CommentSection({ UserEmail, blogId }: CommentSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const queryClient = useQueryClient()
  const session = useSession()
  const sessionData = session?.data
  const token = (sessionData?.user as { token?: string })?.token

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      comment: "",
    },
  })

  const { data, isLoading, isError, error } = useQuery<ApiResponse>({
    queryKey: ["comments", blogId],
    queryFn: async () => {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/comment/content/${blogId}`)
      return response.data
    },
  })

  const submitCommentMutation = useMutation({
    mutationKey: ["comment"],
    mutationFn: async (data: CommentPayload) => {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/comment`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      return response.data
    },
    onSuccess: (data) => {
      if (!data?.success) {
        toast.error(data?.message || "Something went wrong")
        return
      }
      toast.success("Comment submitted successfully!")
      queryClient.invalidateQueries({
        queryKey: ["comments", blogId],
      })
      form.reset()
    },
  })

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
        },
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", blogId] })
    },
    onError: (error) => {
      console.error("Upvote failed:", error)
      toast.error("Failed to upvote. Please try again.")
    },
  })

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
        },
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", blogId] })
    },
    onError: (error) => {
      console.error("Downvote failed:", error)
      toast.error("Failed to downvote. Please try again.")
    },
  })

  const handlePrev = () => {
    if (!data?.data?.length) return
    setCurrentIndex((prev) => (prev - 1 + data.data.length) % data.data.length)
  }

  const handleNext = () => {
    if (!data?.data?.length) return
    setCurrentIndex((prev) => (prev + 1) % data.data.length)
  }

  const handleUpvote = (commentId: number) => {
    if (!token) {
      toast.error("Please log in to upvote")
      return
    }
    upvoteMutation.mutate(commentId)
  }

  const handleDownvote = (commentId: number) => {
    if (!token) {
      toast.error("Please log in to downvote")
      return
    }
    downvoteMutation.mutate(commentId)
  }

  function onSubmit(formData: z.infer<typeof FormSchema>) {
    if (!token || !UserEmail) {
      toast.error("You must be logged in to submit a comment.")
      return
    }

    const payload: CommentPayload = {
      email: UserEmail,
      content_id: blogId,
      comment: formData.comment,
    }

    submitCommentMutation.mutate(payload)
  }

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-8">
      <div className="w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <h4 className="text-lg md:text-xl font-semibold leading-[120%] tracking-[0%] text-black uppercase text-left pb-3 md:pb-4">
                    Leave A Comment
                  </h4>
                  <FormLabel className="text-lg md:text-xl font-semibold leading-[120%] tracking-[0%] text-secondary"></FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write Comment"
                      className="h-[150px] text-lg md:text-xl font-semibold leading-[120%] tracking-[0%] text-black placeholder:text-[#929292] border-[1.5px] border-secondary rounded-[8px]"
                      disabled={submitCommentMutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-4 md:mt-5 lg:mt-6">
              <Button
                className="text-white py-3 px-6 text-base font-bold leading-[120%] tracking-[0%] bg-primary"
                type="submit"
                disabled={submitCommentMutation.isPending}
              >
                {submitCommentMutation.isPending ? "Commenting..." : "Comment"}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <div className="w-full">
        {isLoading && <div className="text-center">Loading comments...</div>}

        {isError && (
          <div className="text-center text-red-500">
            Failed to load comments: {error instanceof Error ? error.message : "Unknown error"}
          </div>
        )}

        {data?.success && data?.data?.length > 0 && (
          <>
            <h4 className="text-lg md:text-xl font-semibold leading-[120%] tracking-[0%] text-black uppercase text-left pb-3 md:pb-4">
              Comments
            </h4>
            <div className="border-b border-gray-200 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-semibold text-black">{data.data[currentIndex].name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(data.data[currentIndex].created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-4">
                  <button
                    className="text-sm text-gray-600"
                    onClick={() => handleUpvote(data.data[currentIndex].id)}
                    title={!token ? "Please log in to upvote" : ""}
                  >
                    👍 {data.data[currentIndex].upvotes}
                  </button>
                  <button
                    className="text-sm text-gray-600"
                    onClick={() => handleDownvote(data.data[currentIndex].id)}
                    title={!token ? "Please log in to downvote" : ""}
                  >
                    👎 {data.data[currentIndex].downvotes}
                  </button>
                </div>
              </div>
              <p className="mt-2 text-base text-gray-700">{data.data[currentIndex].comment}</p>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="flex items-center justify-center group text-white py-3 px-6 leading-[120%] tracking-[0%] bg-primary rounded-md"
                onClick={handlePrev}
              >
                <MoveLeft className="h-4 w-4 text-white" />
                <span className="sr-only">Previous</span>
              </button>
              <button
                className="flex items-center justify-center group text-white py-3 px-6 leading-[120%] tracking-[0%] bg-primary rounded-md"
                onClick={handleNext}
              >
                <MoveRight className="h-4 w-4 text-white" />
                <span className="sr-only">Next</span>
              </button>
            </div>
          </>
        )}

        {data?.success && (!data?.data || data.data.length === 0) && (
          <div className="text-center text-gray-500">No comments yet. Be the first to comment!</div>
        )}
      </div>
    </div>
  )
}

export default CommentSection
