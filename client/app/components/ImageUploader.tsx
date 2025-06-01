import React, { ChangeEvent, Ref, RefObject } from "react";
import { FaUpload } from "react-icons/fa";

interface ImageUploadProps {
  file: File | null;
  preview: string | null;
  error: string | null;
  handleUploadClick: () => void;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: Ref<HTMLInputElement>;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  file,
  preview,
  error,
  handleUploadClick,
  handleFileChange,
  fileInputRef,
}) => {
  return (
    <div className="md:w-1/2 w-full mb-4">
      <div className="flex flex-col lg:items-center justify-center w-96 h-full border-gray-300 rounded-lg mb-4">
        <label
          className="flex flex-col items-center justify-center w-64 lg:w-full h-96 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-[#302b63]"
          onClick={handleUploadClick}
        >
          {file ? (
            preview && (
              <img
                src={preview}
                alt="preview"
                className="w-full h-96 rounded-lg"
              />
            )
          ) : (
            <FaUpload className="text-gray-400 text-4xl" />
          )}
        </label>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <p className="text-gray-500 text-sm mt-1">PNG, JPG, GIF up to 10MB</p>
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="file-input file-input-bordered w-full hidden"
        ref={fileInputRef}
      />
    </div>
  );
};

export default ImageUpload;
