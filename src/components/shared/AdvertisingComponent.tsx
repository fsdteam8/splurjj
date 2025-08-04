import React from "react";

type AdvertisingProps = {
  heading: string;
  img: string;
};

const AdvertisingComponent = ({ heading, img }: AdvertisingProps) => {
  return (
    <div
      style={{ backgroundImage: `url(${img})` }}
      className="w-full h-[230px] bg-cover bg-center bg-no-repeat flex items-center justify-center"
    >
      <h2 className="text-3xl md:text-[42px] lg:text-[56px] font-extrabold  leading-[120%] tracking-[0%] uppercase text-primary">
        {heading}
      </h2>
    </div>
  );
};

export default AdvertisingComponent;
