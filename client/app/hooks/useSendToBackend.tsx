import { makeRequest } from "../lib/helperFunctions";
import { useNotification } from "../context/NotificationContext";

export const useHandleSendToBackend = () => {
  const { showToast } = useNotification();
  const sendListingToBackend = async (
    payload: {
      listId: number;
      service: string;
      receipt?: any;
      tokenId?: number;
      price?: number;
      address?:string
    },
    url: string
  ): Promise<any> => {
    try {
      if (!payload || !url) throw new Error("Invalid payload or URL");

      const response = await makeRequest(url, {
        method: payload.service === "listNFT" ? "POST" : "PUT",
        body: JSON.stringify({ payload }),
      });

      if (!response || !response.success) {
        showToast(response?.message || "Something went wrong", "error");
        return;
      }

      showToast(response.message, "success");
      return response;
    } catch (error: any) {
      console.error("Error in sendListingToBackend:", error);
      showToast(error.message || "Something went wrong", "error");
    }

};
return { sendListingToBackend };
};
