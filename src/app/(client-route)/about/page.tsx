import { poppinsBold } from "@/app/layout";
import Image from "next/image";
import React from "react";

export default function About() {
  return (
    <div>
      <div className="flex justify-center items-center p-20 bg-[url('/aboutbanner.jpg')] text-white text-3xl font-semibold">
        ABOUT US
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-10 my-container">
        <div className={`${poppinsBold.className} flex  lg:min-w-[388px]`}>
          <p className="outlined-text absolute translate-y-24 translate-x-[7rem] z-20 hidden lg:block">
            ABOUT LAKHEY
          </p>
          <p className="unoutlined-text absolute translate-y-24 translate-x-[7rem] z-0 hidden lg:block">
            ABOUT LAKHEY
          </p>
          <Image
            src={"/about.png"}
            width={388}
            height={776}
            alt="about image"
            className="lg:w-[388px] lg:h-[776px] object-cover z-10"
          />
        </div>
        <div className="flex flex-col gap-4 pt-4 lg:pt-80">
          <h3 className="text-xl lg:text-3xl font-semibold">Our Story</h3>
          <p className="lg:text-lg text-justify pb-10">
            Since 2021, LAKHEY has epitomized cutting-edge style. Its
            intellectual universe seamlessly blends concept, structure, and
            image, transcending mere trends. LAKHEY endeavors to craft garments
            that are not only functional but also aesthetically pleasing, all
            while maintaining affordability. Influential, innovative, and
            progressive, LAKHEY is spearheading a complete modernization of the
            fashion landscape.
          </p>
        </div>
      </div>
    </div>
  );
}
