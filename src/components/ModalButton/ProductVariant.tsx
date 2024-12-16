import React from "react";
import { Modal, ModalContent, Button, useDisclosure } from "@nextui-org/react";
import { useGlobalContext } from "@/context";
import CreateProductVariant from "../Forms/CreateProductVariant";
import { UseFieldArrayUpdate } from "react-hook-form";
import { ProductType, ProductVariantType } from "@/lib/types";

export default function ProductVariant({
  name,
  icon,
  updateVariant,
  index,
  updateProductVariant,
}: {
  updateVariant: UseFieldArrayUpdate<ProductType, "variants">;
  index: number;
  name: string;
  icon: React.ReactNode;
  updateProductVariant?: ProductVariantType;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleOpen = () => {
    onOpen();
  };
  const { isMobile } = useGlobalContext();

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button
          size={isMobile ? "sm" : "md"}
          color="primary"
          onPress={() => handleOpen()}
          endContent={icon}
          className="capitalize"
        >
          {name}
        </Button>
      </div>
      <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <CreateProductVariant
              index={index}
              updateVariant={updateVariant}
              onClose={onClose}
              updateProductVariant={updateProductVariant}
            />
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
