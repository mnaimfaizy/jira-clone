import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import {
  JsonLd,
  organizationSchema,
  websiteSchema,
} from "@/components/json-ld";

import { cn } from "@/lib/utils";
import QueryProvider from "@/components/query-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Jira Clone - Project Management & Team Collaboration",
    template: "%s | Jira Clone",
  },
  description:
    "A powerful project management tool inspired by Jira. Manage projects, track tasks, collaborate with your team, and boost productivity with our intuitive workspace management system.",
  keywords: [
    "project management",
    "task tracking",
    "team collaboration",
    "workspace management",
    "jira alternative",
    "agile tools",
    "productivity",
    "task management",
  ],
  authors: [{ name: "Jira Clone Team" }],
  creator: "Jira Clone",
  publisher: "Jira Clone",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001",
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Jira Clone - Project Management & Team Collaboration",
    description:
      "Manage projects, track tasks, and collaborate with your team efficiently. A modern project management solution for teams of all sizes.",
    siteName: "Jira Clone",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Jira Clone - Project Management Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jira Clone - Project Management & Team Collaboration",
    description:
      "Manage projects, track tasks, and collaborate with your team efficiently.",
    images: ["/og-image.png"],
    creator: "@jiraclone",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
      </head>
      <body className={cn(inter.className, "antialiased min-h-screen")}>
        <QueryProvider>
          <Toaster />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
