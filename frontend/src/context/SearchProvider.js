import React, { createContext, useState } from "react";
import { useNotification } from "../hooks";

const SearchContext = createContext();

let timeoutId;
const debounce = (func, delay) => {
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

export default function SearchProvider() {
  const [searching, setSearching] = useState("");
  const [results, setResults] = useState([]);
  const [resultNotFound, setResultNotFound] = useState(false);

  const handleSearch = (method, query, updaterFun) => {
    setSearching(true);
    if (!query.trim()) {
      updaterFun && updaterFun([]);
      resetSearch();
    }
    debounceFunc(method, query, updaterFun);
  };

  const { updateNotification } = useNotification();

  const search = async (method, query, updaterFun) => {
    const { error, results } = await method(query);
    if (error) return updateNotification("error", error);
    if (!results.length) return setResultNotFound(true);
    setResults(results);
    updaterFun && updaterFun([...results]);
  };

  const debounceFunc = debounce(search, 300);

  const resetSearch = () => {
    setResults([]);
    setSearching(false);
    setResultNotFound(false);
  };
  return (
    <SearchContext.Provider
      value={{ handleSearch, resetSearch, searching, resultNotFound, results }}
    >
      SearchProvider
    </SearchContext.Provider>
  );
}
