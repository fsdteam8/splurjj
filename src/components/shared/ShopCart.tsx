import React from "react";
import { ShopDataType } from "../data/ShopData";
import Image from "next/image";
import { RiShareForwardLine } from "react-icons/ri";
import { TbTargetArrow } from "react-icons/tb";
import { FaRegCommentDots } from "react-icons/fa";

const ShopCart = ({ shop }: { shop: ShopDataType }) => {
  return (
    <div>
      <div>
        <Image
          src={shop?.image}
          alt={shop?.title}
          width={306}
          height={306}
          className="w-full h-[306px] object-cover rounded-t-[8px] "
        />
      </div>
      <div className="flex items-center justify-between pt-3 md:pt-4 pb-2">
        <div className="flex items-center gap-2">
          <span>
            <RiShareForwardLine className="w-6 h-6 text-black" />
          </span>
          <span>
            <TbTargetArrow className="w-6 h-6 text-black" />
          </span>
          <span>
            <FaRegCommentDots className="w-6 h-6 text-black" />
          </span>
        </div>
        <button className="text-sm font-bold  leading-[120%] tracking-[0%] text-white uppercase py-[6px] px-[12px] bg-[#0253F7] rounded-[4px]">
          ADD TO CART
        </button>
      </div>
      <h4 className="text-lg md:text-xl  font-semibold leading-[120%] tracking-[0%] text-[#131313]">
        {shop?.title}
      </h4>
      <p className="text-base  font-normal leading-[150%] tracking-[0%] text-[#424242] py-2">
        {shop?.desc}
      </p>
      <div className="flex items-center gap-1">
        <span className="text-lg md:text-xl  font-semibold leading-[120%] tracking-[0%] text-[#0253F7]">
          {shop?.price}
        </span>{" "}
        <span className="text-lg md:text-xl font-semibold  leading-[120%] tracking-[0%] text-[#424242]">
          NEW
        </span>
      </div>
    </div>
  );
};

export default ShopCart;
