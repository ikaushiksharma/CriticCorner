import React from "react";
import { Link } from "react-router-dom";
import { getPoster } from "../../utils/helper";
import GridContainer from "../GridContainer";
import RatingStar from "../RatingStar";
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
      {title ? (
        <h1 className="text-2xl mb-5 dark:text-white text-secondary font-semibold">{title}</h1>
      ) : null}
      <GridContainer>
        {movies.map((movie) => (
          <ListItem movie={movie} key={movie.id} />
        ))}
      </GridContainer>
    </div>
  );
}

const ListItem = ({ movie }) => {
  const { title, poster, responsivePosters, reviews, id } = movie;
  return (
    <Link to={"/movie/" + id}>
      <img
        className="aspect-video object-cover w-full"
        src={getPoster(responsivePosters) || poster}
        alt={title}
      />
      <h1 className="text-lg dark:text-white text-secondary font-semibold" title={movie.title}>
        {trimTitle(title)}
      </h1>
      <RatingStar rating={reviews?.ratingAvg} />
    </Link>
  );
};
