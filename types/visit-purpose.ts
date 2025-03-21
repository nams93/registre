export type VisitPurposeType = "reunion" | "entretien" | "perte_badge" | "livraison" | "travaux" | "autre"

export const visitPurposeLabels: Record<VisitPurposeType, string> = {
  reunion: "Réunion",
  entretien: "Entretien",
  perte_badge: "Perte de badge",
  livraison: "Livraison",
  travaux: "Travaux",
  autre: "Autre",
}

export const visitPurposeColors: Record<VisitPurposeType, string> = {
  reunion: "bg-blue-100 text-blue-800 border-blue-200",
  entretien: "bg-purple-100 text-purple-800 border-purple-200",
  perte_badge: "bg-red-100 text-red-800 border-red-200",
  livraison: "bg-green-100 text-green-800 border-green-200",
  travaux: "bg-amber-100 text-amber-800 border-amber-200",
  autre: "bg-gray-100 text-gray-800 border-gray-200",
}

