import React, { useState } from "react";
import { searchActor } from "../api/actor";
import { useSearch } from "../hooks";
import { renderItem } from "../utils/helper";
import LiveSearch from "./admin/LiveSearch";
import Label from "./Label";

export default function DirectorSelector({ onSelect }) {
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
    <div>
      <Label htmlFor="director">Director</Label>
      <LiveSearch
        name="director"
        value={value}
        placeholder="Search Profile"
        results={profiles}
        renderItem={renderItem}
        onSelect={handleOnSelect}
        onChange={handleOnChange}
      />
    </div>
  );
}
