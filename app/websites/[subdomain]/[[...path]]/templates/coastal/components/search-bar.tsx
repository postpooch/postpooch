type SearchBarProps = {
  locations?: readonly string[];
};

export function SearchBar({
  locations = ["Newport Beach", "Laguna Beach", "Newport Coast"],
}: SearchBarProps) {
  return (
    <form className="searchBar" action="/search" method="get">
      <select aria-label="Location" name="location" defaultValue="">
        <option value="">Location</option>
        {locations.map((location) => (
          <option key={location} value={location}>
            {location}
          </option>
        ))}
      </select>
      <select aria-label="Property type" name="type" defaultValue="">
        <option value="">Property Type</option>
        <option>Single Family</option>
        <option>Condo</option>
      </select>
      <select aria-label="Beds" name="beds" defaultValue="">
        <option value="">Beds</option>
        <option>3+</option>
        <option>4+</option>
        <option>5+</option>
      </select>
      <input aria-label="Minimum price" name="min" placeholder="Min. Price" />
      <input aria-label="Maximum price" name="max" placeholder="Max. Price" />
      <button type="submit">Search</button>
    </form>
  );
}
