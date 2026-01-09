import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import AuthLoader from "@/components/AuthLoader";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "HRMS Portal",
  description: "Human Resource Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark:bg-gray-900`}
      >
        <ThemeProvider>
          <AuthProvider>
            <AuthLoader>
              <SidebarProvider>
                {children}
                <Toaster position="top-right" richColors />
              </SidebarProvider>
            </AuthLoader>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
