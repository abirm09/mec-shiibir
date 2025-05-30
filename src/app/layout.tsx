import { hindShiliguri, poppins, solaimanLipi } from "@/fonts";
import { ReduxProvider } from "@/providers";
import type { Metadata } from "next";
import { ReactNode } from "react";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Home",
  description: "বাংলাদেশ ইসলামী ছাত্রশিবির",
  keywords: ["বাংলাদেশ ইসলামী ছাত্রশিবির"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <ReduxProvider>
        <body
          className={`${solaimanLipi.variable} ${solaimanLipi.className} ${hindShiliguri.variable} ${poppins.variable} antialiased`}
        >
          {children}
        </body>
      </ReduxProvider>
    </html>
  );
}
