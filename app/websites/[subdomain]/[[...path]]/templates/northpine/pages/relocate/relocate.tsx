import type { TemplatePageProps } from "../../../types";
import type { NorthpineSettings } from "../../settings";
import { NorthpineLeadPage } from "../home-worth/home-worth";
import type { NorthpineLeadContent } from "../home-worth/schema";

export function NorthpineRelocatePage(
  props: TemplatePageProps<NorthpineLeadContent, NorthpineSettings>,
) {
  return <NorthpineLeadPage {...props} kind="relocate" />;
}
