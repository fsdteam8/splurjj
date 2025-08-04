// "use client";
// import { useState, useEffect } from "react";
// import {
//   ChevronDown,
//   ChevronRight,
//   Plus,
//   Trash2,
//   Check,
//   X,
//   SquarePen,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useSession } from "next-auth/react";
// import { toast } from "sonner";
// import { motion, AnimatePresence, easeInOut } from "framer-motion";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import Image from "next/image";

// interface Subcategory {
//   id: number;
//   name: string;
//   category_id?: number;
// }

// interface Category {
//   category_id: number;
//   category_name: string;
//   category_icon?: string;
//   subcategories: Subcategory[];
// }

// interface ApiResponse {
//   success: boolean;
//   data: Category[];
//   pagination: {
//     current_page: number;
//     last_page: number;
//     per_page: number;
//     total: number;
//   };
// }

// export default function Sidebar() {
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
//     new Set()
//   );
//   const [addingSubcategory, setAddingSubcategory] = useState<number | null>(
//     null
//   );
//   const [editingSubcategory, setEditingSubcategory] = useState<number | null>(
//     null
//   );
//   const [newSubcategoryName, setNewSubcategoryName] = useState("");
//   const [editSubcategoryName, setEditSubcategoryName] = useState("");
//   const [loading, setLoading] = useState(true);
//   console.log(loading);

//   const pathname = usePathname();
//   const { data: session, status } = useSession();
//   const userRole = session?.user?.role;
//   const token = session?.user?.token;

//   // Helper function to check if a category is active
//   const isCategoryActive = (categoryId: number) => {
//     return pathname.includes(`/dashboard/content/${categoryId}`);
//   };

//   // Helper function to check if a subcategory is active
//   const isSubcategoryActive = (categoryId: number, subcategoryId: number) => {
//     return pathname === `/dashboard/content/${categoryId}/${subcategoryId}`;
//   };

//   // Helper function to check if a route is active
//   const isRouteActive = (route: string) => {
//     return pathname === route;
//   };

//   // Animation variants for subcategories
//   const subcategoryVariants = {
//     hidden: { opacity: 0, height: 0 },
//     visible: {
//       opacity: 1,
//       height: "auto",
//       transition: {
//         duration: 0.3,
//         ease: easeInOut,
//       },
//     },
//     exit: {
//       opacity: 0,
//       height: 0,
//       transition: {
//         duration: 0.2,
//         ease: easeInOut,
//       },
//     },
//   };

//   // Role-based permissions
//   const isAdmin = userRole === "admin";
//   const isEditor = userRole === "editor";
//   const isAuthor = userRole === "author";

//   // Fetch categories
//   const fetchCategories = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       const data: ApiResponse = await response.json();
//       if (data.success) {
//         setCategories(data.data);
//       } else {
//         toast.error("Failed to fetch categories");
//       }
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//       toast.error("Error fetching categories");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch categories on component mount
//   useEffect(() => {
//     if (status === "authenticated" && token) {
//       fetchCategories();
//     }
//   }, [status, token]);

//   // Auto-expand active category
//   useEffect(() => {
//     const pathParts = pathname.split("/");
//     if (pathParts.length >= 4 && pathParts[2] === "content") {
//       const categoryId = Number.parseInt(pathParts[3]);
//       if (categoryId) {
//         setExpandedCategories(
//           (prev) => new Set(Array.from(prev).concat(categoryId))
//         );
//       }
//     }
//   }, [pathname]);

//   const toggleCategory = (categoryId: number) => {
//     setExpandedCategories((prev) => {
//       const newExpanded = new Set<number>();
//       if (!prev.has(categoryId)) {
//         newExpanded.add(categoryId);
//       }
//       return newExpanded;
//     });
//   };

//   const handleAddSubcategory = async (categoryId: number) => {
//     if (!newSubcategoryName.trim()) {
//       toast.error("Subcategory name is required");
//       return;
//     }

//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subcategories`,
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             category_id: categoryId,
//             name: newSubcategoryName.trim(),
//           }),
//         }
//       );

//       if (response.ok) {
//         toast.success("Subcategory added successfully");
//         await fetchCategories();
//         setNewSubcategoryName("");
//         setAddingSubcategory(null);
//       } else {
//         const errorData = await response.json();
//         toast.error(errorData.message || "Failed to add subcategory");
//       }
//     } catch (error) {
//       console.error("Error adding subcategory:", error);
//       toast.error("Error adding subcategory");
//     }
//   };

//   const handleEditSubcategory = async (
//     subcategoryId: number,
//     categoryId: number
//   ) => {
//     if (!editSubcategoryName.trim()) {
//       toast.error("Subcategory name is required");
//       return;
//     }

//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subcategories/${subcategoryId}`,
//         {
//           method: "PUT",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             name: editSubcategoryName,
//             category_id: categoryId,
//           }),
//         }
//       );

//       if (response.ok) {
//         toast.success("Subcategory updated successfully");
//         await fetchCategories();
//         setEditSubcategoryName("");
//         setEditingSubcategory(null);
//       } else {
//         const errorData = await response.json();
//         toast.error(errorData.message || "Failed to update subcategory");
//       }
//     } catch (error) {
//       console.error("Error editing subcategory:", error);
//       toast.error("Error editing subcategory");
//     }
//   };

//   const handleDeleteSubcategory = async (subcategoryId: number) => {
//     if (!confirm("Are you sure you want to delete this subcategory?")) return;

//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subcategories/${subcategoryId}`,
//         {
//           method: "DELETE",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.ok) {
//         toast.success("Subcategory deleted successfully");
//         await fetchCategories();
//       } else {
//         const errorData = await response.json();
//         toast.error(errorData.message || "Failed to delete subcategory");
//       }
//     } catch (error) {
//       console.error("Error deleting subcategory:", error);
//       toast.error("Error deleting subcategory");
//     }
//   };

//   const startEditing = (subcategory: Subcategory) => {
//     setEditingSubcategory(subcategory.id);
//     setEditSubcategoryName(subcategory.name);
//   };

//   const cancelEditing = () => {
//     setEditingSubcategory(null);
//     setEditSubcategoryName("");
//   };

//   const cancelAdding = () => {
//     setAddingSubcategory(null);
//     setNewSubcategoryName("");
//   };

//   if (status === "loading") {
//     return (
//       <div className="w-64 h-screen p-4">
//         <div className="text-center">Loading...</div>
//       </div>
//     );
//   }

