"use client";

import { useState } from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { createBusiness, updateBusiness } from "@/app/actions/business";
import { upsertBusinessSchedules, getBusinessSchedules } from "@/app/actions/business-schedules";
import { timeToMinutes } from "@/lib/utils/schedule-helpers";
import { CldUploadWidget } from "next-cloudinary";
import { toast } from "sonner";
import { useEffect } from "react";
import { useFieldArray } from "react-hook-form";
import { Plus, Trash2, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { CopyPlus, ImagePlus, Instagram, Store, MessageCircle, Globe, Save } from "lucide-react";
import Image from "next/image";

const businessSchema = yup.object({
  name: yup.string().required("El nombre del negocio es requerido").min(3, "Mínimo 3 caracteres"),
  type: yup.string().required("Debe seleccionar una categoría"),
  description: yup.string().max(600, "Máximo 600 caracteres").optional().default(""),
  website_url: yup.string().url("Debe ser una URL válida").optional().default(""),
  image_url: yup.string().url("Debe ser una URL válida").required("La imagen es requerida"),
  country_id: yup.string().required("El país es requerido"),
  city: yup.string().required("La ciudad es requerida"),
  city_id: yup.string().required("Selecciona una ciudad de la lista"),
  address: yup.string().required("La dirección es requerida"),
  tiktok_url: yup.string().url("Debe ser una URL válida").optional().default(""),
  whatsapp_url: yup.string().optional().default(""),
  instagram_url: yup.string().url("Debe ser una URL válida").optional().default(""),
  schedules: yup.array().of(
    yup.object({
      day_of_week: yup.number().required(),
      start: yup.string().required("Inicio requerido").matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato HH:MM"),
      end: yup.string().required("Fin requerido").matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato HH:MM")
        .test("is-after", "Debe ser después del inicio", function(value) {
          const { start } = this.parent;
          if (!start || !value) return true;
          return timeToMinutes(value) > timeToMinutes(start);
        })
    })
  ).test("no-overlaps", "Hay horarios solapados", function(schedules) {
    if (!schedules) return true;
    const days: Record<number, {start: number, end: number}[]> = {};
    for (const s of schedules) {
      if (!s.start || !s.end) continue;
      const start = timeToMinutes(s.start);
      const end = timeToMinutes(s.end);
      if (!days[s.day_of_week]) days[s.day_of_week] = [];
      for (const existing of days[s.day_of_week]) {
        if (start < existing.end && end > existing.start) return false;
      }
      days[s.day_of_week].push({ start, end });
    }
    return true;
  }).default([])
});

const DAYS = [
  { id: 1, name: "Lunes" },
  { id: 2, name: "Martes" },
  { id: 3, name: "Miércoles" },
  { id: 4, name: "Jueves" },
  { id: 5, name: "Viernes" },
  { id: 6, name: "Sábado" },
  { id: 0, name: "Domingo" },
];

interface BusinessFormData {
  name: string;
  type: string;
  description: string;
  website_url: string;
  image_url: string;
  country_id: string;
  city: string;
  city_id: string;
  address: string;
  tiktok_url: string;
  whatsapp_url: string;
  instagram_url: string;
  schedules: { day_of_week: number; start: string; end: string }[];
}

export function BusinessForm({ 
  categories, 
  cities: allCities,
  countries,
  initialData 
}: { 
  categories: { id: string; name: string }[];
  cities: { id: string; name: string; country_id: string }[];
  countries: { id: string; name: string }[];
  initialData?: {
    id: string;
    name: string;
    type: string;
    description?: string | null;
    website_url?: string | null;
    image_url: string;
    country_id: string;
    city: string;
    city_id: string;
    address: string;
    tiktok_url?: string | null;
    whatsapp_url?: string | null;
    instagram_url?: string | null;
    slug: string;
  }
}) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isEditing = !!initialData;

  const form = useForm<BusinessFormData>({
    resolver: yupResolver(businessSchema),
    defaultValues: {
      name: initialData?.name || "",
      type: initialData?.type || "",
      description: initialData?.description || "",
      website_url: initialData?.website_url || "",
      image_url: initialData?.image_url || "",
      country_id: initialData?.country_id || "",
      city: initialData?.city || "",
      city_id: initialData?.city_id || "",
      address: initialData?.address || "",
      tiktok_url: initialData?.tiktok_url || "",
      whatsapp_url: initialData?.whatsapp_url || "",
      instagram_url: initialData?.instagram_url || "",
      schedules: [],
    },
  });

  const { register, control, handleSubmit, formState: { errors, isSubmitting }, setValue } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "schedules",
  });

  useEffect(() => {
    if (isEditing && initialData) {
      getBusinessSchedules(initialData.id).then(data => {
        if (data) {
          const formatted = data.map(s => {
            const match = s.hour_range.match(/\[(\d+),\s*(\d+)\)/);
            if (match) {
              const startStr = Math.floor(parseInt(match[1]) / 60).toString().padStart(2, '0') + ':' + (parseInt(match[1]) % 60).toString().padStart(2, '0');
              const endStr = Math.floor(parseInt(match[2]) / 60).toString().padStart(2, '0') + ':' + (parseInt(match[2]) % 60).toString().padStart(2, '0');
              return { day_of_week: s.day_of_week, start: startStr, end: endStr };
            }
            return null;
          }).filter(Boolean) as { day_of_week: number; start: string; end: string }[];
          
          setValue("schedules", formatted);
        }
      });
    }
  }, [isEditing, initialData, setValue]);

  // Reactivo: Filtrar ciudades por país seleccionado
  const selectedCountryId = useWatch({ control, name: "country_id" });
  const filteredCities = allCities.filter(city => city.country_id === selectedCountryId);

  const onSubmit = async (data: BusinessFormData) => {
    setSubmitError(null);
    
    const result = isEditing 
      ? await updateBusiness(initialData!.id, data)
      : await createBusiness(data);

    if (result.error) {
      setSubmitError(result.error);
    } else {
      // Si el negocio se creó/actualizó con éxito, procedemos con los horarios
      const updatedSlug = (result as { success: boolean; data?: { slug: string }; slug?: string }).slug || 
                         (result as { success: boolean; data?: { slug: string } }).data?.slug || 
                         initialData?.slug;
      
      const businessId = isEditing 
        ? initialData?.id 
        : (result as { success: boolean; data?: { id: string } }).data?.id;
      
      if (businessId) {
        const scheduleResult = await upsertBusinessSchedules(
          businessId,
          data.schedules.map(s => ({
            day_of_week: s.day_of_week,
            hour_range: `[${timeToMinutes(s.start)}, ${timeToMinutes(s.end)})`
          }))
        );
        if (scheduleResult.error) {
          toast.error("Negocio guardado, pero hubo un error con los horarios: " + scheduleResult.error);
        }
      }
      
      toast.success(isEditing ? "Negocio actualizado" : "Negocio creado");
      
      // Si estamos editando y el slug cambió, redirigimos a la nueva página de edición o al dashboard
      if (isEditing && updatedSlug && updatedSlug !== initialData?.slug) {
        router.push(`/dashboard/businesses/${updatedSlug}/edit`);
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    }
  };

  const imageUrl = useWatch({ control, name: "image_url" });

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-2xl border border-white/20 bg-card/80 backdrop-blur-xl rounded-[2rem] overflow-hidden">
      <div className="px-8 pt-8 pb-4 text-center space-y-4">
        <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-2">
          <Store className="w-4 h-4 text-primary mr-2" />
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            {isEditing ? "EDITAR PERFIL" : "NUEVA SUCURSAL"}
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground bg-clip-text">
          {isEditing ? "Editar Negocio" : "Registrar Negocio"}
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          {isEditing 
            ? "Actualiza la información pública y redes sociales de tu negocio."
            : "Completa los datos de tu empresa para empezar a fidelizar clientes hoy mismo."
          }
        </p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <CardContent className="space-y-6">
          
          <FieldGroup>
            <Controller
              control={control}
              name="image_url"
              render={({ field }) => (
                <Field data-invalid={!!errors.image_url}>
                  <FieldLabel>Logotipo o Imagen Principal</FieldLabel>
                  <CldUploadWidget 
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "fideliza_qr_preset"}
                    options={{
                      multiple: false,
                      maxFiles: 1,
                    }}
                    onSuccess={(result) => {
                      const info = result.info as { secure_url: string };
                      if (info?.secure_url) {
                        field.onChange(info.secure_url);
                      }
                    }}
                  >
                    {({ open }) => (
                      <div 
                        onClick={() => open()}
                        className="w-full h-48 border-2 border-dashed border-primary/30 bg-primary/5 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-primary/10 transition-all duration-300 relative overflow-hidden group"
                      >
                        {imageUrl ? (
                          <>
                            <Image src={imageUrl as string} alt="Preview" fill className="object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-white font-medium flex items-center gap-2"><ImagePlus className="w-4 h-4"/> Cambiar Imagen</span>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center text-primary/70">
                            <ImagePlus className="w-10 h-10 mb-3 opacity-80 group-hover:scale-110 transition-transform" />
                            <span className="font-medium">Haz clic para subir logotipo</span>
                            <span className="text-xs opacity-70 mt-1">Recomendado: 800x600px en formato cuadrado</span>
                          </div>
                        )}
                      </div>
                    )}
                  </CldUploadWidget>
                  <FieldError errors={[errors.image_url]} />
                </Field>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field data-invalid={!!errors.name}>
                <FieldLabel>Nombre del Negocio</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <Store />
                  </InputGroupAddon>
                  <InputGroupInput 
                    placeholder="Ej. Cafetería Central" 
                    {...register("name")} 
                    aria-invalid={!!errors.name}
                  />
                </InputGroup>
                <FieldError errors={[errors.name]} />
              </Field>

              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Field data-invalid={!!errors.type}>
                    <FieldLabel>Categoría Principal</FieldLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <SelectTrigger aria-invalid={!!errors.type}>
                        <SelectValue placeholder="Selecciona el rubro..." />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.name}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError errors={[errors.type]} />
                  </Field>
                )}
              />
            </div>

            <Field data-invalid={!!errors.description}>
              <FieldLabel>Descripción del Negocio (Opcional)</FieldLabel>
              <InputGroup>
                <textarea 
                  className="flex min-h-[100px] w-full rounded-2xl border border-input bg-background/50 px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                  placeholder="Cuenta brevemente de qué trata tu negocio..." 
                  {...register("description")} 
                  aria-invalid={!!errors.description}
                />
              </InputGroup>
              <FieldError errors={[errors.description]} />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Controller
                control={control}
                name="country_id"
                render={({ field }) => (
                  <Field data-invalid={!!errors.country_id}>
                    <FieldLabel>País</FieldLabel>
                    <Select 
                      onValueChange={(val) => {
                        field.onChange(val);
                        // Resetear ciudad al cambiar país
                        setValue("city_id", "");
                        setValue("city", "", { shouldValidate: true });
                      }} 
                      value={field.value || ""}
                    >
                      <SelectTrigger aria-invalid={!!errors.country_id}>
                        <SelectValue placeholder="Selecciona país...">
                          {countries.find(c => c.id === field.value)?.name}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.id} value={country.id}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError errors={[errors.country_id]} />
                  </Field>
                )}
              />

              <Controller
                control={control}
                name="city_id"
                render={({ field }) => (
                  <Field data-invalid={!!errors.city_id}>
                    <FieldLabel>Ciudad</FieldLabel>
                    <Select 
                      onValueChange={(val) => {
                        field.onChange(val);
                        const cityName = filteredCities.find(c => c.id === val)?.name || "";
                        setValue("city", cityName, { shouldValidate: true });
                      }} 
                      value={field.value || ""}
                      disabled={!selectedCountryId}
                    >
                      <SelectTrigger aria-invalid={!!errors.city_id}>
                        <SelectValue placeholder={selectedCountryId ? "Selecciona ciudad..." : "Primero elige un país..."}>
                          {filteredCities.find(c => c.id === field.value)?.name}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {filteredCities.map((city) => (
                          <SelectItem key={city.id} value={city.id}>
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError errors={[errors.city_id]} />
                  </Field>
                )}
              />
            </div>

            <Field data-invalid={!!errors.address}>
              <FieldLabel>Dirección Exacta</FieldLabel>
              <InputGroup>
                <InputGroupInput 
                  placeholder="Ej. Calle Falsa 123, Providencia" 
                  {...register("address")} 
                  aria-invalid={!!errors.address}
                />
              </InputGroup>
              <FieldError errors={[errors.address]} />
            </Field>

            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-sm font-medium text-muted-foreground">Redes Sociales (Opcional)</h3>
              
              <div className="grid grid-cols-1 gap-6">
                <Field data-invalid={!!errors.instagram_url} orientation="vertical">
                  <FieldLabel>Instagram</FieldLabel>
                  <InputGroup>
                    <InputGroupAddon>
                      <Instagram />
                    </InputGroupAddon>
                    <InputGroupInput 
                      placeholder="https://instagram.com/tu_negocio" 
                      {...register("instagram_url")} 
                      aria-invalid={!!errors.instagram_url}
                    />
                  </InputGroup>
                  <FieldError errors={[errors.instagram_url]} />
                </Field>

                <Field data-invalid={!!errors.tiktok_url} orientation="vertical">
                  <FieldLabel>TikTok</FieldLabel>
                  <InputGroup>
                    <InputGroupAddon>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4"
                      >
                        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                      </svg>
                    </InputGroupAddon>
                    <InputGroupInput 
                      placeholder="https://tiktok.com/@tu_negocio" 
                      {...register("tiktok_url")} 
                      aria-invalid={!!errors.tiktok_url}
                    />
                  </InputGroup>
                  <FieldError errors={[errors.tiktok_url]} />
                </Field>

                <Field data-invalid={!!errors.whatsapp_url} orientation="vertical">
                  <FieldLabel>WhatsApp (Enlace o Número)</FieldLabel>
                  <InputGroup>
                    <InputGroupAddon>
                      <MessageCircle />
                    </InputGroupAddon>
                    <InputGroupInput 
                      placeholder="Ej. https://wa.me/5491100000000" 
                      {...register("whatsapp_url")} 
                      aria-invalid={!!errors.whatsapp_url}
                    />
                  </InputGroup>
                  <FieldError errors={[errors.whatsapp_url]} />
                </Field>

                <Field data-invalid={!!errors.website_url} orientation="vertical">
                  <FieldLabel>Sitio Web</FieldLabel>
                  <InputGroup>
                    <InputGroupAddon>
                      <Globe />
                    </InputGroupAddon>
                    <InputGroupInput 
                      placeholder="https://tu_negocio.com" 
                      {...register("website_url")} 
                      aria-invalid={!!errors.website_url}
                    />
                  </InputGroup>
                  <FieldError errors={[errors.website_url]} />
                </Field>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Horarios de Atención</h3>
                  <p className="text-xs text-muted-foreground">Define los turnos en los que tu negocio está abierto.</p>
                </div>
                <Button 
                  type="button" 
                  size="sm" 
                  variant="outline" 
                  className="rounded-xl border-primary/30 text-primary hover:bg-primary/5"
                  onClick={() => append({ day_of_week: 1, start: "09:00", end: "18:00" })}
                >
                  <Plus className="w-4 h-4 mr-2" /> Agregar Turno
                </Button>
              </div>

              {errors.schedules?.message && (
                <p className="text-xs text-destructive bg-destructive/10 p-2 rounded-lg border border-destructive/20">
                  {errors.schedules.message}
                </p>
              )}

              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-12 gap-3 items-end bg-muted/30 p-4 rounded-2xl border border-white/10 group">
                    <div className="col-span-4 space-y-2">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Día</label>
                      <Controller
                        control={control}
                        name={`schedules.${index}.day_of_week`}
                        render={({ field }) => (
                          <Select 
                            onValueChange={(val: string | null) => {
                              if (val) field.onChange(parseInt(val));
                            }} 
                            value={field.value !== undefined && field.value !== null ? String(field.value) : ""}
                          >
                            <SelectTrigger className="h-10 rounded-xl bg-background/50 border-white/20">
                              <SelectValue placeholder="Selecciona un día">
                                {DAYS.find(d => d.id.toString() === field.value?.toString())?.name}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {DAYS.map((day) => (
                                <SelectItem key={day.id} value={day.id.toString()}>
                                  {day.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <div className="col-span-3 space-y-2">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Apertura</label>
                      <InputGroup>
                        <InputGroupAddon className="bg-transparent border-0 pr-0"><Clock className="w-3.5 h-3.5 opacity-50"/></InputGroupAddon>
                        <input
                          type="time"
                          className="flex h-10 w-full rounded-xl border border-white/20 bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                          {...register(`schedules.${index}.start`)}
                        />
                      </InputGroup>
                    </div>
                    <div className="col-span-3 space-y-2">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Cierre</label>
                      <InputGroup>
                        <InputGroupAddon className="bg-transparent border-0 pr-0"><Clock className="w-3.5 h-3.5 opacity-50"/></InputGroupAddon>
                        <input
                          type="time"
                          className="flex h-10 w-full rounded-xl border border-white/20 bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                          {...register(`schedules.${index}.end`)}
                        />
                      </InputGroup>
                    </div>
                    <div className="col-span-2 pb-0.5">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    {/* Inline errors for each shift */}
                    <div className="col-span-12">
                      {errors.schedules?.[index]?.end?.message && (
                        <p className="text-[10px] text-destructive ml-1">
                          {errors.schedules[index]?.end?.message}
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                {fields.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-white/10 rounded-3xl bg-muted/10">
                    <Clock className="w-10 h-10 mx-auto text-muted-foreground/30 mb-2" />
                    <p className="text-sm text-muted-foreground">No hay horarios configurados.</p>
                    <p className="text-xs text-muted-foreground/60">El negocio aparecerá como &quot;Cerrado&quot; permanentemente.</p>
                  </div>
                )}
              </div>
            </div>
          </FieldGroup>

          {submitError && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md border border-destructive/20 mt-4">
              {submitError}
            </div>
          )}
        </CardContent>

        <CardFooter className="bg-muted/10 px-8 py-5 flex justify-end gap-3 rounded-b-[2rem] border-t">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="hover:bg-destructive/10 hover:text-destructive transition-colors rounded-xl px-6"
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="min-w-[160px] rounded-xl bg-linear-to-r from-primary to-orange-500 hover:opacity-90 transition-all font-semibold shadow-md hover:shadow-primary/25 hover:-translate-y-0.5"
          >
            {isSubmitting ? (
              "Guardando..."
            ) : (
              <>
                {isEditing ? <Save className="w-4 h-4 mr-2" /> : <CopyPlus className="w-4 h-4 mr-2" />}
                {isEditing ? "Guardar Cambios" : "Crear Negocio"}
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
