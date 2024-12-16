"use server";
import { ProductQAType, ProductType } from "@/lib/types";
import { apiUrl } from "@/lib/utils";

export const addProductQA = async (formData: any) => {
  try {
    const response = await fetch(`${apiUrl}/product-qa/add`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const finalData = await response.json();

    return finalData;
  } catch (e) {
    console.log("error", e);
  }
};

export const getAllProductQAs = async () => {
  try {
    const res = await fetch(`${apiUrl}/product-qa/all`, {
      method: "GET",
    });

    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};
export const getProductQAByProductId = async (productId: string) => {
  try {
    const res = await fetch(
      `${apiUrl}/product-qa/productId?productId=${productId}`,
      {
        method: "GET",
      }
    );

    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const updateProductQA = async (formData: ProductQAType) => {
  try {
    const res = await fetch(`${apiUrl}/product-qa/update`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    return data;
  } catch (e) {
    console.log(e);
  }
};

export const deleteProductQA = async (id: string) => {
  try {
    const res = await fetch(`${apiUrl}/product-qa/delete?id=${id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    console.log(data);

    return data;
  } catch (e) {
    console.log(e);
  }
};
