import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Ashish Maharjan | DevOps Engineer",
  description:
    "Portfolio of Ashish Maharjan — DevOps Engineer bridging code and cloud, with 5+ years automating delivery pipelines across AWS and Azure.",
  keywords: [
    "DevOps",
    "Cloud Engineer",
    "AWS",
    "Azure",
    "CI/CD",
    "Kubernetes",
    "Docker",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("antialiased", inter.variable)}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-screen font-sans font-light text-foreground bg-background" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
