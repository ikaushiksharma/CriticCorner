import React, { useState, useEffect } from "react";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import Submit from "./Submit";

const createArray = (count, fill = "") => new Array(count).fill(fill);
const ratings = createArray(10);

export default function RatingForm({ busy, initialState, onSubmit }) {
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [content, setContent] = useState("");
  const handleMouseEnter = (index) => {
    const ratings = createArray(index + 1, index);
    setSelectedRatings([...ratings]);
  };

  const handleOnChange = ({ target }) => {
    setContent(target.value);
  };

  const handleSubmit = () => {
    if (!selectedRatings.length) return;
    const data = {
      rating: selectedRatings.length,
      content,
    };
    onSubmit(data);
  };

  useEffect(() => {
    if (initialState) {
      const { rating, content } = initialState;
      setSelectedRatings(createArray(rating));
      setContent(content);
    }
  }, [initialState]);
  return (
    <div>
      <div className="p-5 dark:bg-primary bg-white rounded space-y-3">
        <div className="flex items-center text-highlight dark:text-highlight-dark relative">
          <StarsOutlined ratings={ratings} onMouseEnter={handleMouseEnter} />
          <div className="flex items-center absolute top-1/2 -translate-y-1/2">
            <StarsFilled ratings={selectedRatings} onMouseEnter={handleMouseEnter} />
          </div>
        </div>

        <textarea
          name=""
          id=""
          value={content}
          onChange={handleOnChange}
          className="w-full h-24 border-2 p-2 dark:text-white text-primary rounded outline-none bg-transparent resize-none"
        ></textarea>
        <Submit busy={busy} onClick={handleSubmit} value="Rate This Movie" />
      </div>
    </div>
  );
}

const StarsOutlined = ({ ratings, onMouseEnter }) => {
  ratings.map((_, index) => {
    return (
      <AiOutlineStar
        className="cursor-pointer"
        onMouseEnter={() => onMouseEnter(index)}
        key={index}
        size={24}
      />
    );
  });
};
const StarsFilled = ({ ratings, onMouseEnter }) => {
  ratings.map((_, index) => {
    return (
      <AiFillStar
        className="cursor-pointer"
        onMouseEnter={() => onMouseEnter(index)}
        key={index}
        size={24}
      />
    );
  });
};
