import { ProductQADetailType } from "@/lib/types";
import { cn, compareTimes, timeAgo, timeWithin } from "@/lib/utils";
import { deleteProductQA, updateProductQA } from "@/services/productQA";
import { Button, Input } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { TbMessageCircle } from "react-icons/tb";
import { toast } from "react-toastify";

// { qa }: { qa: ProductQAType }
export default function QACard({ qa }: { qa: ProductQADetailType }) {
  const session = useSession();
  const user = session.data?.user;
  console.log("QACard user: ", session);
  const router = useRouter();

  const [question, setQuestion] = useState(qa?.question);
  const [answer, setAnswer] = useState(qa.answer ? qa.answer : "");
  const [questionInputDisabled, setQuestionInputDisabled] = useState(true);
  const [answerInputDisabled, setAnswerInputDisabled] = useState(
    qa.answer ? true : false
  );
  const [isUpdateAnswer, setIsUpdateAnswer] = useState(
    qa.answer ? true : false
  );
  const [questionSubmitLoader, setQuestionSubmitLoader] = useState(false);
  const [answerSubmitLoader, setAnswerSubmitLoader] = useState(false);
  const [deleteButtonLoader, setDeleteButtonLoader] = useState(false);

  async function handleSubmitQuestion() {
    setQuestionSubmitLoader(true);
    if (question === qa?.question) {
      toast.error("Question cannot be same as previous question");
      setQuestionSubmitLoader(false);
      return;
    }
    if (question.length < 10) {
      toast.error("Question must be at least 10 characters");
      setQuestionSubmitLoader(false);
      return;
    }
    const formData = {
      ...qa,
      question,
      userId: user?.id as string,
      questionUpdatedAt: new Date().toString(),
    };
    const res = await updateProductQA(formData);
    console.log(res);
    if (res.success) {
      toast.success(res.message);
      setQuestionInputDisabled(true);
      router.refresh();
    } else {
      toast.error(res.message);
    }
    setQuestionSubmitLoader(false);
  }

  async function handleSubmitAnswer() {
    setAnswerSubmitLoader(true);
    let formData = {
      ...qa,
      answer: answer,
      userId: qa.userId._id as string,
    };
    isUpdateAnswer
      ? (formData = { ...formData, answerUpdatedAt: new Date().toString() })
      : (formData = { ...formData, answerCreatedAt: new Date().toString() });
    const res = await updateProductQA(formData);
    console.log(res);
    if (res.success) {
      toast.success(res.message);
      setAnswerInputDisabled(true);
      router.refresh();
    } else {
      toast.error(res.message);
    }
    setAnswerSubmitLoader(false);
  }

  async function handleDeleteQA() {
    setDeleteButtonLoader(true);
    const res = await deleteProductQA(qa._id);
    if (res.success) {
      toast.success(res.message);
      router.refresh();
    } else {
      toast.error(res.message);
    }
    setDeleteButtonLoader(false);
  }

  return (
    <>
      {qa && (
        <div className="flex flex-col gap-4 p-4 pr-0.5 w-full">
          <div className="flex gap-4">
            <div className="flex justify-center items-center relative text-brand">
              <TbMessageCircle className="size-8" />
              <span className="absolute text-xs font-black">Q</span>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <div className="flex gap-4 items-center">
                <Input
                  type="text"
                  variant="bordered"
                  fullWidth
                  disabled={questionInputDisabled}
                  value={question}
                  classNames={{
                    inputWrapper:
                      questionInputDisabled && "border-0 shadow-none p-0",
                  }}
                  onChange={(e) => setQuestion(e.target.value)}
                />
                {session.status === "authenticated" && user && (
                  <>
                    {user.id === qa.userId?._id && !qa.answer && (
                      <>
                        {questionInputDisabled && (
                          <Button
                            onClick={() => setQuestionInputDisabled(false)}
                            size="sm"
                            className="bg-brand text-white"
                          >
                            Edit
                          </Button>
                        )}
                        {!questionInputDisabled && (
                          <Button
                            isLoading={questionSubmitLoader}
                            className="bg-brand text-white"
                            onClick={handleSubmitQuestion}
                            size="sm"
                          >
                            Submit
                          </Button>
                        )}
                      </>
                    )}
                    {(user.role === "admin" || user.role === "super-admin") && (
                      <Button
                        isLoading={deleteButtonLoader}
                        onClick={handleDeleteQA}
                        size="sm"
                        color="danger"
                      >
                        Delete
                      </Button>
                    )}
                  </>
                )}
              </div>
              <span className="flex text-xs">
                <p className="capitalize font-medium">{qa.userId?.name}</p>
                {" - "}
                {timeAgo(
                  qa.questionUpdatedAt
                    ? qa.questionUpdatedAt
                    : qa.questionCreatedAt
                )}
              </span>
            </div>
          </div>
          {qa.answer && qa.answerCreatedAt ? (
            <div className="flex gap-4">
              <div className="flex justify-center items-center relative text-success">
                <TbMessageCircle className="size-8" />
                <span className="absolute text-xs font-black">A</span>
              </div>
              <div className="w-full">
                <div className="w-full flex gap-4">
                  <Input
                    type="text"
                    variant="bordered"
                    fullWidth
                    disabled={answerInputDisabled}
                    value={answer}
                    classNames={{
                      inputWrapper:
                        answerInputDisabled && "border-0 shadow-none p-0",
                    }}
                    onChange={(e) => setAnswer(e.target.value)}
                  />
                  {session.status === "authenticated" &&
                    user &&
                    (user.role === "admin" || user.role === "super-admin") && (
                      <>
                        {answerInputDisabled && (
                          <Button
                            onClick={() => setAnswerInputDisabled(false)}
                            size="sm"
                            color="success"
                          >
                            Edit
                          </Button>
                        )}
                        {!answerInputDisabled && (
                          <Button
                            isLoading={answerSubmitLoader}
                            color="success"
                            onClick={handleSubmitAnswer}
                            size="sm"
                          >
                            Submit
                          </Button>
                        )}
                      </>
                    )}
                </div>
                <p className="text-xs">
                  {qa.answerUpdatedAt
                    ? qa.questionUpdatedAt
                      ? compareTimes(qa.answerUpdatedAt, qa.questionUpdatedAt)
                        ? timeWithin(qa.answerUpdatedAt, qa.questionUpdatedAt)
                        : null
                      : timeWithin(qa.answerUpdatedAt, qa.questionCreatedAt)
                    : qa.questionUpdatedAt
                    ? timeWithin(qa.answerCreatedAt, qa.questionUpdatedAt)
                    : timeWithin(qa.answerCreatedAt, qa.questionCreatedAt)}
                </p>
              </div>
            </div>
          ) : user?.role === "admin" || user?.role === "super-admin" ? (
            <div className="flex gap-4 w-full">
              <div className="flex justify-center items-center relative text-success">
                <TbMessageCircle className="size-8" />
                <span className="absolute text-xs font-black">A</span>
              </div>
              <div className="flex gap-4 flex-grow w-1 items-center">
                <Input
                  fullWidth
                  variant="bordered"
                  placeholder="Answer the Question"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />
                <Button
                  size="sm"
                  isLoading={answerSubmitLoader}
                  onClick={handleSubmitAnswer}
                  color="success"
                >
                  Submit Answer
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </>
  );
}
