import { Search, X } from "lucide-react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const SearchInput = ({
  query,
  changeQuery,
  changeInput,
  input,
}: {
  query: string;
  input: string;
  changeQuery: (str: string) => void;
  changeInput: (str: string) => void;
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const id = setTimeout(() => {
      changeQuery(input.trim());
    }, 400);

    return () => clearTimeout(id);
  }, [input]);

  return (
    <div className="w-9/10 max-w-110 mx-auto relative">
      <Search className="absolute text-slate-700 left-5 top-1/2 -translate-y-1/2 dark:text-gray-400" />
      {query.length > 0 && (
        <button
          onClick={() => {
            changeQuery("");
            changeInput("")
            searchParams.delete("query");
            setSearchParams(searchParams);
          }}
          className="w-8 h-8 rounded-full flex justify-center items-center hover:bg-slate-300/50 dark:hover:bg-gray-600 absolute right-4 top-1/2 -translate-y-1/2"
        >
          <X className=" text-slate-700  dark:text-gray-400" />
        </button>
      )}
      <input
        type="text"
        className="w-full bg-[#EEF0FF] dark:bg-gray-700 text-slate-700 dark:text-gray-400 py-2.5 border border-slate-400 rounded-lg pl-13 px-9 text-[18px]"
        placeholder="Search for something..."
        value={input}
        onChange={(e) => {
          changeInput(e.target.value);
        }}
      />
    </div>
  );
};

export default SearchInput;
