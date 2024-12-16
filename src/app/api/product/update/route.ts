import Product from "@/models/product";
import connectToDB from "@/database";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest) {
  try {
    await connectToDB();
    const extractData = await req.json();
    console.log(extractData);

    let {
      _id,
      name,
      slug,
      description,
      price,
      gender,
      category,
      season,
      onSale,
      discountPercentage,
      discountLabel,
      imageUrl,
      sizeImageUrl,
      variants,
      reviews,
      metaTitle,
      metaDescription,
    } = extractData;

    const existingSlugs = await Product.find({
      slug: { $regex: `^${slug}(-[0-9])*$`, $options: "i" },
    });

    if (existingSlugs.length > 1) {
      slug = `${slug}-${existingSlugs.length}`;
    }

    const updateProduct = await Product.findOneAndUpdate(
      {
        _id: _id,
      },
      {
        name,
        slug,
        description,
        price,
        gender,
        category,
        season,
        onSale,
        discountPercentage,
        discountLabel,
        imageUrl,
        sizeImageUrl,
        variants,
        reviews,
        metaTitle,
        metaDescription,
      },
      { new: true }
    );

    if (updateProduct) {
      return NextResponse.json({
        success: true,
        message: "Product updated successfully",
      });
    } else {
      console.log(updateProduct);
      return NextResponse.json({
        success: false,
        message: "Failed to update the product! Please try again",
      });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong! Please try again",
    });
  }
}
