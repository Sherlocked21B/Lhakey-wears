import connectToDB from "@/database";
import { ProductSchema } from "@/lib/schemas";
import { getTotalStock } from "@/lib/utils";
import Product from "@/models/product";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const extractedData = await req.json();
    const { slug } = extractedData;

    //validate the schema
    const result = ProductSchema.safeParse(extractedData);

    if (!result.success) {
      console.log(result.error.message);
      return NextResponse.json({
        success: false,
        // message: JSON.parse(result.error.message)[0].message,
        message: JSON.stringify(result.error.message),
      });
    }
    let safeData = result.data;

    const existingSlugs = await Product.find({
      slug: { $regex: `^${slug}(-[0-9])*$`, $options: "i" },
    });

    if (existingSlugs.length > 0) {
      safeData = { ...safeData, slug: `${slug}-${existingSlugs.length}` };
    }

    const newlyCreatedProduct = await Product.create(safeData);

    if (newlyCreatedProduct) {
      return NextResponse.json({
        success: true,
        message: "Product added successfully.",
      });
    }
  } catch (error) {
    console.log("Error while adding new product. Please try again");

    return NextResponse.json({
      success: false,
      message: "Something went wrong ! Please try again later",
    });
  }
}
