"use server";
import { apiUrl } from "@/lib/utils";

export const addProductReview = async (formData: any) => {
  try {
    const response = await fetch(`${apiUrl}/product-review/add`, {
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

export const getAllProductReviews = async () => {
  try {
    const res = await fetch(`${apiUrl}/product-review/all`, {
      method: "GET",
    });

    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const updateProductReview = async (formData: any) => {
  try {
    const res = await fetch(`${apiUrl}/product-review/update`, {
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

export const deleteProductReview = async (id: string) => {
  try {
    const res = await fetch(`${apiUrl}/product-review/delete?id=${id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    console.log(data);

    return data;
  } catch (e) {
    console.log(e);
  }
};
