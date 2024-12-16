import connectToDB from "@/database";
import Voucher from "@/models/voucher";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectToDB();

    const extractAllVouchers = await Voucher.find({});

    if (extractAllVouchers) {
      return NextResponse.json({
        success: true,
        data: extractAllVouchers,
      });
    } else {
      return NextResponse.json({
        success: false,
        status: 204,
        message: "No Product found",
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
