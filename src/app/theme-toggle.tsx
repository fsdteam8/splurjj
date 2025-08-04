"use client";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import React from "react";
import { FaMoon, FaSun } from "react-icons/fa";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div className="">
      <Button
        variant="outline"
        size="icon"
        className="rounded-full bg-black dark:bg-gray-300"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        <FaSun className="text-white dark:text-black absolute h-6 md:h-8 lg:h-10 w-6 md:w-8 lg:w-10 rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
        <FaMoon className="text-black dark:text-black absolute h-6 md:h-8 lg:h-10 w-6 md:w-8 lg:w-10 rotate-90 scale-0 dark:-rotate-0 dark:scale-100" />
      </Button>
    </div>
  );
};

export default ThemeToggle;
