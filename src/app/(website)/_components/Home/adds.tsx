import Image from "next/image";
import React from "react";

function Adds() {
  return (
    <div className="">
        <Image
          src="/assets/images/adds.png"
          alt="blog1"
          width={2600}
          height={300}
          className="w-full h-[300px] object-cover"
        />
    </div>
  );
}

export default Adds;
