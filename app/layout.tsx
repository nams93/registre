import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Registre des Visiteurs GPIS",
  description: "Application de gestion des visiteurs GPIS",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={`${inter.className} relative`}>
        <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center opacity-5">
          <div className="w-full max-w-3xl">
            <img src="/images/gpis-logo.png" alt="GPIS Logo" className="w-full h-auto" />
          </div>
        </div>
        <div className="relative z-10">{children}</div>
        <Toaster />
      </body>
    </html>
  )
}



import './globals.css'