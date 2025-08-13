import { Abril_Fatface, Poppins } from "next/font/google";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import "./globals.css";

export const metadata = {
  title: "Sagard the Barbarian #1 - The Ice Dragon",
  description: "A combat fantasy book by Gary Gygax and Flint Dille.",
};

const abril_fatface = Abril_Fatface({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
});

const poppins = Poppins({
  weight: ["300", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${abril_fatface.variable} ${poppins.variable}`}>
      <body>
        <div className="grid">
          <Header />
          <aside>
            <Sidebar />
          </aside>
          <main id="main">
            <div id="main-top"></div>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
