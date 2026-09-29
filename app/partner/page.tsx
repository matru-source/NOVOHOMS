import { EnquiryForm, InfoCards, PageHero } from "@/components/InnerPage";
import { Reveal } from "@/components/Reveal";

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
      <section className="content-section enquiry-section">
        <Reveal>
          <p className="eyebrow">Submit your opportunity</p>
          <h2>
            Tell us what
            <br />
            <em>you have.</em>
          </h2>
          <p style={{ color: "rgba(255,255,255,.6)", maxWidth: 440 }}>
            Share a few details. We&apos;ll consider the fit, ask the right questions and explore how
            NOVOHOMS can help.
          </p>
        </Reveal>
        <Reveal delay={100}>
          <EnquiryForm partnership />
        </Reveal>
      </section>
    </>
  );
}

