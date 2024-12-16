import React from "react";
import { Modal, ModalContent, Button, useDisclosure } from "@nextui-org/react";
import clsx from "clsx";

export default function ModalButton({
  name,
  icon,
  isMobile,
  MyModal,
  className,
}: {
  name?: string;
  icon?: React.ReactNode;
  isMobile?: boolean;
  MyModal: React.FC<any>;
  className?: string;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleOpen = () => {
    onOpen();
  };

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button
          size={isMobile ? "sm" : "md"}
          color="primary"
          onPress={() => handleOpen()}
          endContent={icon}
          className={clsx("capitalize", className)}>
          {name}
        </Button>
      </div>
      <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => <MyModal onClose={onClose} />}
        </ModalContent>
      </Modal>
    </>
  );
}