//   if (status === "unauthenticated") {
//     return (
//       <div className="w-64 h-screen p-4">
//         <div className="text-center">Please log in</div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col h-screen border-r border-[#B6B6B6]/50 bg-white dark:bg-black">
//       <ScrollArea className="flex-1 overflow-auto py-4 pb-10 w-full">
//         <div className="">
//           <div className="pb-1">
//             <Link href="/dashboard">
//               <button
//                 className={`h-[50px] w-full flex items-center justify-start gap-2 text-[#131313] text-left pl-3 text-lg font-bold leading-[120%] tracking-[0%] uppercase ${
//                   isRouteActive("/dashboard")
//                     ? "bg-[#0253F7] text-white font-bold"
//                     : "text-[#131313] font-bold"
//                 }`}
//               >
//                 <Image
//                   src="/assets/dashboard/dashboard.png"
//                   alt="dashboard"
//                   width={20}
//                   height={20}
//                 />{" "}
//                 Dashboard
//               </button>
//             </Link>
//           </div>
//           <div>
//             {(isAdmin || isEditor || isAuthor) && (
//               <div>
//                 <Link href="/dashboard/add-category">
//                   <button
//                     className={`w-full h-[50px] flex justify-start items-center gap-2 text-[#131313] text-left pl-3 text-lg font-bold leading-[120%] uppercase tracking-[0%] ${
//                       isRouteActive("/dashboard/add-category")
//                         ? "bg-[#0253F7] text-white font-bold"
//                         : "text-[#424242] font-bold"
//                     }`}
//                   >
//                     <Image
//                       src="/assets/dashboard/categories.png"
//                       alt="category"
//                       width={20}
//                       height={20}
//                     />{" "}
//                     Category Lists
//                   </button>
//                 </Link>
//               </div>
//             )}
//           </div>
//           <Accordion type="single" collapsible className="w-full">
//             <AccordionItem value="item-1">
//               <AccordionTrigger className="px-3">
//                 <p className="flex items-center gap-2 text-lg font-bold text-[#131313] dark:white-text leading-[120%] uppercase tracking-[0%]">
//                   <Image
//                     src="/assets/dashboard/content.jpg"
//                     alt="content"
//                     width={20}
//                     height={20}
//                   />{" "}
//                   Content Management
//                 </p>
//               </AccordionTrigger>
//               <AccordionContent className="">
//                 {categories.map((category) => {
//                   const categoryActive = isCategoryActive(category.category_id);
//                   return (
//                     <div
//                       key={category.category_id}
//                       className={`rounded-lg transition-colors ${
//                         categoryActive
//                           ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
//                           : "bg-white dark:bg-transparent"
//                       }`}
//                     >
//                       <button
//                         className={`w-full justify-start text-left px-2 py-1 h-[36px] ${
//                           categoryActive
//                             ? "bg-[#0253F7] text-white font-bold"
//                             : "text-[#131313] font-semibold"
//                         }`}
//                         onClick={() => toggleCategory(category.category_id)}
//                       >
//                         <div className="w-full flex items-center justify-between pl-6">
//                           <span
//                             className={`flex items-center gap-2 text-base leading-[120%] tracking-[0%] ${
//                               categoryActive
//                                 ? "text-white font-bold"
//                                 : "text-[#131313] dark:text-white font-semibold"
//                             }`}
//                           >
//                             <Image
//                               src={
//                                 category?.category_icon ||
//                                 "/assets/dashboard/art-and-culture.png"
//                               }
//                               alt="category icon"
//                               width={20}
//                               height={20}
//                             />{" "}
//                             {category.category_name}
//                           </span>
//                           {expandedCategories.has(category.category_id) ? (
//                             <ChevronDown
//                               className={`h-4 w-4 flex-shrink-0 ${
//                                 categoryActive ? "text-white" : ""
//                               }`}
//                             />
//                           ) : (
//                             <ChevronRight
//                               className={`h-4 w-4 flex-shrink-0 ${
//                                 categoryActive ? "text-white" : ""
//                               }`}
//                             />
//                           )}
//                         </div>
//                       </button>
//                       <AnimatePresence>
//                         {expandedCategories.has(category.category_id) && (
//                           <motion.div
//                             initial="hidden"
//                             animate="visible"
//                             exit="exit"
//                             variants={subcategoryVariants}
//                             className="space-y-1 overflow-hidden bg-[#E6EEFE] dark:bg-white py-2 border-t border-gray-200 dark:border-gray-700"
//                           >
//                             {category.subcategories.map((subcategory) => {
//                               const subcategoryActive = isSubcategoryActive(
//                                 category.category_id,
//                                 subcategory.id
//                               );
//                               return (
//                                 <div
//                                   key={subcategory.id}
//                                   className="group ml-6"
//                                 >
//                                   {editingSubcategory === subcategory.id ? (
//                                     <div className="flex items-center gap-1 p-1">
//                                       <Input
//                                         value={editSubcategoryName}
//                                         onChange={(e) =>
//                                           setEditSubcategoryName(e.target.value)
//                                         }
//                                         className="h-7 text-xs"
//                                         onKeyDown={(e) => {
//                                           if (e.key === "Enter") {
//                                             handleEditSubcategory(
//                                               subcategory.id,
//                                               category.category_id
//                                             );
//                                           } else if (e.key === "Escape") {
//                                             cancelEditing();
//                                           }
//                                         }}
//                                         autoFocus
//                                       />
//                                       <Button
//                                         size="sm"
//                                         variant="ghost"
//                                         className="h-7 w-7 p-0"
//                                         onClick={() =>
//                                           handleEditSubcategory(
//                                             subcategory.id,
//                                             category.category_id
//                                           )
//                                         }
//                                       >
//                                         <Check className="h-3 w-3 dark:text-white" />
//                                       </Button>
//                                       <Button
//                                         size="sm"
//                                         variant="ghost"
//                                         className="h-7 w-7 p-0"
//                                         onClick={cancelEditing}
//                                       >
//                                         <X className="h-3 w-3 dark:text-white" />
//                                       </Button>
//                                     </div>
//                                   ) : (
//                                     <Link
//                                       href={`/dashboard/content/${category.category_id}/${subcategory.id}`}
//                                       className={`text-sm leading-[120%] tracking-[0%] ${
//                                         subcategoryActive
//                                           ? "text-[#0253F7] font-bold"
//                                           : "text-[#131313] font-semibold"
//                                       }`}
//                                     >
//                                       <div
//                                         className={`flex items-center justify-between py-1 rounded transition-colors pl-8`}
//                                       >
//                                         {subcategory.name}
//                                         {(isAdmin || isEditor) && (
//                                           <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                                             <Button
//                                               size="sm"
//                                               variant="ghost"
//                                               className="h-6 w-6 p-0"
//                                               onClick={() =>
//                                                 startEditing(subcategory)
//                                               }
//                                             >
//                                               <SquarePen className="h-3 w-3 dark:text-black" />
//                                             </Button>
//                                             <Button
//                                               size="sm"
//                                               variant="ghost"
//                                               className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
//                                               onClick={() =>
//                                                 handleDeleteSubcategory(
//                                                   subcategory.id
//                                                 )
//                                               }
//                                             >
//                                               <Trash2 className="h-3 w-3 dark:text-red-500" />
//                                             </Button>
//                                           </div>
//                                         )}
//                                       </div>
//                                     </Link>
//                                   )}
//                                 </div>
//                               );
//                             })}
//                             {(isAdmin || isEditor) && (
//                               <>
//                                 {addingSubcategory === category.category_id ? (
//                                   <div className="flex items-center gap-1 p-1 mx-6">
//                                     <Input
//                                       value={newSubcategoryName}
//                                       onChange={(e) =>
//                                         setNewSubcategoryName(e.target.value)
//                                       }
//                                       placeholder="Enter subcategory name"
//                                       className="h-7 text-xs dark:text-black"
//                                       onKeyDown={(e) => {
//                                         if (e.key === "Enter") {
//                                           handleAddSubcategory(
//                                             category.category_id
//                                           );
//                                         } else if (e.key === "Escape") {
//                                           cancelAdding();
//                                         }
//                                       }}
//                                       autoFocus
//                                     />
//                                     <Button
//                                       size="sm"
//                                       variant="ghost"
//                                       className="h-7 w-7 p-0"
//                                       onClick={() =>
//                                         handleAddSubcategory(
//                                           category.category_id
//                                         )
//                                       }
//                                     >
//                                       <Check className="h-3 w-3 dark:text-black" />
//                                     </Button>
//                                     <Button
//                                       size="sm"
//                                       variant="ghost"
//                                       className="h-7 w-7 p-0"
//                                       onClick={cancelAdding}
//                                     >
//                                       <X className="h-3 w-3 dark:text-black" />
//                                     </Button>
//                                   </div>
//                                 ) : (
//                                   <Button
//                                     variant="ghost"
//                                     size="sm"
//                                     className="w-full justify-start text-left p-1 h-7 text-xs text-[#0253F7] dark:text-[#0253F7] hover:bg-blue-100/50 dark:hover:bg-blue-900/30 dark:border mx-6"
//                                     onClick={() =>
//                                       setAddingSubcategory(category.category_id)
//                                     }
//                                   >
//                                     <Plus className="h-3 w-3 mr-1 text-[#0253F7]" />
//                                     Add Sub Category
//                                   </Button>
//                                 )}
//                               </>
//                             )}
//                           </motion.div>
//                         )}
//                       </AnimatePresence>
//                     </div>
//                   );
//                 })}
//                 {!isAuthor && (
//                   <div className="">
//                     <Link href="/dashboard/all-pages">
//                       <button
//                         className={`w-full h-[46px] flex items-center justify-start gap-2 text-base text-left pl-8 font-bold leading-[120%] tracking-[0%] ${
//                           isRouteActive("/dashboard/all-pages")
//                             ? "bg-[#0253F7] text-white font-bold"
//                             : "text-[#131313] font-semibold"
//                         }`}
//                       >
//                         <Image
//                           src="/assets/dashboard/all-page.png"
//                           alt="all page"
//                           width={20}
//                           height={20}
//                         />{" "}
//                         Pages
//                       </button>
//                     </Link>
//                   </div>
//                 )}
//               </AccordionContent>
//             </AccordionItem>

