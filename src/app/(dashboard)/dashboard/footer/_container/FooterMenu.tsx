"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  itemLink1: z.string().min(1, "Item Link is required"),
  itemLink2: z.string().min(1, "Item Link is required"),
  itemLink3: z.string().min(1, "Item Link is required"),
  itemLink4: z.string().min(1, "Item Link is required"),
  item1: z.string().min(1, "Item Name is required"),
  item2: z.string().min(1, "Item Name is required"),
  item3: z.string().min(1, "Item Name is required"),
  item4: z.string().min(1, "Item Name is required"),
});

export function FooterMenu() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemLink1: "",
      itemLink2: "",
      itemLink3: "",
      itemLink4: "",
      item1: "",
      item2: "",
      item3: "",
      item4: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="py-10">
      <div className="p-8 bg-white rounded-lg shadow-lg ">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="grid grid-cols-1 md:grid-cols-2 gap-[30px]"
              >
                <FormField
                  control={form.control}
                  name={`item${i}` as keyof z.infer<typeof formSchema>}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-normal  text-[#212121]">
                        Item Name {i}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={`Item ${i}`}
                          {...field}
                          className="h-[51px] border border-[#595959] placeholder:text-[#595959] text-[#212121]  font-normal text-base rounded-[8px]"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm font-medium" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`itemLink${i}` as keyof z.infer<typeof formSchema>}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-normal  text-[#212121]">
                        Item Link {i}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={`https://www.example.com/item-${i}`}
                          {...field}
                          className="h-[51px] border border-[#595959] placeholder:text-[#595959] text-[#212121]  font-normal text-base rounded-[8px]"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm font-medium" />
                    </FormItem>
                  )}
                />
              </div>
            ))}

            <div className="flex justify-center items-center pt-5">
              <Button
                size="lg"
                type="submit"
                className="py-3 px-10 rounded-lg bg-primary text-white font-semibold text-lg"
              >
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
