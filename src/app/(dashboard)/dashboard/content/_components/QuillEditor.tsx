/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import dynamic from "next/dynamic"
import { useCallback, useEffect, useMemo, useRef } from "react"
import type { ComponentClass } from "react"

interface QuillEditorProps {
  value: string
  onChange: (value: string) => void
  id: string
  uploadEndpoint?: string
  uploadHeaders?: Record<string, string>
  maxImageSizeBytes?: number
  withCredentials?: boolean
}

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <div className="min-h-[200px] bg-gray-100 animate-pulse rounded-md" />,
}) as unknown as ComponentClass<any>

import "react-quill/dist/quill.snow.css"

const BASE_TOOLBAR = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ color: [] }, { background: [] }],
  ["link", "image"],
  ["clean"],
] as const

// --- helpers ---
const dataUrlToFile = async (dataUrl: string, filename = `paste-${Date.now()}`): Promise<File> => {
  // fetch on data: URL returns a Blob in modern browsers
  const res = await fetch(dataUrl)
  const blob = await res.blob()
  // try to infer extension from mime
  const ext = (blob.type.split("/")[1] || "png").split(";")[0]
  return new File([blob], `${filename}.${ext}`, { type: blob.type })
}

// Optional: scrub any data: images left in HTML (use before submit)
export const scrubDataImages = async (
  html: string,
  upload: (file: File) => Promise<string>
): Promise<string> => {
  const doc = new DOMParser().parseFromString(html, "text/html")
  const imgs = Array.from(doc.images).filter((img) => img.src.startsWith("data:"))
  for (const img of imgs) {
    const file = await dataUrlToFile(img.src)
    const url = await upload(file)
    img.src = url
  }
  return doc.body.innerHTML
}

