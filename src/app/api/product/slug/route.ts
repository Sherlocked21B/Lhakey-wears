// import connectToDB from "@/database";
// import Product from "@/models/product";
// import { NextRequest, NextResponse } from "next/server";
// require("@/models/productqa");

// export const dynamic = "force-dynamic";

// export async function GET(req: NextRequest) {
//   try {
//     await connectToDB();
//     const { searchParams } = new URL(req.url);
//     const slug = searchParams.get("slug");
//     if (!slug)
//       return NextResponse.json({
//         success: false,
//         message: "Product Slug is required",
//       });
//     const slugProducts = await Product.find({ slug: slug }).populate("qas");
//     if (slugProducts) {
//       return NextResponse.json({
//         success: true,
//         data: slugProducts,
//       });
//     } else {
//       return NextResponse.json({
//         success: false,
//         message: "Product not found",
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json({
//       success: false,
//       message: "Something went wrong! Please try again",
//     });
//   }
// }

import connectToDB from "@/database";
import Product from "@/models/product";
import { NextRequest, NextResponse } from "next/server";

require("@/models/productqa"); // Ensure this is required to register the model

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectToDB();
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({
        success: false,
        message: "Product Slug is required",
      });
    }

    const slugProducts = await Product.find({ slug })
      .populate({
        path: "qas",
        populate: { path: "userId", model: "User" },
      })
      .populate({
        path: "reviews",
        populate: { path: "user", model: "User" },
      });

    if (slugProducts) {
      return NextResponse.json({
        success: true,
        data: slugProducts,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Product not found",
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong! Please try again",
    });
  }
}
