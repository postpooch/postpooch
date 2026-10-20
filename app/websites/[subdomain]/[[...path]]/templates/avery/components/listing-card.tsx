import type { AveryProperty } from "../settings";

type ListingCardProps = {
  item: AveryProperty;
  index: number;
};

export function ListingCard({ item, index }: ListingCardProps) {
  return (
    <a className="listing-card" href={`/properties/${item.slug}`}>
      <div className="listing-image">
        <img src={item.image} alt="" />
        <span className="status">{item.status}</span>
        <span className="card-index">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="listing-info">
        <div>
          <h3>{item.address}</h3>
          <p>{item.city}</p>
        </div>
        <strong>{item.price}</strong>
      </div>
      <div className="listing-meta">
        <span>{item.beds} BD</span>
        <span>{item.baths} BA</span>
        <span>{item.sqft} SF</span>
        <span className="arrow">↗</span>
      </div>
    </a>
  );
}

type ListingGridProps = {
  items: readonly AveryProperty[];
};

export function ListingGrid({ items }: ListingGridProps) {
  if (!items.length) return null;
  return (
    <div className="listing-grid">
      {items.map((item, index) => (
        <ListingCard item={item} index={index} key={item.slug} />
      ))}
    </div>
  );
}
