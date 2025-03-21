"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TraceabilityForm } from "./traceability-form"
import { TraceabilityTable } from "./traceability-table"
import type { TraceabilityEvent } from "@/types/traceability"
import type { Visitor } from "@/types/visitor"
import { saveTraceabilityEvents, getTraceabilityEvents } from "@/lib/storage-service"

type TraceabilityProps = {
  visitors: Visitor[]
}

export function Traceability({ visitors }: TraceabilityProps) {
  const [events, setEvents] = useState<TraceabilityEvent[]>([])
  const [activeTab, setActiveTab] = useState("table")

  // Charger les événements depuis le localStorage au chargement initial
  useEffect(() => {
    const savedEvents = getTraceabilityEvents()
    if (savedEvents.length > 0) {
      setEvents(savedEvents)
    }
  }, [])

  // Sauvegarder les événements dans le localStorage à chaque modification
  useEffect(() => {
    if (events.length > 0) {
      saveTraceabilityEvents(events)
    }
  }, [events])

  const addEvent = (event: TraceabilityEvent) => {
    const newEvents = [...events, event]
    setEvents(newEvents)
  }

  const updateEvent = (updatedEvent: TraceabilityEvent) => {
    const newEvents = events.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
    setEvents(newEvents)
  }

  return (
    <div className="space-y-8">
      <Tabs defaultValue="table" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="table">Tableau de traçabilité</TabsTrigger>
          <TabsTrigger value="add">Ajouter un événement</TabsTrigger>
        </TabsList>
        <TabsContent value="table" className="mt-6">
          <TraceabilityTable events={events} onUpdateEvent={updateEvent} />
        </TabsContent>
        <TabsContent value="add" className="mt-6">
          <TraceabilityForm onAddEvent={addEvent} visitors={visitors} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

