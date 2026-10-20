"use client";

import { useState } from "react";

type SearchBarProps = {
  placeholder: string;
};

export function SearchBar({ placeholder }: SearchBarProps) {
  const [query, setQuery] = useState("");

  return (
    <form className="search-bar" onSubmit={(event) => event.preventDefault()}>
      <input
        placeholder={placeholder}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        aria-label={placeholder}
      />
      <button type="submit" aria-label="Search">
        ↗
      </button>
    </form>
  );
}
