"use client";
import React, { useRef, useState } from "react";
import { FaUserLarge } from "react-icons/fa6";
import { CustomFile, UserproileProps } from "@/app/lib/types";
import { useProfile } from "@/app/context/ProfileContext";
import TabComponent from "@/app/components/Tabs";
import UserContactDetails from "./UserContactDetails";
import UserNFTs from "./UserNFTs";
import { IoIosCamera } from "react-icons/io";
import Image from "next/image";
import { useProfileImageUpdate } from "@/app/hooks/useProfileImageUpdate";
import ProfileModal from "@/app/components/ProfileModal";
import { useAuth } from "@/app/context/AuthContext";
import EditForm from "@/app/components/EditForm";
import NFTs from "../nfts/NFTs";
interface UserProfileInterface {
  user: UserproileProps;
}
const UserProfile = ({ user }: UserProfileInterface) => {
  const { profilePicture, updateProfilePicture } = useProfile();
  const nonListedNFTs = user.OwnedNFTs.filter((nft) => !nft.listed && nft.owner.address === user.address);
  const OwnedNFTs = user.OwnedNFTs.filter((nft) =>  nft.owner.address === user.address);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState<string | any>();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null) as React.MutableRefObject<HTMLFormElement>;
  const [openEditModal, setOpenEditModal] = useState<boolean>(false)

  const {user: authUser} = useAuth();
    const { submit, pending, message } = useProfileImageUpdate({
    user: authUser!,
    updateProfilePicture,
    formRef,
  });
  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const files = event.target.files?.[0];
    console.log(files);
    if (files) {
      const fileUrl: CustomFile | any = URL.createObjectURL(files);
      setProfileImage(fileUrl);
      setModalOpen(true) 
    }
  };

  const onClose = () => setProfileImage("");
  const handleOnClick = () => setOpenEditModal(true);
  const handleClick = () => {
    fileInputRef?.current?.click();
  };
  const tabs = [
    {
      label: "Contact Details",
      content: <UserContactDetails  handleOnClick={handleOnClick} user={user}/>,
    },
    {
      label: "NFTs",
      content: <NFTs nfts={OwnedNFTs} />,
    },
    {
      label: "Non-Listed NFTs",
      content: <UserNFTs nfts={nonListedNFTs} />,
    },
  ];

  const useProfilePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    await submit(profileImage)
  };
  return (
    <div className="mt-30 flex flex-col relative">
      <div className="flex flex-col gap-3 items-center justify-center relative">
        <div
          className="w-30 h-30 rounded-full bg-gray-300 flex items-center justify-center relative cursor-pointer"
          onClick={handleClick}
        >
          {profilePicture ? (
            <div className="w-28 h-28 rounded-full shadow-md">
              <Image
                src={profilePicture}
                alt="profile-picture"
                width={300}
                height={300}
                className="rounded-full w-full h-full shadow-md border-white border-solid"
              />
            </div>
          ) : (
            <FaUserLarge size={50} className="text-gray-600" />
          )}
          <IoIosCamera
            className="w-full cursor-pointer  absolute top-24 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white"
            size={25}
          />
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>
        <p className="text-sm text-gray-300">{user.address}</p>
      </div>
      <div>
        <TabComponent tabs={tabs} className="max-w-3xl gap-10" />
      </div>
      <ProfileModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        profileImage={profileImage}
        handleClick={handleClick}
        pending={pending}
        message={message}
        useProfilePhoto={useProfilePhoto}
        formRef={formRef}
        onClose={onClose}
      />
      <EditForm modalOpen={openEditModal} setModalOpen={setOpenEditModal}/>
    </div>
  );
};

export default UserProfile;
