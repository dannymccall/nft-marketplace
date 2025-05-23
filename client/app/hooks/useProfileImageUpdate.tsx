import { useState } from "react";
import { blobToFile, makeRequest } from "../lib/helperFunctions";
import { UserAuthProps } from "../lib/types";

type MessageType = {
  showMessage: boolean;
  message: string;
  type: "successMessage" | "error";
};

export function useProfileImageUpdate({
  user,
  updateProfilePicture,
  formRef,
}: {
  user: UserAuthProps;
  updateProfilePicture: (data: any) => void;
  formRef: React.RefObject<HTMLFormElement>;
}) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<MessageType>({
    showMessage: false,
    message: "",
    type: "successMessage",
  });

  const submit = async (profileImage: Blob | any) => {
    setPending(true);
    const photo: any = await blobToFile(profileImage, "profile-image");
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    formData.append("profileImage", photo);

    const response = await makeRequest(
      `/api/auth/user/check?userId=${user._id}`,
      {
        method: "PUT",
        body: formData,
      }
    );

    if (!response.success) {
      console.log({ response });
      setPending(false);
      setMessage({
        showMessage: true,
        message: response.message,
        type: "error",
      });
      return;
    }

    updateProfilePicture(response.updatedProfilePicture);
    setPending(false);
    console.log({ response });
    setMessage({
      showMessage: true,
      message: response.message,
      type: "successMessage",
    });

    let timeOut: NodeJS.Timeout = setTimeout(() => {
      setMessage((prev) => ({ ...prev, showMessage: false }));
    }, 1000);

    return () => clearTimeout(timeOut);
  };

  return {
    submit,
    pending,
    message,
  };
}