//             {!isAuthor && (
//               <AccordionItem value="item-2">
//                 <AccordionTrigger className="px-3">
//                   <p className="flex items-center gap-2 text-lg font-bold text-[#131313] dark:white-text leading-[120%] uppercase tracking-[0%] font-marnrope">
//                     <Image
//                       src="/assets/dashboard/ads.png"
//                       alt="ads"
//                       width={20}
//                       height={20}
//                     />{" "}
//                     Ad Management
//                   </p>
//                 </AccordionTrigger>
//                 <AccordionContent>
//                   <div>
//                     <div className="">
//                       <Link href="/dashboard/horizontal-advertising">
//                         <button
//                           className={`w-full h-[36px] flex justify-start items-center gap-2 text-base text-left pl-8 leading-[120%] tracking-[0%] ${
//                             isRouteActive("/dashboard/horizontal-advertising")
//                               ? "bg-[#0253F7] text-white font-bold"
//                               : "text-[#131313] font-semibold"
//                           }`}
//                         >
//                           <Image
//                             src="/assets/dashboard/horizontal.png"
//                             alt="horizontal"
//                             width={20}
//                             height={20}
//                           />{" "}
//                           Horizontal
//                         </button>
//                       </Link>
//                     </div>
//                     <div className="">
//                       <Link href="/dashboard/vertical-advertising">
//                         <button
//                           className={`w-full h-[36px] flex items-center justify-start gap-2 text-base text-left pl-8 leading-[120%] tracking-[0%] ${
//                             isRouteActive("/dashboard/vertical-advertising")
//                               ? "bg-[#0253F7] text-white font-bold"
//                               : "text-[#131313] font-semibold"
//                           }`}
//                         >
//                           <Image
//                             src="/assets/dashboard/vertical.png"
//                             alt="vertical"
//                             width={20}
//                             height={20}
//                           />{" "}
//                           Vertical
//                         </button>
//                       </Link>
//                     </div>
//                   </div>
//                 </AccordionContent>
//               </AccordionItem>
//             )}

//             <AccordionItem value="item-3">
//               <AccordionTrigger className="px-3">
//                 <p className="flex items-center gap-2 text-lg font-bold text-[#131313] dark:white-text leading-[120%] uppercase tracking-[0%] font-marnrope">
//                   <Image
//                     src="/assets/dashboard/settings.png"
//                     alt="settings"
//                     width={20}
//                     height={20}
//                   />{" "}
//                   Settings
//                 </p>
//               </AccordionTrigger>
//               <AccordionContent>
//                 {isAdmin && (
//                   <div className="">
//                     <Link href="/dashboard/role">
//                       <button
//                         className={`h-[36px] w-full flex items-center justify-start gap-2 text-base text-left pl-8 leading-[120%] tracking-[0%] ${
//                           isRouteActive("/dashboard/role")
//                             ? "bg-[#0253F7] text-white font-bold"
//                             : "text-[#131313] font-semibold"
//                         }`}
//                       >
//                         <Image
//                           src="/assets/dashboard/employee .png"
//                           alt="role management"
//                           width={20}
//                           height={20}
//                         />{" "}
//                         Role Management
//                       </button>
//                     </Link>
//                   </div>
//                 )}
//                 {!isAuthor && (
//                   <div className="">
//                     <Link href="/dashboard/subscriber">
//                       <button
//                         className={`h-[36px] w-full flex items-center justify-start gap-2 text-base pl-8 text-left leading-[120%] tracking-[0%] ${
//                           isRouteActive("/dashboard/subscriber")
//                             ? "bg-[#0253F7] text-white font-bold"
//                             : "text-[#131313] font-semibold"
//                         }`}
//                       >
//                         <Image
//                           src="/assets/dashboard/team.png"
//                           alt="subscriber"
//                           width={20}
//                           height={20}
//                         />{" "}
//                         Subscriber
//                       </button>
//                     </Link>
//                   </div>
//                 )}
//                 <div className="">
//                   <Link href="/dashboard/settings">
//                     <button
//                       className={`h-[36px] w-full flex justify-start items-center gap-2 text-base pl-8 text-left leading-[120%] tracking-[0%] ${
//                         isRouteActive("/dashboard/settings")
//                           ? "bg-[#0253F7] text-white font-bold"
//                           : "text-[#131313] font-semibold"
//                       }`}
//                     >
//                       <Image
//                         src="/assets/dashboard/profile.png"
//                         alt="subscriber"
//                         width={20}
//                         height={20}
//                       />{" "}
//                       Account
//                     </button>
//                   </Link>
//                 </div>
//               </AccordionContent>
//             </AccordionItem>

