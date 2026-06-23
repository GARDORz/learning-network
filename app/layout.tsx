import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Network Learning',
  description: 'เรียน Network พื้นฐานถึง CCNA',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className={`${inter.className} min-h-screen`} style={{ background: '#0f172a', color: '#e2e8f0' }}>
        {children}
      </body>
    </html>
  )
}
