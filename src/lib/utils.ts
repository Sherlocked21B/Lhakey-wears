import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { CartType, OrderItemType, ProductVariantType } from "./types";
import crypto from "crypto";
import {
  fromDate,
  getLocalTimeZone,
  now,
  CalendarDate,
  parseDate,
  parseDateTime,
  parseAbsolute,
  DateFormatter,
} from "@internationalized/date";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// export const apiUrl =
//   process.env.NODE_ENV === "development"
//     ? "http://localhost:3000/api"
//     : "https://www.lakheywears.com.np/api";
export const apiUrl = "http://localhost:3000/api";

export function finalPrice(price: number, discountPercentage: number): number {
  const discountAmount = price * (discountPercentage / 100);
  const discountedPrice = price - discountAmount;
  return Math.ceil(discountedPrice);
}

export const slugify = (...args: (string | number)[]): string => {
  const value = args.join(" ");

  return value
    .normalize("NFD") // split an accented letter in the base letter and the acent
    .replace(/[\u0300-\u036f]/g, "") // remove all previously split accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 ]/g, "") // remove all chars not letters, numbers and spaces (to be replaced)
    .replace(/\s+/g, "-"); // separator
};

export function getTotalQuantity(items: CartType[] | []): number {
  if (items.length === 0) return 0;
  return items.reduce((total, item) => {
    if (item.selected) {
      return total + item.quantity;
    }
    return total;
  }, 0);
}

export function getTotalPrice(items: CartType[] | []): number {
  console.log("Items: ", items);
  if (items.length === 0) return 0;
  return items.reduce((total: number, item) => {
    const price =
      item.productID.onSale === "yes"
        ? finalPrice(
            item.productID.price,
            item.productID.discountPercentage as number
          )
        : item.productID.price;
    if (item.selected) {
      return total + price * item.quantity;
    }
    return total;
  }, 0);
}

export function getDiscountPriceForCategory(
  items: CartType[] | [],
  category: string,
  discount: number
): number {
  if (items.length === 0) return 0;
  return items.reduce((total: number, item) => {
    const discountPrice = item.productID.price * (discount / 100);

    if (item.selected && item.productID.category === category) {
      return total + discountPrice * item.quantity;
    }
    return Math.floor(total);
  }, 0);
}

export function getTotalPriceWithoutDiscount(items: CartType[] | []): number {
  if (items.length === 0) return 0;
  return items.reduce((total: number, item) => {
    const price = item.productID.price;
    if (item.selected) {
      return total + price * item.quantity;
    }
    return total;
  }, 0);
}

export function getTotalStock(items: ProductVariantType[] | []): number {
  if (items.length === 0) return 0;
  return items.reduce((total: number, item) => {
    return total + item.sizes.reduce((acc, size) => acc + size.stock, 0);
  }, 0);
}

export function generateSignature(
  totalAmount: number,
  transactionUuid: string
) {
  const hash = crypto.createHmac(
    "sha256",
    process.env.NEXT_PUBLIC_ESEWA_SIGNATURE_SECRET as string
  );
  hash.update(
    `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${process.env.NEXT_PUBLIC_ESEWA_PRODUCT_CODE}`
  );
  const hashInBase64 = hash.digest("base64");
  return hashInBase64;
}

export function generateSignatureFromMessage(message: string) {
  const hash = crypto.createHmac(
    "sha256",
    process.env.NEXT_PUBLIC_ESEWA_SIGNATURE_SECRET as string
  );
  hash.update(message);
  const hashInBase64 = hash.digest("base64");
  return hashInBase64;
}

export const getVoucherDiscount = (res: any, cartItems: CartType[]): number => {
  console.log("voucher discount", res);

  if (!res) {
    return 0;
  }
  const currentDate = now(getLocalTimeZone()); // Get the current date and time in the local time zone

  // Check if the voucher is active yet
  const startDate = fromDate(new Date(res.start), getLocalTimeZone());
  if (startDate.compare(currentDate) >= 0) {
    return 0; // Voucher is not active yet
  }

  // Check if the voucher is expired
  const expiryDate = fromDate(new Date(res.expiry), getLocalTimeZone());
  if (expiryDate.compare(currentDate) < 0) {
    return 0; // Voucher is expired
  }

  // Check if the cart total meets the minimum amount requirement for the voucher
  const minimumAmount = res.minimumAmount;
  const cartTotal = getTotalPrice(cartItems);
  if (cartTotal < minimumAmount) {
    return 0; // Cart total does not meet the minimum amount requirement
  }

  // Calculate discount
  let discount = 0;
  if (res.category === "all") {
    discount = (res.discount * getTotalPriceWithoutDiscount(cartItems)) / 100;
  } else {
    discount = getDiscountPriceForCategory(
      cartItems,
      res.category,
      res.discount
    );
  }

  // Ensure the discount does not exceed the maximum allowed discount
  const maximumDiscount = res.maximumDiscount;
  if (maximumDiscount === 0) {
    return discount;
  }
  discount = Math.min(Math.floor(discount), maximumDiscount);

  return discount; // Return the calculated discount
};

