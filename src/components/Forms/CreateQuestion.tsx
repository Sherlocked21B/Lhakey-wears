"use client";
import { addProductQA } from "@/services/productQA";
import { Button, Input } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function CreateQuestion({ productId }: { productId: string }) {
  const session = useSession();
  const userId = session.data?.user?.id;
  const router = useRouter();

  const [question, setQuestion] = useState("");
  const [buttonLoader, setButtonLoader] = useState(false);

  const handleSubmitQuestion = async () => {
    if (question.length < 10) {
      toast.error("Question must be at least 10 characters");
      return;
    }
    if (!userId) {
      toast.error("Please login to ask a question");
      router.push("/signin");
      return;
    }
    setButtonLoader(true);
    const data = { productId: productId, userId: userId, question };
    const res = await addProductQA(data);

    if (res.success) {
      toast.success(res.message);
      setQuestion("");
      router.refresh();
    } else {
      toast.error(res.message);
    }
    setButtonLoader(false);
  };
  return (
    <div className="flex gap-4">
      <Input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        variant="bordered"
        placeholder="Ask a Question"
      />
      <Button
        isLoading={buttonLoader}
        onClick={() => handleSubmitQuestion()}
        className="bg-brand">
        Ask a Question
      </Button>
    </div>
  );
}
