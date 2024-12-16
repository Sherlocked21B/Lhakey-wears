import { z } from "zod";
import {
  CartSchema,
  FormCartSchema,
  OrderDetailSchema,
  OrderItemSchema,
  OrderSchema,
  ProductQADetailSchema,
  ProductQASchema,
  ProductReviewDetailSchema,
  ProductReviewSchema,
  ProductSchema,
  ProductVariantSchema,
  RegisterAdminSchema,
  UserSchema,
  VoucherSchema,
} from "./schemas";

export type UserRegister = {
  name: string;
  email: string;
  password: string;
};
export type UserLogin = {
  email: string;
  password: string;
};

export type UserType = z.infer<typeof UserSchema>;

export type AdminType = z.infer<typeof RegisterAdminSchema>;

export type ProductType = z.infer<typeof ProductSchema>;

export type ProductVariantType = z.infer<typeof ProductVariantSchema>;

export type ProductReviewType = z.infer<typeof ProductReviewSchema>;

export type ProductReviewDetailType = z.infer<typeof ProductReviewDetailSchema>;

export type ProductQAType = z.infer<typeof ProductQASchema>;

export type ProductQADetailType = z.infer<typeof ProductQADetailSchema>;

export type FormCartType = z.infer<typeof FormCartSchema>;

export type CartType = z.infer<typeof CartSchema>;

export type VoucherType = z.infer<typeof VoucherSchema>;

export type OrderType = z.infer<typeof OrderSchema>;

export type OrderDetailType = z.infer<typeof OrderDetailSchema>;

export type OrderItemType = z.infer<typeof OrderItemSchema>;