//             <AccordionItem value="item-4">
//               {!isAuthor && (
//                 <AccordionTrigger className="px-3">
//                   <p className="flex items-center gap-2 text-lg font-semibold text-[#131313] dark:white-text leading-[120%] uppercase tracking-[0%] font-marnrope">
//                     <Image
//                       src="/assets/images/setting.png"
//                       alt="theme-settings"
//                       width={20}
//                       height={20}
//                     />{" "}
//                     Theme Settings
//                   </p>
//                 </AccordionTrigger>
//               )}

//               <AccordionContent>
//                 {!isAuthor && (
//                   <div className="">
//                     <Link href="/dashboard/header">
//                       <button
//                         className={`h-[36px] w-full flex items-center justify-start gap-2 pl-6 text-base text-left leading-[120%] tracking-[0%] ${
//                           isRouteActive("/dashboard/header")
//                             ? "bg-[#0253F7] text-white font-bold"
//                             : "text-[#131313] font-semibold"
//                         }`}
//                       >
//                         <svg
//                           height="20"
//                           viewBox="0 0 512 512"
//                           width="20"
//                           xmlns="http://www.w3.org/2000/svg"
//                           xmlnsXlink="http://www.w3.org/1999/xlink"
//                           id="fi_9073168"
//                         >
//                           <linearGradient
//                             id="linear-gradient"
//                             gradientTransform="matrix(0 -1 1 0 0 512)"
//                             gradientUnits="userSpaceOnUse"
//                             x1="38.65"
//                             x2="473.35"
//                             y1="38.65"
//                             y2="473.35"
//                           >
//                             <stop offset="0" stop-color="#549eff"></stop>
//                             <stop offset="1" stop-color="#006db0"></stop>
//                           </linearGradient>
//                           <linearGradient
//                             id="linear-gradient-2"
//                             gradientUnits="userSpaceOnUse"
//                             x1="146.15"
//                             x2="473.35"
//                             y1="146.15"
//                             y2="473.35"
//                           >
//                             <stop offset="0" stop-opacity=".35"></stop>
//                             <stop offset="1" stop-opacity="0"></stop>
//                           </linearGradient>
//                           <g id="Layer_2" data-name="Layer 2">
//                             <g id="InterfaceIcon">
//                               <g id="_06.Menu" data-name="06.Menu">
//                                 <rect
//                                   id="Background"
//                                   fill="url(#linear-gradient)"
//                                   height="512"
//                                   rx="131.96"
//                                   transform="matrix(0 1 -1 0 512 0)"
//                                   width="512"
//                                 ></rect>
//                                 <path
//                                   d="m512 250.29v129.71a132 132 0 0 1 -132 132h-129.73l-136-136 54-45.65-53.95-54 55.33-44.27-54.68-54.68 281.74-42.5z"
//                                   fill="url(#linear-gradient-2)"
//                                 ></path>
//                                 <g
//                                   id="_06.Menu-2"
//                                   fill="#fff"
//                                   data-name="06.Menu"
//                                 >
//                                   <rect
//                                     height="58.59"
//                                     rx="29.3"
//                                     width="300"
//                                     x="106"
//                                     y="226.7"
//                                   ></rect>
//                                   <rect
//                                     height="58.59"
//                                     rx="29.3"
//                                     width="300"
//                                     x="106"
//                                     y="127.09"
//                                   ></rect>
//                                   <rect
//                                     height="58.59"
//                                     rx="29.3"
//                                     width="300"
//                                     x="106"
//                                     y="326.31"
//                                   ></rect>
//                                 </g>
//                               </g>
//                             </g>
//                           </g>
//                         </svg>{" "}
//                         Header
//                       </button>
//                     </Link>
//                   </div>
//                 )}
//                 {!isAuthor && (
//                   <div className="">
//                     <Link href="/dashboard/footer">
//                       <button
//                         className={`h-[36px] w-full flex items-center justify-start gap-2 pl-6 text-base text-left leading-[120%] tracking-[0%] ${
//                           isRouteActive("/dashboard/footer")
//                             ? "bg-[#0253F7] text-white font-bold"
//                             : "text-[#131313] font-semibold"
//                         }`}
//                       >
//                         <svg
//                           id="fi_6726859"
//                           enable-background="new 0 0 512 512"
//                           height="20"
//                           viewBox="0 0 512 512"
//                           width="20"
//                           xmlns="http://www.w3.org/2000/svg"
//                         >
//                           <g>
//                             <g>
//                               <path
//                                 d="m512 451h-512v-150h512z"
//                                 fill="#465d8c"
//                               ></path>
//                             </g>
//                             <path
//                               d="m256 301h256v150h-256z"
//                               fill="#333b66"
//                             ></path>
//                             <g id="_x32_0-captcha_2_">
//                               <g>
//                                 <path d="m0 241h30v30h-30z" fill="#9ff"></path>
//                               </g>
//                               <g>
//                                 <path d="m0 181h30v30h-30z" fill="#9ff"></path>
//                               </g>
//                               <g>
//                                 <path d="m0 121h30v30h-30z" fill="#9ff"></path>
//                               </g>
//                               <g>
//                                 <path d="m0 61h30v30h-30z" fill="#9ff"></path>
//                               </g>
//                               <g>
//                                 <path d="m61 61h30v30h-30z" fill="#9ff"></path>
//                               </g>
//                               <g>
//                                 <path d="m121 61h30v30h-30z" fill="#9ff"></path>
//                               </g>
//                               <g>
//                                 <path d="m181 61h30v30h-30z" fill="#9ff"></path>
//                               </g>
//                               <g>
//                                 <path d="m241 61h30v30h-30z" fill="#9ff"></path>
//                               </g>
//                               <g>
//                                 <path
//                                   d="m301 61h30v30h-30z"
//                                   fill="#66e6ff"
//                                 ></path>
//                               </g>
//                               <g>
//                                 <g>
//                                   <path
//                                     d="m361 61h30v30h-30z"
//                                     fill="#66e6ff"
//                                   ></path>
//                                 </g>
//                               </g>
//                               <g>
//                                 <g>
//                                   <path
//                                     d="m421 61h30v30h-30z"
//                                     fill="#66e6ff"
//                                   ></path>
//                                 </g>
//                               </g>
//                               <g>
//                                 <g>
//                                   <path
//                                     d="m482 61h30v30h-30z"
//                                     fill="#66e6ff"
//                                   ></path>
//                                 </g>
//                               </g>
//                               <g>
//                                 <g>
//                                   <path
//                                     d="m482 121h30v30h-30z"
//                                     fill="#66e6ff"
//                                   ></path>
//                                 </g>
//                               </g>
//                               <g>
//                                 <g>
//                                   <path
//                                     d="m482 181h30v30h-30z"
//                                     fill="#66e6ff"
//                                   ></path>
//                                 </g>
//                               </g>
//                               <g>
//                                 <path
//                                   d="m482 241h30v30h-30z"
//                                   fill="#66e6ff"
//                                 ></path>
//                               </g>
//                               <g>
//                                 <path
//                                   d="m421 361h30v30h-30z"
//                                   fill="#d9e5ff"
//                                 ></path>
//                               </g>
//                               <g>
//                                 <path
//                                   d="m361 361h30v30h-30z"
//                                   fill="#d9e5ff"
//                                 ></path>
//                               </g>
//                               <g>
//                                 <path
//                                   d="m301 361h30v30h-30z"
//                                   fill="#d9e5ff"
//                                 ></path>
//                               </g>
//                               <g>
//                                 <path
//                                   d="m61 361h180v30h-180z"
//                                   fill="#ecf2ff"
//                                 ></path>
//                               </g>
//                             </g>
//                             <path d="m256 61h15v30h-15z" fill="#66e6ff"></path>
//                           </g>
//                         </svg>{" "}
//                         Footer
//                       </button>
//                     </Link>
//                   </div>
//                 )}
//               </AccordionContent>
//             </AccordionItem>
//           </Accordion>
//         </div>
//       </ScrollArea>
//     </div>
//   );
// }

