import { ProductQADetailType, ProductReviewDetailType } from "@/lib/types";
import React from "react";
import { Tabs, Tab, Card, CardBody, Button } from "@nextui-org/react";
import CreateQuestion from "../Forms/CreateQuestion";
import QACard from "../Cards/QACard";
import ReviewCard from "../Cards/ReviewCard";
import CreateReviewButton from "../ModalButton/CreateReviewButton";

export default function ReviewsAndDescriptions({
  reviews,
  description,
  qas,
  productId,
}: {
  reviews?: ProductReviewDetailType[];
  description: string;
  qas?: ProductQADetailType[];
  productId: string;
}) {
  return (
    <div className="flex w-full flex-col gap-0 py-16">
      <Tabs
        className="w-full border-2 border-slate-500 py-1.5 rounded-t-md"
        variant="underlined"
        aria-label="Options"
      >
        <Tab
          className="m-0 p-0"
          key="photos"
          title={
            <div className="w-40">
              <span>Description</span>
            </div>
          }
        >
          <Card className="bg-slate-100 rounded-b-md rounded-t-none w-full shadow-none border-2 border-slate-500 bg-background mx-0 my-0">
            <CardBody className="p-[20px] h-[400px] overflow-auto">
              {description}
            </CardBody>
          </Card>
        </Tab>
        <Tab
          className="m-0 p-0"
          key="reviews"
          title={
            <div className="w-40">
              <span>Reviews</span>
            </div>
          }
        >
          <Card className="bg-slate-100 rounded-b-md rounded-t-none w-full shadow-none border-2 border-slate-500 bg-background mx-0 my-0">
            <CardBody className="p-[20px] h-[400px] overflow-auto flex flex-col">
              <div className="w-full flex justify-end">
                <CreateReviewButton productId={productId} name="Add a Review" />
              </div>
              {reviews?.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </CardBody>
          </Card>
        </Tab>
        <Tab
          className="m-0 p-0"
          key="qas"
          title={
            <div className="w-40">
              <span>Q&As</span>
            </div>
          }
        >
          <Card className="bg-slate-100 rounded-b-md rounded-t-none w-full shadow-none border-2 border-slate-500 bg-background mx-0 my-0">
            <CardBody className="p-[20px] h-[400px] overflow-auto">
              <CreateQuestion productId={productId} />
              <div className="flex flex-col divide-y-2">
                {qas?.map((qa) => (
                  <QACard key={qa._id} qa={qa} />
                ))}
              </div>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
