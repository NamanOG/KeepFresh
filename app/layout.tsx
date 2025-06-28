import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "KeepFresh | Smart Food Expiry Tracker",
  description:
    "Track your food expiry dates and get recipe ideas to reduce waste. Never let fresh ingredients go bad again!",
  keywords: ["food tracker", "expiry dates", "reduce waste", "recipe suggestions", "fresh food"],
  authors: [{ name: "KeepFresh" }],
  creator: "KeepFresh",
  publisher: "KeepFresh",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  // Add Open Graph meta tags for social media sharing
  openGraph: {
    title: "KeepFresh | Smart Food Expiry Tracker",
    description:
      "Track your food expiry dates and get recipe ideas to reduce waste. Never let fresh ingredients go bad again!",
    url: "https://keepfresh.vercel.app/", // Replace with your actual domain
    siteName: "KeepFresh",
    images: [
      {
        url: "/KeepFresh.png", // Using PNG instead of ICO for better compatibility
        width: 1200,
        height: 630,
        alt: "KeepFresh | Smart Food Expiry Tracker",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  // Add Twitter Card meta tags
  twitter: {
    card: "summary_large_image",
    title: "KeepFresh | Smart Food Expiry Tracker",
    description:
      "Track your food expiry dates and get recipe ideas to reduce waste. Never let fresh ingredients go bad again!",
    images: ["/KeepFresh.png"],
    creator: "@your_twitter_handle", // Replace with your Twitter handle if you have one
  },
  icons: {
    icon: [
      {
        url: "/KeepFresh.ico",
        sizes: "any",
      },
      {
        url: "/icon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/icon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#059669",
      },
    ],
  },
  manifest: "/site.webmanifest",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#059669" },
    { media: "(prefers-color-scheme: dark)", color: "#10b981" },
  ],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
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
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/icon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#059669" />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
