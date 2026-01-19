import { Metadata } from "next";

interface GenerateMetadataProps {
  title: string;
  description: string;
  image?: string;
  noIndex?: boolean;
}

export function generateMetadata({
  title,
  description,
  image = "/og-image.png",
  noIndex = false,
}: GenerateMetadataProps): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}

export const defaultMetadata = {
  title: "Jira Clone - Project Management & Team Collaboration",
  description:
    "A powerful project management tool inspired by Jira. Manage projects, track tasks, and collaborate with your team efficiently.",
};
