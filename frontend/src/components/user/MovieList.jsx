import React from "react";
import { AiFillStar } from "react-icons/ai";
import { Link } from "react-router-dom";
import GridContainer from "../GridContainer";
const trimTitle = (text = "") => {
  const maxLength = 20;
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};
export default function MovieList({ title, movies = [] }) {
  if (!movies.length) return null;
  return (
    <div>
      <h1 className="text-2xl mb-5 dark:text-white text-secondary font-semibold">{title}</h1>
      <GridContainer>
        {movies.map((movie) => (
          <ListItem movie={movie} key={movie.id} />
        ))}
      </GridContainer>
    </div>
  );
}

const ListItem = ({ movie }) => {
  const { title, poster, reviews, id } = movie;
  return (
    <Link to={"/movie/" + id}>
      <img className="aspect-video object-cover" src={poster} alt={title} />
      <h1 className="text-lg dark:text-white text-secondary font-semibold" title={movie.title}>
        {trimTitle(title)}
      </h1>
      {reviews.ratingAvg ? (
        <p className="text-highlight dark:text-highlight-dark flex items-center space-x-1">
          <span>{movie.review?.ratingAvg}</span>
          <AiFillStar />
        </p>
      ) : (
        <p className="text-highlight dark:text-highlight-dark flex items-center space-x-1">
          No Reviews
        </p>
      )}
    </Link>
  );
};
