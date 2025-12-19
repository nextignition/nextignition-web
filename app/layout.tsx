import type { Metadata } from 'next'
import './globals.css'

const siteUrl = 'https://nextignition.com'
const siteName = 'Next Ignition'
const siteTitle = 'Next Ignition - Turning Startup Ideas into Reality'
const siteDescription =
  'Next Ignition helps founders grow from idea to launch. Connect with experts, get mentorship, build your MVP, and raise funding—all on one platform.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: '%s | Next Ignition',
  },
  description: siteDescription,
  keywords: [
    'Next Ignition',
    'startup platform',
    'founder community',
    'startup mentorship',
    'MVP development',
    'startup funding',
    'expert marketplace',
    'AI tools for startups',
  ],
  authors: [{ name: 'Next Ignition' }],
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: siteTitle,
    description: siteDescription,
    siteName,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
  },
  alternates: {
    canonical: siteUrl,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}


