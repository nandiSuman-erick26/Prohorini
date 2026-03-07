import { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { ClerkProvider } from "@clerk/nextjs";
import ReactQueryProvider from "@/lib/react-query/ReactQueryProvider";
import ReduxProvider from "@/hooks/utils/ReduxProvider";
import { Toaster } from "sonner";
import ClientInitializationWrapper from "@/components/ClientInitializationWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prohorini | Guardian for Women",
  description:
    "Advanced AI-driven safety platform providing real-time protection, threat zone monitoring, and emergency SOS intelligence for women.",
  icons: {
    icon: "/prohorini-logo.png",
    apple: "/prohorini-logo.png",
  },
  openGraph: {
    title: "Prohorini | Guardian for Women",
    description:
      "Advanced AI-driven safety platform providing real-time protection, threat zone monitoring, and emergency SOS intelligence for women.",
    url: "https://prohorini-safety.vercel.app",
    siteName: "Prohorini",
    images: [
      {
        url: "/prohorini-logo-with-text.png",
        width: 1200,
        height: 630,
        alt: "Prohorini Safety Platform Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prohorini | Guardian for Women",
    description:
      "Advanced AI-driven safety platform providing real-time protection, threat zone monitoring, and emergency SOS intelligence for women.",
    images: ["/prohorini-logo-with-text.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-zinc-950">
          <ReduxProvider>
            <Toaster position="top-center" richColors duration={3000} />
            <ReactQueryProvider>
              <ClientInitializationWrapper>
                {children}
              </ClientInitializationWrapper>
            </ReactQueryProvider>
          </ReduxProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
