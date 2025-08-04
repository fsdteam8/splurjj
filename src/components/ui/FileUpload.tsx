// // "use client";

// // import { useEffect, useState } from "react";
// // import { X } from "lucide-react";
// // import Image from "next/image";

// // type FileUploadProps = {
// //   label: string;
// //   file: File | null;
// //   setFile: (file: File | null) => void;
// //   existingUrl?: string | null;
// //   type?: "image" | "video";
// // };

// // export default function FileUpload({
// //   label,
// //   file,
// //   setFile,
// //   existingUrl,
// //   type = "image",
// // }: FileUploadProps) {
// //   const [preview, setPreview] = useState<string | null>(null);

// //   useEffect(() => {
// //     if (file) {
// //       const url = URL.createObjectURL(file);
// //       setPreview(url);
// //       return () => URL.revokeObjectURL(url);
// //     } else if (existingUrl) {
// //       setPreview(existingUrl);
// //     } else {
// //       setPreview(null);
// //     }
// //   }, [file, existingUrl]);

// //   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const selectedFile = e.target.files?.[0] || null;
// //     setFile(selectedFile);
// //   };

// //   const removeFile = () => {
// //     setFile(null);
// //     setPreview(null);
// //   };

// //   return (
// //     <div className="space-y-2">
// //       <label className="text-base font-bold text-black">{label}</label>

// //       <input
// //         type="file"
// //         accept={type + "/*"}
// //         onChange={handleFileChange}
// //         className="block mt-1"
// //       />

// //       {preview && (
// //         <div className="relative mt-3 w-fit">
// //           {type === "image" ? (
// //             <Image
// //               src={preview}
// //               alt="Preview"
// //               width={128}
// //               height={128}
// //               className="w-32 h-32 object-cover rounded border"
// //             />
// //           ) : (
// //             <video
// //               src={preview}
// //               controls
// //               className="w-48 h-32 object-cover rounded border"
// //             />
// //           )}

// //           <button
// //             type="button"
// //             onClick={removeFile}
// //             className="absolute -top-2 -right-2 bg-white border rounded-full p-1 shadow hover:bg-gray-100"
// //           >
// //             <X className="w-4 h-4 text-gray-500" />
// //           </button>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }





// "use client"

// import type React from "react"

// import { useEffect, useState } from "react"
// import { X } from "lucide-react"
// import Image from "next/image"

// type FileUploadProps = {
//   label: string
//   file: File | null
//   setFile: (file: File | null) => void
//   existingUrl?: string | null
//   type?: "image" | "video"
//   disabled?: boolean
// }

// export default function FileUpload({
//   label,
//   file,
//   setFile,
//   existingUrl,
//   type = "image",
//   disabled = false,
// }: FileUploadProps) {
//   const [preview, setPreview] = useState<string | null>(null)

//   useEffect(() => {
//     if (file) {
//       const url = URL.createObjectURL(file)
//       setPreview(url)
//       return () => URL.revokeObjectURL(url)
//     } else if (existingUrl) {
//       setPreview(existingUrl)
//     } else {
//       setPreview(null)
//     }
//   }, [file, existingUrl])

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (disabled) return
//     const selectedFile = e.target.files?.[0] || null
//     setFile(selectedFile)
//   }

//   const removeFile = () => {
//     if (disabled) return
//     setFile(null)
//     setPreview(null)
//   }

//   return (
//     <div className="space-y-2">
//       <label className={`text-base font-bold ${disabled ? "text-gray-400" : "text-black"}`}>{label}</label>

//       <input
//         type="file"
//         accept={type + "/*"}
//         onChange={handleFileChange}
//         disabled={disabled}
//         className={`block mt-1 ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
//       />

//       {preview && (
//         <div className="relative mt-3 w-fit">
//           {type === "image" ? (
//             <Image
//               src={preview || "/placeholder.svg"}
//               alt="Preview"
//               width={128}
//               height={128}
//               className={`w-32 h-32 object-cover rounded border ${disabled ? "opacity-50" : ""}`}
//             />
//           ) : (
//             <video
//               src={preview}
//               controls
//               className={`w-48 h-32 object-cover rounded border ${disabled ? "opacity-50" : ""}`}
//             />
//           )}

//           <button
//             type="button"
//             onClick={removeFile}
//             disabled={disabled}
//             className={`absolute -top-2 -right-2 bg-white border rounded-full p-1 shadow ${
//               disabled ? "cursor-not-allowed opacity-50" : "hover:bg-gray-100 cursor-pointer"
//             }`}
//           >
//             <X className="w-4 h-4 text-gray-500" />
//           </button>
//         </div>
//       )}
//     </div>
//   )
// }




"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

type FileUploadProps = {
  label: string;
  file: File | null;
  setFile: (file: File | null) => void;
  existingUrl?: string | null;
  type?: "image" | "video";
  disabled?: boolean;
};

export default function FileUpload({
  label,
  file,
  setFile,
  existingUrl,
  type = "image",
  disabled = false,
}: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (existingUrl) {
      setPreview(existingUrl);
    } else {
      setPreview(null);
    }
  }, [file, existingUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const removeFile = () => {
    if (disabled) return;
    setFile(null);
    setPreview(null);
  };

  return (
    <div className="space-y-2">
      <label className={`text-base font-bold ${disabled ? "text-gray-500" : "text-black"}`}>
        {label}
      </label>
      <input
        type="file"
        accept={type + "/*"}
        onChange={handleFileChange}
        disabled={disabled}
        className={`block mt-1 text-black/70 ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
      />
      {preview && (
        <div className="relative mt-3 w-fit">
          {type === "image" ? (
            <Image
              src={preview}
              alt="Preview"
              width={128}
              height={128}
              className={`w-32 h-32 object-cover rounded border ${disabled ? "opacity-50" : ""}`}
            />
          ) : (
            <video
              src={preview}
              controls
              className={`w-48 h-32 object-cover rounded border ${disabled ? "opacity-50" : ""}`}
            />
          )}
          <button
            type="button"
            onClick={removeFile}
            disabled={disabled}
            className={`absolute -top-2 -right-2 bg-white border rounded-full p-1 shadow ${
              disabled ? "cursor-not-allowed opacity-50" : "hover:bg-gray-100 cursor-pointer"
            }`}
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      )}
    </div>
  );
}
