"server only";
import { PinataSDK } from "pinata";
import { pinata } from "@/app/lib/pinata_config";
  import { v2 as cloudinary } from "cloudinary";

  export const uploadFileToPinata = async (file: File): Promise<string> => {
    const { cid } = await pinata.upload.public.file(file);
    const gatewayUrl = await pinata.gateways.public.convert(cid);
    // const ipfsUrl = `ipfs://${cid}`;
  
    // return {
    //   cid,
    //   ipfsUrl,
    //   gatewayUrl,
    // };
    return gatewayUrl;
  };
  
  export const uploadMetadata = async (
    metadata: Record<string, any>,
    file: File | null
  ) => {
    try {
      if (!file) throw new Error("File is required");
  
      const imageUpload = await uploadFileToPinata(file);
  
      const finalMetadata = {
        ...metadata,
        image: imageUpload,
      };
  
      const blob = new Blob([JSON.stringify(finalMetadata)], {
        type: "application/json",
      });
  
      // Dynamically generate filename based on name or timestamp
      const safeName = metadata.name?.replace(/\s+/g, "_").toLowerCase() || "nft";
      const timestamp = Date.now();
      const filename = `${safeName}_${timestamp}.json`;
  
      const metadataFile = new File([blob], filename);
  
      const metadataUpload = await uploadFileToPinata(metadataFile);
  
      return {
        metadataUri: imageUpload,
        metadataGatewayUrl: metadataUpload,
      };
    } catch (error) {
      console.error("Upload error:", error);
      return { error: "Error while uploading metadata" };
    }
  };

  cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  folder: string
) => {
  return new Promise(async (resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

export const getArrayBuffer = async (file: File): Promise<Buffer> => {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
};
