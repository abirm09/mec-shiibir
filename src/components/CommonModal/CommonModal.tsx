import { cn } from "@/lib/utils";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
const CommonModal = ({
  children,
  open,
  handleOpen,
  modalTitle,
  className,
  isCloseOnOutsideClick = false,
}: {
  children: React.ReactNode;
  open: boolean;
  handleOpen: (open: boolean) => void;
  modalTitle?: string;
  className?: string;
  isCloseOnOutsideClick?: boolean;
}) => {
  return (
    <Dialog onOpenChange={handleOpen} open={open}>
      <DialogContent
        className={`${cn("", className)}`}
        onPointerDownOutside={(event) => {
          if (isCloseOnOutsideClick) {
            event.preventDefault();
          }
        }}
        aria-describedby=""
      >
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default CommonModal;
