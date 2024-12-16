import { Rating, TextField } from "@mui/material";
import { Button, Input, ModalBody, ModalHeader } from "@nextui-org/react";
import React from "react";
import UploadGallery from "../UploadImage";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { defaultProductReview } from "@/lib/default";
import {
  addProductReview,
  updateProductReview,
} from "@/services/productReview";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { ProductReviewType } from "@/lib/types";

export default function CreateReview({
  onClose,
  productId,
  updateReview,
}: {
  onClose: () => void;
  productId: string;
  updateReview?: ProductReviewType;
}) {
  const session = useSession();
  const user = session.data?.user;
  const [submitButtonLoader, setSubmitButtonLoader] = React.useState(false);
  const router = useRouter();

  const { register, watch, setValue, handleSubmit } = useForm({
    defaultValues: updateReview ? updateReview : defaultProductReview,
  });

  async function onSubmit(data: any) {
    let res;
    setSubmitButtonLoader(true);
    if (updateReview) {
      res = await updateProductReview(data);
    } else {
      const formdata = { ...data, user: user?.id, product: productId };
      res = await addProductReview(formdata);
    }
    if (res.success) {
      toast.success(res.message);
      router.refresh();
      onClose();
    } else {
      toast.error(res.message);
    }
    setSubmitButtonLoader(false);
  }

  return (
    <>
      <ModalHeader>Create Review</ModalHeader>
      <ModalBody>
        <form className="flex flex-col gap-4">
          <TextField
            rows={4}
            multiline
            label="Comment"
            {...register("comment")}
          />
          <Rating
            value={watch("rating")}
            precision={0.5}
            onChange={(e) =>
              setValue("rating", Number((e.target as HTMLInputElement).value))
            }
          />
          <UploadGallery
            isMultiple={true}
            formName="imageGallery"
            name="Upload Images"
            gallery={updateReview?.imageGallery || []}
            setValue={setValue}
          />
          <Button
            isLoading={submitButtonLoader}
            onClick={handleSubmit(onSubmit)}
          >
            Submit
          </Button>
        </form>
      </ModalBody>
    </>
  );
}
