"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import QuillEditor from "@/components/ui/quill-editor"
import type { PageData } from "./AllPagesContainer"

const formSchema = z.object({
  pageName: z.string().min(1, "Page name is required"),
  body: z.string().min(1, "Content is required"),
  status: z.enum(["Draft", "Published"]),
})

type FormData = z.infer<typeof formSchema>

interface AddNewPageProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  initialData?: PageData | null
  onSuccess: () => void
}

const AddNewPage: React.FC<AddNewPageProps> = ({ isOpen, setIsOpen, initialData, onSuccess }) => {
  const { data: session, status } = useSession()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const token = session?.user?.token
  const isUnauthenticated = status === "unauthenticated"

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pageName: "",
      body: "",
      status: "Draft",
    },
  })

  // Set form values when editing
  useEffect(() => {
    if (initialData) {
      form.reset({
        pageName: initialData.name,
        body: initialData.body,
        status: (initialData.status as "Draft" | "Published") || "Draft",
      })
    } else {
      form.reset({
        pageName: "",
        body: "",
        status: "Draft",
      })
    }
  }, [initialData, form])

  const onSubmit = async (data: FormData) => {
    if (!token) {
      alert("You must be authenticated to perform this action")
      return
    }

    try {
      setIsSubmitting(true)

      const url = initialData
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pages/${initialData.id}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pages`

      const method = initialData ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.pageName,
          body: data.body,
          status: data.status,
        }),
      })

      if (response.ok) {
        onSuccess()
        form.reset()
      } else {
        const errorData = await response.json()
        console.error("Failed to save page:", errorData)
        alert(`Failed to save page: ${errorData.message || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Error saving page:", error)
      alert("Error saving page. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-4xl md:max-w-7xl lg:max-w-8xl bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{initialData ? "Edit Page" : "Add New Page"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pageName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium text-black leading-normal">Page Name</FormLabel>
                    <FormControl>
                      <Input className="text-black text-base font-normal leading-normal" placeholder="Enter page name" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-medium text-black leading-normal">Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} >
                      <FormControl className="text-black text-base font-normal leading-normal">
                        <SelectTrigger className="text-black dark:text-black text-base font-normal leading-normal" disabled={isSubmitting}>
                          <SelectValue className="text-black dark:text-black text-base font-normal leading-normal" placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white">
                        <SelectItem className="text-black text-base font-normal leading-normal" value="Draft">Draft</SelectItem>
                        <SelectItem className="text-black text-base font-normal leading-normal" value="Published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-medium text-black leading-normal">Content</FormLabel>
                  <FormControl>
                    <QuillEditor id="body" value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4 pt-4">
              <Button className="text-black dark:text-black border" type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || isUnauthenticated} className="text-white">
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent text-white" />
                    Processing...
                  </div>
                ) : initialData ? (
                  "Update Page"
                ) : (
                  "Create Page"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AddNewPage
