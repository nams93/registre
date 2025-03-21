import Image from "next/image"

export function Header() {
  return (
    <header className="bg-white border-b py-4 px-6 mb-6">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Image src="/images/gpis-logo.png" alt="GPIS Logo" width={120} height={40} className="mr-4" />
          <h1 className="text-2xl font-bold text-gray-800">Registre des Visiteurs</h1>
        </div>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString("fr-FR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>
    </header>
  )
}

