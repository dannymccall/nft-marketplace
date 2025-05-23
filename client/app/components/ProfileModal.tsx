import React, { Ref, useRef } from "react";
import Modal from "./Modal";
import Image from "next/image";

interface ProfileFormProps {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  message: {
    type?: string;
    message?: string;
    showMessage?: boolean;
  };
  useProfilePhoto: (e: React.FormEvent) => void;
  profileImage: string;
  handleClick: () => void;
  pending: boolean;
  formRef: Ref<HTMLFormElement>;
  onClose: () => void;
  //   setPending: React.Dispatch<React.SetStateAction<boolean>>
}
const ProfileModal = ({
  modalOpen,
  setModalOpen,
  message,
  useProfilePhoto,
  profileImage,
  handleClick,
  pending,
  formRef,
  onClose
}: ProfileFormProps) => {

  return (
    <Modal modalOpen={modalOpen} setModalOpen={setModalOpen} onClose={onClose}>
      <div className="w-full flex flex-col gap-5 items-center">
        {message.showMessage && message.type === "error" && (
          <p className="w-1/2 text-red-500 p-1 font-semibold text-center bg-red-200 m-4 border-2 border-red-600 rounded-md desktop:text-base laptop:text-base tablet:text-sm phone:text-xs">
            {message.message}
          </p>
        )}
        <form
          method="post"
          className="w-full flex flex-col gap-5 items-center"
          onSubmit={useProfilePhoto}
          ref={formRef}
        >
          <div className="w-32 lg:w-30 h-32 lg:h-30">
            {
              profileImage && 
            <Image
              src={profileImage}
              alt="profile-img"
              className="rounded-full border-white border-solid w-full h-full"
              width={32}
              height={32}
            />
            }
          </div>
          <div className="flex gap-5">
            <button
              className="btn btn-sm bg-violet-600 text-slate-100"
              type="submit"
            >
              {pending && (
                <span className="loading loading-spinner loading-sm"></span>
              )}
              Use Picture
            </button>
            <button
              className="btn btn-sm btn-error text-slate-100"
              onClick={handleClick}
              type="button"
              disabled={pending}
            >
              Select Another
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ProfileModal;
