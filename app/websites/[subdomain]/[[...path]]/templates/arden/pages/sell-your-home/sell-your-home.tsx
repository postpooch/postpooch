import { isSoldListing } from "@/lib/websites/property";
import type { TemplatePageProps } from "../../../types";
import { toArdenProperty } from "../../../property-adapters";
import { ArdenChrome } from "../../components/arden-chrome";
import { ContactForm } from "../../components/forms";
import { PropertyGrid, SectionHeading } from "../../components/ui";
import type { ArdenSettings } from "../../settings";

import type { ArdenSellContent } from "./schema";

export function ArdenSellPage({
  site,
  settings,
  content,
  properties,
}: TemplatePageProps<ArdenSellContent, ArdenSettings>) {
  const sold = properties.filter(isSoldListing).map(toArdenProperty);

  return (
    <ArdenChrome site={site} settings={settings}>
      <section className="valuation">
        <div className="valuationImage">
          <img src={content.image} alt="" />
        </div>
        <div className="valuationForm">
          <p className="eyebrow">{content.eyebrow}</p>
          <h1>{content.title}</h1>
          <p>{content.intro}</p>
          <ContactForm />
        </div>
      </section>
      <section className="section">
        <SectionHeading
          eyebrow={content.resultsEyebrow}
          title={content.resultsTitle}
          copy={content.resultsCopy}
        />
        <PropertyGrid items={sold.slice(0, 3)} />
      </section>
    </ArdenChrome>
  );
}
