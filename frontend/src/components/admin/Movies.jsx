import React, { useEffect, useState } from "react";
import { getMovies } from "../../api/movie";
import { useNotification } from "../../hooks";
import MovieListItem from "../MovieListItem";
import NextAndPrevButton from "../NextAndPrevButton";
const limit = 10;
let currentPageNo = 0;
export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [reachedToEnd, setReachedToEnd] = useState(false);
  const { updateNotification } = useNotification();

  const fetchMovies = async (pageNo) => {
    const { error, movies } = await getMovies(pageNo, limit);
    if (error) return updateNotification("error", error);
    if (!movies.length) {
      currentPageNo = pageNo - 1;
      return setReachedToEnd(true);
    }
    setMovies([...movies]);
  };
  const handleOnNextClick = () => {
    if (reachedToEnd) return updateNotification("error", "You are on the last page");
    currentPageNo++;
    fetchMovies(currentPageNo);
  };
  const handleOnPrevClick = () => {
    if (currentPageNo === 0) return updateNotification("error", "You are on the first page");
    if (reachedToEnd) setReachedToEnd(false);
    currentPageNo--;
    fetchMovies(currentPageNo);
  };
  useEffect(() => {
    fetchMovies(currentPageNo);
  }, []);

  return (
    <div className="space-y-5 p-5">
      {movies.map((movie, index) => (
        <MovieListItem key={movie.id} movie={movie} />
      ))}
      <NextAndPrevButton onPrevClick={handleOnPrevClick} onNextClick={handleOnNextClick} />
    </div>
  );
}
