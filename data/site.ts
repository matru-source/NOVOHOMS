export type Property = {
  slug: string;
  name: string;
  eyebrow: string;
  location: string;
  tagline: string;
  summary: string;
  config: string;
  status: string;
  image: string;
  gallery: { label: string; image: string }[];
  highlights: { title: string; text: string }[];
};

const asset = (path: string) => `https://novohoms.com/airo-assets/images/${path}`;

export const properties: Property[] = [
  {
    slug: "merlot-heights",
    name: "The Merlot Heights",
    eyebrow: "Residential · Saheed Nagar",
    location: "Saheed Nagar, Bhubaneswar",
    tagline: "Boutique living, inspired by the French vineyard.",
    summary: "A rare collection of 31 residences in one of Bhubaneswar's most established neighbourhoods—considered architecture, curated amenities and a quietly exceptional standard of living.",
    config: "3.5 & 4.5 BHK",
    status: "Ready to move",
    image: asset("properties/merlot-heights/hero"),
    gallery: [
      { label: "Grand entrance", image: asset("properties/merlot-heights/entrance") },
      { label: "Resident lounge", image: asset("properties/merlot-heights/lounge") },
      { label: "Living room", image: asset("properties/merlot-heights/living-room") },
      { label: "Pool", image: asset("properties/merlot-heights/pool") },
    ],
    highlights: [
      { title: "An established address", text: "Moments from healthcare, schools, transport links and the city's everyday conveniences." },
      { title: "Boutique scale", text: "Just 31 residences create a private, low-density community with a genuine sense of place." },
      { title: "Ready to move", text: "A finished address with none of the uncertainty of an under-construction timeline." },
    ],
  },
  {
    slug: "saswat-riverside",
    name: "Saswat Riverside",
    eyebrow: "Residential · Trisulia",
    location: "Trisulia, Bhubaneswar",
    tagline: "Riverside living, thoughtfully connected.",
    summary: "A gated community of 318 apartments beside the Kathajodi River—seven towers, generous open space and a living environment shaped by light, greenery and a quieter pace.",
    config: "2, 3 & 4 BHK",
    status: "Under construction",
    image: asset("properties/saswat-riverside/hero"),
    gallery: [
      { label: "Riverside setting", image: asset("properties/saswat-riverside/riverside") },
      { label: "The development", image: asset("properties/saswat-riverside/exterior") },
      { label: "Interior spaces", image: asset("properties/saswat-riverside/interior-living") },
      { label: "Amenities", image: asset("properties/saswat-riverside/amenities-2") },
    ],
    highlights: [
      { title: "Riverside setting", text: "Natural views, open corridors and a calmer residential environment beside the Kathajodi." },
      { title: "60% open space", text: "Landscaping, green areas and outdoor amenities shape the majority of the development." },
      { title: "Connected location", text: "Within reach of the High Court, SCB Medical College, Nandankanan and the National Highway." },
    ],
  },
  {
    slug: "laxmi-vaikunthapuram",
    name: "Laxmi Vaikunthapuram",
    eyebrow: "Residential · Bhubaneswar",
    location: "Bhubaneswar, Odisha",
    tagline: "A signature of luxury and elegance.",
    summary: "Contemporary residences set within landscaped surroundings, bringing together thoughtful homes, curated amenities and open green spaces for a balanced everyday life.",
    config: "2, 2.5, 3 & 3.5 BHK",
    status: "Premium residences",
    image: asset("properties/laxmi-vaikunthapuram/hero"),
    gallery: [
      { label: "Architecture", image: asset("properties/laxmi-vaikunthapuram/arch-exterior-1") },
      { label: "Exterior view", image: asset("properties/laxmi-vaikunthapuram/arch-exterior-2") },
      { label: "Amenity areas", image: asset("properties/laxmi-vaikunthapuram/lifestyle-amenities-1") },
      { label: "Living room", image: asset("properties/laxmi-vaikunthapuram/interior-living-room") },
    ],
    highlights: [
      { title: "Curated amenities", text: "Pool, gymnasium, amphitheatre and open sports courts for an active, balanced lifestyle." },
      { title: "Multiple configurations", text: "Four considered configurations offer a fitting answer for different household needs." },
      { title: "Landscaped setting", text: "Green surroundings create a sense of space and calm while remaining connected to the city." },
    ],
  },
];

export const nav = [
  ["Home", "/"],
  ["About", "/about"],
  ["Opportunities", "/opportunities"],
  ["How we help", "/how-we-help"],
  ["Partner", "/partner"],
  ["Journal", "/insights"],
] as const;

export const whatsapp = "https://wa.me/919777958275?text=Hi%20NOVOHOMS%2C%20I%27d%20like%20to%20speak%20with%20an%20advisor.";