const QuillEditor = ({
  value,
  onChange,
  id,
  uploadEndpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/uploads/images`,
  uploadHeaders,
  maxImageSizeBytes = 20 * 1024 * 1024,
  withCredentials = false,
}: QuillEditorProps) => {
  const quillRef = useRef<any>(null)

  const uploadToApi = useCallback(
    async (file: File): Promise<string> => {
      if (!file) throw new Error("No file selected")
      if (!file.type.startsWith("image/")) throw new Error("Only image uploads are allowed")

      const form = new FormData()
      form.append("image", file)

      const res = await fetch(uploadEndpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          ...(uploadHeaders || {}),
        } as HeadersInit,
        body: form,
        credentials: withCredentials ? "include" : "omit",
      })

      if (!res.ok) throw new Error((await res.text()) || "Upload failed")
      const data = (await res.json()) as { url?: string }
      if (!data?.url) throw new Error("No URL returned from upload API")
      return data.url
    },
    [uploadEndpoint, uploadHeaders, maxImageSizeBytes, withCredentials]
  )

  // Toolbar "image" button
  const imageHandler = useCallback(() => {
    const quill = quillRef.current?.getEditor?.()
    if (!quill) return

    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      const range = quill.getSelection(true)
      try {
        const url = await uploadToApi(file)
        quill.insertEmbed(range ? range.index : 0, "image", url, "user")
        if (range) quill.setSelection(range.index + 1)
      } catch (err: any) {
        console.error(err)
        alert(err?.message || "Image upload failed")
      }
    }
    input.click()
  }, [uploadToApi])

  const modules = useMemo(
    () => ({
      toolbar: {
        container: BASE_TOOLBAR,
        handlers: { image: imageHandler },
      },
    }),
    [imageHandler]
  )

  useEffect(() => {
    const quill = quillRef.current?.getEditor?.()
    if (!quill) return
    const root: HTMLElement = quill.root

    const handlePaste = async (e: ClipboardEvent) => {
      // 1) File(s) directly on clipboard
      const items = Array.from(e.clipboardData?.items || [])
      const imageItem = items.find((i) => i.type.startsWith("image/"))
      if (imageItem) {
        e.preventDefault()
        const file = imageItem.getAsFile()
        if (!file) return
        const range = quill.getSelection(true)
        try {
          const url = await uploadToApi(file)
          quill.insertEmbed(range ? range.index : 0, "image", url, "user")
          if (range) quill.setSelection(range.index + 1)
        } catch (err: any) {
          console.error(err)
          alert(err?.message || "Pasted image upload failed")
        }
        return
      }

      // 2) HTML with <img src="data:...">
      const html = e.clipboardData?.getData("text/html")
      if (html && html.includes("data:image")) {
        e.preventDefault()
        const doc = new DOMParser().parseFromString(html, "text/html")
        const imgs = Array.from(doc.images).filter((img) => img.src.startsWith("data:"))
        const range = quill.getSelection(true)

        try {
          for (const img of imgs) {
            const file = await dataUrlToFile(img.src)
            const url = await uploadToApi(file)
            quill.insertEmbed(range ? range.index : 0, "image", url, "user")
            if (range) quill.setSelection(range.index + 1)
          }
        } catch (err: any) {
          console.error(err)
          alert(err?.message || "Pasted image upload failed")
        }
      }
      // Otherwise let Quill handle normally
    }

    const handleDrop = async (e: DragEvent) => {
      const dt = e.dataTransfer
      if (!dt) return

      // 1) Real files
      const file = Array.from(dt.files || []).find((f) => f.type.startsWith("image/"))
      if (file) {
        e.preventDefault()
        e.stopPropagation()
        const range = quill.getSelection(true)
        try {
          const url = await uploadToApi(file)
          quill.insertEmbed(range ? range.index : 0, "image", url, "user")
          if (range) quill.setSelection(range.index + 1)
        } catch (err: any) {
          console.error(err)
          alert(err?.message || "Image drop upload failed")
        }
        return
      }

      // 2) HTML with data URIs dragged
      const html = dt.getData("text/html")
      if (html && html.includes("data:image")) {
        e.preventDefault()
        e.stopPropagation()
        const doc = new DOMParser().parseFromString(html, "text/html")
        const imgs = Array.from(doc.images).filter((img) => img.src.startsWith("data:"))
        const range = quill.getSelection(true)
        try {
          for (const img of imgs) {
            const fileFromData = await dataUrlToFile(img.src)
            const url = await uploadToApi(fileFromData)
            quill.insertEmbed(range ? range.index : 0, "image", url, "user")
            if (range) quill.setSelection(range.index + 1)
          }
        } catch (err: any) {
          console.error(err)
          alert(err?.message || "Image drop upload failed")
        }
      }
    }

    root.addEventListener("paste", handlePaste as any)
    root.addEventListener("drop", handleDrop as any)
    return () => {
      root.removeEventListener("paste", handlePaste as any)
      root.removeEventListener("drop", handleDrop as any)
    }
  }, [uploadToApi])

  const formats = useMemo(
    () => ["header", "bold", "italic", "underline", "strike", "list", "bullet", "color", "background", "link", "image"],
    []
  )

  return (
    <div className="quill-editor-wrapper">
      <ReactQuill
        ref={quillRef}
        id={id}
        value={value}
        onChange={(content: string) => onChange(content === "<p><br></p>" ? "" : content)}
        modules={modules}
        formats={formats}
        theme="snow"
      />

      <style jsx global>{`
        .quill-editor-wrapper .ql-container {
          border-color: #e2e8f0;
          border-bottom-left-radius: 0.375rem;
          border-bottom-right-radius: 0.375rem;
          min-height: 200px;
          font-size: 1rem;
        }
        .quill-editor-wrapper .ql-toolbar {
          border-color: #e2e8f0;
          border-top-left-radius: 0.375rem;
          border-top-right-radius: 0.375rem;
          background: #f8fafc;
        }
        .quill-editor-wrapper .ql-editor {
          min-height: 200px;
        }
      `}</style>
    </div>
  )
}

export default QuillEditor
