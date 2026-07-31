import { Poppins } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";
import DashboardLayout from "./src/component/dashboard-layout";
import ToastProvider from "./src/lib/toastprovider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "AXC – American Xpress Courier | Nothing Is Too Far",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className} suppressHydrationWarning>
        <DashboardLayout>
          {children}
          <ToastProvider />
        </DashboardLayout>
      </body>
    </html>
  );
}