"use client";

import { useState } from "react";
import { Check, Settings, Sparkles, MessageSquare, HelpCircle, Loader2, Building2, Users, Calculator, FileText, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LazyMotion, m, domAnimation } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface CustomPlanBuilderProps {
  index?: number;
}

export function CustomPlanBuilder({ index = 0 }: CustomPlanBuilderProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Configuration States
  const [empresas, setEmpresas] = useState("1");
  const [usuarios, setUsuarios] = useState("1");
  const [contadores, setContadores] = useState("0");
  const [documentos, setDocumentos] = useState("100");
  const [nomina, setNomina] = useState("sin-nomina");

  // Modules Checkboxes
  const [modules, setModules] = useState({
    inventario: true,
    facturacion: true,
    comprasVentas: true,
    contabilidad: true,
    bancos: false,
    cartera: false,
    nominaMod: false,
    soporte: true,
  });

  // Contact Info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleModuleChange = (key: keyof typeof modules) => {
    setModules((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      toast.error("Por favor, completa todos los campos de contacto");
      return;
    }

    setSubmitting(true);

    const selectedModules = Object.entries(modules)
      .filter(([_, val]) => val)
      .map(([key]) => {
        const labelMap: Record<string, string> = {
          inventario: "Inventario",
          facturacion: "Facturación Electrónica SRI",
          comprasVentas: "Ventas y Compras",
          contabilidad: "Contabilidad Completa",
          bancos: "Conciliación Bancaria / Bancos",
          cartera: "Cuentas por Cobrar/Pagar",
          nominaMod: "Nómina y Empleados",
          soporte: "Soporte Técnico Personalizado",
        };
        return labelMap[key];
      });

    const docsLabelMap: Record<string, string> = {
      "100": "100 documentos / año",
      "600": "600 documentos / año",
      "1200": "1200 documentos / año",
      "2400": "2400 documentos / año",
      ilimitado: "Documentos Ilimitados",
    };

    const nominaLabelMap: Record<string, string> = {
      "sin-nomina": "Sin nómina",
      "hasta-5": "Hasta 5 empleados",
      "hasta-20": "Hasta 20 empleados",
      "hasta-100": "Hasta 100 empleados",
      ilimitado: "Empleados Ilimitados",
    };

    const detailsText = [
      `• Empresas: ${empresas === "ilimitado" ? "Ilimitadas" : empresas}`,
      `• Usuarios: ${usuarios === "ilimitado" ? "Ilimitados" : usuarios}`,
      `• Contadores: ${contadores === "ilimitado" ? "Ilimitados" : contadores}`,
      `• SRI Documentos: ${docsLabelMap[documentos] || documentos}`,
      `• Nómina: ${nominaLabelMap[nomina] || nomina}`,
      `• Módulos Seleccionados: ${selectedModules.join(", ")}`,
    ].join("\n");

    try {
      const res = await fetch("/api/custom-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          details: detailsText,
          empresas,
          usuarios,
          contadores,
          documentos: docsLabelMap[documentos] || documentos,
          nomina: nominaLabelMap[nomina] || nomina,
          modules: selectedModules,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save inquiry");
      }

      const waNumber = "593978835575";
      const message = [
        `Hola EXA Contable, deseo cotizar un *Plan Personalizado* con las siguientes características:`,
        "",
        `🏢 *Empresas:* ${empresas === "ilimitado" ? "Ilimitadas" : empresas}`,
        `👥 *Usuarios:* ${usuarios === "ilimitado" ? "Ilimitados" : usuarios}`,
        `🧮 *Contadores:* ${contadores === "ilimitado" ? "Ilimitados" : contadores}`,
        `📄 *SRI Facturas:* ${docsLabelMap[documentos] || documentos}`,
        `👥 *Nómina:* ${nominaLabelMap[nomina] || nomina}`,
        `🛠️ *Módulos:* ${selectedModules.join(", ")}`,
        "",
        `👤 *Cliente:* ${name}`,
        `📧 *Correo:* ${email}`,
        `📞 *Teléfono:* ${phone}`,
        "",
        `¿Cuál sería el precio estimado del plan?`,
      ].join("\n");

      const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

      toast.success("¡Cotización registrada! Redirigiendo a WhatsApp...");
      window.open(waUrl, "_blank");

      setOpen(false);
      setName("");
      setEmail("");
      setPhone("");
    } catch (err) {
      console.error(err);
      toast.error("Error al registrar la cotización, por favor intente de nuevo");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LazyMotion features={domAnimation}>
    <m.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
      className="relative mt-12 w-full max-w-4xl mx-auto flex flex-col items-center justify-between gap-6 rounded-2xl border border-red-200 bg-red-50 p-8 text-center md:flex-row md:text-left shadow-[0_0_25px_rgba(220,76,30,0.03)] hover:border-red-300 hover:shadow-[0_0_35px_rgba(220,76,30,0.08)] transition-all duration-500 overflow-hidden"
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-700" />

      <div className="space-y-2 flex-1 pl-2 md:pl-4">
        <div className="flex items-center justify-center md:justify-start gap-2">
          <Badge className="bg-red-200 text-red-800 border border-red-300 text-[10px] px-2.5 py-0.5 font-bold uppercase tracking-wider rounded-md">
            Plan Personalizado
          </Badge>
        </div>
        <h4 className="text-lg font-bold text-zinc-800 font-heading">
          ¿Ninguno de estos planes se ajusta a tus requerimientos?
        </h4>
        <p className="text-sm text-zinc-600">
          Personaliza el plan a tu medida seleccionando los recursos y módulos exactos que tu empresa necesita.
        </p>
      </div>

      <div className="shrink-0">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={(props) => (
              <Button
                className="gap-2.5 transition-all duration-300 rounded-full font-bold bg-red-700 hover:bg-red-800 text-white shadow-lg shadow-red-500/20 px-6 py-5 text-sm shrink-0 hover:scale-[1.02]"
                {...props}
              >
                <Settings className="h-4.5 w-4.5 text-white shrink-0" />
                Personaliza el plan a tu medida
              </Button>
            )}
          />
          <DialogContent className="max-w-6xl w-[96vw] sm:max-w-6xl max-h-[92vh] overflow-y-auto bg-white rounded-2xl shadow-2xl p-0">
            <div className="bg-red-700 px-6 py-5 rounded-t-2xl">
              <DialogHeader className="space-y-1 p-0">
                <DialogTitle className="text-xl sm:text-2xl font-black font-heading text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-white/90" />
                  Configurar Plan Personalizado
                </DialogTitle>
                <DialogDescription className="text-red-100 text-sm leading-relaxed">
                  Selecciona los recursos y módulos requeridos por tu negocio. Nuestro equipo estimará el precio ideal para tu empresa.
                </DialogDescription>
              </DialogHeader>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 p-6 pt-5">
              {/* Step 1: Recursos */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-red-600 uppercase tracking-widest flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-600 text-[10px] font-bold">1</span>
                  Recursos y Capacidades
                </h4>

                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="empresas" className="text-zinc-700 text-xs font-semibold flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-zinc-400" />
                      Empresas
                    </Label>
                    <Select value={empresas} onValueChange={(val) => val && setEmpresas(val)}>
                      <SelectTrigger id="empresas" className="border-zinc-300 bg-white text-zinc-900 focus:ring-red-500/40 focus:border-red-500/40 h-10 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-zinc-200 bg-white text-zinc-900">
                        <SelectItem value="1">1 Empresa</SelectItem>
                        <SelectItem value="2">2 Empresas</SelectItem>
                        <SelectItem value="3">3 Empresas</SelectItem>
                        <SelectItem value="5">5 Empresas</SelectItem>
                        <SelectItem value="10">10 Empresas</SelectItem>
                        <SelectItem value="ilimitado">Ilimitadas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="usuarios" className="text-zinc-700 text-xs font-semibold flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-zinc-400" />
                      Usuarios Operativos
                    </Label>
                    <Select value={usuarios} onValueChange={(val) => val && setUsuarios(val)}>
                      <SelectTrigger id="usuarios" className="border-zinc-300 bg-white text-zinc-900 focus:ring-red-500/40 focus:border-red-500/40 h-10 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-zinc-200 bg-white text-zinc-900">
                        <SelectItem value="1">1 Usuario</SelectItem>
                        <SelectItem value="2">2 Usuarios</SelectItem>
                        <SelectItem value="3">3 Usuarios</SelectItem>
                        <SelectItem value="5">5 Usuarios</SelectItem>
                        <SelectItem value="10">10 Usuarios</SelectItem>
                        <SelectItem value="20">20 Usuarios</SelectItem>
                        <SelectItem value="ilimitado">Ilimitados</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="contadores" className="text-zinc-700 text-xs font-semibold flex items-center gap-1.5">
                      <Calculator className="h-3.5 w-3.5 text-zinc-400" />
                      Accesos Contador
                    </Label>
                    <Select value={contadores} onValueChange={(val) => val && setContadores(val)}>
                      <SelectTrigger id="contadores" className="border-zinc-300 bg-white text-zinc-900 focus:ring-red-500/40 focus:border-red-500/40 h-10 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-zinc-200 bg-white text-zinc-900">
                        <SelectItem value="0">Sin contador</SelectItem>
                        <SelectItem value="1">1 Contador</SelectItem>
                        <SelectItem value="2">2 Contadores</SelectItem>
                        <SelectItem value="3">3 Contadores</SelectItem>
                        <SelectItem value="ilimitado">Ilimitados</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="documentos" className="text-zinc-700 text-xs font-semibold flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-zinc-400" />
                      Facturación Electrónica SRI
                    </Label>
                    <Select value={documentos} onValueChange={(val) => val && setDocumentos(val)}>
                      <SelectTrigger id="documentos" className="border-zinc-300 bg-white text-zinc-900 focus:ring-red-500/40 focus:border-red-500/40 h-10 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-zinc-200 bg-white text-zinc-900">
                        <SelectItem value="100">100 Comprobantes / año</SelectItem>
                        <SelectItem value="600">600 Comprobantes / año</SelectItem>
                        <SelectItem value="1200">1200 Comprobantes / año</SelectItem>
                        <SelectItem value="2400">2400 Comprobantes / año</SelectItem>
                        <SelectItem value="ilimitado">Comprobantes Ilimitados</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="nomina" className="text-zinc-700 text-xs font-semibold flex items-center gap-1.5">
                      <UserCheck className="h-3.5 w-3.5 text-zinc-400" />
                      Nómina (Capacidad)
                    </Label>
                    <Select value={nomina} onValueChange={(val) => val && setNomina(val)}>
                      <SelectTrigger id="nomina" className="border-zinc-300 bg-white text-zinc-900 focus:ring-red-500/40 focus:border-red-500/40 h-10 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-zinc-200 bg-white text-zinc-900">
                        <SelectItem value="sin-nomina">Sin módulo de nómina</SelectItem>
                        <SelectItem value="hasta-5">Hasta 5 empleados</SelectItem>
                        <SelectItem value="hasta-20">Hasta 20 empleados</SelectItem>
                        <SelectItem value="hasta-100">Hasta 100 empleados</SelectItem>
                        <SelectItem value="ilimitado">Empleados Ilimitados</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Step 2: Módulos */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-red-600 uppercase tracking-widest flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-600 text-[10px] font-bold">2</span>
                  Módulos Requeridos
                </h4>

                <div className="grid gap-2.5 grid-cols-1 sm:grid-cols-2">
                  {[
                    { key: "inventario" as const, label: "Control de Inventarios", desc: "Kardex, stock por bodegas y alertas de mínimos." },
                    { key: "facturacion" as const, label: "Facturación SRI integrada", desc: "Emisión ilimitada autorizada de comprobantes electrónicos." },
                    { key: "comprasVentas" as const, label: "Ventas y Compras", desc: "Registro rápido de transacciones comerciales y reportes." },
                    { key: "contabilidad" as const, label: "Contabilidad Completa", desc: "Balances, asientos automáticos y anexos para SRI." },
                    { key: "bancos" as const, label: "Bancos y Conciliación", desc: "Conciliación de depósitos, cheques y transferencias." },
                    { key: "cartera" as const, label: "Cuentas por Cobrar/Pagar", desc: "Control de cartera vencida y deudas con proveedores." },
                    { key: "nominaMod" as const, label: "Módulo Nómina", desc: "Cálculo de décimos, liquidaciones y roles IESS." },
                    { key: "soporte" as const, label: "Soporte Técnico Prioritario", desc: "Asistencia directa por chat o llamada y capacitación." },
                  ].map(({ key, label, desc }) => (
                    <div
                      key={key}
                      onClick={() => handleModuleChange(key)}
                      className={cn(
                        "flex items-start gap-3 p-3.5 rounded-xl border transition-all duration-200 cursor-pointer select-none",
                        modules[key]
                          ? "border-red-500/50 bg-red-50 shadow-[0_0_15px_rgba(220,76,30,0.05)]"
                          : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300 hover:bg-zinc-50"
                      )}
                    >
                      <div className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all mt-0.5",
                        modules[key] ? "border-red-600 bg-red-600 text-white" : "border-zinc-400"
                      )}>
                        {modules[key] && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                      </div>
                      <div className="space-y-0.5">
                        <p className={cn("text-xs font-bold", modules[key] ? "text-zinc-900" : "text-zinc-600")}>{label}</p>
                        <p className="text-[10px] text-zinc-400 leading-normal">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 3: Contacto */}
              <div className="space-y-4 bg-zinc-50 p-4 sm:p-5 rounded-2xl border border-zinc-200">
                <h4 className="text-xs font-bold text-red-600 uppercase tracking-widest flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-600 text-[10px] font-bold">3</span>
                  Tus Datos de Contacto
                </h4>

                <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="cust-name" className="text-zinc-700 text-xs font-semibold">Nombre Completo</Label>
                    <Input
                      id="cust-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Juan Pérez"
                      className="border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-400 h-10 text-sm focus:ring-red-500/40 focus:border-red-500/40"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="cust-email" className="text-zinc-700 text-xs font-semibold">Correo Electrónico</Label>
                    <Input
                      id="cust-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="juan@example.com"
                      className="border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-400 h-10 text-sm focus:ring-red-500/40 focus:border-red-500/40"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="cust-phone" className="text-zinc-700 text-xs font-semibold">Teléfono / WhatsApp</Label>
                    <Input
                      id="cust-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="0998765432"
                      className="border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-400 h-10 text-sm focus:ring-red-500/40 focus:border-red-500/40"
                    />
                  </div>
                </div>
              </div>

              <DialogFooter className="gap-3 border-t border-zinc-200 pt-4 flex flex-col-reverse sm:flex-row justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="h-10 px-5 rounded-lg text-xs font-semibold uppercase tracking-wider border-zinc-300 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-red-700 hover:bg-red-800 text-white gap-2 font-bold px-6 h-10 rounded-lg text-xs font-semibold uppercase tracking-wider shadow-lg shadow-red-500/20"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="h-4 w-4" />
                      Consultar en WhatsApp
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </m.div>
    </LazyMotion>
  );
}
