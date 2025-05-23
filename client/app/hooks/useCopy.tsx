import { useState } from "react";

export const useHandleCopy = () => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    if (!text || !navigator.clipboard) {
      console.error("Invalid text or Clipboard API not supported");
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return { copied, copyToClipboard, setCopied };
};
