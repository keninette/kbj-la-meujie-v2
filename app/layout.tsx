import type { Metadata } from "next";
import "./variables.scss";
import { ServicesProvider } from "@hooks/services.hook";
import { Montserrat } from "next/font/google";

export const metadata: Metadata = {
  title: "Scratch",
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
    <html lang="en" className={montserrat.className}>
      <body>
        <ServicesProvider>{children}</ServicesProvider>
      </body>
    </html>
  );
}
