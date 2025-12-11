import type { Metadata } from "next";
import { ServicesProvider } from "@hooks/services.hook";
import { Montserrat } from "next/font/google";
import styles from "./page.module.scss";

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
      className={`${montserrat.className} ${styles["page__root"]}`}
    >
      <head title="Scratchie">
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script
          src="https://kit.fontawesome.com/3cdc464647.js"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body>
        <ServicesProvider>{children}</ServicesProvider>
      </body>
    </html>
  );
}
