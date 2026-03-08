"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import { Loader2, Plus, CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createReward } from "@/app/actions/rewards";

// Esquema de validación estricto
const rewardSchema = yup.object().shape({
  title: yup.string().required("El título es obligatorio").min(3, "Mínimo 3 caracteres"),
  description: yup.string().optional().default(""),
  requirements: yup.string().optional().default(""),
  scans_required: yup
    .number()
    .typeError("Debe ser un número válido")
    .required("La cantidad de escaneos es obligatoria")
    .positive("Debe ser mayor a 0")
    .integer("Debe ser un número entero"),
  expires_at: yup.date().optional().nullable().default(null),
  max_redemptions_per_user: yup.number().optional().nullable().default(null),
});

type RewardFormValues = yup.InferType<typeof rewardSchema>;

interface RewardFormProps {
  businessId: string;
}

export function RewardForm({ businessId }: RewardFormProps) {
  const [open, setOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RewardFormValues>({
    resolver: yupResolver(rewardSchema),
    defaultValues: {
      title: "",
      description: "",
      requirements: "",
      scans_required: 10,
      expires_at: null,
      max_redemptions_per_user: null,
    },
  });

  const expiresAtValue = watch("expires_at");

  const onSubmit = async (data: RewardFormValues) => {
    try {
      const result = await createReward({
        business_id: businessId,
        title: data.title,
        description: data.description,
        requirements: data.requirements,
        scans_required: data.scans_required,
        expires_at: data.expires_at ? data.expires_at.toISOString() : undefined,
        max_redemptions_per_user: data.max_redemptions_per_user,
      });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("¡Recompensa creada exitosamente!");
      setOpen(false);
      reset();
    } catch (_err: unknown) {
        toast.error("Ocurrió un error inesperado al guardar la recompensa.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md">
          <Plus className="mr-2 h-4 w-4" /> Nueva Tarjeta (Recompensa)
        </Button>}>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px] border-border shadow-2xl bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Crear Recompensa</DialogTitle>
          <DialogDescription>
            Configura qué vas a regalar y cuántas visitas necesita el cliente para reclamarlo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-4">
          <div className="space-y-1">
            <Label htmlFor="title" className="text-foreground font-semibold">Título <span className="text-destructive">*</span></Label>
            <Input
              id="title"
              placeholder="Ej: Café Gratis"
              {...register("title")}
              className={errors.title ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.title && <p className="text-xs text-destructive mt-1">{errors.title.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="description" className="text-foreground font-semibold">Descripción / Qué ofrece</Label>
            <Textarea
              id="description"
              placeholder="Ej: Llévate un café americano o cappuccino del tamaño que desees."
              {...register("description")}
              className="resize-none"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="scans_required" className="text-foreground font-semibold">Escaneos necesarios <span className="text-destructive">*</span></Label>
              <Input
                id="scans_required"
                type="number"
                min={1}
                {...register("scans_required")}
                className={errors.scans_required ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.scans_required && <p className="text-xs text-destructive mt-1">{errors.scans_required.message}</p>}
            </div>

            <div className="space-y-1">
              <Label className="text-foreground font-semibold">Válido hasta (Opcional)</Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger render={<Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal border-border",
                      !expiresAtValue && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {expiresAtValue ? format(expiresAtValue as Date, "PPP", { locale: es }) : <span>Sin caducidad</span>}
                  </Button>}>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={expiresAtValue || undefined}
                    onSelect={(date) => {
                      setValue("expires_at", date ? date : null);
                      setCalendarOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="max_redemptions" className="text-foreground font-semibold">Límite de canjes por cliente</Label>
            <Select 
              onValueChange={(val) => setValue("max_redemptions_per_user", val === "unlimited" ? null : parseInt(val as string))}
              defaultValue={"unlimited"}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona un límite" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unlimited">Ilimitado (Puede canjear siempre que complete visitas)</SelectItem>
                <SelectItem value="1">Canje único (Solo una vez por cliente)</SelectItem>
                <SelectItem value="2">Máximo 2 canjes</SelectItem>
                <SelectItem value="3">Máximo 3 canjes</SelectItem>
                <SelectItem value="5">Máximo 5 canjes</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[10px] text-muted-foreground italic">
              Ideal para promociones de bienvenida o cupones de un solo uso.
            </p>
          </div>

          <div className="space-y-1">
            <Label htmlFor="requirements" className="text-foreground font-semibold">Requisitos / Condiciones (Opcional)</Label>
            <Textarea
              id="requirements"
              placeholder="Ej: Válido solo de 8:00 AM a 12:00 PM. No incluye adicionales."
              {...register("requirements")}
              className="resize-none"
              rows={2}
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-border mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="mr-3"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="font-bold">
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Crear Recompensa
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