"use client";
import type * as React from "react";
import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Check,
  X,
  SquarePen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { useQuery } from "@tanstack/react-query";
import { HeaderResponse } from "../header/_container/HeaderForm";
// import type { HeaderResponse } from "./dashboardHeader"

interface Subcategory {
  id: number;
  name: string;
  category_id?: number;
}

interface Category {
  category_id: number;
  category_name: string;
  category_icon?: string;
  subcategories: Subcategory[];
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
  const [expandedMainGroup, setExpandedMainGroup] = useState<string | null>(
    null
  );
  const [addingSubcategory, setAddingSubcategory] = useState<number | null>(
    null
  );
  const [editingSubcategory, setEditingSubcategory] = useState<number | null>(
    null
  );
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [editSubcategoryName, setEditSubcategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { state } = useSidebar();
  const userRole = session?.user?.role;
  const token = session?.user?.token;

  console.log(loading);

  const isCategoryActive = (categoryId: number) => {
    return pathname.includes(`/dashboard/content/${categoryId}`);
  };

  const isSubcategoryActive = (categoryId: number, subcategoryId: number) => {
    return pathname === `/dashboard/content/${categoryId}/${subcategoryId}`;
  };

  const isRouteActive = (route: string) => {
    return pathname === route;
  };

  const isAdmin = userRole === "admin";
  const isEditor = userRole === "editor";
  const isAuthor = userRole === "author";

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data: ApiResponse = await response.json();
      if (data.success) {
        setCategories(data.data);
      } else {
        toast.error("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Error fetching categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && token) {
      fetchCategories();
    }
  }, [status, token]);

  useEffect(() => {
    const pathParts = pathname.split("/");
    if (pathParts.length >= 4 && pathParts[2] === "content") {
      const categoryId = Number.parseInt(pathParts[3]);
      if (categoryId && !Number.isNaN(categoryId)) {
        setExpandedCategory(categoryId);
        setExpandedMainGroup("content-management");
      }
    } else {
      setExpandedCategory(null);
    }
  }, [pathname]);

  const toggleCategory = (categoryId: number) => {
    setExpandedCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  const toggleMainGroup = (groupId: string) => {
    setExpandedMainGroup((prev) => (prev === groupId ? null : groupId));
  };

  const handleAddSubcategory = async (categoryId: number) => {
    if (!newSubcategoryName.trim()) {
      toast.error("Subcategory name is required");
      return;
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subcategories`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            category_id: categoryId,
            name: newSubcategoryName.trim(),
          }),
        }
      );
      if (response.ok) {
        toast.success("Subcategory added successfully");
        await fetchCategories();
        setNewSubcategoryName("");
        setAddingSubcategory(null);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to add subcategory");
      }
    } catch (error) {
      console.error("Error adding subcategory:", error);
      toast.error("Error adding subcategory");
    }
  };

  const handleEditSubcategory = async (
    subcategoryId: number,
    categoryId: number
  ) => {
    if (!editSubcategoryName.trim()) {
      toast.error("Subcategory name is required");
      return;
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subcategories/${subcategoryId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editSubcategoryName,
            category_id: categoryId,
          }),
        }
      );
      if (response.ok) {
        toast.success("Subcategory updated successfully");
        await fetchCategories();
        setEditSubcategoryName("");
        setEditingSubcategory(null);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to update subcategory");
      }
    } catch (error) {
      console.error("Error editing subcategory:", error);
      toast.error("Error editing subcategory");
    }
  };

  const handleDeleteSubcategory = async (subcategoryId: number) => {
    if (!confirm("Are you sure you want to delete this subcategory?")) return;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subcategories/${subcategoryId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        toast.success("Subcategory deleted successfully");
        await fetchCategories();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to delete subcategory");
      }
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      toast.error("Error deleting subcategory");
    }
  };

  const { data: headerData } = useQuery<HeaderResponse>({
    queryKey: ["header"],
    queryFn: () =>
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/header`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json()),
  });

  const startEditing = (subcategory: Subcategory) => {
    setEditingSubcategory(subcategory.id);
    setEditSubcategoryName(subcategory.name);
  };

  const cancelEditing = () => {
    setEditingSubcategory(null);
    setEditSubcategoryName("");
  };

