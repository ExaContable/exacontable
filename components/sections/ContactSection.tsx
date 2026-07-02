"use client";

import { Mail, Phone, MapPin, Send, MessageCircle, CheckCircle2, Clock, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Nombre requerido (mín. 2 caracteres)"),
  email: z.string().email("Correo electrónico inválido"),
  phone: z.string().min(7, "Teléfono inválido (mín. 7 dígitos)"),
  subject: z.string().min(1, "Selecciona un asunto"),
  message: z
    .string()
    .min(10, "El mensaje debe tener al menos 10 caracteres")
    .max(500, "Máximo 500 caracteres"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const subjects = [
  { value: "general", label: "Consulta general" },
  { value: "soporte", label: "Soporte técnico" },
  { value: "comercial", label: "Información comercial" },
  { value: "facturacion", label: "Facturación" },
  { value: "otro", label: "Otro" },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function ContactSection() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", subject: "", message: "" },
  });

  const messageValue = form.watch("message");

  const handleSubmit = async (data: ContactFormValues) => {
    setLoading(true);
    setSuccess(false);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Error al enviar");

      setSuccess(true);
      toast.success("Mensaje enviado correctamente");
      form.reset();
    } catch {
      toast.error("Error al enviar el mensaje. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contacto" className="scroll-mt-20 bg-background py-24 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/3 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-primary uppercase">
            Contacto
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl font-heading">
            ¿Tienes alguna duda?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Rellena el formulario o escríbenos por WhatsApp y un asesor de EXA te atenderá personalmente.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 grid gap-12 lg:grid-cols-5"
        >
          <motion.div variants={itemVariants} className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="flex flex-col items-center justify-center rounded-2xl border border-primary/20 bg-card p-12 text-center shadow-sm"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                    className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10"
                  >
                    <CheckCircle2 className="h-10 w-10 text-primary" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-foreground">
                    ¡Mensaje enviado con éxito!
                  </h3>
                  <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                    Gracias por contactarnos. Un asesor de EXA se pondrá en
                    contacto contigo en las próximas horas.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-8 rounded-full"
                    onClick={() => setSuccess(false)}
                  >
                    Enviar otro mensaje
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-sm">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(handleSubmit)} noValidate className="space-y-5">
                        <div className="grid gap-5 sm:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nombre completo</FormLabel>
                                <FormControl>
                                  <Input placeholder="Tu nombre" {...field} />
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
                                <FormLabel>Correo electrónico</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="correo@ejemplo.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid gap-5 sm:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Teléfono</FormLabel>
                                <FormControl>
                                  <Input type="tel" placeholder="+593 99 999 9999" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="subject"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Asunto</FormLabel>
                                <FormControl>
                                  <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Selecciona un asunto" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {subjects.map((s) => (
                                        <SelectItem key={s.value} value={s.value}>
                                          {s.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <FormLabel>Mensaje</FormLabel>
                                <span className="text-xs text-muted-foreground tabular-nums">
                                  {messageValue?.length || 0}/500
                                </span>
                              </div>
                              <FormControl>
                                <Textarea
                                  placeholder="Escribe tu mensaje aquí..."
                                  rows={5}
                                  maxLength={500}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="submit"
                          size="lg"
                          className="w-full gap-2 group rounded-full"
                          disabled={loading}
                          aria-busy={loading}
                        >
                          {loading ? (
                            <>
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              Enviando...
                            </>
                          ) : (
                            <>
                              Enviar mensaje
                              <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-5">
            <h3 className="text-xl font-semibold text-foreground font-heading">
              Información de contacto
            </h3>

            <a
              href="https://wa.me/593978835575"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/[0.08] to-primary/[0.02] p-5 transition-all hover:shadow-1"
            >
              <div className="relative z-10 rounded-xl bg-primary p-3.5 text-white shadow-md transition-transform group-hover:scale-110 group-hover:rotate-6">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div className="relative z-10">
                <p className="text-base font-semibold text-foreground">WhatsApp</p>
                <p className="text-sm text-muted-foreground">Respuesta en minutos</p>
              </div>
              <MessageCircle className="absolute right-4 top-1/2 h-16 w-16 -translate-y-1/2 text-primary/[0.07]" />
            </a>

            <div className="space-y-3">
              {[
                {
                  icon: Mail,
                  label: "Email",
                  value: "info@exacontable.com",
                  href: "mailto:info@exacontable.com",
                },
                {
                  icon: Phone,
                  label: "Teléfono",
                  value: "+593 97 883 5575",
                  href: "tel:+593978835575",
                },
                {
                  icon: MapPin,
                  label: "Dirección",
                  value: "La aurora Calle los ceibos, Machala, El Oro, Ecuador",
                },
                {
                  icon: Globe2,
                  label: "Sitio web",
                  value: "exacontable.com",
                  href: "https://exacontable.com",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="group flex items-center gap-4 rounded-xl border border-border/60 bg-card/50 p-4 transition-all hover:border-primary/20 hover:bg-card/80 hover:shadow-sm"
                >
                  <div className="rounded-lg bg-primary/10 p-3 text-primary transition-transform group-hover:scale-110">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm text-muted-foreground">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-border/60 bg-card/50 p-5">
              <div className="mb-3 flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                  <Clock className="h-4 w-4" />
                </div>
                <p className="text-sm font-semibold text-foreground">Horario de atención</p>
              </div>
              <div className="space-y-1.5 pl-11">
                {[
                  { day: "Lun - Vie", hours: "08:00 - 18:00" },
                  { day: "Sábado", hours: "08:00 - 13:00" },
                  { day: "Domingo", hours: "Cerrado", muted: true },
                ].map((row) => (
                  <div key={row.day} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{row.day}</span>
                    <span className={row.muted ? "text-muted-foreground/60" : "text-foreground font-medium"}>
                      {row.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
