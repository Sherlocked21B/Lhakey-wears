import connectToDB from "@/database";
import { VoucherSchema } from "@/lib/schemas";
import Voucher from "@/models/voucher";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const {
      code,
      discount,
      start,
      category,
      expiry,
      minimumAmount,
      maximumDiscount,
      totalVoucher,
    } = await req.json();

    //validate the schema

    const result = VoucherSchema.safeParse({
      code,
      discount,
      start,
      category,
      expiry,
      minimumAmount,
      maximumDiscount,
      totalVoucher,
    });

    if (!result.success) {
      console.log(result.error.message);
      return NextResponse.json({
        success: false,
        message: JSON.parse(result.error.message)[0].message,
      });
    }

    //check if the user is exists or not

    const voucherAlreadyExists = await Voucher.findOne({ code });

    if (voucherAlreadyExists) {
      return NextResponse.json({
        success: false,
        message: "Voucher Code already exists. Please try with different code.",
      });
    } else {
      const newVoucher = await Voucher.create({
        code,
        discount,
        start,
        category,
        expiry,
        minimumAmount,
        maximumDiscount,
        totalVoucher,
      });

      if (newVoucher) {
        return NextResponse.json({
          success: true,
          message: "Voucher created successfully.",
        });
      }
    }
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      success: false,
      message: "Something went wrong ! Please try again later",
    });
  }
}
