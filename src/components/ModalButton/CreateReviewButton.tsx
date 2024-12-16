import React from "react";
import {
  Modal,
  ModalContent,
  Button,
  useDisclosure,
  VariantProps,
} from "@nextui-org/react";
import { useGlobalContext } from "@/context";
import CreateProductVariant from "../Forms/CreateProductVariant";
import { UseFieldArrayUpdate } from "react-hook-form";
import {
  ProductReviewDetailType,
  ProductType,
  ProductVariantType,
} from "@/lib/types";
import CreateReview from "../Forms/CreateReview";
import { cn } from "@/lib/utils";

export default function CreateReviewButton({
  name,
  updateReview,
  productId,
  variant,
  className,
}: {
  name: string;
  productId: string;
  updateReview?: ProductReviewDetailType;
  variant?: VariantProps<typeof Button>["variant"];
  className?: string;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const finalReview = {
    ...updateReview,
    user: updateReview?.user._id as string,
    product: productId,
    rating: updateReview?.rating as number,
    comment: updateReview?.comment as string,
  };
  const handleOpen = () => {
    onOpen();
  };

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button
          size="sm"
          onPress={handleOpen}
          variant={variant || "bordered"}
          className={cn(
            "border-brand text-brand hover:text-background hover:bg-brand",
            className
          )}
        >
          {name}
        </Button>
      </div>
      <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <CreateReview
              onClose={onClose}
              productId={productId}
              updateReview={finalReview}
            />
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
