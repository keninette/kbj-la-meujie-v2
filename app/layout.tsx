import type { Metadata } from "next";
import { ServicesProvider } from "@hooks/services.hook";
import { Montserrat } from "next/font/google";
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
      <head title="Scratchie">
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script
          src="https://kit.fontawesome.com/3cdc464647.js"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body>
        <ServicesProvider>
          <div className={layoutStyles["page"]}>
            <main>
              <Header />
              <Nav />
              {children}
            </main>
          </div>
        </ServicesProvider>
      </body>
    </html>
  );
}
