"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ShoppingBag, CreditCard, Building2, Upload, ChevronDown, ChevronUp, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { LazyMotion, m, domAnimation, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useCart } from "@/hooks/use-cart";
import { validarRucOCedula } from "@/lib/validators";

const checkoutSchema = z
  .object({
    first_name: z.string().min(2, "Nombre requerido"),
    last_name: z.string().min(2, "Apellido requerido"),
    email: z.string().email("Email inválido"),
    phone: z.string().min(7, "Teléfono requerido"),
    address_1: z.string().min(5, "Dirección requerida"),
    address_2: z.string().optional(),
    city: z.string().min(2, "Ciudad requerida"),
    state: z.string().min(1, "Provincia requerida"),
    postcode: z.string().min(3, "Código postal requerido"),
    ruc: z.string().optional(),
    cedula: z.string().optional(),
    usuario: z.string().min(3, "Usuario requerido (mín 3 caracteres)"),
    clave: z.string().min(6, "Clave requerida (mín 6 caracteres)"),
    genero: z.string().min(1, "Selecciona un género"),
    payment_method: z.string().min(1, "Selecciona un método de pago"),
    accept_terms: z.boolean().refine((val) => val === true, { message: "Debes aceptar los términos" }),
  })
  .superRefine((data, ctx) => {
    if (data.ruc && data.ruc.length > 0) {
      const tipo = validarRucOCedula(data.ruc);
      if (!tipo) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["ruc"],
          message: "RUC inválido (13 dígitos válidos requeridos)",
        });
      }
    }
    if (data.cedula && data.cedula.length > 0) {
      const tipo = validarRucOCedula(data.cedula);
      if (!tipo) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["cedula"],
          message: "Cédula inválida (10 dígitos válidos requeridos)",
        });
      }
    }
  });

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const ecuadorStates = [
  { value: "EC-A", label: "Azuay" },
  { value: "EC-B", label: "Bolívar" },
  { value: "EC-F", label: "Cañar" },
  { value: "EC-C", label: "Carchi" },
  { value: "EC-H", label: "Chimborazo" },
  { value: "EC-X", label: "Cotopaxi" },
  { value: "EC-O", label: "El Oro" },
  { value: "EC-E", label: "Esmeraldas" },
  { value: "EC-W", label: "Galápagos" },
  { value: "EC-G", label: "Guayas" },
  { value: "EC-I", label: "Imbabura" },
  { value: "EC-L", label: "Loja" },
  { value: "EC-R", label: "Los Ríos" },
  { value: "EC-M", label: "Manabí" },
  { value: "EC-S", label: "Morona Santiago" },
  { value: "EC-N", label: "Napo" },
  { value: "EC-D", label: "Orellana" },
  { value: "EC-Y", label: "Pastaza" },
  { value: "EC-P", label: "Pichincha" },
  { value: "EC-SE", label: "Santa Elena" },
  { value: "EC-SD", label: "Santo Domingo de los Tsáchilas" },
  { value: "EC-U", label: "Sucumbíos" },
  { value: "EC-T", label: "Tungurahua" },
  { value: "EC-Z", label: "Zamora Chinchipe" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartToken } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<{ id: string; title: string; description: string; accounts?: { account_name: string; account_number: string; bank_name: string; account_ruc: string }[] }[]>([]);
  const [loadingGateways, setLoadingGateways] = useState(true);
  const [showOrderSummary, setShowOrderSummary] = useState(false);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      address_1: "",
      address_2: "",
      city: "",
      state: "",
      postcode: "",
      ruc: "",
      cedula: "",
      usuario: "",
      clave: "",
      genero: "",
      payment_method: "bacs",
      accept_terms: false,
    },
  });

  useEffect(() => {
    async function loadPaymentMethods() {
      try {
        const res = await fetch("/api/payment-methods");
        if (res.ok) {
          const data = await res.json();
          setPaymentMethods(data);
          if (data.length > 0 && !data.some((m: { id: string }) => m.id === form.getValues("payment_method"))) {
            form.setValue("payment_method", data[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load payment methods", err);
      } finally {
        setLoadingGateways(false);
      }
    }
    loadPaymentMethods();
  }, [form]);

  const paymentMethod = form.watch("payment_method");
  const selectedMethod = paymentMethods.find((m) => m.id === paymentMethod);
  const hasAccounts = selectedMethod?.accounts && selectedMethod.accounts.length > 0;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 pt-24 px-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100">
          <ShoppingBag className="h-10 w-10 text-zinc-300" />
        </div>
        <h1 className="text-2xl font-bold text-center">No hay productos en tu carrito</h1>
        <p className="text-sm text-zinc-500 text-center">Explora nuestros planes y elige el que mejor se adapte a tu negocio</p>
        <Link href="/#planes">
          <Button className="rounded-full">Ver planes disponibles</Button>
        </Link>
      </div>
    );
  }

  const formatPrice = (cents: string, prefix = "$") => {
    const num = parseInt(cents);
    if (isNaN(num)) return `${prefix}0.00`;
    return `${prefix}${(num / 100).toFixed(2)}`;
  };

  const onSubmit = async (data: CheckoutFormValues) => {
    setLoading(true);

    try {
      const metaData: { key: string; value: string }[] = [
        { key: "billing_usuario", value: data.usuario },
        { key: "billing_clave", value: data.clave },
        { key: "billing_genero", value: data.genero },
        { key: "billing_logueo", value: "" },
      ];

      if (data.ruc) {
        metaData.push({ key: "billing_ruc", value: data.ruc });
      } else if (data.cedula) {
        metaData.push({ key: "billing_cedula", value: data.cedula });
      }

      const checkoutPayload = {
        billing: {
          first_name: data.first_name,
          last_name: data.last_name,
          company: "",
          address_1: data.address_1,
          address_2: data.address_2 || "",
          city: data.city,
          state: data.state,
          postcode: data.postcode,
          country: "EC",
          email: data.email,
          phone: data.phone,
        },
        payment_method: data.payment_method,
        payment_data: {},
        meta_data: metaData,
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkoutData: checkoutPayload }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Error al procesar el pago");
      }

      const result = await res.json();

      if (data.payment_method === "bacs") {
        toast.success("Pedido creado. Realiza la transferencia y sube tu comprobante.");
        router.push(`/mis-pedidos/${result.order_id}`);
      } else {
        toast.success("Pedido creado exitosamente");
        router.push(`/gracias?order_id=${result.order_id}&order_number=${result.order_number}`);
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Error al procesar el pedido"
      );
    } finally {
      setLoading(false);
    }
  };

  const docConfig = { showRuc: true, showCedula: true };

  return (
    <LazyMotion features={domAnimation}>
    <div className="min-h-screen bg-zinc-50/50">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-zinc-900">Checkout</h1>
          <p className="text-sm text-zinc-500 mt-1">Completa tus datos para finalizar la compra</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Formulario */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {/* Resumen móvil colapsable */}
                <div className="lg:hidden rounded-xl border border-zinc-200 bg-white overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setShowOrderSummary(!showOrderSummary)}
                    className="flex w-full items-center justify-between p-4 text-left"
                  >
                    <div>
                      <p className="text-sm font-bold text-zinc-900">Resumen del pedido</p>
                      <p className="text-xs text-zinc-500">
                        {cart.items.length} {cart.items.length === 1 ? "producto" : "productos"} —{" "}
                        {formatPrice(cart.totals.total_price, cart.totals.currency_prefix)}
                      </p>
                    </div>
                    {showOrderSummary ? (
                      <ChevronUp className="h-4 w-4 text-zinc-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-zinc-400" />
                    )}
                  </button>
                  <AnimatePresence>
                    {showOrderSummary && (
                      <m.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-zinc-200"
                      >
                        <div className="p-4 space-y-3">
                          {cart.items.map((item) => (
                            <div key={item.key} className="flex items-center justify-between text-sm">
                              <span className="flex-1 text-zinc-700">
                                {item.name.replace(/^EXA\s*/i, "")}{" "}
                                <span className="text-zinc-400">x{item.quantity}</span>
                              </span>
                              <span className="font-bold text-zinc-900">
                                {formatPrice(item.totals.line_total)}
                              </span>
                            </div>
                          ))}
                          <Separator className="bg-zinc-200" />
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-zinc-900">Total</span>
                            <span className="text-lg font-extrabold text-zinc-900">
                              {formatPrice(cart.totals.total_price, cart.totals.currency_prefix)}
                            </span>
                          </div>
                        </div>
                      </m.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Datos de facturación */}
                <div className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-6 space-y-5">
                  <h2 className="text-lg font-bold font-heading text-zinc-900 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600 text-xs font-bold">1</span>
                    Datos de facturación
                  </h2>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombres</FormLabel>
                          <FormControl>
                            <Input placeholder="Juan" {...field} className="border-zinc-300 focus:ring-red-500/40 focus:border-red-500/40" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Apellidos</FormLabel>
                          <FormControl>
                            <Input placeholder="Pérez" {...field} className="border-zinc-300 focus:ring-red-500/40 focus:border-red-500/40" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Correo electrónico</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="correo@ejemplo.com"
                              {...field}
                              className="border-zinc-300 focus:ring-red-500/40 focus:border-red-500/40"
                            />
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
                          <FormLabel>Teléfono</FormLabel>
                          <FormControl>
                            <Input placeholder="+593 99 999 9999" {...field} className="border-zinc-300 focus:ring-red-500/40 focus:border-red-500/40" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address_1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dirección</FormLabel>
                        <FormControl>
                          <Input placeholder="Calle y número" {...field} className="border-zinc-300 focus:ring-red-500/40 focus:border-red-500/40" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ciudad</FormLabel>
                          <FormControl>
                            <Input placeholder="Machala" {...field} className="border-zinc-300 focus:ring-red-500/40 focus:border-red-500/40" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Provincia</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-zinc-300 focus:ring-red-500/40 focus:border-red-500/40">
                                <SelectValue placeholder="Seleccionar" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {ecuadorStates.map((s) => (
                                <SelectItem key={s.value} value={s.value}>
                                  {s.label}
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
                      name="postcode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Código Postal</FormLabel>
                          <FormControl>
                            <Input placeholder="070205" {...field} className="border-zinc-300 focus:ring-red-500/40 focus:border-red-500/40" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Datos de la cuenta */}
                <div className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-6 space-y-5">
                  <h2 className="text-lg font-bold font-heading text-zinc-900 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600 text-xs font-bold">2</span>
                    Datos de la cuenta
                  </h2>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {docConfig.showRuc && (
                      <FormField
                        control={form.control}
                        name="ruc"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>RUC</FormLabel>
                            <FormControl>
                              <Input placeholder="13 dígitos" maxLength={13} {...field} className="border-zinc-300 focus:ring-red-500/40 focus:border-red-500/40" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    {docConfig.showCedula && (
                      <FormField
                        control={form.control}
                        name="cedula"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cédula</FormLabel>
                            <FormControl>
                              <Input placeholder="10 dígitos" maxLength={10} {...field} className="border-zinc-300 focus:ring-red-500/40 focus:border-red-500/40" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="usuario"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre de usuario</FormLabel>
                          <FormControl>
                            <Input placeholder="usuario123" {...field} className="border-zinc-300 focus:ring-red-500/40 focus:border-red-500/40" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="clave"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contraseña</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Mín 6 caracteres" {...field} className="border-zinc-300 focus:ring-red-500/40 focus:border-red-500/40" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="genero"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Género</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-zinc-300 focus:ring-red-500/40 focus:border-red-500/40">
                                <SelectValue placeholder="Seleccionar" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Masculino">Masculino</SelectItem>
                              <SelectItem value="Femenino">Femenino</SelectItem>
                              <SelectItem value="Otro">Otro</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Método de pago */}
                <div className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-6 space-y-5">
                  <h2 className="text-lg font-bold font-heading text-zinc-900 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600 text-xs font-bold">3</span>
                    Método de pago
                  </h2>

                  <div className="space-y-3">
                    {loadingGateways ? (
                      <div className="space-y-3">
                        <div className="h-20 w-full animate-pulse rounded-xl bg-zinc-100" />
                        <div className="h-20 w-full animate-pulse rounded-xl bg-zinc-100" />
                      </div>
                    ) : paymentMethods.length === 0 ? (
                      <p className="text-sm text-zinc-500">No hay métodos de pago disponibles.</p>
                    ) : (
                      paymentMethods.map((method) => {
                        const isSelected = paymentMethod === method.id;
                        return (
                          <label
                            key={method.id}
                            className={cn(
                              "relative flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-all duration-200",
                              isSelected
                                ? "border-red-500 bg-red-50/50 shadow-[0_2px_12px_rgba(220,76,30,0.08)]"
                                : "border-zinc-200 bg-white hover:bg-zinc-50"
                            )}
                          >
                            <div className={cn(
                              "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all",
                              isSelected ? "border-red-600" : "border-zinc-300"
                            )}>
                              {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-red-600" />}
                            </div>
                            <input
                              type="radio"
                              {...form.register("payment_method")}
                              value={method.id}
                              className="sr-only"
                            />
                            <div className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-lg transition-all",
                              isSelected ? "bg-red-600 text-white" : "bg-zinc-100 text-zinc-500"
                            )}>
                              {method.accounts ? (
                                <Building2 className="h-5 w-5" />
                              ) : (
                                <CreditCard className="h-5 w-5" />
                              )}
                            </div>
                            <div>
                              <p className={cn("font-bold transition-all", isSelected ? "text-red-600" : "text-zinc-900")}>
                                {method.title}
                              </p>
                              {method.description && (
                                <p className="text-xs text-zinc-500 mt-0.5">
                                  {method.description}
                                </p>
                              )}
                            </div>
                            {isSelected && (
                              <m.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white"
                              >
                                <Check className="h-3.5 w-3.5 stroke-[3]" />
                              </m.div>
                            )}
                          </label>
                        );
                      })
                    )}
                  </div>

                  {hasAccounts && selectedMethod && (
                    <m.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4 rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 sm:p-5"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100">
                          <Building2 className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-zinc-900 font-heading">Datos de la cuenta bancaria</p>
                          <p className="text-xs text-zinc-500">Realiza la transferencia por el valor total del pedido</p>
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        {selectedMethod.accounts!.map((account, i) => (
                          <div key={i} className="rounded-lg border border-zinc-200 bg-white p-3.5 space-y-2">
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                              <div>
                                <span className="text-[10px] font-semibold tracking-wider text-zinc-500 uppercase">Banco</span>
                                <p className="font-semibold text-zinc-900">{account.bank_name}</p>
                              </div>
                              <div>
                                <span className="text-[10px] font-semibold tracking-wider text-zinc-500 uppercase">Titular</span>
                                <p className="font-semibold text-zinc-900">{account.account_name}</p>
                              </div>
                              <div>
                                <span className="text-[10px] font-semibold tracking-wider text-zinc-500 uppercase">N° Cuenta</span>
                                <p className="font-mono font-bold text-zinc-900 tracking-wider">{account.account_number}</p>
                              </div>
                              {account.account_ruc && (
                                <div>
                                  <span className="text-[10px] font-semibold tracking-wider text-zinc-500 uppercase">RUC/Cédula</span>
                                  <p className="font-mono font-bold text-zinc-900 tracking-wider">{account.account_ruc}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-start gap-3 rounded-lg border border-dashed border-red-500/20 bg-red-50/50 p-3.5">
                        <Upload className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                        <p className="text-xs text-zinc-600">
                          Luego de realizar la transferencia, podrás subir tu comprobante de pago desde la página de confirmación del pedido.
                        </p>
                      </div>
                    </m.div>
                  )}

                  <FormField
                    control={form.control}
                    name="accept_terms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start gap-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-normal text-zinc-600">
                            Acepto los{" "}
                            <a href="/terminos" className="text-red-600 hover:underline font-medium">
                              términos y condiciones
                            </a>{" "}
                            y la{" "}
                            <a href="/privacidad" className="text-red-600 hover:underline font-medium">
                              política de privacidad
                            </a>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full rounded-xl h-12 text-base font-bold bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/20"
                  disabled={loading}
                >
                  {loading
                    ? "Procesando..."
                    : `Pagar ${formatPrice(cart.totals.total_price, cart.totals.currency_prefix)}`}
                </Button>
              </form>
            </Form>
          </div>

          {/* Resumen Desktop */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="hidden lg:block sticky top-28 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold font-heading text-zinc-900 mb-4">Resumen del pedido</h3>
              <div className="space-y-3">
                {cart.items.map((item) => (
                  <div key={item.key} className="flex items-center justify-between text-sm">
                    <span className="flex-1 text-zinc-700">
                      {item.name.replace(/^EXA\s*/i, "")}{" "}
                      <span className="text-zinc-400">x{item.quantity}</span>
                    </span>
                    <span className="font-bold text-zinc-900">
                      {formatPrice(item.totals.line_total)}
                    </span>
                  </div>
                ))}
              </div>
              <Separator className="my-4 bg-zinc-200" />
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-900">Total</span>
                <span className="text-xl font-extrabold text-zinc-900">
                  {formatPrice(cart.totals.total_price, cart.totals.currency_prefix)}
                </span>
              </div>
              {paymentMethods.length > 0 && (
                <div className="mt-4 rounded-lg bg-zinc-50 p-3 border border-zinc-100">
                  <p className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">Métodos aceptados</p>
                  <div className="mt-1.5 space-y-1">
                    {paymentMethods.map((m) => (
                      <p key={m.id} className="flex items-center gap-2 text-xs text-zinc-600">
                        {m.accounts ? (
                          <Building2 className="h-3.5 w-3.5 text-red-500/60 shrink-0" />
                        ) : (
                          <CreditCard className="h-3.5 w-3.5 text-red-500/60 shrink-0" />
                        )}
                        {m.title}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </LazyMotion>
  );
}
