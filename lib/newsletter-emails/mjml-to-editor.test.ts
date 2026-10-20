import { describe, expect, it } from "vitest";

import { importMjmlToEditorContent } from "./mjml-to-editor";

describe("importMjmlToEditorContent", () => {
  it("uses the official importer to produce native editor blocks", () => {
    const content = importMjmlToEditorContent(`
      <mjml>
        <mj-head>
          <mj-preview>New listings this week</mj-preview>
          <mj-attributes>
            <mj-all font-family="Arial, sans-serif" />
            <mj-text color="#24312d" />
          </mj-attributes>
        </mj-head>
        <mj-body background-color="#f3f1eb" width="600px">
          <mj-section background-color="#ffffff" padding="24px">
            <mj-column width="65%">
              <mj-text font-size="24px" font-weight="700">Market update</mj-text>
              <mj-image src="https://example.com/home.jpg" alt="A home" />
            </mj-column>
            <mj-column width="35%">
              <mj-button href="https://example.com">View listings</mj-button>
              <mj-spacer height="12px" />
              <mj-divider border-color="#ead9c8" />
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `);

    expect(content.settings).toMatchObject({
      width: 600,
      backgroundColor: "#f3f1eb",
      preheaderText: "New listings this week",
    });
    expect(content.blocks).toHaveLength(1);
    expect(content.blocks[0]).toMatchObject({
      type: "section",
      columns: "2-1",
    });
    expect(content.blocks[0]?.type).toBe("section");
    if (content.blocks[0]?.type === "section") {
      expect(content.blocks[0].children[0]?.map((block) => block.type)).toEqual(
        expect.arrayContaining(["image"]),
      );
      expect(content.blocks[0].children[1]?.map((block) => block.type)).toEqual(
        ["button", "spacer", "divider"],
      );
    }
  });

  it("does not invent all-corner radius from top-only MJML radius", () => {
    const content = importMjmlToEditorContent(`
      <mjml>
        <mj-body background-color="#f3f1eb">
          <mj-section
            background-color="#ffffff"
            padding="24px 30px 20px"
            border-radius="18px 18px 0 0"
          >
            <mj-column>
              <mj-text font-size="22px" font-weight="700">[AGENT NAME]</mj-text>
            </mj-column>
          </mj-section>
          <mj-section background-color="#ffffff" padding="0 30px">
            <mj-column>
              <mj-image
                src="https://example.com/home.jpg"
                alt="Listing"
                border-radius="0"
              />
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `);

    const header = content.blocks[0];
    expect(header?.type).toBe("section");
    if (header?.type === "section") {
      // Official importer omits unsupported multi-corner radius rather than
      // forcing a uniform radius that creates a visual "dip".
      expect(header.borderRadius ?? 0).toBe(0);
    }
  });
});
