import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Corporate Dashboard - Notary AI",
  description: "Bulk document processing and management for corporate clients",
};

export default function CorporateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}