import type { Metadata } from "next";
import { PageHero } from "@/components/InnerPage";
import { ThreeWaysToPartner } from "@/components/ThreeWaysToPartner";
import { WhoWeWorkWith } from "@/components/WhoWeWorkWith";
import { PartnerIntakeForm } from "@/components/PartnerIntakeForm";

export const metadata: Metadata = {
  title: "Partner With Us — Developers, Architects & Landowners",
  description:
    "Partner with NOVOHOMS to bring your development, land parcel, or commercial asset to the right market with targeted marketing and qualified buyer advisory in Bhubaneswar.",
  alternates: {
    canonical: "/partner",
  },
  openGraph: {
    title: "Partner With Us | NOVOHOMS Real Estate Advisory",
    description:
      "Partner with NOVOHOMS to bring your development, land parcel, or commercial asset to the right market with targeted marketing and qualified buyer advisory in Bhubaneswar.",
    url: "https://novohoms.com/partner",
    images: [
      {
        url: "/commercial-architecture.webp",
        width: 1200,
        height: 630,
        alt: "Partner with NOVOHOMS",
      },
    ],
  },
};
export default function PartnerPage() {
  return (
    <>
      <PageHero
        eyebrow="Partner with NOVOHOMS"
        title={
          <>
            Bring your opportunity
            <br />
            <em>to the right market.</em>
          </>
        }
        lead="For developers, builders, owners and investors ready to connect a property or project with the people it was made for."
      />
      <ThreeWaysToPartner />
      <WhoWeWorkWith />
      <PartnerIntakeForm />
    </>
  );
}

