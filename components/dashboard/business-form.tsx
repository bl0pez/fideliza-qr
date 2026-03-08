"use client";

import { useState } from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { createBusiness } from "@/app/actions/business";
import { CldUploadWidget } from "next-cloudinary";

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
import { CopyPlus, ImagePlus, Instagram, Store, MessageCircle, Music2 } from "lucide-react";
import Image from "next/image";

const businessSchema = yup.object({
  name: yup.string().required("El nombre del negocio es requerido").min(3, "Mínimo 3 caracteres"),
  type: yup.string().required("Debe seleccionar una categoría"),
  image_url: yup.string().url("Debe ser una URL válida").required("La imagen es requerida"),
  tiktok_url: yup.string().url("Debe ser una URL válida").optional().default(""),
  whatsapp_url: yup.string().optional().default(""),
  instagram_url: yup.string().url("Debe ser una URL válida").optional().default(""),
});

type BusinessFormData = yup.InferType<typeof businessSchema>;

export function BusinessForm({ categories }: { categories: { id: string; name: string }[] }) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<BusinessFormData>({
    resolver: yupResolver(businessSchema),
    defaultValues: {
      name: "",
      type: "",
      image_url: "",
      tiktok_url: "",
      whatsapp_url: "",
      instagram_url: "",
    },
  });

  const { register, control, handleSubmit, formState: { errors, isSubmitting } } = form;

  const onSubmit = async (data: BusinessFormData) => {
    setSubmitError(null);
    
    const result = await createBusiness(data);

    if (result.error) {
      setSubmitError(result.error);
    } else {
      router.push("/dashboard");
    }
  };

  const imageUrl = useWatch({ control, name: "image_url" });

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-2xl border border-white/20 bg-card/80 backdrop-blur-xl rounded-[2rem] overflow-hidden">
      <div className="px-8 pt-8 pb-4 text-center space-y-4">
        <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-2">
          <Store className="w-4 h-4 text-primary mr-2" />
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">NUEVA SUCURSAL</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground bg-clip-text">
          Registrar Negocio
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Completa los datos de tu empresa para empezar a fidelizar clientes hoy mismo.
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
                            <Image src={imageUrl} alt="Preview" fill className="object-cover" />
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
                      <Music2 />
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
                <CopyPlus className="w-4 h-4 mr-2" />
                Crear Negocio
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
