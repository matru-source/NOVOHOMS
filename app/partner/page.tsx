import { InfoCards, PageHero } from "@/components/InnerPage";
import { Reveal } from "@/components/Reveal";
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
      <section className="content-section">
        <Reveal>
          <p className="eyebrow">Choose your path</p>
          <h2>
            Three ways
            <br />
            <em>to partner.</em>
          </h2>
        </Reveal>
        <div style={{ height: 60 }} />
        <InfoCards
          items={[
            {
              title: "I have a project",
              text: "Residential, commercial and mixed-use developments—from new launches to existing inventory.",
            },
            {
              title: "I have a property",
              text: "Residential property, commercial space, land, plots and distinctive investment opportunities.",
            },
            {
              title: "I have an idea",
              text: "An early conversation for opportunities that do not fit neatly into a category yet.",
            },
          ]}
        />
      </section>
      <WhoWeWorkWith />
      <PartnerIntakeForm />
    </>
  );
}

