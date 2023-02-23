import React, { createContext, useState } from "react";
import { getMovies } from "../api/movie";
import { useNotification } from "../hooks";
export const MovieContext = createContext();
const limit = 10;
let currentPageNo = 0;
export default function MoviesProvider({ children }) {
  const { updateNotification } = useNotification();
  const [movies, setMovies] = useState([]);
  const [latestUploads, setLatestUploads] = useState([]);
  const [reachedToEnd, setReachedToEnd] = useState(false);
  const fetchMovies = async (pageNo = currentPageNo) => {
    const { error, movies } = await getMovies(pageNo, limit);
    if (error) return updateNotification("error", error);
    if (!movies.length) {
      currentPageNo = pageNo - 1;
      return setReachedToEnd(true);
    }
    setMovies([...movies]);
  };
  const fetchNextPage = () => {
    if (reachedToEnd) return updateNotification("error", "You are on the last page");
    currentPageNo++;
    fetchMovies(currentPageNo);
  };
  const fetchPrevPage = () => {
    if (currentPageNo === 0) return updateNotification("error", "You are on the first page");
    if (reachedToEnd) setReachedToEnd(false);
    currentPageNo--;
    fetchMovies(currentPageNo);
  };
  const fetchLatestUploads = async (qty = 5) => {
    const { error, movies } = await getMovies(0, qty);
    if (error) return updateNotification("error", error);
    setLatestUploads([...movies]);
  };
  return (
    <MovieContext.Provider
      value={{
        movies,
        fetchMovies,
        fetchNextPage,
        fetchPrevPage,
        latestUploads,
        fetchLatestUploads,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
}
