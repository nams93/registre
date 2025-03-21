"use client"

import { useState } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Visitor } from "@/types/visitor"
import { Input } from "@/components/ui/input"
import { Search, Download } from "lucide-react"
import { exportToCsv } from "@/lib/csv-export"
import { visitPurposeLabels, visitPurposeColors } from "@/types/visit-purpose"
import { Badge } from "@/components/ui/badge"

type VisitorsListProps = {
  visitors: Visitor[]
}

export function VisitorsList({ visitors }: VisitorsListProps) {
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null)
  const [filter, setFilter] = useState("")

  const filteredVisitors = visitors.filter(
    (visitor) =>
      visitor.name.toLowerCase().includes(filter.toLowerCase()) ||
      visitor.company.toLowerCase().includes(filter.toLowerCase()) ||
      visitPurposeLabels[visitor.purpose].toLowerCase().includes(filter.toLowerCase()) ||
      (visitor.purposeDetails && visitor.purposeDetails.toLowerCase().includes(filter.toLowerCase())) ||
      (visitor.badgeNumber && visitor.badgeNumber.toLowerCase().includes(filter.toLowerCase())),
  )

  const sortedVisitors = [...filteredVisitors].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const handleExportCsv = () => {
    const data = sortedVisitors.map((visitor) => ({
      Nom: visitor.name,
      Email: visitor.email,
      Téléphone: visitor.phone || "",
      Société: visitor.company,
      "Numéro de badge": visitor.badgeNumber || "",
      Date: format(new Date(visitor.date), "dd/MM/yyyy"),
      Heure: visitor.time,
      Motif: visitPurposeLabels[visitor.purpose],
      "Détails du motif": visitor.purposeDetails || "",
      Notes: visitor.notes || "",
    }))

    exportToCsv(data, `visiteurs-${format(new Date(), "yyyy-MM-dd")}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filtrer par nom, société, badge ou motif..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button variant="outline" onClick={handleExportCsv} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Exporter CSV</span>
        </Button>
      </div>

      {sortedVisitors.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          {visitors.length === 0
            ? "Aucun visiteur enregistré pour le moment."
            : "Aucun visiteur ne correspond à votre recherche."}
        </div>
      ) : (
        <div className="rounded-md border card-with-bg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Société</TableHead>
                <TableHead>Badge</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Heure</TableHead>
                <TableHead>Motif</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedVisitors.map((visitor) => (
                <TableRow key={visitor.id}>
                  <TableCell className="font-medium">{visitor.name}</TableCell>
                  <TableCell>{visitor.company}</TableCell>
                  <TableCell>{visitor.badgeNumber || "-"}</TableCell>
                  <TableCell>{format(new Date(visitor.date), "dd/MM/yyyy")}</TableCell>
                  <TableCell>{visitor.time}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={visitPurposeColors[visitor.purpose]}>
                      {visitPurposeLabels[visitor.purpose]}
                    </Badge>
                    {visitor.purposeDetails && (
                      <span className="ml-2 text-xs text-muted-foreground">{visitor.purposeDetails}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedVisitor(visitor)}>
                      Détails
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Badge:</div>
                <div className="col-span-3">{selectedVisitor.badgeNumber || "Non attribué"}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Date:</div>
                <div className="col-span-3">{format(new Date(selectedVisitor.date), "PPP", { locale: fr })}</div>
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
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Enregistré:</div>
                <div className="col-span-3">
                  {format(new Date(selectedVisitor.createdAt), "PPP à HH:mm", { locale: fr })}
                </div>
              </div>
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

