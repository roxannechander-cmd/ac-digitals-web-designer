import { createFileRoute } from "@tanstack/react-router";
import { AcDigitalsSite } from "@/components/ac-digitals-site";

// No head() here: the home route inherits title/description/og/twitter from
// __root.tsx, and ships no og:image so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AC DIGITALS | Premium Web Design Durban & Worldwide" },
      { name: "description", content: "Premium website design for businesses in Durban, South Africa and worldwide. Custom business websites, online stores and high-converting digital experiences." },
      { property: "og:title", content: "AC DIGITALS | Premium Websites. Powerful First Impressions." },
      { property: "og:description", content: "Professional website design for ambitious businesses in South Africa and internationally." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: AcDigitalsSite,
});
