import { ProductVariantType } from "./../../../../lib/types";
import connectToDB from "@/database";
import {
  generateSignature,
  getTotalPrice,
  getVoucherDiscount,
} from "@/lib/utils";
import Cart from "@/models/cart";
import Order from "@/models/order";
import Product from "@/models/product";
import Voucher from "@/models/voucher";
import { NextRequest, NextResponse } from "next/server";
const crypto = require("crypto");

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const data = await req.json();
    console.log("order api data:", data);

    const { user, paymentMethod, voucherCode, deliveryFee } = data;
    const orderItems = (await Cart.find({
      userID: user,
      selected: true,
    }).populate("productID")) as any;

    //check if the item has enogh stock
    for (const item of orderItems) {
      const {
        productID,
        variant: { color },
        size,
        quantity,
      } = item;

      // Find the product with the specified ID and variant color
      const product = await Product.findOne({
        _id: productID._id,
        "variants.color": color,
      });

      if (product) {
        // Find the index of the variant and the size within the variant
        const variantIndex = product.variants.findIndex(
          (v: ProductVariantType) => v.color === color
        );
        if (variantIndex !== -1) {
          const sizeIndex = product.variants[variantIndex].sizes.findIndex(
            (s: { name: string; stock: number }) => s.name === size
          );
          if (sizeIndex !== -1) {
            if (
              product.variants[variantIndex].sizes[sizeIndex].stock < quantity
            ) {
              console.log(
                `Not enough stock for product ${productID._id} in variant ${color} and size ${size}`
              );
              return NextResponse.json({
                success: false,
                message:
                  "You have ordered more than the stock of the product. Please adjust the quantity...",
              });
            }
          } else {
            console.log(
              `Size ${size} not found for product ${productID._id} in variant ${color}`
            );
            return NextResponse.json({
              success: false,
              message:
                "You have ordered more than the stock of the product. Please adjust the quantity...",
            });
          }
        } else {
          console.log(`Product color not found...`);
          return NextResponse.json({
            success: false,
            message: "Product variant not found...",
          });
        }
      } else {
        console.log(`Product ${productID._id} not found`);
        return NextResponse.json({
          success: false,
          message: "Product id not found...",
        });
      }
    }

    const voucherDiscountPercentage = await Voucher.findOne({
      code: voucherCode,
    });

    const voucherDiscount = getVoucherDiscount(
      voucherDiscountPercentage,
      orderItems
    );
    const totalPriceWithoutVoucherDiscount = getTotalPrice(orderItems);

    const totalPrice =
      totalPriceWithoutVoucherDiscount - voucherDiscount + deliveryFee;
    const finalData = { ...data, totalPrice, voucherDiscount };
    console.log("Total price in api: ", totalPrice);

    const saveNewOrder = await Order.create(finalData);

    if (saveNewOrder) {
      const saveOrder = { ...saveNewOrder };
      const transactionUuidHash = JSON.stringify(saveOrder);
      const hash = crypto.createHash("sha256");
      hash.update(transactionUuidHash);
      const transactionUuid = hash.digest("hex");

      if (paymentMethod === "esewa") {
        const esewaFormData = {
          amount: totalPrice,
          failure_url: "http://localhost:3000/user/checkout",
          product_delivery_charge: 0,
          product_service_charge: 0,
          product_code: process.env.NEXT_PUBLIC_ESEWA_PRODUCT_CODE,
          signature: generateSignature(totalPrice, transactionUuid),
          signed_field_names: "total_amount,transaction_uuid,product_code",
          success_url: "http://localhost:3000/user/orders",
          tax_amount: 0,
          total_amount: totalPrice,
          transaction_uuid: transactionUuid,
        };

        return NextResponse.json({
          success: true,
          message: "Order Placed Successfully !!!",
          data: esewaFormData,
          orderId: saveNewOrder._id,
        });
      }

      //decrease the number of remaining voucher after placing the order
      await Voucher.findOneAndUpdate(
        { code: voucherCode },
        { $inc: { totalVoucher: -1 } }
      );

      //decrease the stock of product in the order items after placing the order
      for (const item of orderItems) {
        const {
          productID,
          variant: { color },
          size,
          quantity,
        } = item;

        // Find the product with the specified ID and variant color
        const product = await Product.findOne({
          _id: productID._id,
          "variants.color": color,
        });

        if (product) {
          // Find the index of the variant and the size within the variant
          const variantIndex = product.variants.findIndex(
            (v: ProductVariantType) => v.color === color
          );
          if (variantIndex !== -1) {
            const sizeIndex = product.variants[variantIndex].sizes.findIndex(
              (s: { name: string; stock: number }) => s.name === size
            );
            if (sizeIndex !== -1) {
              // Decrement the stock for the specified size
              const updateResult = await Product.updateOne(
                {
                  _id: productID._id,
                  [`variants.${variantIndex}.sizes.${sizeIndex}.name`]: size,
                },
                {
                  $inc: {
                    [`variants.${variantIndex}.sizes.${sizeIndex}.stock`]:
                      -quantity,
                  },
                }
              );
              console.log(`Updated product ${productID._id}:`, updateResult);
            } else {
              console.log(
                `Size ${size} not found for product ${productID._id} in variant ${color}`
              );
            }
          } else {
            console.log(
              `Variant ${color} not found for product ${productID._id}`
            );
          }
        } else {
          console.log(`Product ${productID._id} not found`);
        }
      }

      //delete all selected cart items after order is placed
      // await Cart.deleteMany({ userID: user, selected: true });

      return NextResponse.json({
        success: true,
        message: "Order Placed Successfully !!!",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Failed to create a order ! Please try again",
      });
    }
  } catch (e) {
    console.log(e);

    return NextResponse.json({
      success: false,
      message: "Something went wrong ! Please try again later",
    });
  }
}
