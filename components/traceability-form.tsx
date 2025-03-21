"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import type { TraceabilityEvent, EventType } from "@/types/traceability"
import type { Visitor } from "@/types/visitor"

const formSchema = z.object({
  visitorName: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  eventType: z.enum(["badge_lost", "badge_found", "incident", "other"], {
    required_error: "Veuillez sélectionner un type d'événement",
  }),
  description: z.string().min(5, { message: "La description doit contenir au moins 5 caractères" }),
  date: z.date({ required_error: "La date est requise" }),
})

type TraceabilityFormProps = {
  onAddEvent: (event: TraceabilityEvent) => void
  visitors: Visitor[]
}

const eventTypeLabels: Record<EventType, string> = {
  badge_lost: "Badge perdu",
  badge_found: "Badge retrouvé",
  incident: "Incident",
  other: "Autre",
}

export function TraceabilityForm({ onAddEvent, visitors }: TraceabilityFormProps) {
  const [selectedVisitorId, setSelectedVisitorId] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      visitorName: "",
      eventType: "badge_lost" as EventType,
      description: "",
      date: new Date(),
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const event: TraceabilityEvent = {
      id: Date.now().toString(),
      visitorId: selectedVisitorId || undefined,
      visitorName: values.visitorName,
      eventType: values.eventType,
      description: values.description,
      date: values.date,
      createdAt: new Date().toISOString(),
      status: "open",
    }

    onAddEvent(event)

    toast({
      title: "Événement enregistré",
      description: `L'événement a été ajouté à la traçabilité.`,
    })

    form.reset()
    setSelectedVisitorId(null)
  }

  // Fonction pour remplir automatiquement le nom du visiteur lorsqu'on sélectionne un visiteur existant
  const handleVisitorSelect = (visitorId: string) => {
    setSelectedVisitorId(visitorId)
    const visitor = visitors.find((v) => v.id === visitorId)
    if (visitor) {
      form.setValue("visitorName", visitor.name)
    }
  }

  return (
    <div className="rounded-lg border p-6 shadow-sm card-with-bg">
      <h2 className="text-xl font-semibold mb-6">Enregistrer un nouvel événement</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <FormLabel>Visiteur concerné (optionnel)</FormLabel>
              <Select onValueChange={handleVisitorSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un visiteur existant" />
                </SelectTrigger>
                <SelectContent>
                  {visitors.map((visitor) => (
                    <SelectItem key={visitor.id} value={visitor.id}>
                      {visitor.name} ({visitor.company})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">Ou saisissez manuellement le nom ci-dessous</p>
            </div>

            <FormField
              control={form.control}
              name="visitorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de la personne</FormLabel>
                  <FormControl>
                    <Input placeholder="Jean Dupont" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="eventType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type d'événement</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type d'événement" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(eventTypeLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date de l'événement</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: fr })
                          ) : (
                            <span>Sélectionner une date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Décrivez l'événement en détail..."
                        className="resize-none min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Enregistrer l'événement
          </Button>
        </form>
      </Form>
    </div>
  )
}

