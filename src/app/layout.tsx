import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Amiri } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/layout/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

// basePath for GitHub Pages deployment
const basePath = process.env.GITHUB_PAGES === "true" ? "/L-Alchimie-du-Miroir-2" : "";

export const metadata: Metadata = {
  title: "L'Alchimie du Miroir — Niveau 2",
  description: "Guide Pratique Interactif Avancé — Méditer le Coran avec l'Âme. Basé sur les enseignements d'Al-Ghazālī, Ibn al-Qayyim et Ibn ʿArabī.",
  keywords: ["Coran", "tadabbur", "méditation", "Al-Fatiha", "spiritualité", "islam"],
  authors: [{ name: "L'Alchimie du Miroir" }],
  icons: {
    icon: `${basePath}/logo.svg`,
  },
  manifest: `${basePath}/manifest.json`,
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
  other: {
    "theme-color": "#d97706",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#d97706",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning className="transition-colors duration-300">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${amiri.variable} antialiased bg-background text-foreground transition-colors duration-300`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
        >
          {children}
          <Toaster />
        </ThemeProvider>
        {/* Service Worker Registration — auto-detects basePath from current URL */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  var swPath = window.location.pathname.split('/').slice(0, 2).join('/') + '/sw.js';
                  navigator.serviceWorker.register(swPath).catch(function() {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
