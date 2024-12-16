import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import Link from "next/link";
import { FaArrowRightLong } from "react-icons/fa6";
import { getAllCartItems } from "@/services/cart";
import { CartType } from "@/lib/types";
import CartModalCard from "../Cards/CartModalCard";
import { AnimatePresence } from "framer-motion";
import CartModalCardLoading from "../Loading/CartModalCartLoading";
import { useSession } from "next-auth/react";

type CartModalProps = {
  isOpen: boolean;
  onOpenChange: () => void;
};

export default function CartModal({ isOpen, onOpenChange }: CartModalProps) {
  const [cartItems, setCartItems] = useState<CartType[] | []>([]);
  const [modalLoading, setModalLoading] = useState(false);

  const session = useSession();
  const user = session.data?.user;

  const getCartItems = async () => {
    setModalLoading(true);
    const res = await getAllCartItems(user?.id as string);

    if (res.success) {
      setCartItems(res.data);
    }
    setModalLoading(false);
  };

  useEffect(() => {
    console.log(isOpen);
    if (isOpen) {
      getCartItems();
    }
  }, [isOpen]);

  return (
    <Modal
      radius="none"
      className="w-[400px] absolute right-0"
      size="full"
      backdrop="opaque"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      motionProps={{
        variants: {
          enter: {
            x: 0,
            opacity: 1,
            transition: {
              duration: 0.5,
              ease: "easeOut",
            },
          },
          exit: {
            x: 150,
            opacity: 0,
            transition: {
              duration: 0.5,
              ease: "easeIn",
            },
          },
        },
      }}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Cart Items
            </ModalHeader>
            <ModalBody className="flex flex-col gap-4 overflow-y-scroll">
              {modalLoading ? (
                <>
                  {Array.from({ length: 4 }).map((_, index) => (
                    <CartModalCardLoading key={index} index={index} />
                  ))}
                </>
              ) : cartItems && cartItems.length > 0 ? (
                <AnimatePresence>
                  {cartItems.map((item: CartType, index) => (
                    <CartModalCard
                      setCartItems={setCartItems}
                      key={item._id}
                      cartDetail={item}
                    />
                  ))}
                </AnimatePresence>
              ) : (
                "No items in cart"
              )}
            </ModalBody>
            <ModalFooter className="flex flex-col gap-4 justify-center">
              <Link className="w-full" href={"/user/cart"}>
                <Button
                  className="w-full"
                  color="danger"
                  variant="light"
                  onPress={onClose}>
                  Go to Cart
                </Button>
              </Link>
              <Link className="w-full" href={"/user/checkout"}>
                <Button className="w-full" color="primary" onPress={onClose}>
                  Checkout
                </Button>
              </Link>

              <Link
                className="flex gap-2 items-center justify-center hover:font-semibold"
                href={"/products"}>
                <span>Continue Shopping</span>
                <FaArrowRightLong />
              </Link>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