export const getSizeIndex = (size: string, variant: ProductVariantType) => {
  try {
    return variant.sizes.findIndex((s) => s.name === size);
  } catch (e) {
    console.log(e);
    return 0;
  }
};

export function convertCartToOrderItem(
  cartDataArray: CartType[] | []
): OrderItemType[] | [] {
  console.log("Cart Datas: ", cartDataArray);

  // Return an empty array if the input array is empty
  if (cartDataArray.length === 0) {
    return [];
  }

  // Map over the array to convert each cart item to an order item
  let orderItemsArray = <OrderItemType[]>[];
  cartDataArray.map((cartData) => {
    // Validate the input data against the CartSchema

    // Extract necessary fields from the cart data
    const { _id, productID, quantity, variant, size } = cartData;

    // Create the OrderItem object
    const orderItem = {
      _id,
      productID: productID._id as string,
      price: productID.price,
      discountPercentage:
        productID.onSale === "yes" && productID.discountPercentage
          ? productID.discountPercentage
          : 0,
      quantity,
      color: variant.color,
      image: variant.imageGallery[0],
      size,
      productName: productID.name,
    };
    orderItemsArray.push(orderItem);
  });
  return orderItemsArray;
}

export function getLengthOfSelectedCartItems(cartDataArray: CartType[] | []) {
  if (cartDataArray.length === 0) {
    return 0; // Return 0 if cartDataArray is empty or undefined
  }

  return cartDataArray.filter((cartData) => cartData.selected).length;
}

export function timeAgo(dateStr: string) {
  const providedDate = parseAbsolute(dateStr, "Asia/Kathmandu");
  const currentDate = now(getLocalTimeZone());

  const diffInMinutes = Math.floor(
    currentDate.compare(providedDate) / (1000 * 60)
  );
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute(s) ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour(s) ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} day(s) ago`;
  } else if (diffInDays < 30) {
    return `${diffInWeeks} week(s) ago`;
  } else if (diffInDays < 365) {
    return `${diffInMonths} month(s) ago`;
  } else {
    return `${diffInYears} year(s) ago`;
  }
}

export function timeWithin(questionDate: string, answerDate: string) {
  const parsedQuestionDate = parseAbsolute(questionDate, "Asia/Kathmandu");
  const parsedAnswerDate = parseAbsolute(answerDate, "Asia/Kathmandu");

  const diffInMinutes = Math.floor(
    parsedQuestionDate.compare(parsedAnswerDate) / (1000 * 60)
  );
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInMinutes < 60) {
    return `answered within ${diffInMinutes} minute(s)`;
  } else if (diffInHours < 24) {
    return `answered within ${diffInHours} hour(s)`;
  } else if (diffInDays < 7) {
    return `answered within ${diffInDays} day(s)`;
  } else if (diffInDays < 30) {
    return `answered within ${diffInWeeks} week(s)`;
  } else if (diffInDays < 365) {
    return `answered within ${diffInMonths} month(s)`;
  } else {
    return `answered within ${diffInYears} year(s)`;
  }
}

export const compareTimes = (a: string, b: string) => {
  const dateA = parseAbsolute(a, "Asia/Kathmandu");
  const dateB = parseAbsolute(b, "Asia/Kathmandu");
  const timeDiff = dateA.compare(dateB);
  if (timeDiff > 0) {
    return true;
  }
  return false;
};

export const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

export const formatDate = (date: string) => {
  const dateValue = new Date(date);
  const formatterShort = new DateFormatter("en-US", {
    dateStyle: "medium",
  });
  const formatedDate = formatterShort.format(dateValue);
  return formatedDate;
};

export function extractNameFromEmail(email: string) {
  try {
    // Split the email at the '@' symbol
    let name = email.split("@")[0];
    // Remove all numbers from the name using a regular expression
    name = name.replace(/\d+/g, "");
    console.log(name);

    return name;
  } catch (error) {
    // Return an error message in case of any exception
    console.log(error);

    return email;
  }
}
