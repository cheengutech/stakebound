import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'StakeBound — Commitment Infrastructure',
  description: 'Set a goal. Stake real money. Your friend verifies it. No excuses.',
  openGraph: {
    title: 'StakeBound',
    description: 'Set a goal. Stake real money. Your friend verifies it.',
    url: 'https://stakebound.app',
    siteName: 'StakeBound',
    type: 'website',
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