  const cancelAdding = () => {
    setAddingSubcategory(null);
    setNewSubcategoryName("");
  };

  if (status === "loading") {
    return (
      <Sidebar {...props}>
        <SidebarContent>
          <div className="p-4 text-center">Loading...</div>
        </SidebarContent>
      </Sidebar>
    );
  }

  if (status === "unauthenticated") {
    return (
      <Sidebar {...props}>
        <SidebarContent>
          <div className="p-4 text-center">Please log in</div>
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <Sidebar {...props} className="w-[280px]">
      <SidebarHeader className="pb-5">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center">
              <Link href="/" className="transition-opacity hover:opacity-80">
                {headerData?.data?.logo ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${headerData.data.logo}`}
                    alt="Company Logo"
                    width={90}
                    height={55}
                    className="w-[90px] h-[55px] object-contain"
                  />
                ) : (
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    LOGO
                  </h2>
                )}
              </Link>
            </div>
          </SidebarMenuItem>
          {/* <SidebarMenuItem className="mt-5">
            <SidebarMenuButton
              asChild
              isActive={isRouteActive("/dashboard")}
              tooltip="Dashboard"
            >
              <Link href="/dashboard">
                <Image
                  src="/assets/dashboard/dashboard.png"
                  alt="dashboard"
                  width={20}
                  height={20}
                />
                <span className="text-lg font-bold leading-[120%] font-poppins text-[#131313] dark:text-white">
                  Dashboard
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem> */}
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="space-y-2">
        <SidebarGroup className="py-0 ">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                className="py-0 !mt-4"
                asChild
                isActive={isRouteActive("/dashboard")}
                tooltip="Dashboard"
              >
                <Link href="/dashboard" className="">
                  <Image
                    src="/assets/dashboard/dashboard.png"
                    alt="dashboard"
                    width={20}
                    height={20}
                  />
                  <span className="text-lg font-bold leading-[120%] font-poppins text-[#131313] dark:text-white">
                    Dashboard
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup className="py-0">
          <SidebarMenu>
            {(isAdmin || isEditor || isAuthor) && (
              <SidebarMenuItem>
                <SidebarMenuButton
                  className="py-0  mb-[4px] "
                  asChild
                  isActive={isRouteActive("/dashboard/add-category")}
                  tooltip="Category Lists"
                >
                  <Link href="/dashboard/add-category" className="">
                    <Image
                      src="/assets/dashboard/categories.png"
                      alt="category"
                      width={20}
                      height={20}
                    />
                    <span className="text-lg font-bold leading-[120%] font-poppins text-[#131313] dark:text-white">
                      Category Lists
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarGroup>

        {/* Content Management Group */}
        <Collapsible
          open={expandedMainGroup === "content-management"}
          onOpenChange={() => toggleMainGroup("content-management")}
          className="group/collapsible"
        >
          <SidebarGroup>
            <SidebarGroupLabel
              asChild
              className="group-data-[collapsible=icon]:opacity-100"
            >
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip="Content Management">
                  <Image
                    src="/assets/dashboard/content.jpg"
                    alt="content"
                    width={20}
                    height={20}
                  />
                  <span className="text-lg font-bold leading-[120%] font-poppins text-[#131313] dark:text-white">
                    Content Management
                  </span>
                  {state === "expanded" &&
                    (expandedMainGroup === "content-management" ? (
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    ) : (
                      <ChevronRight className="ml-auto h-4 w-4" />
                    ))}
                </SidebarMenuButton>
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            {state === "expanded" && (
              <CollapsibleContent className="pl-5">
                <SidebarGroupContent>
                  <SidebarMenu>
                    {categories.map((category) => {
                      const categoryActive = isCategoryActive(
                        category.category_id
                      );
                      const isExpanded =
                        expandedCategory === category.category_id;
                      return (
                        <Collapsible
                          key={category.category_id}
                          open={isExpanded}
                          onOpenChange={() =>
                            toggleCategory(category.category_id)
                          }
                        >
                          <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                              <SidebarMenuButton
                                isActive={categoryActive}
                                tooltip={category.category_name}
                              >
                                <Image
                                  src={
                                    category?.category_icon ||
                                    "/assets/dashboard/art-and-culture.png"
                                  }
                                  alt="category icon"
                                  width={20}
                                  height={20}
                                />
                                <span>{category.category_name}</span>
                                {state === "expanded" &&
                                  (isExpanded ? (
                                    <ChevronDown className="ml-auto h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="ml-auto h-4 w-4" />
                                  ))}
                              </SidebarMenuButton>
                            </CollapsibleTrigger>
                            {state === "expanded" && (
                              <CollapsibleContent>
                                <SidebarMenuSub>
                                  {category.subcategories.map((subcategory) => {
                                    const subcategoryActive =
                                      isSubcategoryActive(
                                        category.category_id,
                                        subcategory.id
                                      );
                                    return (
                                      <SidebarMenuSubItem key={subcategory.id}>
                                        {editingSubcategory ===
                                        subcategory.id ? (
                                          <div className="flex items-center gap-1 p-1">
                                            <Input
                                              value={editSubcategoryName}
                                              onChange={(e) =>
                                                setEditSubcategoryName(
                                                  e.target.value
                                                )
                                              }
                                              className="h-7 text-xs"
                                              onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                  handleEditSubcategory(
                                                    subcategory.id,
                                                    category.category_id
                                                  );
                                                } else if (e.key === "Escape") {
                                                  cancelEditing();
                                                }
                                              }}
                                              autoFocus
                                            />
                                            <Button
                                              size="sm"
                                              variant="ghost"
                                              className="h-7 w-7 p-0"
                                              onClick={() =>
                                                handleEditSubcategory(
                                                  subcategory.id,
                                                  category.category_id
                                                )
                                              }
                                            >
                                              <Check className="h-3 w-3" />
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="ghost"
                                              className="h-7 w-7 p-0"
                                              onClick={cancelEditing}
                                            >
                                              <X className="h-3 w-3" />
                                            </Button>
                                          </div>
                                        ) : (
                                          <div className="group flex items-center justify-between">
                                            <SidebarMenuSubButton
                                              asChild
                                              isActive={subcategoryActive}
                                            >
                                              <Link
                                                href={`/dashboard/content/${category.category_id}/${subcategory.id}`}
                                              >
                                                {subcategory.name}
                                              </Link>
                                            </SidebarMenuSubButton>
                                            {(isAdmin || isEditor) && (
                                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                  size="sm"
                                                  variant="ghost"
                                                  className="h-6 w-6 p-0"
                                                  onClick={() =>
                                                    startEditing(subcategory)
                                                  }
                                                >
                                                  <SquarePen className="h-3 w-3" />
                                                </Button>
                                                <Button
                                                  size="sm"
                                                  variant="ghost"
                                                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                                  onClick={() =>
                                                    handleDeleteSubcategory(
                                                      subcategory.id
                                                    )
                                                  }
                                                >
                                                  <Trash2 className="h-3 w-3" />
                                                </Button>
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </SidebarMenuSubItem>
                                    );
                                  })}
                                  {(isAdmin || isEditor) && (
                                    <SidebarMenuSubItem>
                                      {addingSubcategory ===
                                      category.category_id ? (
                                        <div className="flex items-center gap-1 p-1">
                                          <Input
                                            value={newSubcategoryName}
                                            onChange={(e) =>
                                              setNewSubcategoryName(
                                                e.target.value
                                              )
                                            }
                                            placeholder="Enter subcategory name"
                                            className="h-7 text-xs"
                                            onKeyDown={(e) => {
                                              if (e.key === "Enter") {
                                                handleAddSubcategory(
                                                  category.category_id
                                                );
                                              } else if (e.key === "Escape") {
                                                cancelAdding();
                                              }
                                            }}
                                            autoFocus
                                          />
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-7 w-7 p-0"
                                            onClick={() =>
                                              handleAddSubcategory(
                                                category.category_id
                                              )
                                            }
                                          >
                                            <Check className="h-3 w-3" />
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-7 w-7 p-0"
                                            onClick={cancelAdding}
                                          >
                                            <X className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      ) : (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="w-full justify-start text-left p-1 h-7 text-xs text-blue-600 hover:bg-blue-100/50"
                                          onClick={() =>
                                            setAddingSubcategory(
                                              category.category_id
                                            )
                                          }
                                        >
                                          <Plus className="h-3 w-3 mr-1" />
                                          Add Sub Category
                                        </Button>
                                      )}
                                    </SidebarMenuSubItem>
                                  )}
                                </SidebarMenuSub>
                              </CollapsibleContent>
                            )}
                          </SidebarMenuItem>
                        </Collapsible>
                      );
                    })}
                    {!isAuthor && (
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive={isRouteActive("/dashboard/all-pages")}
                          tooltip="Pages"
                        >
                          <Link href="/dashboard/all-pages">
                            <Image
                              src="/assets/dashboard/all-page.png"
                              alt="all page"
                              width={20}
                              height={20}
                            />
                            <span>Pages</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            )}
          </SidebarGroup>
        </Collapsible>

        {/* Ad Management Group */}
        {!isAuthor && (
          <Collapsible
            open={expandedMainGroup === "ad-management"}
            onOpenChange={() => toggleMainGroup("ad-management")}
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className="group-data-[collapsible=icon]:opacity-100"
              >
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip="Ad Management">
                    <Image
                      src="/assets/dashboard/ads.png"
                      alt="ads"
                      width={20}
                      height={20}
                    />
                    <span className="text-lg font-bold leading-[120%] font-poppins text-[#131313] dark:text-white">
                      Ad Management
                    </span>
                    {state === "expanded" &&
                      (expandedMainGroup === "ad-management" ? (
                        <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                      ) : (
                        <ChevronRight className="ml-auto h-4 w-4" />
                      ))}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              {state === "expanded" && (
                <CollapsibleContent className="pl-5">
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive={isRouteActive(
                            "/dashboard/horizontal-advertising"
                          )}
                          tooltip="Horizontal Ads"
                        >
                          <Link href="/dashboard/horizontal-advertising">
                            <Image
                              src="/assets/dashboard/horizontal.png"
                              alt="horizontal"
                              width={20}
                              height={20}
                            />
                            <span>Horizontal</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive={isRouteActive(
                            "/dashboard/vertical-advertising"
                          )}
                          tooltip="Vertical Ads"
                        >
                          <Link href="/dashboard/vertical-advertising">
                            <Image
                              src="/assets/dashboard/vertical.png"
                              alt="vertical"
                              width={20}
                              height={20}
                            />
                            <span>Vertical</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              )}
            </SidebarGroup>
          </Collapsible>
        )}

        {/* Settings Group */}
        <Collapsible
          open={expandedMainGroup === "settings"}
          onOpenChange={() => toggleMainGroup("settings")}
          className="group/collapsible"
        >
          <SidebarGroup>
            <SidebarGroupLabel
              asChild
              className="group-data-[collapsible=icon]:opacity-100"
            >
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip="Settings">
                  <Image
                    src="/assets/dashboard/settings.png"
                    alt="settings"
                    width={20}
                    height={20}
                    className="opacity-100"
                  />
                  <span className="text-lg font-bold leading-[120%] font-poppins text-[#131313] dark:text-white">
                    Settings
                  </span>
                  {state === "expanded" &&
                    (expandedMainGroup === "settings" ? (
                      <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    ) : (
                      <ChevronRight className="ml-auto h-4 w-4" />
                    ))}
                </SidebarMenuButton>
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            {state === "expanded" && (
              <CollapsibleContent className="pl-5">
                <SidebarGroupContent>
                  <SidebarMenu>
                    {isAdmin && (
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive={isRouteActive("/dashboard/role")}
                          tooltip="Role Management"
                        >
                          <Link href="/dashboard/role">
                            <Image
                              src="/assets/dashboard/employee .png"
                              alt="role management"
                              width={20}
                              height={20}
                            />
                            <span>Role Management</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                    {!isAuthor && (
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive={isRouteActive("/dashboard/subscriber")}
                          tooltip="Subscriber"
                        >
                          <Link href="/dashboard/subscriber">
                            <Image
                              src="/assets/dashboard/team.png"
                              alt="subscriber"
                              width={20}
                              height={20}
                            />
                            <span>Subscriber</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )}
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        isActive={isRouteActive("/dashboard/settings")}
                        tooltip="Account Settings"
                      >
                        <Link href="/dashboard/settings">
                          <Image
                            src="/assets/dashboard/profile.png"
                            alt="account"
                            width={20}
                            height={20}
                          />
                          <span>Account</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            )}
          </SidebarGroup>
        </Collapsible>

        {/* Theme Settings Group */}
        {!isAuthor && (
          <Collapsible
            open={expandedMainGroup === "theme-settings"}
            onOpenChange={() => toggleMainGroup("theme-settings")}
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className="group-data-[collapsible=icon]:opacity-100"
              >
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip="Theme Settings">
                    <Image
                      src="/assets/images/setting.png"
                      alt="theme-settings"
                      width={20}
                      height={20}
                    />
                    <span className="text-lg font-bold leading-[120%] font-poppins text-[#131313] dark:text-white">
                      Theme Settings
                    </span>
                    {state === "expanded" &&
                      (expandedMainGroup === "theme-settings" ? (
                        <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                      ) : (
                        <ChevronRight className="ml-auto h-4 w-4" />
                      ))}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              {state === "expanded" && (
                <CollapsibleContent>
                  <SidebarGroupContent className="pl-5">
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive={isRouteActive("/dashboard/header")}
                          tooltip="Header Settings"
                        >
                          <Link href="/dashboard/header">
                            <svg
                              height="20"
                              viewBox="0 0 512 512"
                              width="20"
                              xmlns="http://www.w3.org/2000/svg"
                              xmlnsXlink="http://www.w3.org/1999/xlink"
                              id="fi_9073168"
                            >
                              <linearGradient
                                id="linear-gradient"
                                gradientTransform="matrix(0 -1 1 0 0 512)"
                                gradientUnits="userSpaceOnUse"
                                x1="38.65"
                                x2="473.35"
                                y1="38.65"
                                y2="473.35"
                              >
                                <stop offset="0" stopColor="#549eff"></stop>
                                <stop offset="1" stopColor="#006db0"></stop>
                              </linearGradient>
                              <linearGradient
                                id="linear-gradient-2"
                                gradientUnits="userSpaceOnUse"
                                x1="146.15"
                                x2="473.35"
                                y1="146.15"
                                y2="473.35"
                              >
                                <stop offset="0" stopOpacity=".35"></stop>
                                <stop offset="1" stopOpacity="0"></stop>
                              </linearGradient>
                              <g id="Layer_2" data-name="Layer 2">
                                <g id="InterfaceIcon">
                                  <g id="_06.Menu" data-name="06.Menu">
                                    <rect
                                      id="Background"
                                      fill="url(#linear-gradient)"
                                      height="512"
                                      rx="131.96"
                                      transform="matrix(0 1 -1 0 512 0)"
                                      width="512"
                                    ></rect>
                                    <path
                                      d="m512 250.29v129.71a132 132 0 0 1 -132 132h-129.73l-136-136 54-45.65-53.95-54 55.33-44.27-54.68-54.68 281.74-42.5z"
                                      fill="url(#linear-gradient-2)"
                                    ></path>
                                    <g
                                      id="_06.Menu-2"
                                      fill="#fff"
                                      data-name="06.Menu"
                                    >
                                      <rect
                                        height="58.59"
                                        rx="29.3"
                                        width="300"
                                        x="106"
                                        y="226.7"
                                      ></rect>
                                      <rect
                                        height="58.59"
                                        rx="29.3"
                                        width="300"
                                        x="106"
                                        y="127.09"
                                      ></rect>
                                      <rect
                                        height="58.59"
                                        rx="29.3"
                                        width="300"
                                        x="106"
                                        y="326.31"
                                      ></rect>
                                    </g>
                                  </g>
                                </g>
                              </g>
                            </svg>

                            <span>Header</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive={isRouteActive("/dashboard/footer")}
                          tooltip="Footer Settings"
                        >
                          <Link href="/dashboard/footer">
                            <svg
                              id="fi_6726859"
                              enableBackground="new 0 0 512 512"
                              height="20"
                              viewBox="0 0 512 512"
                              width="20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g>
                                <g>
                                  <path
                                    d="m512 451h-512v-150h512z"
                                    fill="#465d8c"
                                  ></path>
                                </g>
                                <path
                                  d="m256 301h256v150h-256z"
                                  fill="#333b66"
                                ></path>
                                <g id="_x32_0-captcha_2_">
                                  <g>
                                    <path
                                      d="m0 241h30v30h-30z"
                                      fill="#9ff"
                                    ></path>
                                  </g>
                                  <g>
                                    <path
                                      d="m0 181h30v30h-30z"
                                      fill="#9ff"
                                    ></path>
                                  </g>
                                  <g>
                                    <path
                                      d="m0 121h30v30h-30z"
                                      fill="#9ff"
                                    ></path>
                                  </g>
                                  <g>
                                    <path
                                      d="m0 61h30v30h-30z"
                                      fill="#9ff"
                                    ></path>
                                  </g>
                                  <g>
                                    <path
                                      d="m61 61h30v30h-30z"
                                      fill="#9ff"
                                    ></path>
                                  </g>
                                  <g>
                                    <path
                                      d="m121 61h30v30h-30z"
                                      fill="#9ff"
                                    ></path>
                                  </g>
                                  <g>
                                    <path
                                      d="m181 61h30v30h-30z"
                                      fill="#9ff"
                                    ></path>
                                  </g>
                                  <g>
                                    <path
                                      d="m241 61h30v30h-30z"
                                      fill="#9ff"
                                    ></path>
                                  </g>
                                  <g>
                                    <path
                                      d="m301 61h30v30h-30z"
                                      fill="#66e6ff"
                                    ></path>
                                  </g>
                                  <g>
                                    <g>
                                      <path
                                        d="m361 61h30v30h-30z"
                                        fill="#66e6ff"
                                      ></path>
                                    </g>
                                  </g>
                                  <g>
                                    <g>
                                      <path
                                        d="m421 61h30v30h-30z"
                                        fill="#66e6ff"
                                      ></path>
                                    </g>
                                  </g>
                                  <g>
                                    <g>
                                      <path
                                        d="m482 61h30v30h-30z"
                                        fill="#66e6ff"
                                      ></path>
                                    </g>
                                  </g>
                                  <g>
                                    <g>
                                      <path
                                        d="m482 121h30v30h-30z"
                                        fill="#66e6ff"
                                      ></path>
                                    </g>
                                  </g>
                                  <g>
                                    <g>
                                      <path
                                        d="m482 181h30v30h-30z"
                                        fill="#66e6ff"
                                      ></path>
                                    </g>
                                  </g>
                                  <g>
                                    <path
                                      d="m482 241h30v30h-30z"
                                      fill="#66e6ff"
                                    ></path>
                                  </g>
                                  <g>
                                    <path
                                      d="m421 361h30v30h-30z"
                                      fill="#d9e5ff"
                                    ></path>
                                  </g>
                                  <g>
                                    <path
                                      d="m361 361h30v30h-30z"
                                      fill="#d9e5ff"
                                    ></path>
                                  </g>
                                  <g>
                                    <path
                                      d="m301 361h30v30h-30z"
                                      fill="#d9e5ff"
                                    ></path>
                                  </g>
                                  <g>
                                    <path
                                      d="m61 361h180v30h-180z"
                                      fill="#ecf2ff"
                                    ></path>
                                  </g>
                                </g>
                                <path
                                  d="m256 61h15v30h-15z"
                                  fill="#66e6ff"
                                ></path>
                              </g>
                            </svg>

                            <span>Footer</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              )}
            </SidebarGroup>
          </Collapsible>
        )}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
