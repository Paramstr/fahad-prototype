import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Attest a Document - Notary AI",
  description: "Complete document attestation service with MoJ, MoFA, and Embassy legalisation.",
  keywords: "document attestation, MoJ, MoFA, embassy legalisation, UAE document services",
};

export default function AttestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}