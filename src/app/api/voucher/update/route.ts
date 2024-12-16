import connectToDB from "@/database";
import { NextRequest, NextResponse } from "next/server";
import Voucher from "@/models/voucher";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest) {
  try {
    await connectToDB();

    const extractData = await req.json();

    let {
      _id,
      code,
      discount,
      start,
      category,
      expiry,
      minimumAmount,
      maximumDiscount,
      totalVoucher,
    } = extractData;

    const updateProduct = await Voucher.findOneAndUpdate(
      {
        _id: _id,
      },
      {
        code,
        discount,
        start,
        category,
        expiry,
        minimumAmount,
        maximumDiscount,
        totalVoucher,
      },
      { new: true }
    );

    if (updateProduct) {
      return NextResponse.json({
        success: true,
        message: "Voucher updated successfully",
      });
    } else {
      console.log(updateProduct);
      return NextResponse.json({
        success: false,
        message: "Failed to update the voucher! Please try again",
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
