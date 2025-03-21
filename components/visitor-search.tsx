"use client"

import { useState } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { Visitor } from "@/types/visitor"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Ajouter les imports pour les motifs de visite
import { visitPurposeLabels, visitPurposeColors } from "@/types/visit-purpose"
import { Badge } from "@/components/ui/badge"

type VisitorSearchProps = {
  onSearch: (query: string) => void
  onClear: () => void
  searchResults: Visitor[]
  isSearching: boolean
}

export function VisitorSearch({ onSearch, onClear, searchResults, isSearching }: VisitorSearchProps) {
  const [query, setQuery] = useState("")
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null)

  const handleSearch = () => {
    onSearch(query)
  }

  const handleClear = () => {
    setQuery("")
    onClear()
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, société, badge ou email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-8"
          />
        </div>
        <Button onClick={handleSearch}>Rechercher</Button>
        {isSearching && (
          <Button variant="outline" onClick={handleClear}>
            <X className="h-4 w-4 mr-2" />
            Effacer
          </Button>
        )}
      </div>

      {isSearching && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">
            {searchResults.length === 0
              ? "Aucun résultat trouvé"
              : `${searchResults.length} résultat${searchResults.length > 1 ? "s" : ""} trouvé${searchResults.length > 1 ? "s" : ""}`}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.map((visitor) => (
              <Card
                key={visitor.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors card-with-bg"
                onClick={() => setSelectedVisitor(visitor)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{visitor.name}</CardTitle>
                  <CardDescription>{visitor.company}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-1">
                    <p>Email: {visitor.email}</p>
                    <p>Date: {format(new Date(visitor.date), "dd/MM/yyyy")}</p>
                    {visitor.badgeNumber && <p>Badge: {visitor.badgeNumber}</p>}
                    <p className="flex items-center">
                      Motif:
                      <Badge variant="outline" className={`ml-1 ${visitPurposeColors[visitor.purpose]}`}>
                        {visitPurposeLabels[visitor.purpose]}
                      </Badge>
                    </p>
                  </div>
                </CardContent>
                {visitor.signature && (
                  <CardFooter className="pt-0">
                    <img
                      src={visitor.signature || "/placeholder.svg"}
                      alt="Signature"
                      className="border rounded-md h-12 w-auto"
                    />
                  </CardFooter>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      <Dialog open={!!selectedVisitor} onOpenChange={() => setSelectedVisitor(null)}>
        {selectedVisitor && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Détails du visiteur</DialogTitle>
              <DialogDescription>Informations complètes sur le visiteur</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Nom:</div>
                <div className="col-span-3">{selectedVisitor.name}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Email:</div>
                <div className="col-span-3">{selectedVisitor.email}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Téléphone:</div>
                <div className="col-span-3">{selectedVisitor.phone || "Non renseigné"}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Société:</div>
                <div className="col-span-3">{selectedVisitor.company}</div>
              </div>
              {selectedVisitor.badgeNumber && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="font-medium">Badge:</div>
                  <div className="col-span-3">{selectedVisitor.badgeNumber}</div>
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Date:</div>
                <div className="col-span-3">{format(new Date(selectedVisitor.date), "dd/MM/yyyy")}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Heure:</div>
                <div className="col-span-3">{selectedVisitor.time}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Motif:</div>
                <div className="col-span-3">
                  <Badge variant="outline" className={visitPurposeColors[selectedVisitor.purpose]}>
                    {visitPurposeLabels[selectedVisitor.purpose]}
                  </Badge>
                  {selectedVisitor.purposeDetails && <span className="ml-2">{selectedVisitor.purposeDetails}</span>}
                </div>
              </div>
              {selectedVisitor.notes && (
                <div className="grid grid-cols-4 items-start gap-4">
                  <div className="font-medium">Notes:</div>
                  <div className="col-span-3">{selectedVisitor.notes}</div>
                </div>
              )}
              {selectedVisitor.signature && (
                <div className="grid grid-cols-4 items-start gap-4">
                  <div className="font-medium">Signature:</div>
                  <div className="col-span-3">
                    <img
                      src={selectedVisitor.signature || "/placeholder.svg"}
                      alt="Signature"
                      className="border rounded-md max-h-24"
                    />
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}

