import connectToDB from "@/database";
import { ProductQASchema, ProductSchema } from "@/lib/schemas";
import { getTotalStock } from "@/lib/utils";
import Product from "@/models/product";
import ProductQA from "@/models/productqa";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const extractedData = await req.json();
    const currentDate = new Date().toString();
    console.log(currentDate);

    const finalData = { ...extractedData, questionCreatedAt: currentDate };

    //validate the schema
    const result = ProductQASchema.safeParse(finalData);

    if (!result.success) {
      console.log(result.error.message);
      return NextResponse.json({
        success: false,
        // message: JSON.parse(result.error.message)[0].message,
        message: JSON.stringify(result.error.message.split("\n")[0]),
      });
    }
    const safeData = result.data;

    const newlyCreatedProductQA = await ProductQA.create(safeData);

    if (newlyCreatedProductQA) {
      return NextResponse.json({
        success: true,
        message: "Question submitted successfully...",
      });
    }
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      success: false,
      message: "Something went wrong ! Please try again later",
    });
  }
}
