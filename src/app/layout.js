import { Geist, Geist_Mono } from "next/font/google";
import "@/frontend/styles/globals.css";
import AsciiBackground from "@/frontend/components/AsciiBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "GOJO GPT",
  description:
    "Une application de chat propulsée par l'IA inspirée de Jujutsu Kaisen.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className="h-dvh overflow-hidden">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-dvh overflow-hidden relative`}
      >
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <AsciiBackground opacity={0.18} blur={0} scale={1.05} drift />
        </div>
        {children}
      </body>
    </html>
  );
}
