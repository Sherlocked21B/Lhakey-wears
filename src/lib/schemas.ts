import { z } from "zod";
import { colorMapping } from "./mapping";

export const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email!!!"),
  password: z.string().min(1, "Password is required!!!"),
});

export const RegisterSchema = z.object({
  name: z.string().min(4, "Name must be at least 4 characters"),
  email: z.string().email("Valid email is required!!!"),
  password: z.string().min(6, "Password must be at least 6 characters!!!"),
});

export const UserSchema = z.object({
  _id: z.nullable(z.string()),
  name: z.nullable(z.string()),
  email: z.nullable(z.string()),
  image: z.string().optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  role: z.string().optional(),
  emailVerified: z.date().optional(),
});

export const RegisterAdminSchema = z
  .object({
    name: z.string().min(4, "Name must be at least 4 characters"),
    email: z.string().email("Valid email is required!!!"),
    password: z.string().min(6, "Password must be at least 6 characters!!!"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),

    imageUrl: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const ProductVariantSchema = z.object({
  id: z.string().optional(),
  color: z.string().min(1, "Color is required"),
  sizes: z.array(
    z.object({
      name: z.string().min(1, "Size name is required"),
      stock: z.number().nonnegative("Stock must be at least 0"),
    })
  ),
  imageGallery: z.array(z.string()),
});

export const ProductReviewSchema = z.object({
  _id: z.string().optional(),
  user: z.string(),
  product: z.string(),
  rating: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  comment: z.string().min(10, "Description must be at least 10 characters"),
  imageGallery: z.array(z.string()).optional(),
});
export const ProductReviewDetailSchema = z.object({
  _id: z.string(),
  user: UserSchema,
  product: z.string(),
  rating: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  comment: z.string().min(10, "Description must be at least 10 characters"),
  imageGallery: z.array(z.string()).optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});

export const ProductQASchema = z.object({
  _id: z.string().optional(),
  userId: z.string(),
  productId: z.string(),
  question: z.string().min(10, "Question must be at least 10 characters"),
  questionCreatedAt: z.string(),
  questionUpdatedAt: z.string().optional(),
  answer: z.string().optional(),
  answerCreatedAt: z.string().optional(),
  answerUpdatedAt: z.string().optional(),
});

export const ProductQADetailSchema = z.object({
  _id: z.string(),
  userId: UserSchema,
  productId: z.string(),
  question: z.string().min(10, "Question must be at least 10 characters"),
  questionCreatedAt: z.string(),
  questionUpdatedAt: z.string().optional(),
  answer: z.string().optional(),
  answerCreatedAt: z.string().optional(),
  answerUpdatedAt: z.string().optional(),
});

export const ProductSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(4, "Name must be at least 4 characters!!!"),
  slug: z.string().optional(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters!!!"),
  price: z.number().min(0, "Price must be at least 0"),
  gender: z.string().min(1, "Gender is Required"),
  category: z.string().min(1, "Category is Required"),
  season: z.string().min(1, "Season is Required"),
  onSale: z.string().default("no"),
  discountPercentage: z
    .number()
    .min(0, "Discount percentage must be greater than 0")
    .max(100, "Discount percentage must be lower than 100")
    .optional(),
  discountLabel: z.string().optional(),
  imageUrl: z.string().min(1, "Image url is required!!!"),
  sizeImageUrl: z.string().optional(),
  variants: z.array(ProductVariantSchema),
  reviews: z.array(ProductReviewDetailSchema).optional(),
  qas: z.array(ProductQADetailSchema).optional(),
  metaTitle: z.string().min(4, "Meta Title is Required"),
  metaDescription: z.string().min(4, "Meta Description is Required"),
});

export const FormCartSchema = z.object({
  userID: z.string(),
  productID: z.string(),
  // price: z.number(),
  quantity: z.number(),
  variant: ProductVariantSchema,
  size: z.string(),
  // productName: z.string(),
  selected: z.boolean(),
});

export const CartSchema = z.object({
  _id: z.string(),
  userID: z.string(),
  productID: ProductSchema,
  quantity: z.number(),
  variant: ProductVariantSchema,
  size: z.string(),
  selected: z.boolean(),
});

const dateSchema = z.coerce.date().refine((data) => data > new Date(), {
  message: "Date must be in the future",
});

export const VoucherSchema = z
  .object({
    _id: z.string().optional(),
    code: z.string(),
    discount: z
      .number()
      .nonnegative("Discount must be at least 0")
      .max(100, "Discount Percentage must be at most 100"),
    category: z.string(),
    minimumAmount: z.number().min(0, "Amount must be at least 0"),
    maximumDiscount: z.number().min(0, "Amount must be at least 0"),
    start: dateSchema,
    expiry: dateSchema,
    totalVoucher: z.number().nonnegative("Current Count must be at least 0"),
  })
  .refine((data) => data.expiry > data.start, {
    message: "Expiry date must be greater than start date",
    path: ["expiry"],
  });

export const OrderItemSchema = z.object({
  _id: z.string(),
  productID: z.string(),
  price: z.number(),
  discountPercentage: z.number(),
  quantity: z.number(),
  color: z.string(),
  image: z.string(),
  size: z.string(),
  productName: z.string(),
});

export const OrderSchema = z.object({
  _id: z.string().optional(),
  user: z.string(),
  orderItems: OrderItemSchema.array(),
  deliveryFee: z.number().nonnegative("Delivery Fee must be at least 0"),
  voucherCode: z.string(),
  paymentMethod: z.string(),
  totalPrice: z.number(),
  isPaid: z.boolean(),
  currentProgress: z.string(),
});

export const OrderDetailSchema = z.object({
  _id: z.string().optional(),
  user: z.string(),
  orderItems: OrderItemSchema.array(),
  deliveryFee: z.number().nonnegative("Delivery Fee must be at least 0"),
  voucherCode: z.string(),
  paymentMethod: z.string(),
  totalPrice: z.number(),
  isPaid: z.boolean(),
  voucherDiscount: z
    .number()
    .nonnegative("Voucher Discount must be at least 0"),
  currentProgress: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
