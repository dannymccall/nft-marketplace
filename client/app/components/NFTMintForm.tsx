import React from "react";
import { UseFormRegister, FieldErrors, FieldValues } from "react-hook-form";

interface NFTMintFormProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  uploading: boolean;
  minting: boolean;
  // onSubmit should be handled in the parent with `handleSubmit`
}

const NFTMintForm: React.FC<NFTMintFormProps> = ({
  register,
  errors,
  uploading,
  minting,
}) => {
  return (
    <div className="md:w-1/2 w-full flex flex-col gap-4">
      {/* Name Field */}
      <div>
        <label className="block mb-1 text-slate-200 font-medium">Name</label>
        <input
          type="text"
          placeholder="Enter name"
          className="input input-bordered w-full text-gray-800 font-semibold"
          {...register("name", { required: "Name is required" })}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message as string}</p>
        )}
      </div>

      {/* Price Field */}
      {/* <div>
        <label className="block mb-1 text-slate-200 font-medium">Price</label>
        <input
          type="number"
          placeholder="Enter price"
          step="0.01"
          min="0.01"
          className="input input-bordered w-full text-gray-800 font-semibold"
          {...register("price", {
            valueAsNumber: true,
            min: { value: 0.01, message: "Price must be at least 0.01" },
          })}
        />
        {errors.price && (
          <p className="text-red-500 text-sm">{errors.price.message as string}</p>
        )}
      </div> */}

      {/* Description Field */}
      <div>
        <label className="block mb-1 text-slate-200 font-medium">Description</label>
        <textarea
          placeholder="Enter description"
          className="textarea textarea-bordered w-full h-32 text-gray-800 font-semibold"
          {...register("description", { required: "Description is required" })}
        />
        {errors.description && (
          <p className="text-red-500 text-sm">
            {errors.description.message as string}
          </p>
        )}
      </div>

      {/* Collection Dropdown */}
      <div>
        <label className="block mb-1 text-slate-200 font-medium">Collection</label>
        <select
          className="select select-bordered w-full text-gray-800 font-semibold cursor-pointer"
          {...register("collection", { required: "Collection is required" })}
        >
          <option value="">Select collection</option>
          <option value="music">Music</option>
          <option value="art">Art</option>
          <option value="game">Game</option>
        </select>
        {errors.collection && (
          <p className="text-red-500 text-sm">
            {errors.collection.message as string}
          </p>
        )}
      </div>

      {/* Checkbox */}
      <div className="flex items-center gap-2 mb-4">
        <label className="block mb-1 text-slate-200 font-medium">Sell NFT</label>
        <input
          type="checkbox"
          className="checkbox checkbox-info"
          {...register("sell")}
        />
      </div>

      {/* Submit Button */}
      <button
        className="btn w-full bg-[#302b63] hover:bg-[#4d488a] text-white"
        disabled={uploading || minting}
        type="submit"
      >
        {uploading ? "Uploading..." : minting ? "Minting..." : "Mint NFT"}
      </button>
    </div>
  );
};

export default NFTMintForm;
