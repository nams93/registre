import type { Metadata } from "next"
import VisitorsRegister from "@/components/visitors-register"
import { Header } from "@/components/header"

export const metadata: Metadata = {
  title: "Registre des Visiteurs GPIS",
  description: "Application de gestion des visiteurs GPIS",
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4 md:px-6">
        <VisitorsRegister />
      </main>
    </div>
  )
}

