import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowLeft, Store, User, CheckCircle2, QrCode } from "lucide-react";

const schema = yup.object({
  businessName: yup.string().required("El nombre del negocio es obligatorio").min(3, "Mínimo 3 caracteres"),
  category: yup.string().required("La categoría es obligatoria"),
  ownerName: yup.string().required("Tu nombre es obligatorio"),
  email: yup.string().email("Email inválido").required("El email es obligatorio"),
  phone: yup.string().required("El teléfono es obligatorio"),
  password: yup.string().required("La contraseña es obligatoria").min(6, "Mínimo 6 caracteres"),
}).required();

type FormData = yup.InferType<typeof schema>;

export function RegistrationForm() {
  const [step, setStep] = useState(1);
  const { register, handleSubmit, formState: { errors }, trigger } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onChange"
  });

  const nextStep = async () => {
    const fieldsToValidate = step === 1 
      ? ["businessName", "category"] as const
      : ["ownerName", "email", "phone", "password"] as const;
    
    const result = await trigger(fieldsToValidate);
    if (result) setStep(step + 1);
  };

  const onSubmit = (data: FormData) => {
    console.log("Form Data:", data);
    setStep(3); // Success state
  };

  if (step === 3) {
    return (
      <div className="p-8 md:p-16 rounded-[2.5rem] bg-white border border-slate-100 shadow-2xl text-center space-y-8 animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-12 h-12 text-primary" />
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900">¡Registro Exitoso!</h2>
          <p className="text-slate-500 font-medium text-lg max-w-md mx-auto">
            Hemos creado tu cuenta profesional. Ya puedes empezar a configurar tus tarjetas de sellos.
          </p>
        </div>
        <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 max-w-xs mx-auto space-y-4">
           <div className="w-40 h-40 bg-white rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center mx-auto">
              <QrCode className="w-20 h-20 text-slate-300" />
           </div>
           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tu primer QR está listo</p>
        </div>
        <Button className="h-14 px-10 rounded-2xl font-black text-lg bg-slate-900 hover:bg-primary shadow-xl shadow-black/10 transition-all">
          Ir al Panel de Control
        </Button>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12 rounded-[2.5rem] bg-slate-50 border border-slate-100 shadow-2xl relative overflow-hidden transition-all duration-500">
      
      {/* Progress Line */}
      <div className="absolute top-0 left-0 h-1 bg-primary transition-all duration-700" style={{ width: `${(step / 2) * 100}%` }} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 relative z-10">
        {step === 1 && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
            <div className="flex items-center gap-4 text-primary">
               <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Store className="w-6 h-6" />
               </div>
               <h3 className="text-2xl font-black tracking-tight text-slate-900">Sobre tu Negocio</h3>
            </div>
            
            <div className="grid gap-6">
              <div className="space-y-3">
                <Label className="text-slate-900 font-black uppercase text-[10px] tracking-widest ml-1">Nombre Comercial</Label>
                <Input 
                  {...register("businessName")} 
                  placeholder="Ej: Café La Esperanza"
                  className={`h-14 rounded-2xl bg-white border-slate-200 focus-visible:ring-primary/50 text-lg font-medium transition-all ${errors.businessName ? 'border-red-500 ring-red-500' : ''}`}
                />
                {errors.businessName && <p className="text-xs text-red-500 font-bold ml-1">{errors.businessName.message}</p>}
              </div>

              <div className="space-y-3">
                <Label className="text-slate-900 font-black uppercase text-[10px] tracking-widest ml-1">Categoría</Label>
                <select 
                  {...register("category")}
                  className="w-full h-14 rounded-2xl bg-white border border-slate-200 px-4 text-lg font-medium outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                >
                  <option value="">Selecciona una categoría</option>
                  <option value="cafeteria">Cafetería</option>
                  <option value="restaurante">Restaurante</option>
                  <option value="barberia">Barbería</option>
                  <option value="otros">Otros</option>
                </select>
                {errors.category && <p className="text-xs text-red-500 font-bold ml-1">{errors.category.message}</p>}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
            <div className="flex items-center gap-4 text-primary">
               <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <User className="w-6 h-6" />
               </div>
               <h3 className="text-2xl font-black tracking-tight text-slate-900">Sobre el Administrador</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-slate-900 font-black uppercase text-[10px] tracking-widest ml-1">Tu Nombre</Label>
                <Input 
                  {...register("ownerName")} 
                  placeholder="Ej: Juan Pérez"
                  className="h-14 rounded-2xl bg-white border-slate-200 text-lg font-medium"
                />
                {errors.ownerName && <p className="text-xs text-red-500 font-bold ml-1">{errors.ownerName.message}</p>}
              </div>

              <div className="space-y-3">
                <Label className="text-slate-900 font-black uppercase text-[10px] tracking-widest ml-1">Teléfono</Label>
                <Input 
                  {...register("phone")} 
                  placeholder="+56 9..."
                  className="h-14 rounded-2xl bg-white border-slate-200 text-lg font-medium"
                />
                {errors.phone && <p className="text-xs text-red-500 font-bold ml-1">{errors.phone.message}</p>}
              </div>

              <div className="space-y-3">
                <Label className="text-slate-900 font-black uppercase text-[10px] tracking-widest ml-1">Email Profesional</Label>
                <Input 
                  {...register("email")} 
                  placeholder="juan@ejemplo.com"
                  className="h-14 rounded-2xl bg-white border-slate-200 text-lg font-medium"
                />
                {errors.email && <p className="text-xs text-red-500 font-bold ml-1">{errors.email.message}</p>}
              </div>

              <div className="space-y-3">
                <Label className="text-slate-900 font-black uppercase text-[10px] tracking-widest ml-1">Contraseña</Label>
                <Input 
                  {...register("password")} 
                  type="password"
                  placeholder="••••••••"
                  className="h-14 rounded-2xl bg-white border-slate-200 text-lg font-medium"
                />
                {errors.password && <p className="text-xs text-red-500 font-bold ml-1">{errors.password.message}</p>}
              </div>
            </div>
          </div>
        )}

        <div className="pt-8 border-t border-slate-200 flex items-center justify-between gap-4">
          {step === 2 && (
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setStep(1)}
              className="h-14 px-8 rounded-2xl font-black text-slate-500 border-slate-200 hover:bg-slate-100 transition-all gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Atrás
            </Button>
          )}
          
          <Button 
            type="button" 
            onClick={step === 1 ? nextStep : handleSubmit(onSubmit)}
            className={`h-14 px-10 rounded-2xl font-black text-lg ml-auto transition-all gap-2 shadow-xl ${
              step === 1 ? 'bg-slate-900 text-white hover:bg-primary' : 'bg-primary text-white hover:scale-105 active:scale-95 shadow-primary/20'
            }`}
          >
            {step === 1 ? "Continuar" : "Finalizar Registro"}
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </form>
    </div>
  );
}
