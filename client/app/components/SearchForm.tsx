import React from "react";

export interface SearchFormProps {
  typedQuery: string;
  setTypedQuery: (typedQuery: string) => void;
  handleKeydown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}
const SearchForm: React.FC<SearchFormProps> = ({
  typedQuery,
  handleKeydown,
  setTypedQuery,
}) => {
  return (
    <div className="flex-grow  w-full mt-5">
      <input
        type="text"
        placeholder="Search NFTs, Collections, Users..."
        className="input input-bordered w-full z-50 text-gray-800 font-semibold"
        value={typedQuery}
        onKeyDown={handleKeydown}
        onChange={(e) => setTypedQuery(e.target.value)}
      />
    </div>
  );
};

export default SearchForm;
