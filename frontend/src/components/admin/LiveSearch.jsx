import React, { forwardRef, useEffect, useRef, useState } from "react";
import { commonInputClasses } from "../../utils/theme";



export default function LiveSearch({
  value='',
  onChange=null,
  placeholder='',
  results = [],
  name,
  selectedResultStyle,
  resultContainerStyle,
  renderItem=null,
  onSelect=null,
  inputStyle,
}) {
  const [displaySearch, setDisplaySearch] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const handleOnFocus = () => {
    if (results.length) setDisplaySearch(true);
  };
  const closeSearch = () => {
    setDisplaySearch(false);
    setFocusedIndex(-1);
  };
  const handleOnBlur = () => {
    setTimeout(() => {
      closeSearch();
    }, 100);
  };
  const handleSelection = (selectedItem) => {
    onSelect(selectedItem);
  };
  const handleKeyDown = ({ key }) => {
    let nextCount;
    const keys = ["ArrowDown", "ArrowUp", "Enter", "Escape"];
    if (!keys.includes(key)) return;

    if (key === keys[0]) {
      nextCount = (focusedIndex + 1) % results.length;
    }
    if (key === keys[1]) {
      nextCount = (focusedIndex + results.length - 1) % results.length;
    }
    if (key === keys[2]) return handleSelection(results[focusedIndex]);
    setFocusedIndex(nextCount);
  };
  const getInputStyle = () => {
    return inputStyle ? inputStyle : commonInputClasses + " border-2 rounded p-1 text-lg";
  };

  return (
    <div className="relative">
      <input
        type="text"
        id={name}
        name={name}
        className={getInputStyle()}
        placeholder={placeholder}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        onKeyDown={handleKeyDown}
        value={value}
        onChange={onChange}
      />
      <SearchResults
        visible={displaySearch}
        onSelect={handleSelection}
        results={results}
        focusedIndex={focusedIndex}
        renderItem={renderItem}
        resultContainerStyle={resultContainerStyle}
        selectedResultStyle={selectedResultStyle}
      />
    </div>
  );
}

const SearchResults = ({
  visible,
  results = [],
  focusedIndex,
  onSelect,
  renderItem,
  resultContainerStyle,
  selectedResultStyle,
}) => {
  const resultContainer = useRef();
  useEffect(() => {
    resultContainer.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [focusedIndex]);

  if (!visible) return null;
  return (
    <div className="absolute z-50 right-0 left-0 top-10 bg-white dark:bg-secondary shadow-md p-2 max-h-64 space-y-2 mt-1 overflow-auto custom-scroll-bar">
      {results.map((result, index) => {
        const getSelectedClass = () => {
          return selectedResultStyle ? selectedResultStyle : "dark:bg-dark-subtle bg-light-subtle";
        };
        return (
          <ResultCard
            ref={index === focusedIndex ? resultContainer : null}
            key={index.toString()}
            item={result}
            renderItem={renderItem}
            resultContainerStyle={resultContainerStyle}
            selectedResultStyle={index === focusedIndex ? getSelectedClass() : ""}
            onClick={() => onSelect(result)}
          />
        );
      })}
    </div>
  );
};

const ResultCard = forwardRef(
  ({ item, renderItem, resultContainerStyle, selectedResultStyle, onClick }, ref) => {
    const getClasses = () => {
      if (resultContainerStyle) return resultContainerStyle + " " + selectedResultStyle;
      return (
        selectedResultStyle +
        // (index === focusedIndex ? "dark:bg-dark-subtle bg-light-subtle" : "") +
        " cursor-pointer rounded overflow-hidden dark:hover:bg-dark-subtle hover:bg-light-subtle transition"
      );
    };
    return (
      <div onClick={onClick} ref={ref} key={item.id} className={getClasses()}>
        {renderItem(item)}
      </div>
    );
  },
);
