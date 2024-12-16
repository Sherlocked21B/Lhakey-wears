import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Image,
  CardFooter,
  Button,
} from "@nextui-org/react";
import NextImage from "next/image";
import { LuTrash2 } from "react-icons/lu";
import { BiEditAlt } from "react-icons/bi";
import { useGlobalContext } from "@/context";
import {
  UseFieldArrayRemove,
  UseFieldArrayUpdate,
  UseFormSetValue,
} from "react-hook-form";
import ProductVariant from "../ModalButton/ProductVariant";
import { ProductType, ProductVariantType } from "@/lib/types";

export default function ProductVariantCard({
  variantDetail,
  removeVariant,
  updateVariant,
  index,
}: {
  variantDetail: ProductVariantType;
  removeVariant: UseFieldArrayRemove;
  updateVariant: UseFieldArrayUpdate<ProductType, "variants">;
  index: number;
}) {
  const { isMobile, setUpdateForm } = useGlobalContext();
  return (
    <Card className="py-4 px-2 w-full lg:w-2/5 max-w-[500px]">
      <CardHeader className="flex justify-between">
        <div className="flex gap-2">
          <h4 className="font-semibold">Color:</h4>
          <p className="capitalize">{variantDetail.color}</p>
        </div>
        {/* <div className="flex gap-2">
          <h4 className="font-semibold">Stock:</h4>
          <p className="capitalize">{variantDetail.stock}</p>
        </div> */}
      </CardHeader>
      <CardBody className="flex flex-col gap-5">
        <div className="w-full">
          <h4 className="font-semibold">Image Gallery:</h4>
          <div className=" w-full rounded-sm lg:py-2 min-h-[80px] flex px-2 gap-4 items-center justify-center">
            {variantDetail.imageGallery.map((imageLink, index) => (
              <Image
                key={imageLink}
                radius="sm"
                as={NextImage}
                src={imageLink}
                width={100}
                height={100}
                className="object-cover w-full aspect-square group-hover:scale-110"
                alt={`image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </CardBody>
      <CardFooter className="flex gap-4 justify-end pt-0">
        <ProductVariant
          icon={<BiEditAlt />}
          name="Edit"
          updateVariant={updateVariant}
          index={index}
          updateProductVariant={variantDetail}
        />

        <Button
          onClick={() => removeVariant(index)}
          size={isMobile ? "sm" : "md"}
          endContent={<LuTrash2 />}
          color="danger"
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
