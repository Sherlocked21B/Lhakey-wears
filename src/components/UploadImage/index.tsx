"use client";
import React, { useEffect, useState } from "react";
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { PiTrashBold } from "react-icons/pi";
import { Button, Image, Tooltip } from "@nextui-org/react";
import NextImage from "next/image";
import { MdUpload } from "react-icons/md";
import { motion, AnimatePresence, animate } from "framer-motion";
import { cn } from "@/lib/utils";
import { UseFormSetValue } from "react-hook-form";
import { ProductType } from "@/lib/types";

export default function UploadGallery({
  name,
  gallery,
  isMultiple,
  setValue,
  formName,
}: {
  formName: string;
  name: string;
  gallery: string[];
  isMultiple: boolean;
  setValue: UseFormSetValue<any>;
}) {
  const [images, setImages] = useState(gallery);

  const handleRemove = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number
  ) => {
    e.preventDefault();
    if (images) {
      const updatedImages = [...images];
      // Remove the image at the specified index
      updatedImages.splice(index, 1);
      // Update the state with the new array
      setImages(updatedImages);
    }
  };

  useEffect(() => {
    if (isMultiple) {
      setValue(formName, images);
    } else {
      setValue(formName, images[0] || "");
    }
  }, [images]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative flex gap-4 h-[240px] items-center justify-center border-2 border-slate-300 rounded-sm">
        <h2 className="absolute bg-background -top-3 left-4 px-1">{name}*</h2>
        <div className="flex gap-2 overflow-x-auto pb-6">
          <AnimatePresence>
            {images?.map((imagelink, index) => (
              <motion.div
                key={imagelink}
                className="flex flex-col items-center gap-4 "
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 1 } }}
                exit={{ opacity: 0 }}>
                <div
                  className={` relative flex justify-center items-center group hover:backdrop-blur-md
                ${isMultiple ? "h-[100px] w-[100px]" : "h-[200px] w-[200px]"}`}>
                  <Image
                    priority
                    radius="sm"
                    as={NextImage}
                    shadow="sm"
                    width={isMultiple ? 100 : 200}
                    height={isMultiple ? 100 : 200}
                    alt={`product image ${index}`}
                    className={cn(
                      "object-cover w-full h-auto aspect-square group-hover:brightness-50"
                    )}
                    src={imagelink}
                  />

                  <motion.div
                    whileHover={{
                      rotate: [
                        "0deg",
                        "30deg",
                        "-30deg",
                        "30deg",
                        "-30deg",
                        "0deg",
                      ],
                    }}
                    className="absolute z-20 hidden group-hover:block">
                    <Tooltip content="Remove Image">
                      <button
                        className="peer"
                        onClick={(e) => handleRemove(e, index)}>
                        <PiTrashBold className="text-2xl text-danger" />
                      </button>
                    </Tooltip>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      <CldUploadWidget
        options={{
          sources: ["local"],
          resourceType: "image",
          multiple: isMultiple,
        }}
        uploadPreset="lakheyPreset"
        onSuccess={(result) => {
          const resultInfo = result.info as CloudinaryUploadWidgetInfo;
          setImages((prev: any) => [...prev, resultInfo.secure_url]);
        }}>
        {({ open }) => {
          function handleOnClick() {
            open();
          }
          return (
            <Button
              disabled={!isMultiple && images.length > 0}
              onClick={handleOnClick}
              className="disabled:cursor-not-allowed w-fit mx-auto"
              endContent={<MdUpload className="text-lg" />}>
              Upload
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}
