import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "KeepFresh | Smart Food Expiry Tracker",
  description: "Track your food expiry dates and get recipe ideas to reduce waste",
  keywords: ["food tracker", "expiry dates", "food waste", "recipes", "kitchen management"],
  authors: [{ name: "KeepFresh Team" }],
  creator: "KeepFresh",
  publisher: "KeepFresh",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://keepfresh-app.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "KeepFresh | Smart Food Expiry Tracker",
    description: "Track your food expiry dates and get recipe ideas to reduce waste",
    url: "https://keepfresh-app.vercel.app",
    siteName: "KeepFresh",
    images: [
      {
        url: "/KeepFresh.png",
        width: 1200,
        height: 630,
        alt: "KeepFresh - Smart Food Expiry Tracker",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KeepFresh | Smart Food Expiry Tracker",
    description: "Track your food expiry dates and get recipe ideas to reduce waste",
    images: ["/KeepFresh.png"],
    creator: "@keepfresh_app",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/KeepFresh.png", sizes: "32x32", type: "image/png" },
      { url: "/KeepFresh.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/KeepFresh.png", sizes: "180x180", type: "image/png" }],
    other: [
      {
        rel: "mask-icon",
        url: "/KeepFresh.png",
      },
    ],
  },
  manifest: "/site.webmanifest",
  category: "food",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
