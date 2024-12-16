import { ProductReviewDetailType } from "@/lib/types";
import { extractNameFromEmail, formatDate, getInitials } from "@/lib/utils";
import { Rating } from "@mui/material";
import { Avatar, Button } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import CreateReviewButton from "../ModalButton/CreateReviewButton";
import { deleteProductReview } from "@/services/productReview";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function ReviewCard({
  review,
}: {
  review: ProductReviewDetailType;
}) {
  const session = useSession();
  const user = session.data?.user;
  const router = useRouter();
  const [deleteButtonLoader, setDeleteButtonLoader] = React.useState(false);

  async function handleDeleteReview() {
    setDeleteButtonLoader(true);
    const res = await deleteProductReview(review._id);
    if (res.success) {
      toast.success(res.message);
      router.refresh();
    } else {
      toast.error(res.message);
    }
    setDeleteButtonLoader(false);
  }
  return (
    <div className="flex p-4 gap-6">
      <Avatar
        className="mt-4"
        src={review.user.image}
        name={review.user.name || getInitials(review.user.email as string)}
        isBordered
      />
      <div className="flex flex-col gap-1 w-1 flex-grow">
        <div className="w-full flex justify-between">
          <p className="font-semibold capitalize">
            {review.user.name ||
              extractNameFromEmail(review.user.email as string)}
          </p>
          <div className="flex gap-4">
            {session.status === "authenticated" &&
              user &&
              user.id === review.user._id && (
                <CreateReviewButton
                  productId={review.product}
                  updateReview={review}
                  name="Edit"
                  variant="solid"
                  className="bg-brand text-white"
                />
              )}
            {session.status === "authenticated" &&
              user &&
              (user.role === "admin" ||
                user.role === "super-admin" ||
                user.id === review.user._id) && (
                <Button
                  isLoading={deleteButtonLoader}
                  size="sm"
                  color="danger"
                  onClick={handleDeleteReview}
                >
                  Delete
                </Button>
              )}
          </div>
        </div>
        <Rating
          name="product rating"
          value={review.rating}
          precision={0.5}
          readOnly
          size="small"
          className="-ml-1"
        />
        <p className="text-sm font-medium">{review.comment}</p>
        <p className="text-sm text-default-500">
          {formatDate(review.createdAt)}
        </p>
        <div className="flex gap-4 w-full overflow-auto">
          {review.imageGallery?.map((item, index) => (
            <Image
              className="w-[100px] h-[100px] object-cover rounded-md shadow-md"
              key={index}
              src={item}
              height={100}
              width={100}
              alt={`image-${index}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
