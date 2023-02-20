import React from "react";
import { BsTrash, BsBoxArrowUpRight, BsPencilSquare } from "react-icons/bs";
export default function LatestUploads() {
  return (
    <div className="bg-white shadow dark:shadow dark:bg-secondary p-5 rounded col-span-2">
      <h1 className="font-semibold text-2xl mb-2 text-primary dark:text-white">Recent Uploads</h1>
      <MovieListItem
        movie={{
          poster: "",
          title: "The Shawshank Redemption",
          genres: ["Action", "Drama"],
          status: "Public",
        }}
      />
    </div>
  );
}
const MovieListItem = ({ movie, onDeleteClick, onEditClick, onOpenClick }) => {
  const { poster, title, status, genres = [] } = movie;
  return (
    <table className="w-full border-b">
      <tbody>
        <tr>
          <td>
            <div className="w-24">
              <img className="w-full aspect-video" src={poster} alt="" />
            </div>
          </td>
          <td className="w-full pl-5">
            <div>
              <h1 className="text-lg font-semibold text-primary dark:text-white">{title}</h1>
              <div className="space-x-2">
                {genres.map((genre, index) => (
                  <span key={genre + index} className="text-primary dark:text-white text-xs">
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </td>
          <td className="px-5">
            <p className="text-primary dark:text-white">{status}</p>
          </td>
          <td>
            <div className="flex items-center space-x-3 text-primary dark:text-white text-lg">
              <button onClick={onDeleteClick} type="button">
                <BsTrash />
              </button>
              <button onClick={onEditClick} type="button">
                <BsPencilSquare />
              </button>
              <button onClick={onOpenClick} type="button">
                <BsBoxArrowUpRight />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
