import Image from "next/image";
import React from "react";

export default function MaintenancePage() {
  return (
    <div className="bg-[url('../../public/background.jpg')] w-full h-svh bg-cover flex flex-col justify-around items-center">
      <Image
        src={"/maintenance-logo.png"}
        height={300}
        width={300}
        alt="lakhey-logo"
        className="w-1/3 lg:w-[150px] h-auto"
      />
      <div className="flex flex-col gap-4 w-full items-center">
        <Image
          src={"/Under.png"}
          height={300}
          width={300}
          alt="lakhey-logo"
          className="w-2/5 lg:w-[350px] "
        />
        <Image
          src={"/maintenance.png"}
          height={300}
          width={300}
          alt="lakhey-logo"
          className="w-4/5 lg:w-[350px] "
        />
        {/* <Image
          src={"/undermaintenance.png"}
          height={300}
          width={1000}
          alt="lakhey-logo"
          className="hidden lg:w-[1000px]"
        /> */}
      </div>
      <Image
        src={"/scratch.png"}
        height={300}
        width={300}
        alt="lakhey-logo"
        className="bg-blend-lighten lg:w-[1000px] h-auto"
      />
      <div className="">
        <Image
          src={"/social.png"}
          height={300}
          width={300}
          alt="lakhey-logo"
          className="w-[200px] lg:w-[250px] h-auto"
        />
      </div>
    </div>
  );
}
