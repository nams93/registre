"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { cn } from "@/lib/utils"
import type { Visitor } from "@/types/visitor"
import { toast } from "@/hooks/use-toast"
import { SignaturePad } from "./signature-pad"
// Importer les types et constantes pour les motifs de visite
import type { VisitPurposeType } from "@/types/visit-purpose"
import { visitPurposeLabels } from "@/types/visit-purpose"
// Ajouter l'import pour Select
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mettre à jour le schéma de validation
const formSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Email invalide" }),
  company: z.string().min(1, { message: "La société est requise" }),
  phone: z.string().optional(),
  purpose: z.enum(["reunion", "entretien", "perte_badge", "livraison", "travaux", "autre"] as const, {
    required_error: "Veuillez sélectionner un motif de visite",
  }),
  purposeDetails: z.string().optional(),
  date: z.date({ required_error: "La date est requise" }),
  notes: z.string().optional(),
  badgeNumber: z.string().optional(),
  signature: z.string().optional(),
})

type VisitorFormProps = {
  onAddVisitor: (visitor: Visitor) => void
}

export function VisitorForm({ onAddVisitor }: VisitorFormProps) {
  const [time, setTime] = useState<string>(format(new Date(), "HH:mm"))

  // Dans les valeurs par défaut du formulaire
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      phone: "",
      purpose: "reunion" as VisitPurposeType,
      purposeDetails: "",
      date: new Date(),
      notes: "",
      badgeNumber: "",
      signature: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const visitor: Visitor = {
      id: "",
      ...values,
      time,
      createdAt: new Date().toISOString(),
    }

    onAddVisitor(visitor)

    toast({
      title: "Visiteur enregistré",
      description: `${values.name} a été ajouté au registre.`,
    })

    form.reset()
    setTime(format(new Date(), "HH:mm"))
  }

  return (
    <div className="rounded-lg border p-6 shadow-sm card-with-bg">
      <h2 className="text-xl font-semibold mb-6">Enregistrer un nouveau visiteur</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom complet</FormLabel>
                  <FormControl>
                    <Input placeholder="Jean Dupont" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="jean.dupont@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Société</FormLabel>
                  <FormControl>
                    <Input placeholder="Entreprise SA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input placeholder="06 12 34 56 78" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="badgeNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numéro de badge</FormLabel>
                  <FormControl>
                    <Input placeholder="B-12345" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date de visite</FormLabel>
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

            <div className="space-y-2">
              <Label htmlFor="time">Heure d'arrivée</Label>
              <div className="flex items-center">
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full"
                />
                <Clock className="ml-2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="md:grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="purpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motif</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un motif" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(visitPurposeLabels).map(([value, label]) => (
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
                name="purposeDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Détails du motif (optionnel)</FormLabel>
                    <FormControl>
                      <Input placeholder="Précisions sur le motif..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes additionnelles</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Informations complémentaires..." className="resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="signature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Signature</FormLabel>
                    <FormControl>
                      <SignaturePad value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Enregistrer le visiteur
          </Button>
        </form>
      </Form>
    </div>
  )
}

