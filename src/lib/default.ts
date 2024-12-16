export const defaultProduct = {
  name: "",
  slug: "",
  description: "",
  price: 0,
  gender: "",
  category: "",
  season: "",
  onSale: "no",
  discountPercentage: 0,
  discountLabel: "",
  imageUrl: "",
  sizeImageUrl: "",
  variants: [],
  metaTitle: "",
  metaDescription: "",
};

export const defaultProductVariant = {
  color: "",
  sizes: [{ name: "", stock: 0 }],
  imageGallery: [""],
};

export const defaultProductReview = {
  user: "",
  product: "",
  rating: 0,
  comment: "",
  imageGallery: [""],
};

export const defaultProductQA = {
  user: "",
  question: "",
  questionCreatedAt: "",
  questionUpdatedAt: "",
  answer: "",
  answerCreatedAt: "",
  answerUpdatedAt: "",
};

export const defaultOrderDetail = {
  _id: "667c1db159e7d00eb2daad37",
  user: "bijen",
  voucherCode: "lakhey20",
  paymentMethod: "esewa",
  totalPrice: 1500,
  isPaid: true,
  currentProgress: "pending",
  createdAt: "06/27/2024T13:30",
  orderItems: [
    {
      _id: "dfsfsdfsdfsdfsdd6f4sd56f46sfsgg",
      productID: "dfsfsdfsdfsdfsdd6f4sd56f46sfsgg",
      price: 500,
      discountPercentage: 15,
      quantity: 5,
      variant: {
        id: "fdfsdfsdf sfsdf sdfsd fsd f",
        color: "black",
        sizes: [
          {
            name: "small",
            stock: 10,
          },
          {
            name: "medium",
            stock: 10,
          },
          {
            name: "large",
            stock: 10,
          },
        ],
        imageGallery: ["/logo.png"],
      },
      size: "medium",
      productName: "Lakhey Combo Pack",
    },
  ],
};
