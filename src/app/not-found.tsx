"use client";

import Link from "next/link";
import React from "react";
import "./globals.css";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center  bg-black  h-screen">
      <div
        className="text-center p-10 rounded-lg w-[500px] h-[400px] flex flex-col items-center justify-end"
        style={{
          backgroundImage: `url(/assets/images/404.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Link href="/" className="mt-6 inline-block text-black underline bg-white p-2 rounded">
          Return Home
        </Link>
      </div>
    </div>
  );
}
