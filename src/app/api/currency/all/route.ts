import connectToDB from "@/database";
import Currency from "@/models/currency";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectToDB();

    const extractAllCurrency = await Currency.find({});

    if (extractAllCurrency) {
      return NextResponse.json({
        success: true,
        data: extractAllCurrency,
      });
    } else {
      return NextResponse.json({
        success: false,
        status: 204,
        message: "No Currency found",
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
