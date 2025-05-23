"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { userEditForm } from "@/app/lib/definitions";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "./Modal";
import { makeRequest } from "../lib/helperFunctions";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useNotification } from "../context/NotificationContext";
interface EditFormProps {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const EditForm = ({ modalOpen, setModalOpen }: EditFormProps) => {
  type userEditForm = z.infer<typeof userEditForm>;
  const [pending, setPending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useNotification();
  const router = useRouter();
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<userEditForm>({
    resolver: zodResolver(userEditForm),
    defaultValues: {
      username: "",
      email: "",
    },
  });

  const handleForm = async (data: userEditForm) => {
    console.log(data);
    try {
      setPending(true);
      const response = await makeRequest(
        `/api/auth/user/check?userId=${user?._id}`,
        { method: "PUT", body: JSON.stringify(data) }
      );
      if (!response.success) {
        showToast(response.message, "error");
        setPending(false);
      } else {
        setPending(false);
        setModalOpen(false);
        router.refresh();
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };
  return (
    <Modal
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      onClose={() => {
        setError("");
        reset();
      }}
    >
      <div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <form onSubmit={handleSubmit(handleForm)}>
          <div className=" w-full flex flex-col gap-4">
            <div className="w-full">
              <label className="block mb-1 font-medium text-gray-600">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter Username"
                className="input input-bordered w-full text-gray-800 font-semibold"
                {...register("username")}
              />
              {errors.username && (
                <p className="text-red-500 text-sm">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="w-full">
              <label className="block mb-1 text-gray-600 font-medium">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter Email"
                className="input input-bordered w-full text-gray-800 font-semibold"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <button
              className="btn w-full mt-2 bg-[#302b63] hover:bg-[#4d488a] text-slate-100"
              disabled={pending}
              type="submit"
            >
              {pending ? "Updating..." : "Update"}
            </button>
            {/* {success && <p className="text-green-600 text-center">{success}</p>} */}
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditForm;
