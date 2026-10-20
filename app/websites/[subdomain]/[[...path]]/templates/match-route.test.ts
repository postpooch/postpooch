import { describe, expect, it } from "vitest";

import { matchRoute } from "./match-route";

describe("matchRoute", () => {
  it("matches the homepage for undefined and empty patterns", () => {
    expect(matchRoute(undefined, "/")).toEqual({});
    expect(matchRoute([], "/")).toEqual({});
  });

  it("matches static segments", () => {
    expect(matchRoute(["about"], "/about")).toEqual({});
    expect(matchRoute(["listings"], "/listings")).toEqual({});
  });

  it("extracts dynamic params", () => {
    expect(matchRoute(["listings", "123"], "/listings/[id]")).toEqual({
      id: "123",
    });
    expect(matchRoute(["blog", "hello-world"], "/blog/[slug]")).toEqual({
      slug: "hello-world",
    });
  });

  it("supports nested dynamic routes", () => {
    expect(
      matchRoute(
        ["communities", "sun-city", "listings", "123"],
        "/communities/[slug]/listings/[id]",
      ),
    ).toEqual({ slug: "sun-city", id: "123" });
  });

  it("returns null when length or static segments do not match", () => {
    expect(matchRoute(["team"], "/about")).toBeNull();
    expect(matchRoute(["listings"], "/listings/[id]")).toBeNull();
    expect(matchRoute(["listings", "123", "extra"], "/listings/[id]")).toBeNull();
    expect(matchRoute(["about"], "/")).toBeNull();
  });
});
