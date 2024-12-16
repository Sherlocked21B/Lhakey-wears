import connectToDB from "@/database";
import Voucher from "@/models/voucher";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectToDB();
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    if (!code)
      return NextResponse.json({
        success: false,
        message: "Voucher Code is required",
      });
    const voucherCode = await Voucher.findOne({ code: code });
    if (voucherCode) {
      return NextResponse.json({
        success: true,
        message: "Voucher Redeemed Successfully",
        data: voucherCode,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Voucher not found",
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
