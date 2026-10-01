import { CallbackForm } from "@/components/CallbackForm";
import { ContactQuickStrip } from "@/components/ContactQuickStrip";
import { EnquiryForm, PageHero } from "@/components/InnerPage";
import { Reveal } from "@/components/Reveal";
import { whatsapp } from "@/data/site";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title={
          <>
            Let&apos;s start
            <br />
            <em>the conversation.</em>
          </>
        }
        lead="Whether you're looking for a property, exploring an investment or bringing an opportunity to market, we're here to help."
      />

      <ContactQuickStrip />

      <section className="content-section contact-section">
        <div className="content-grid contact-grid-layout">
          <Reveal>
            <p className="eyebrow">Direct connections</p>
            <h2>
              Talk to us
              <br />
              <em>your way.</em>
            </h2>
            <div className="contact-list">
              <a href="tel:+919777958275">
                <span>Call us</span>
                <b>+91 97779 58275</b>
              </a>
              <a href={whatsapp} target="_blank" rel="noreferrer">
                <span>WhatsApp</span>
                <b>Start a conversation</b>
              </a>
              <a href="mailto:hello@novohoms.com">
                <span>Email</span>
                <b>hello@novohoms.com</b>
              </a>
              <a
                href="https://maps.google.com/?q=BMC+Bhawani+Mall+Saheed+Nagar+Bhubaneswar"
                target="_blank"
                rel="noreferrer"
              >
                <span>Visit</span>
                <b>Saheed Nagar, Bhubaneswar</b>
              </a>
            </div>
          </Reveal>
          <Reveal delay={100} className="contact-form-reveal">
            <div className="contact-form-wrapper">
              <img
                src="/contact/advisor-character.webp"
                alt="NOVOHOMS Advisor"
                className="contact-advisor-character"
                loading="eager"
                decoding="async"
              />
              <EnquiryForm />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Prefer a call? / Callback Section */}
      <section className="callback-section">
        <div className="callback-section-container">
          <Reveal>
            <CallbackForm />
          </Reveal>
        </div>
      </section>

      <section className="content-section paper">
        <div className="content-grid">
          <Reveal>
            <p className="eyebrow">Our office</p>
            <h2>
              A place for
              <br />
              <em>better questions.</em>
            </h2>
          </Reveal>
          <Reveal className="content-copy">
            <p>5th Floor, BMC Bhawani Mall, Block 2, Saheed Nagar, Bhubaneswar, Odisha 751007.</p>
            <p style={{ fontFamily: "var(--sans)", fontSize: 14 }}>
              Monday–Sunday · 10:30 AM–6:30 PM
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}

