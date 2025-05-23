// components/ToastContainer.tsx

"use client";
import { useNotification } from "@/app/context/NotificationContext";
import { AnimatePresence, motion } from "framer-motion";
import {
  HiCheckCircle,
  HiXCircle,
  HiExclamationCircle,
  HiInformationCircle,
} from "react-icons/hi";

const getIcon = (type: string) => {
  const iconClass = "w-5 h-5";

  switch (type) {
    case "success":
      return <HiCheckCircle className={`${iconClass} text-green-500`} />;
    case "error":
      return <HiXCircle className={`${iconClass} text-red-500`} />;
    case "warning":
      return <HiExclamationCircle className={`${iconClass} text-yellow-500`} />;
    case "info":
    default:
      return <HiInformationCircle className={`${iconClass} text-blue-500`} />;
  }
};

export default function ToastContainer() {
  const { toasts } = useNotification();

  return (
    <div className="fixed bottom-4 right-4 z-[9999] space-y-2">
      <AnimatePresence initial={false}>
        {toasts.map(({ id, message, type }) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3 }}
            className="flex items-start gap-3 bg-white border border-gray-200 shadow-lg rounded-lg px-4 py-3 w-[280px]"
          >
            {getIcon(type)}
            <p className="text-sm text-gray-800">{message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
