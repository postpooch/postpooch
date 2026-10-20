import type { TemplatePageProps } from "../../../types";
import type { NorthpineSettings } from "../../settings";
import { NorthpineLeadPage } from "../home-worth/home-worth";
import type { NorthpineLeadContent } from "../home-worth/schema";

export function NorthpineDreamHomePage(
  props: TemplatePageProps<NorthpineLeadContent, NorthpineSettings>,
) {
  return <NorthpineLeadPage {...props} kind="dream" />;
}
