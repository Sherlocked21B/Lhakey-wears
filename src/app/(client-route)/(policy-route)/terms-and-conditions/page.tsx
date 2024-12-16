import Link from "next/link";
import React from "react";

export default function TermsAndConditions() {
  return (
    <div className="my-container py-10 flex flex-col gap-6">
      <h2 className="text-xl font-bold">Terms and Conditions</h2>
      <ol className="flex flex-col gap-6 list-decimal ml-4">
        {termsAndConditions.map((item) => (
          <li key={item.title} className="font-semibold">
            <h3 className="text-lg">{item.title}</h3>
            <p className="font-normal text-justify">{item.content}</p>
          </li>
        ))}
      </ol>
      <p>
        By using our website and purchasing our products, you agree to abide by
        these terms and conditions. If you have any questions or concerns,
        please contact us at{" "}
        <Link
          className="font-semibold underline underline-offset-4"
          href="mailto:contact@lakheywears.com.np">
          contact@lakheywears.com.np
        </Link>
        .
      </p>
    </div>
  );
}

const termsAndConditions = [
  {
    title: "Introduction",
    content:
      "Welcome to Lakhey Wears Pvt. Ltd., a clothing company dedicated to providing quality apparel for our customers. These terms and conditions govern your use of our website and the purchase of our products. By accessing or using our website, you agree to be bound by these terms and conditions.",
  },
  {
    title: "Product Information",
    content:
      "We endeavor to provide accurate descriptions and images of our products. However, please note that colors and details may vary slightly due to monitor settings and manufacturing processes.",
  },
  {
    title: "Ordering and Payment",
    content:
      "To place an order, you must provide accurate and up-to-date information. We accept payment via Esewa and Cash on Delivery. Payment is required in full at the time of purchase.",
  },
  {
    title: "Shipping and Delivery",
    content:
      "We aim to ship orders promptly, typically within 3 business days. Delivery times may vary based on your location and shipping method. We are not responsible for delays caused by third-party shipping carriers.",
  },
  {
    title: "Returns and Exchanges",
    content:
      "We accept returns and exchanges within a week of purchase, provided the item is unused and in its original condition. Customers are responsible for return shipping costs unless the item is defective or damaged.",
  },
  {
    title: "Intellectual Property",
    content:
      "All content on our website, including images, logos, and product designs, is the property of Lakhey Wears Pvt. Ltd. and is protected by copyright laws. You may not use or reproduce any content without our prior written consent.",
  },
  {
    title: "Privacy Policy",
    content:
      "Our privacy policy outlines how we collect, use, and protect your personal information. By using our website, you consent to the terms of our privacy policy.",
  },
  {
    title: "Limitation of Liability",
    content:
      "In no event shall Lakhey Wears Pvt. Ltd. be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with our products or website.",
  },
  {
    title: "Governing Law",
    content:
      "These terms and conditions shall be governed by and construed in accordance with the laws of the Federal Democratic Republic of Nepal. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Kathmandu.",
  },
  {
    title: "Changes to Terms",
    content:
      "We reserve the right to update or modify these terms and conditions at any time. Any changes will be effective immediately upon posting on our website.",
  },
];
