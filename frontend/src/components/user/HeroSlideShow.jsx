import React, { useEffect, useRef, useState, forwardRef } from "react";
import { getLatestUploads } from "../../api/movie";
import { useNotification } from "../../hooks";
import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from "react-icons/ai";
import { Link } from "react-router-dom";

let count = 0;
let intervalId;
let newTime = 0;
let lastTime = 0;
export default function HeroSlideShow() {
  const slideRef = useRef();
  const clonedSlideRef = useRef();
  const [slide, setSlide] = useState({});
  const [visible, setVisible] = useState(false);
  const [upNext, setUpNext] = useState([]); // [slide, setSlide
  const [clonedSlide, setClonedSlide] = useState({});
  const [slides, setSlides] = useState([]);
  const { updateNotification } = useNotification();
  const fetchLatestUploads = async (signal) => {
    const { error, movies } = await getLatestUploads(signal);
    if (error) return updateNotification("error", error);
    setSlides([...movies]);
    setSlide(movies[0]);
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
    startSlideShow();
  };

  const startSlideShow = () => {
    intervalId = setInterval(() => {
      newTime = Date.now();
      const delta = newTime - lastTime;
      if (delta < 4000) return clearInterval(intervalId);
      handleOnNextClick();
    }, 3500);
  };

  const pauseSlideShow = () => {
    clearInterval(intervalId);
  };

  const updateUpNext = (currentIndex) => {
    if (!slides.length) return;
    const upNextCount = currentIndex + 1;
    const end = upNextCount + 3;
    let newSlides = [...slides];
    newSlides = newSlides.slice(upNextCount, end);
    if (!newSlides.length) {
      newSlides = [...slides].slice(0, 3);
    }
    setUpNext([...newSlides]);
  };

  const handleOnNextClick = () => {
    lastTime = Date.now();
    pauseSlideShow();
    setClonedSlide(count);
    count = (count + 1) % slides.length;
    setSlide(slides[count]);

    clonedSlideRef.current.classList.add("slide-out-to-left");
    slideRef.current.classList.add("slide-in-from-right");
    updateUpNext(count);
  };
  const handleOnPrevClick = () => {
    pauseSlideShow();
    setClonedSlide(count);
    count = (count - 1 + slides.length) % slides.length;
    setSlide(slides[count]);
    clonedSlideRef.current.classList.add("slide-out-to-right");
    slideRef.current.classList.add("slide-in-from-left");
    updateUpNext(count);
  };
  const handleOnVisibilityChange = () => {
    const visibility = document.visibilityState;
    if (visibility === "visible") {
      setVisible(true);
    }
    if (visibility === "hidden") {
      setVisible(false);
    }
  };
  useEffect(() => {
    const ac = new AbortController();
    fetchLatestUploads(ac.signal);
    document.addEventListener("visibilitychange", handleOnVisibilityChange);

    return () => {
      pauseSlideShow();
      document.removeEventListener("visibilitychange", handleOnVisibilityChange);
      ac.abort();
    };
  }, []);

  useEffect(() => {
    if (slides.length && visible) {
      startSlideShow();
      updateUpNext(count);
    } else pauseSlideShow();
  }, [slides.length, visible]);
  return (
    <div className="w-full flex">
      <div className="md:w-4/5 w-full aspect-video relative overflow-hidden">
        <Slide title={slide.title} src={slide.poster} ref={slideRef} id={slide.id} />
        <Slide
          ref={clonedSlideRef}
          onAnimationEnd={handleAnimationEnd}
          className="absolute inset-0"
          src={clonedSlide.poster}
          title={clonedSlide.title}
          id={slide.id}
        />

        <SlideShowController onNextClick={handleOnNextClick} onPrevClick={handleOnPrevClick} />
      </div>
      <div className="w-1/5 md:block hidden space-y-3 px-3">
        <h1 className="font-semibold text-2xl text-primary dark:text-white">Up Next</h1>
        {upNext.map(({ poster, id }) => {
          return <img key={id} className="aspect-video rounded object-cover" src={poster} alt="" />;
        })}
      </div>
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

const Slide = forwardRef(({ props, ref }) => {
  const { title, id, src, className = "", ...rest } = props;
  return (
    <Link
      to={"/movie/" + id}
      ref={ref}
      className={"w-full cursor-pointer block " + className}
      {...rest}
    >
      {src ? <img className="aspect-video object-cover" src={src} alt="" /> : null}
      {title ? (
        <div className="absolute inset-0 flex flex-col justify-end py-3 bg-gradient-to-t from-white via-transparent dark:to-primary dark:via-transparent">
          <h1 className="font-semibold text-4xl dark:text-highlight-dark text-highlight">
            {title}
          </h1>
        </div>
      ) : null}
    </Link>
  );
});
