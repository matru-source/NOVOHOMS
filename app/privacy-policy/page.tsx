import type { Metadata } from "next";
import { PageHero } from "@/components/InnerPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "NOVOHOMS privacy policy regarding user information, data retention, and advisory enquiries in Bhubaneswar, Odisha.",
  alternates: { canonical: "/privacy-policy" },
};
const sections=[['Who we are','NOVOHOMS is a real estate advisory platform based in Bhubaneswar, Odisha, India. You can contact us at hello@novohoms.com.'],['Information we collect','We collect information you provide directly, including your name, email, phone number, property preferences, budget, timeline and messages sent through our website, WhatsApp or email.'],['How we use information','We use this information to respond to enquiries, provide advisory services, share relevant property information, improve our services and comply with legal obligations. We do not sell or rent personal information for marketing.'],['How we share information','Information may be shared with relevant property partners when needed to fulfil a specific enquiry, with service providers bound by confidentiality, or where required by law.'],['Data retention','Enquiry data is normally retained for up to three years unless you request deletion earlier.'],['Your rights','You may ask to access, correct or delete your information, or withdraw consent for communications, by emailing hello@novohoms.com.'],['Cookies','The website may use essential and analytics cookies. You can control cookies through your browser settings.'],['Security and updates','We take reasonable technical and organisational measures to protect information and may update this policy as our services evolve.']];
export default function Privacy(){return <><PageHero eyebrow="Legal · Updated 16 September 2026" title={<>Privacy<br/><em>Policy.</em></>}/><article className="content-section legal">{sections.map(([h,p],i)=><section key={h}><h2>{i+1}. {h}</h2><p>{p}</p></section>)}</article></>}
