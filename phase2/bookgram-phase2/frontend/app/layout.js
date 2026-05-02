import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Bookgram",
  description: "Bookgram Social Media Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-[#3d3528]">
        <nav className="flex items-center justify-between bg-[#f5f0e8] px-6 py-4 shadow">
          <div className="flex items-center gap-6">
            <Link href="/posts" className="text-xl italic text-[#1c1710]">
              Bookgram
            </Link>

            <Link href="/stats" className="text-sm text-[#1c1710]">
              Stats
            </Link>
          </div>

          <Link
            href="/profile"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3d3528] text-white"
            title="Profile"
          >
            👤
          </Link>
        </nav>

        {children}
      </body>
    </html>
  );
}