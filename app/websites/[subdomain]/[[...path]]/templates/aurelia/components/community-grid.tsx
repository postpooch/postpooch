import type { AureliaCommunity } from "../settings";

type CommunityGridProps = {
  items: readonly AureliaCommunity[];
};

export function CommunityGrid({ items }: CommunityGridProps) {
  return (
    <div className="community-grid">
      {items.map((community, index) => (
        <a
          key={community.slug}
          href={`/communities/${community.slug}`}
          className={`community-card community-card-${(index % 4) + 1}`}
        >
          <img src={community.image} alt="" />
          <div className="community-shade" />
          <div className="community-card-copy">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{community.name}</h3>
            <p>{community.tagline}</p>
            <b>Explore ↗</b>
          </div>
        </a>
      ))}
    </div>
  );
}
