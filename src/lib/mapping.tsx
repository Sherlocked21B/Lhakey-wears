import {
  MdOutlineDashboard,
  MdDashboard,
  MdShoppingCart,
  MdOutlineShoppingCart,
} from "react-icons/md";
import { BsBoxSeam, BsBoxSeamFill } from "react-icons/bs";
import { RiAdminLine, RiAdminFill } from "react-icons/ri";
import {
  IoOptionsOutline,
  IoOptionsSharp,
  IoCartOutline,
  IoCartSharp,
  IoPricetagSharp,
  IoPricetagOutline,
} from "react-icons/io5";
import { FaRegUser, FaUser } from "react-icons/fa";
import { GoHeart, GoHeartFill } from "react-icons/go";

export const clientNavItems = [
  { label: "About", path: "/about" },
  { label: "Shop", path: "/products" },
  { label: "Contact", path: "/contact" },
  { label: "Admin", path: "/admin" },
];

export const adminNavItems = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: MdOutlineDashboard,
    filledIcon: MdDashboard,
  },
  {
    label: "Orders",
    path: "/admin/orders",
    icon: MdOutlineShoppingCart,
    filledIcon: MdShoppingCart,
  },
  {
    label: "Products",
    path: "/admin/products",
    icon: BsBoxSeam,
    filledIcon: BsBoxSeamFill,
  },
  // {
  //   label: "Attributes",
  //   path: "/admin/attributes",
  //   icon: IoOptionsOutline,
  //   filledIcon: IoOptionsSharp,
  // },
  {
    label: "Vouchers",
    path: "/admin/vouchers",
    icon: IoPricetagOutline,
    filledIcon: IoPricetagSharp,
  },
  {
    label: "Admins",
    path: "/admin/admins",
    icon: RiAdminLine,
    filledIcon: RiAdminFill,
  },
];

export const clientAccountNavItems = [
  {
    label: "My Profile",
    path: `/user/profile`,
    icon: MdOutlineDashboard,
    filledIcon: MdDashboard,
  },
  {
    label: "My Orders",
    path: "/user/orders",
    icon: MdOutlineShoppingCart,
    filledIcon: MdShoppingCart,
  },
  {
    label: "My Cart",
    path: "/user/cart",
    icon: IoCartOutline,
    filledIcon: IoCartSharp,
  },
  {
    label: "My Wishlist",
    path: "/user/wishlist",
    icon: GoHeart,
    filledIcon: GoHeartFill,
  },
];

export const registerForm = [
  {
    label: "Full Name",
    formType: "text",
    id: "name",
  },
  {
    label: "Email",
    formType: "email",
    id: "email",
  },
  {
    label: "Password",
    formType: "password",
    id: "password",
  },
];

export const loginForm = [
  {
    label: "Email",
    formType: "email",
    id: "email",
  },
  {
    label: "Password",
    formType: "password",
    id: "password",
  },
];

export const colorMapping = {
  black: "#000",
  white: "#fff",
  grey: "#808080",
  brown: "#964B00",
};

export const sizeMapping = {
  small: "S",
  medium: "M",
  large: "L",
  "x-large": "XL",
  "2x-large": "2XL",
  "3x-large": "3XL",
};

export const productAttributes = {
  color: Object.keys(colorMapping),
  season: ["spring", "summer", "autumn", "winter", "all"],
  gender: ["male", "female", "all", "others"],
  category: [
    "t-shirt",
    "shirt",
    "hoodie",
    "shorts",
    "jacket",
    "windcheater",
    "balaclava",
    "accessories",
  ],
  sizes: Object.keys(sizeMapping),
};

export const productForm1 = [
  {
    id: "name",
    label: "Name",
    formType: "text",
    componentType: "input",
  },
  {
    id: "description",
    label: "Description",
    formType: "text",
    componentType: "textArea",
  },

  // {
  //   id: "sizes",
  //   label: "Sizes",
  //   formType: "text",
  //   componentType: "select",
  //   options: productAttributes.sizes,
  // },
];

export const productForm2 = [
  {
    id: "price",
    label: "Price",
    formType: "number",
    componentType: "input",
  },

  {
    id: "gender",
    label: "Gender",
    formType: "text",
    componentType: "select",
    options: productAttributes.gender,
  },
  {
    id: "category",
    label: "Category",
    formType: "text",
    componentType: "select",
    options: productAttributes.category,
  },
  {
    id: "season",
    label: "Season",
    formType: "text",
    componentType: "select",
    options: productAttributes.season,
  },
];

export const footerNav = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "About Company",
    href: "/about",
  },
  {
    label: "All Products",
    href: "/products",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

export const footerSocial = [
  {
    label: "Facebook",
    href: "#",
  },
  {
    label: "Instagram",
    href: "#",
  },
  {
    label: "Tiktok",
    href: "#",
  },
  {
    label: "LinkedIn",
    href: "#",
  },
];

export const userProfile = [
  { label: "Full Name", id: "name" },
  { label: "Email", id: "email" },
  { label: "Phone Number with Country Code", id: "phoneNumber" },
  { label: "Full Address", id: "address" },
];
