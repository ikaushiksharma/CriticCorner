import React, { useState } from "react";
import { searchActor } from "../api/actor";
import { useSearch } from "../hooks";
import { renderItem } from "../utils/helper";
import LiveSearch from "./admin/LiveSearch";

export default function WritersSelector({ onSelect }) {
  const [value, setValue] = useState("");
  const [profiles, setProfiles] = useState([]);

  const { handleSearch, resetSearch } = useSearch();

  const handleOnChange = ({ target }) => {
    const { value } = target;
    setValue(value);
    handleSearch(searchActor, value, setProfiles);
  };
  const handleOnSelect = (profile) => {
    setValue(profile.name);
    onSelect(profile);
    setProfiles([]);
    resetSearch();
  };

  return (
    <LiveSearch
      name="writers"
      placeholder="Search Profile"
      results={profiles}
      renderItem={renderItem}
      onSelect={handleOnSelect}
      onChange={handleOnChange}
      value={value}
    />
  );
}
