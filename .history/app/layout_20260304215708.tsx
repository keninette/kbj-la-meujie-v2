import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Script from "next/script";
import layoutStyles from "./layout.module.scss";
import Header from "@components/header/Header.server";
import Nav from "@components/nav/Nav";

export const metadata: Metadata = {
  title: "Scratchie",
  description: "Game master's best friend",
};

const montserrat = Montserrat({
  weight: ["300", "400"],
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.className} ${layoutStyles["page__root"]}`}
    >
      <body>
        <Script
          src="https://kit.fontawesome.com/3cdc464647.js"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <div className={layoutStyles["page"]}>
          <main>
            <Header />
            <Nav />
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
