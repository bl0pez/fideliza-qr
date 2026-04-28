"use client";

import { useState } from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { createAdminBusiness, updateAdminBusiness } from "@/app/actions/admin-business";
import { CldUploadWidget } from "next-cloudinary";
import { cldForStorage } from "@/lib/cloudinary";
import { toast } from "sonner";
import { Store, ImagePlus, Instagram, MessageCircle, Globe, ArrowLeft, Rocket, Plus, Trash2, Clock, ShieldCheck, MapPin } from "lucide-react";
import Image from "next/image";
import { DS } from "@/lib/constants";
import { useFieldArray } from "react-hook-form";
import { timeToMinutes } from "@/lib/utils/schedule-helpers";

import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import {
  CardContent,
  CardFooter,
} from "@/components/ui/card";
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

const adminBusinessSchema = yup.object({
  name: yup.string().required("El nombre del negocio es requerido").min(3, "Mínimo 3 caracteres"),
  type: yup.string().required("Debe seleccionar una categoría"),
  description: yup.string().max(600, "Máximo 600 caracteres").optional().default(""),
  website_url: yup.string().url("Debe ser una URL válida").optional().default(""),
  image_url: yup.string().url("Debe ser una URL válida").required("La imagen es requerida"),
  country_id: yup.string().required("El país es requerido"),
  city: yup.string().required("La ciudad es requerida"),
  city_id: yup.string().required("Selecciona una ciudad de la lista"),
  address: yup.string().required("La dirección o punto de referencia es requerida"),
  tiktok_url: yup.string().url("Debe ser una URL válida").optional().default(""),
  whatsapp_url: yup.string().optional().default(""),
  instagram_url: yup.string().url("Debe ser una URL válida").optional().default(""),
  google_maps_url: yup.string().url("Debe ser una URL de Maps válida").optional().default(""),
  owner_id: yup.string().optional().default(""),
  schedules: yup.array().of(
    yup.object({
      day_of_week: yup.number().required(),
      start: yup.string().required("Inicio requerido").matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato HH:MM"),
      end: yup.string().required("Fin requerido").matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato HH:MM"),
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

interface AdminBusinessFormData {
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
  google_maps_url: string;
  owner_id: string;
  schedules: { day_of_week: number; start: string; end: string }[];
}

const DAYS = [
  { id: 1, name: "Lunes" },
  { id: 2, name: "Martes" },
  { id: 3, name: "Miércoles" },
  { id: 4, name: "Jueves" },
  { id: 5, name: "Viernes" },
  { id: 6, name: "Sábado" },
  { id: 0, name: "Domingo" },
];

interface AdminShopFormProps {
  categories: { id: string; name: string }[];
  cities: { id: string; name: string; country_id: string }[];
  countries: { id: string; name: string }[];
  profiles: { id: string; full_name: string | null; role: string | null }[];
  initialData?: Partial<AdminBusinessFormData> & { id?: string };
}

export function AdminShopForm({ categories, cities: allCities, countries, profiles, initialData }: AdminShopFormProps) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isEditing = !!initialData?.id;

  const form = useForm<AdminBusinessFormData>({
    resolver: yupResolver(adminBusinessSchema),
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
      google_maps_url: initialData?.google_maps_url || "",
      owner_id: initialData?.owner_id || "",
      schedules: initialData?.schedules || [],
    },
  });

  const { register, control, handleSubmit, formState: { errors, isSubmitting }, setValue } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "schedules",
  });

  const selectedCountryId = useWatch({ control, name: "country_id" });
  const filteredCities = allCities.filter(city => city.country_id === selectedCountryId);
  const imageUrl = useWatch({ control, name: "image_url" });

  const onSubmit = async (data: AdminBusinessFormData) => {
    setSubmitError(null);
    let result;
    
    if (isEditing && initialData?.id) {
      result = await updateAdminBusiness(initialData.id, data);
    } else {
      result = await createAdminBusiness(data);
    }

    if (result.error) {
      setSubmitError(result.error);
      if (typeof result.error === "string") {
        toast.error(result.error);
      }
    } else {
      toast.success(isEditing ? "Negocio actualizado exitosamente" : "Negocio creado exitosamente (Modo Admin)");
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className={`${DS.card.rounded} ${DS.card.border} ${DS.glass.card} overflow-hidden shadow-2xl shadow-primary/5`}>
        {/* Banner Decorativo */}
        <div className={`h-2 ${DS.gradient.primary}`} />
        
        <div className="px-8 pt-12 pb-8 text-center border-b border-border/40 relative overflow-hidden">
          <div className={`absolute -top-24 -right-24 w-64 h-64 ${DS.glow.light} opacity-30`} />
          <div className={`absolute -bottom-24 -left-24 w-64 h-64 ${DS.glow.accent} opacity-20`} />

          {/* Heading Badge Pattern */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className={DS.typography.sectionLabelLine} />
            <span className={DS.typography.sectionLabel}>{isEditing ? "Edición Maestra" : "Creación Maestra"}</span>
            <div className={DS.typography.sectionLabelLine} />
          </div>
          
          <h1 className={`text-4xl md:text-5xl ${DS.typography.heading} text-slate-900 dark:text-white mb-4`}>
            {isEditing ? "Gestionar" : "Desplegar Nuevo"} <span className={DS.gradient.primaryText}>Comercio</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto italic font-medium">
            {isEditing ? "Actualiza la configuración global del negocio." : "Configuración global de negocio con privilegios de administrador."}
          </p>
        </div>

      <form onSubmit={handleSubmit(onSubmit)} className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <CardContent className="space-y-8 px-10 pb-10">
          <FieldGroup>
            {/* Imagen Principal */}
            <Controller
              control={control}
              name="image_url"
              render={({ field }) => (
                <Field data-invalid={!!errors.image_url}>
                  <FieldLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Identidad Visual</FieldLabel>
                  <CldUploadWidget 
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "fideliza_qr_preset"}
                    options={{
                      multiple: false,
                      maxFiles: 1,
                    }}
                    onSuccess={(result) => {
                      const info = result.info as { secure_url: string };
                      if (info?.secure_url) {
                        field.onChange(cldForStorage(info.secure_url));
                      }
                    }}
                  >
                    {({ open }) => (
                      <div 
                        onClick={() => open?.()}
                        className="w-full h-64 border-2 border-dashed border-indigo-500/30 bg-indigo-500/5 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-500/10 transition-all duration-500 group relative overflow-hidden"
                      >
                        {imageUrl ? (
                          <>
                            <Image src={imageUrl} alt="Preview" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-indigo-600/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                              <span className="text-white font-black flex items-center gap-2 scale-90 group-hover:scale-100 transition-transform"><ImagePlus className="w-6 h-6"/> CAMBIAR LOGOTIPO</span>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center text-indigo-600/70">
                            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner">
                              <ImagePlus className="w-8 h-8 opacity-80" />
                            </div>
                            <span className="font-black tracking-tight text-xl">Subir imagen de portada</span>
                            <span className="text-xs font-medium opacity-60 mt-1 uppercase tracking-widest">Horizontal · mín. 1200×400 px · no logos verticales</span>
                          </div>
                        )}
                      </div>
                    )}
                  </CldUploadWidget>
                  <FieldError errors={[errors.image_url]} />
                </Field>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Nombre */}
              <Field data-invalid={!!errors.name}>
                <FieldLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Nombre Comercial</FieldLabel>
                <InputGroup>
                  <InputGroupAddon className="bg-indigo-500/5 border-r border-border/40 text-indigo-600">
                    <Store className="w-4 h-4" />
                  </InputGroupAddon>
                  <InputGroupInput 
                    placeholder="Ej. Sushi Master Premium" 
                    className="h-12 font-medium"
                    {...register("name")} 
                    aria-invalid={!!errors.name}
                  />
                </InputGroup>
                <FieldError errors={[errors.name]} />
              </Field>

              {/* Categoría */}
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Field data-invalid={!!errors.type}>
                    <FieldLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Rubro / Categoría</FieldLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <SelectTrigger className="h-12 rounded-2xl bg-white/50 dark:bg-slate-950/50 border-border/40 focus:ring-indigo-500/10" aria-invalid={!!errors.type}>
                        <SelectValue placeholder="Selecciona categoría..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-border/40">
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.name} className="focus:bg-indigo-500/10 focus:text-indigo-600 font-medium">
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

            {/* Descripción */}
            <Field data-invalid={!!errors.description}>
              <FieldLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Descripción (Pitch de ventas)</FieldLabel>
              <InputGroup>
                <textarea 
                  className="flex min-h-[120px] w-full rounded-2xl border-0 bg-transparent px-4 py-3 text-sm font-medium ring-0 focus:ring-0 placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-none shadow-none focus-visible:ring-0 focus-visible:outline-none"
                  placeholder="Describe la propuesta de valor del negocio..." 
                  {...register("description")} 
                  aria-invalid={!!errors.description}
                />
              </InputGroup>
              <FieldError errors={[errors.description]} />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* País */}
              <Controller
                control={control}
                name="country_id"
                render={({ field }) => (
                  <Field data-invalid={!!errors.country_id}>
                    <FieldLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Localización (País)</FieldLabel>
                    <Select 
                      onValueChange={(val) => {
                        field.onChange(val);
                        setValue("city_id", "");
                        setValue("city", "");
                      }} 
                      value={field.value || ""}
                    >
                      <SelectTrigger className="h-12 rounded-2xl bg-white/50 dark:bg-slate-950/50 border-border/40" aria-invalid={!!errors.country_id}>
                        <SelectValue placeholder="Elegir país...">
                          {countries.find(c => c.id === field.value)?.name}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        {countries.map((country) => (
                          <SelectItem key={country.id} value={country.id} className="font-medium">
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError errors={[errors.country_id]} />
                  </Field>
                )}
              />

              {/* Ciudad */}
              <Controller
                control={control}
                name="city_id"
                render={({ field }) => (
                  <Field data-invalid={!!errors.city_id}>
                    <FieldLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Ciudad</FieldLabel>
                    <Select 
                      onValueChange={(val) => {
                        field.onChange(val);
                        const cityName = filteredCities.find(c => c.id === val)?.name || "";
                        setValue("city", cityName, { shouldValidate: true });
                      }} 
                      value={field.value || ""}
                      disabled={!selectedCountryId}
                    >
                      <SelectTrigger className="h-12 rounded-2xl bg-white/50 dark:bg-slate-950/50 border-border/40" aria-invalid={!!errors.city_id}>
                        <SelectValue placeholder={selectedCountryId ? "Elegir ciudad..." : "Elige un país primero"}>
                          {filteredCities.find(c => c.id === field.value)?.name}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        {filteredCities.map((city) => (
                          <SelectItem key={city.id} value={city.id} className="font-medium">
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

            {/* Dirección */}
            <div className="space-y-4">
              <Field data-invalid={!!errors.address}>
                <FieldLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Dirección o Punto de Referencia</FieldLabel>
                <InputGroup>
                  <InputGroupAddon className="bg-indigo-500/5 text-indigo-600 border-r border-border/40">
                    <Globe className="w-4 h-4" />
                  </InputGroupAddon>
                  <InputGroupInput 
                    placeholder="Calle, número o 'Itinerante (Carrito)'" 
                    className="h-12 font-medium"
                    {...register("address")} 
                    aria-invalid={!!errors.address}
                  />
                </InputGroup>
                <FieldError errors={[errors.address]} />
              </Field>

              <Field data-invalid={!!errors.google_maps_url}>
                <FieldLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                  Enlace de Google Maps (Opcional)
                </FieldLabel>
                <InputGroup>
                  <InputGroupAddon className="bg-indigo-500/5 text-indigo-600 border-r border-border/40">
                    <MapPin className="w-4 h-4" />
                  </InputGroupAddon>
                  <InputGroupInput 
                    placeholder="https://maps.app.goo.gl/..." 
                    className="h-12 font-medium"
                    {...register("google_maps_url")} 
                    aria-invalid={!!errors.google_maps_url}
                  />
                </InputGroup>
                <FieldError errors={[errors.google_maps_url]} />
                <p className="text-[10px] text-muted-foreground mt-1 italic font-medium">
                  Ideal para carritos de comida o negocios sin dirección fija exacta.
                </p>
              </Field>
            </div>

            {/* Redes Sociales - Glassmorphism Container */}
            <div className="p-8 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 space-y-6">
              <h3 className="text-lg font-black tracking-tight text-indigo-900 dark:text-indigo-100 flex items-center gap-3">
                <Globe className="w-5 h-5 text-indigo-600" /> Presencia Digital
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field data-invalid={!!errors.instagram_url} orientation="vertical">
                  <FieldLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">Instagram</FieldLabel>
                  <InputGroup>
                    <InputGroupAddon className="bg-pink-500/10 text-pink-600"><Instagram className="w-4 h-4"/></InputGroupAddon>
                    <InputGroupInput placeholder="@username" className="h-10 text-sm" {...register("instagram_url")} aria-invalid={!!errors.instagram_url} />
                  </InputGroup>
                </Field>

                <Field data-invalid={!!errors.whatsapp_url} orientation="vertical">
                  <FieldLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">WhatsApp</FieldLabel>
                  <InputGroup>
                    <InputGroupAddon className="bg-green-500/10 text-green-600"><MessageCircle className="w-4 h-4"/></InputGroupAddon>
                    <InputGroupInput placeholder="+569..." className="h-10 text-sm" {...register("whatsapp_url")} aria-invalid={!!errors.whatsapp_url} />
                  </InputGroup>
                </Field>

                <Field data-invalid={!!errors.website_url} orientation="vertical">
                  <FieldLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">Sitio Web</FieldLabel>
                  <InputGroup>
                    <InputGroupAddon className="bg-indigo-500/10 text-indigo-600"><Globe className="w-4 h-4"/></InputGroupAddon>
                    <InputGroupInput placeholder="https://..." className="h-10 text-sm" {...register("website_url")} aria-invalid={!!errors.website_url} />
                  </InputGroup>
                </Field>

                <Field data-invalid={!!errors.tiktok_url} orientation="vertical">
                  <FieldLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">TikTok</FieldLabel>
                  <InputGroup>
                    <InputGroupAddon className="bg-slate-900/10 text-slate-900 dark:bg-slate-200/10 dark:text-slate-200">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>
                    </InputGroupAddon>
                    <InputGroupInput placeholder="https://tiktok.com/@..." className="h-10 text-sm" {...register("tiktok_url")} aria-invalid={!!errors.tiktok_url} />
                  </InputGroup>
                </Field>
              </div>
            </div>

            {/* Horarios de Atención - PREMIUM DESIGN */}
            <div className={`p-8 rounded-[2.5rem] ${DS.glass.card} ${DS.card.border} space-y-8 relative overflow-hidden group/schedules`}>
              <div className={`absolute top-0 right-0 w-32 h-32 ${DS.glow.light} opacity-10 group-hover/schedules:opacity-20 transition-opacity`} />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className={`text-xl font-black tracking-tight ${DS.gradient.primaryText} flex items-center gap-3`}>
                    <Clock className="w-6 h-6 text-primary" /> Horarios de Atención
                  </h3>
                  <p className="text-sm font-medium text-muted-foreground mt-1 italic">Define las franjas horarias de operación global.</p>
                </div>
                
                <button 
                  type="button"
                  onClick={() => append({ day_of_week: 1, start: "09:00", end: "18:00" })}
                  className={`h-11 px-6 rounded-xl ${DS.gradient.primary} text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-2`}
                >
                  <Plus className="w-4 h-4" /> Agregar Turno
                </button>
              </div>

              {errors.schedules?.message && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs font-bold animate-shake">
                  {String(errors.schedules.message)}
                </div>
              )}

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-white/40 dark:bg-slate-900/40 p-5 rounded-3xl border border-border/40 hover:border-primary/30 transition-colors group/item">
                    <div className="col-span-1 md:col-span-4 space-y-2">
                      <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/70 ml-1">Día de la semana</label>
                      <Controller
                        control={control}
                        name={`schedules.${index}.day_of_week`}
                        render={({ field }) => (
                          <Select 
                            onValueChange={(val) => field.onChange(val ? parseInt(val) : 1)} 
                            value={String(field.value ?? 1)}
                          >
                            <SelectTrigger className="h-11 rounded-xl bg-white/50 dark:bg-slate-950/50 border-border/40 focus:ring-primary/20">
                              <SelectValue placeholder="Día">
                                {DAYS.find(d => d.id === field.value)?.name}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-border/40">
                              {DAYS.map((day) => (
                                <SelectItem key={day.id} value={String(day.id)} className="font-medium">
                                  {day.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>

                    <div className="col-span-1 md:col-span-3 space-y-2">
                      <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/70 ml-1">Apertura</label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 pointer-events-none" />
                        <input
                          type="time"
                          className="w-full h-11 pl-10 rounded-xl bg-white/50 dark:bg-slate-950/50 border border-border/40 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                          {...register(`schedules.${index}.start`)}
                        />
                      </div>
                    </div>

                    <div className="col-span-1 md:col-span-3 space-y-2">
                      <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/70 ml-1">Cierre</label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 pointer-events-none" />
                        <input
                          type="time"
                          className="w-full h-11 pl-10 rounded-xl bg-white/50 dark:bg-slate-950/50 border border-border/40 text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                          {...register(`schedules.${index}.end`)}
                        />
                      </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="h-11 w-11 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center shadow-inner"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {errors.schedules?.[index]?.end && (
                      <div className="col-span-12 text-[10px] font-black text-red-500 uppercase tracking-widest ml-1 mt-1">
                        {errors.schedules[index]?.end?.message}
                      </div>
                    )}
                  </div>
                ))}

                {fields.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed border-border/30 rounded-[2rem] bg-indigo-500/5">
                    <div className="w-16 h-16 rounded-3xl bg-white/50 dark:bg-slate-900/50 border border-white/20 flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <Clock className="w-8 h-8 text-muted-foreground/40" />
                    </div>
                    <p className="text-slate-900 dark:text-white font-black uppercase tracking-widest text-sm">Sin horarios activos</p>
                    <p className="text-muted-foreground text-xs mt-1 font-medium italic">Agrega turnos para definir la operatividad del comercio.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Asignación de Propietario (Solamente para Admin) */}
            <div className="p-8 rounded-[2.5rem] bg-indigo-500/5 border border-indigo-500/10">
              <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground/70 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Control de Propiedad
              </h3>
              <Controller
                control={control}
                name="owner_id"
                render={({ field }) => (
                  <Field data-invalid={!!errors.owner_id}>
                    <FieldLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">Propietario del Comercio</FieldLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <SelectTrigger className="h-12 rounded-2xl bg-white/50 dark:bg-slate-950/50 border-border/40 focus:ring-indigo-500/10" aria-invalid={!!errors.owner_id}>
                        <SelectValue placeholder="Seleccionar propietario..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-border/40">
                        <SelectItem value="" className="italic text-muted-foreground">Tú (Administrador)</SelectItem>
                        {profiles.map((profile) => (
                          <SelectItem key={profile.id} value={profile.id} className="focus:bg-indigo-500/10 focus:text-indigo-600 font-medium">
                            <div className="flex flex-col items-start text-xs">
                              <div className="flex items-center gap-2">
                                <span className="font-bold">{profile.full_name || "Sin nombre"}</span>
                                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-black uppercase tracking-tighter opacity-70">
                                  {profile.role}
                                </span>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError errors={[errors.owner_id]} />
                    <p className="text-[10px] text-muted-foreground mt-2 italic font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-primary" /> Si no seleccionas a nadie, serás el dueño por defecto.
                    </p>
                  </Field>
                )}
              />
            </div>

          </FieldGroup>

          {submitError && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 text-sm font-bold flex items-center gap-3 animate-shake">
              <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              {submitError}
            </div>
          )}
        </CardContent>

        <CardFooter className="px-10 py-8 bg-slate-50/50 dark:bg-slate-950/50 border-t border-border/40 flex items-center justify-between gap-4">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="h-14 px-8 rounded-2xl font-bold hover:bg-red-500/10 hover:text-red-600 transition-all"
          >
            <ArrowLeft className="w-5 h-5 mr-3" /> Cancelar
          </Button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`h-14 min-w-[280px] ${DS.card.rounded} ${DS.gradient.primary} text-white font-black text-lg shadow-xl shadow-primary/20 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 group`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>PROCESANDO...</span>
              </>
            ) : (
              <>
                <Rocket className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span>{isEditing ? "GUARDAR CAMBIOS" : "DESPLEGAR NEGOCIO"}</span>
              </>
            )}
          </button>
        </CardFooter>
      </form>
    </div>
  </div>
);
}
