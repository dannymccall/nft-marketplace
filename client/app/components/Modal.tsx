import React from "react";

interface ModalProps {
  modalOpen?: boolean;
  setModalOpen: (open: boolean) => boolean | void;
  children?: React.ReactNode;
  width?: string;
  onClose: () => void;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  modalOpen,
  setModalOpen,
  children,
  width,
  onClose,
  className
}) => {
  return (
    <div className={`modal ${className} ${modalOpen ? "modal-open" : ""} w-full px-5 z-50`}>
      <div className={`modal-box relative ${width}`}>
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button
            onClick={() => {
              setModalOpen(false);
              if (onClose) {
                onClose();
              }
            }}
            className="btn btn-sm btn-circle text-gray-500 btn-ghost absolute right-2 top-2"
          >
            ✕
          </button>
        </form>
        {children}
      </div>
    </div>
  );
};

export default Modal;
