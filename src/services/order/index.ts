"use server";
import { CartType, OrderItemType, ProductVariantType } from "@/lib/types";
import { apiUrl } from "@/lib/utils";
import Product from "@/models/product";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export const createNewOrder = async (formData: any) => {
  try {
    const res = await fetch(`${apiUrl}/order/add`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const buyNowOrder = async (formData: any) => {
  try {
    const res = await fetch(`${apiUrl}/order/buy-now`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllOrders = async () => {
  try {
    const res = await fetch(`${apiUrl}/order/all`, {
      cache: "no-store",
      method: "GET",
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllOrdersForUser = async (id: string) => {
  try {
    const res = await fetch(`${apiUrl}/order/all-of-user?id=${id}`, {
      method: "GET",
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getOrderById = async (id: string) => {
  try {
    const res = await fetch(`${apiUrl}/order/order-detail?id=${id}`, {
      cache: "no-store",
      method: "GET",
    });
    const data = await res.json();
    return data;
  } catch (e) {
    console.log(e);
  }
};

export const updateOrder = async (id: string) => {
  try {
    const res = await fetch(`/api/admin/orders/update-order?id=${id}`, {
      method: "PUT",
    });
    const data = await res.json();
    return data;
  } catch (e) {
    console.log(e);
  }
};

export const updatePaidStatus = async (id: string, userID: string) => {
  try {
    const res = await fetch(
      `${apiUrl}/order/update/paid-status?id=${id}&userID=${userID}`,
      {
        method: "PUT",
        headers: {},
      }
    );
    const data = await res.json();
    return data;
  } catch (e) {
    console.log(e);
  }
};

export const updateProgressStatus = async (
  progress: string,
  userID: string,
  orderID: string
) => {
  try {
    const res = await fetch(
      `${apiUrl}/order/update/progress-status?progress=${progress}&userID=${userID}&orderID=${orderID}`,
      {
        method: "PUT",
      }
    );
    const data = await res.json();
    return data;
  } catch (e) {
    console.log(e);
  }
};

export const deleteOrder = async (id: string) => {
  try {
    const res = await fetch(`${apiUrl}/order/delete?id=${id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    console.log(data);

    return data;
  } catch (e) {
    console.log(e);
  }
};

export const checkStock = async (orderItems: OrderItemType[]) => {
  //check if the item has enogh stock
  for (const item of orderItems) {
    const { productID, color, size, quantity } = item;

    // Find the product with the specified ID and variant color
    const product = await Product.findOne({
      _id: productID,
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
              `Not enough stock for product ${productID} in variant ${color} and size ${size}`
            );
            return NextResponse.json({
              success: false,
              message:
                "You have ordered more than the stock of the product. Please adjust the quantity...",
            });
          }
        } else {
          console.log(
            `Size ${size} not found for product ${productID} in variant ${color}`
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
      console.log(`Product ${productID} not found`);
      return NextResponse.json({
        success: false,
        message: "Product id not found...",
      });
    }
  }
};

export const substractStock = async (orderItems: OrderItemType[]) => {
  //decrease the stock of product in the order items after placing the order
  for (const item of orderItems) {
    const { productID, color, size, quantity } = item;

    // Find the product with the specified ID and variant color
    const product = await Product.findOne({
      _id: productID,
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
              _id: productID,
              [`variants.${variantIndex}.sizes.${sizeIndex}.name`]: size,
            },
            {
              $inc: {
                [`variants.${variantIndex}.sizes.${sizeIndex}.stock`]:
                  -quantity,
              },
            }
          );
          console.log(`Updated product ${productID}:`, updateResult);
        } else {
          console.log(
            `Size ${size} not found for product ${productID} in variant ${color}`
          );
        }
      } else {
        console.log(`Variant ${color} not found for product ${productID}`);
      }
    } else {
      console.log(`Product ${productID} not found`);
    }
  }
};
