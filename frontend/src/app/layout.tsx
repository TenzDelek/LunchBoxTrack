import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LunchBox",
  description: "Nextjs project for LunchBox",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
     <html lang="en">
      <body
        className={`${inter.className}`}
      >
        <div className=" m-auto h-screen  flex flex-col justify-between">
          <Navbar />
          {children}
          <Footer />
        </div>
      </body>
    </html>
    </ClerkProvider>
  );
}
