import React from "react";
import { IoCaretBackSharp, IoCaretForward } from "react-icons/io5";

const Pagination = () => {
  return (
    <div className="flex items-center gap-4 p-2">
      <button
        className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        onClick={() => setCurrentPage(Math.max((currentPage ?? 1) - 1, 1))}
        disabled={currentPage === 1}
      >
        <IoCaretBackSharp className="text-violet-700" />
      </button>
      <span className="font-semibold font-sans">
        Page {currentPage} of {totalPages}
      </span>
      <button
        className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        onClick={() =>
          setCurrentPage(Math.min((currentPage ?? 1) + 1, totalPages))
        }
        disabled={currentPage === totalPages}
      >
        <IoCaretForward className="text-violet-700" />
      </button>
    </div>
  );
};

export default Pagination;
