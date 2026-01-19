"use client";

interface JsonLdProps {
  data: Record<string, any>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Reusable structured data schemas
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Jira Clone",
  description: "Project Management & Team Collaboration Platform",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001",
  logo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"}/icon-512.png`,
  sameAs: [
    // Add your social media URLs here
    // "https://twitter.com/jiraclone",
    // "https://github.com/yourusername/jira-clone",
  ],
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Jira Clone",
  description: "Project Management & Team Collaboration Platform",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001",
};

export const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Jira Clone",
  description:
    "A powerful project management tool inspired by Jira. Manage projects, track tasks, and collaborate with your team efficiently.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "100",
  },
};
