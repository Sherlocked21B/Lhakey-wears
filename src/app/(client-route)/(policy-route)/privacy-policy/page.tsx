import Link from "next/link";
import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="my-container flex flex-col gap-6 text-justify py-10">
      <h2 className="text-xl font-bold">Privacy Policy</h2>
      <p>
        Welcome to <span className="font-semibold">lakheywears.com.np</span>,
        operated by{" "}
        <span className="font-semibold">Lakhey Wears Pvt. Ltd.</span> Your
        privacy is important to us, and we are committed to safeguarding your
        personal information. Please take a moment to review this Privacy
        Policy.
      </p>
      <p>
        Our Privacy Policy outlines how we collect, utilize, and, under specific
        circumstances, disclose your personal data. It also elucidates the
        measures we&rsquo;ve implemented to ensure the security of your personal
        information. By accessing the Site directly or through another platform,
        you agree to the practices described in this Policy.
      </p>
      <p>
        At Lakhey Wears, we understand that data protection is built on trust,
        and we handle your personal information in line with this principle. We
        only use your name and relevant information as outlined in this Privacy
        Policy. Our data collection is limited to what is necessary for our
        interactions with you, and we retain your information only as long as
        required by law or for the purposes for which it was collected.
      </p>
      <p>
        You can explore the Site anonymously without providing personal details.
        Your anonymity is preserved unless you create an account and log in with
        your credentials.
      </p>
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold">Information Collection</h3>
        <p>
          When you place an order on our Site, we may collect various details
          necessary for processing your purchase and providing our services.
          This may include your name, contact information, payment details, and
          other relevant data.
        </p>
        <h3 className="text-lg font-semibold mt-1">Types of Data We Collect</h3>
        <ul className="list-disc ml-4 flex flex-col gap-1">
          {dataCollection.map((item) => (
            <li key={item.title}>
              <span className="font-semibold">{item.title}:</span>{" "}
              {item.description}
            </li>
          ))}
        </ul>
      </div>
      {additionalData.map((item) => (
        <div key={item.title} className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold">{item.title}</h3>
          <p>{item.description}</p>
        </div>
      ))}
      <p>
        We are not liable for unauthorized use of your account, and it&rsquo;s
        your responsibility to ensure the proper use of the Site.
      </p>
      <p>
        If you have any questions or concerns regarding our Privacy Policy,
        please contact us at{" "}
        <Link
          className="font-semibold underline underline-offset-4"
          href="mailto:contact@lakheywears.com.np">
          contact@lakheywears.com.np
        </Link>
      </p>
    </div>
  );
}

const dataCollection = [
  {
    title: "Identity Data",
    description: "Includes name, gender, and date of birth.",
  },
  {
    title: "Contact Data",
    description: "Includes address, email, and phone numbers.",
  },
  {
    title: "Billing Account Information",
    description: "Includes bank or credit card details.",
  },
  {
    title: "Transaction Records",
    description: "Includes details of orders and payments.",
  },
  {
    title: "Technical Data",
    description: "Includes IP address and browser information.",
  },
  {
    title: "Profile Data",
    description: "Includes username, preferences, and feedback.",
  },
  {
    title: "Usage Data",
    description: "Includes information on site activity and interactions.",
  },
  {
    title: "Location Data",
    description: "Includes location details if provided by you.",
  },
];

const additionalData = [
  {
    title: "Cookies",
    description:
      "We may use cookies, web beacons, and similar technologies to enhance your browsing experience on our Site. While acceptance of cookies is not mandatory, some functionalities like the shopping basket require their activation. Cookies help us recognize your device or browser and provide a personalized experience.",
  },
  {
    title: "Security",
    description:
      "We maintain robust technical and security measures to prevent unauthorized access, loss, or damage to your information. However, no method of transmission over the Internet is entirely secure, and we continuously review and enhance our security measures.",
  },
  {
    title: "Your Rights",
    description:
      "You have the right to access, correct, or request deletion of your personal data. If you have concerns about your data, you can contact us to exercise these rights. Please note that we may charge a reasonable fee for data retrieval, as permitted by applicable laws.",
  },
  {
    title: "Minors",
    description:
      "We do not sell products to individuals under 18 years old or knowingly collect their personal data. If minors access our Site with your permission, you are responsible for their actions.",
  },
];
