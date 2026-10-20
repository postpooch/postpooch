import { SiteHeader } from "@/components/landing/site-header";
import { Hero } from "@/components/landing/hero";
import { SocialProof } from "@/components/landing/social-proof";
import { ContentMix } from "@/components/landing/content-mix";
import { HowItWorks } from "@/components/landing/how-it-works";
import { BeforeAfter } from "@/components/landing/before-after";
import { TemplateShowcase } from "@/components/landing/template-showcase";
import { Features } from "@/components/landing/features";
import { ProductPreview } from "@/components/landing/product-preview";
import { Brokerages } from "@/components/landing/brokerages";
import { Pricing } from "@/components/landing/pricing";
import { FinalCta } from "@/components/landing/final-cta";
import { SiteFooter } from "@/components/landing/site-footer";
import "./landing.css";

export default function Home() {
  return (
    <div className="pp-landing flex min-h-full flex-col" data-theme="light">
      <SiteHeader />
      <main className="flex-1 scroll-smooth">
        <Hero />
        <SocialProof />
        <HowItWorks />
        <BeforeAfter />
        <ContentMix />
        <TemplateShowcase />
        <Features />
        <ProductPreview />
        <Brokerages />
        <Pricing />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}
