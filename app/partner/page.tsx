import { PageHero } from "@/components/InnerPage";
import { ThreeWaysToPartner } from "@/components/ThreeWaysToPartner";
import { WhoWeWorkWith } from "@/components/WhoWeWorkWith";
import { PartnerIntakeForm } from "@/components/PartnerIntakeForm";

export const metadata = { title: "Partner With Us" };
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

