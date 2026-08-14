import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TGDetect — V16 Apex Temporal Graph Neural Network for APT Detection",
  description:
    "TGDetect deploys a V16 Apex Temporal Graph Neural Network that continuously maps your network as a living temporal graph — detecting Advanced Persistent Threats with 98.9% F1 accuracy and zero false positives across 1 million out-of-distribution events.",
  keywords: [
    "TGDetect",
    "TGNN",
    "Temporal Graph Neural Network",
    "APT Detection",
    "Cybersecurity",
    "MITRE ATT&CK",
    "Threat Detection",
    "V16 Apex",
  ],
  authors: [{ name: "TGDetect" }],
  openGraph: {
    title: "TGDetect — V16 Apex TGNN for APT Detection",
    description:
      "See Every Threat. Trace Every Step. Stop Every APT. 98.9% F1 accuracy on 1M out-of-distribution events.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TGDetect — V16 Apex TGNN",
    description:
      "See Every Threat. Trace Every Step. Stop Every APT.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
