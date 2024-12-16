import connectToDB from "@/database";
import { NextRequest, NextResponse } from "next/server";
import Currency from "@/models/currency";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest) {
  try {
    await connectToDB();
    console.log("update api called");

    const data = await req.json();
    console.log("update api data:", data);

    const filter = {}; // Match all documents (or specify criteria)
    const update = {
      timestamp: new Date(),
      rates: data,
    };

    const options = { upsert: true, new: true }; // Create a new document if no document matches the filter

    await Currency.updateOne(filter, update, options);
    console.log("Data inserted/updated successfully");
    return NextResponse.json({
      success: true,
      message: "Data inserted/updated successfully",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong! Please try again",
    });
  }
}
