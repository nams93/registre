"use client"

import { useState } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Search, Filter, CheckCircle, Download } from "lucide-react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { TraceabilityEvent, EventType } from "@/types/traceability"
import { toast } from "@/hooks/use-toast"
import { exportToCsv } from "@/lib/csv-export"

type TraceabilityTableProps = {
  events: TraceabilityEvent[]
  onUpdateEvent: (event: TraceabilityEvent) => void
}

const eventTypeLabels: Record<EventType, string> = {
  badge_lost: "Badge perdu",
  badge_found: "Badge retrouvé",
  incident: "Incident",
  other: "Autre",
}

const eventTypeColors: Record<EventType, string> = {
  badge_lost: "bg-red-100 text-red-800 border-red-200",
  badge_found: "bg-green-100 text-green-800 border-green-200",
  incident: "bg-amber-100 text-amber-800 border-amber-200",
  other: "bg-blue-100 text-blue-800 border-blue-200",
}

export function TraceabilityTable({ events, onUpdateEvent }: TraceabilityTableProps) {
  const [selectedEvent, setSelectedEvent] = useState<TraceabilityEvent | null>(null)
  const [filter, setFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.visitorName.toLowerCase().includes(filter.toLowerCase()) ||
      event.description.toLowerCase().includes(filter.toLowerCase())

    const matchesStatus = statusFilter === "all" || event.status === statusFilter

    const matchesType = typeFilter === "all" || event.eventType === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const sortedEvents = [...filteredEvents].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const resolveEvent = (event: TraceabilityEvent) => {
    const updatedEvent: TraceabilityEvent = {
      ...event,
      status: "resolved",
      resolvedAt: new Date().toISOString(),
      resolvedBy: "Utilisateur actuel", // Idéalement, utilisez le nom de l'utilisateur connecté
    }

    onUpdateEvent(updatedEvent)
    setSelectedEvent(null)

    toast({
      title: "Événement résolu",
      description: "L'événement a été marqué comme résolu.",
    })
  }

  const handleExportCsv = () => {
    const data = sortedEvents.map((event) => ({
      Date: format(new Date(event.date), "dd/MM/yyyy"),
      Personne: event.visitorName,
      Type: eventTypeLabels[event.eventType],
      Description: event.description,
      Statut: event.status === "open" ? "En cours" : "Résolu",
      "Résolu le": event.resolvedAt ? format(new Date(event.resolvedAt), "dd/MM/yyyy") : "",
      "Résolu par": event.resolvedBy || "",
      "Créé le": format(new Date(event.createdAt), "dd/MM/yyyy HH:mm"),
    }))

    exportToCsv(data, `traceabilite-${format(new Date(), "yyyy-MM-dd")}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom ou description..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className="flex gap-2">
          <div className="w-40">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="open">En cours</SelectItem>
                <SelectItem value="resolved">Résolu</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-40">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {Object.entries(eventTypeLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" onClick={handleExportCsv} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Exporter CSV</span>
          </Button>
        </div>
      </div>

      {sortedEvents.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          {events.length === 0
            ? "Aucun événement enregistré pour le moment."
            : "Aucun événement ne correspond à votre recherche."}
        </div>
      ) : (
        <div className="rounded-md border card-with-bg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Personne</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>{format(new Date(event.date), "dd/MM/yyyy")}</TableCell>
                  <TableCell className="font-medium">{event.visitorName}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={eventTypeColors[event.eventType]}>
                      {eventTypeLabels[event.eventType]}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{event.description}</TableCell>
                  <TableCell>
                    <Badge
                      variant={event.status === "open" ? "default" : "outline"}
                      className={
                        event.status === "open"
                          ? "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100"
                          : "bg-green-100 text-green-800 border-green-200 hover:bg-green-100"
                      }
                    >
                      {event.status === "open" ? "En cours" : "Résolu"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedEvent(event)}>
                      Détails
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        {selectedEvent && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Détails de l'événement</DialogTitle>
              <DialogDescription>Informations complètes sur l'événement</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Personne:</div>
                <div className="col-span-3">{selectedEvent.visitorName}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Type:</div>
                <div className="col-span-3">
                  <Badge variant="outline" className={eventTypeColors[selectedEvent.eventType]}>
                    {eventTypeLabels[selectedEvent.eventType]}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Date:</div>
                <div className="col-span-3">{format(new Date(selectedEvent.date), "PPP", { locale: fr })}</div>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <div className="font-medium">Description:</div>
                <div className="col-span-3">{selectedEvent.description}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Statut:</div>
                <div className="col-span-3">
                  <Badge
                    variant={selectedEvent.status === "open" ? "default" : "outline"}
                    className={
                      selectedEvent.status === "open"
                        ? "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100"
                        : "bg-green-100 text-green-800 border-green-200 hover:bg-green-100"
                    }
                  >
                    {selectedEvent.status === "open" ? "En cours" : "Résolu"}
                  </Badge>
                </div>
              </div>
              {selectedEvent.resolvedAt && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="font-medium">Résolu le:</div>
                    <div className="col-span-3">
                      {format(new Date(selectedEvent.resolvedAt), "PPP", { locale: fr })}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="font-medium">Résolu par:</div>
                    <div className="col-span-3">{selectedEvent.resolvedBy}</div>
                  </div>
                </>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Créé le:</div>
                <div className="col-span-3">
                  {format(new Date(selectedEvent.createdAt), "PPP à HH:mm", { locale: fr })}
                </div>
              </div>
            </div>
            {selectedEvent.status === "open" && (
              <DialogFooter>
                <Button onClick={() => resolveEvent(selectedEvent)} className="w-full sm:w-auto">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Marquer comme résolu
                </Button>
              </DialogFooter>
            )}
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}

