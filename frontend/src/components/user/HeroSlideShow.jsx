import React, { useEffect, useRef, useState } from "react";
import { getLatestUploads } from "../../api/movie";
import { useNotification } from "../../hooks";
import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from "react-icons/ai";
export default function HeroSlideShow() {
  const slideRef = useRef();
  const clonedSlideRef = useRef();
  const [slide, setSlide] = useState({});
  const [clonedSlide, setClonedSlide] = useState({});
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { updateNotification } = useNotification();
  const fetchLatestUploads = async () => {
    const { error, movies } = await getLatestUploads();
    if (error) return updateNotification("error", error);
    setSlides([...movies]);
    setSlide(movies[currentIndex]);
  };

  const handleAnimationEnd = () => {
    const classes = [
      "slide-in-from-right",
      "slide-out-to-left",
      "slide-out-to-right",
      "slide-in-from-left",
    ];
    slideRef.current.classList.remove(...classes);
    clonedSlideRef.current.classList.remove(...classes);
    setClonedSlide({});
  };

  useEffect(() => {
    fetchLatestUploads();
  }, []);

  const handleOnNextClick = () => {
    setClonedSlide(currentIndex);
    const nextSlideIndex = (currentIndex + 1) % slides.length;
    setSlide(slides[nextSlideIndex]);
    setCurrentIndex(nextSlideIndex);
    clonedSlideRef.current.classList.add("slide-out-to-left");
    slideRef.current.classList.add("slide-in-from-right");
  };
  const handleOnPrevClick = () => {
    setClonedSlide(currentIndex);
    const prevSlideIndex = (currentIndex - 1 + slides.length) % slides.length;
    setSlide(slides[prevSlideIndex]);
    setCurrentIndex(prevSlideIndex);
    clonedSlideRef.current.classList.add("slide-out-to-right");
    slideRef.current.classList.add("slide-in-from-left");
  };
  return (
    <div className="w-full flex">
      <div className="w-4/5 aspect-video relative overflow-hidden">
        <img
          onAnimationEnd={handleAnimationEnd}
          ref={slideRef}
          className="aspect-video object-cover"
          src={slide.poster}
          alt=""
        />
        <img
          onAnimationEnd={handleAnimationEnd}
          ref={clonedSlideRef}
          className="aspect-video object-cover absolute inset-0"
          src={clonedSlide.poster}
          alt=""
        />
        <SlideShowController onNextClick={handleOnNextClick} onPrevClick={handleOnPrevClick} />
      </div>
      <div className="w-1/5 aspect-video"></div>
    </div>
  );
}

const SlideShowController = ({ onPrevClick, onNextClick }) => {
  const btnClass = "bg-primary rounded border-2 text-white text-xl p-2 outline-none";
  return (
    <div className="absolute top-1/2 -translate-y-1/2 w-full flex items-center justify-between px-2">
      <button onClick={onPrevClick} className={btnClass} type="button">
        <AiOutlineDoubleLeft />
      </button>
      <button onClick={onNextClick} className={btnClass} type="button">
        <AiOutlineDoubleRight />
      </button>
    </div>
  );
};
