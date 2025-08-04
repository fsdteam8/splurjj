"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "react-toastify"
import { SquarePen } from "lucide-react"
import { useSession } from "next-auth/react"
import { useEffect } from "react"

const personalInfoSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  road: z.string().optional(),
  postal_code: z.string().optional(),
})

type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>

type UserSettingsResponse = {
  success: boolean;
  message: string;
  data: {
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    country: string;
    city: string;
    road: string;
    postal_code: string;
  };
};


export default function PersonalInformation() {

  const session = useSession();
  const token = (session?.data?.user as {token: string})?.token;


  const queryClient = useQueryClient()


  
    // GET API
    const { data } = useQuery<UserSettingsResponse>({
      queryKey: ["personal-information"],
      enabled: !!token,
      queryFn: () =>
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/updateInfo`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then((res) => res.json()),
    });




const form = useForm<PersonalInfoFormValues>({
  resolver: zodResolver(personalInfoSchema),
  defaultValues: {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    road: "",
    postal_code: "",
  },
})

useEffect(() => {
  if (data?.data) {
    form.reset({
      first_name: data.data.first_name || "",
      last_name: data.data.last_name || "",
      email: data.data.email || "",
      phone: data.data.phone || "",
      country: data.data.country || "",
      city: data.data.city || "",
      road: data.data.road || "",
      postal_code: data.data.postal_code || "",
    })
  }
}, [data, form])


  const {mutate, isPending} = useMutation({
    mutationKey : ["updateProfile"],
    mutationFn : (data: PersonalInfoFormValues)=>fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/updateInfo`,{
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data),
    }).then((res)=>res.json()),
    onSuccess: (data)=>{
      if(!data?.success){
        toast.error(data?.message || "Something went wrong");
        return;
      }
      toast.success(data?.message || "Profile info updated successfully");
      queryClient.invalidateQueries({ queryKey: ["personal-information"] });
    }
  })

  function onSubmit(data: PersonalInfoFormValues) {
    console.log(data)
    mutate(data)
  }


  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl md:text-[22px] lg:text-[24px]  font-semibold leading-[120%] tracking-[0%] text-[#131313]">Personal Information</h2>
        <Button
          className="w-[124px] h-[39px] rounded-[8px] bg-primary dark:bg-black  hover:bg-black dark:border dark:border-primary dark:border-rounded hover:dark:bg-primary hover:text-white  dark:text-white transition-all duration-200 ease-in-out py-2 px-4 text-base font-extrabold uppercase text-white"
          onClick={form.handleSubmit(onSubmit)}
          disabled={isPending}
        >
         <SquarePen />  {isPending ? "Updating..." : "Update"}
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-7 lg:gap-[30px]">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base md:text-[17px] lg:text-lg  font-medium leading-[120%] tracking-[0%] text-[#131313] dark:text-white">First Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="w-full h-[56px] border border-[#645949] rounded-[8px] text-base font-normal  leading-[150%] tracking-[0%] text-[#131313] placeholder:text-[#616161] dark:text-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base md:text-[17px] lg:text-lg  font-medium leading-[120%] tracking-[0%] text-[#131313] dark:text-white">Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="w-full h-[56px] border border-[#645949] rounded-[8px] text-base font-normal  leading-[150%] tracking-[0%] text-[#131313] placeholder:text-[#616161] dark:text-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-7 lg:gap-[30px]">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base md:text-[17px] lg:text-lg  font-medium leading-[120%] tracking-[0%] text-[#131313] dark:text-white">Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} className="w-full h-[56px] border border-[#645949] rounded-[8px] text-base font-normal  leading-[150%] tracking-[0%] text-[#131313] placeholder:text-[#616161] dark:text-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base md:text-[17px] lg:text-lg  font-medium leading-[120%] tracking-[0%] text-[#131313] dark:text-white">Phone</FormLabel>
                  <FormControl>
                    <Input {...field} className="w-full h-[56px] border border-[#645949] rounded-[8px] text-base font-normal  leading-[150%] tracking-[0%] text-[#131313] placeholder:text-[#616161] dark:text-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-7 lg:gap-[30px]">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base md:text-[17px] lg:text-lg  font-medium leading-[120%] tracking-[0%] text-[#131313] dark:text-white">Country</FormLabel>
                  <FormControl>
                    <Input {...field} className="w-full h-[56px] border border-[#645949] rounded-[8px] text-base font-normal  leading-[150%] tracking-[0%] text-[#131313] placeholder:text-[#616161] dark:text-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base md:text-[17px] lg:text-lg  font-medium leading-[120%] tracking-[0%] text-[#131313] dark:text-white">City/State</FormLabel>
                  <FormControl>
                    <Input {...field} className="w-full h-[56px] border border-[#645949] rounded-[8px] text-base font-normal  leading-[150%] tracking-[0%] text-[#131313] placeholder:text-[#616161] dark:text-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="road"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base md:text-[17px] lg:text-lg  font-medium leading-[120%] tracking-[0%] text-[#131313] dark:text-white">Road/Area</FormLabel>
                <FormControl>
                   <Input {...field} className="w-full h-[56px] border border-[#645949] rounded-[8px] text-base font-normal  leading-[150%] tracking-[0%] text-[#131313] placeholder:text-[#616161] dark:text-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="postal_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base md:text-[17px] lg:text-lg  font-medium leading-[120%] tracking-[0%] text-[#131313] dark:text-white">Postal Code</FormLabel>
                <FormControl>
                  <Input {...field} className="w-full h-[56px] border border-[#645949] rounded-[8px] text-base font-normal  leading-[150%] tracking-[0%] text-[#131313] placeholder:text-[#616161] dark:text-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  )
}
