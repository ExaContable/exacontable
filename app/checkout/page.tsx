"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ShoppingBag, CreditCard, Building2, Upload } from "lucide-react";
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
import { toast } from "sonner";
import { useCart } from "@/hooks/use-cart";
import { validarRucOCedula } from "@/lib/validators";


const checkoutSchema = z
  .object({
    first_name: z.string().min(2, "Nombre requerido"),
    last_name: z.string().min(2, "Apellido requerido"),
    email: z.string().email("Email invalido"),
    phone: z.string().min(7, "Telefono requerido"),
    address_1: z.string().min(5, "Direccion requerida"),
    address_2: z.string().optional(),
    city: z.string().min(2, "Ciudad requerida"),
    state: z.string().min(1, "Provincia requerida"),
    postcode: z.string().min(3, "Codigo postal requerido"),
    ruc: z.string().optional(),
    cedula: z.string().optional(),
    usuario: z.string().min(3, "Usuario requerido (min 3 caracteres)"),
    clave: z.string().min(6, "Clave requerida (min 6 caracteres)"),
    genero: z.string().min(1, "Selecciona un genero"),
    payment_method: z.string().min(1, "Selecciona un metodo de pago"),
    accept_terms: z.boolean().refine((val) => val === true, { message: "Debes aceptar los terminos" }),
  })
  .superRefine((data, ctx) => {
    if (data.ruc && data.ruc.length > 0) {
      const tipo = validarRucOCedula(data.ruc);
      if (!tipo) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["ruc"],
          message: "RUC invalido (debe tener 13 digitos validos)",
        });
      }
    }
    if (data.cedula && data.cedula.length > 0) {
      const tipo = validarRucOCedula(data.cedula);
      if (!tipo) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["cedula"],
          message: "Cedula invalida (debe tener 10 digitos validos)",
        });
      }
    }
  });

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const ecuadorStates = [
  { value: "EC-A", label: "Azuay" },
  { value: "EC-B", label: "Bolivar" },
  { value: "EC-F", label: "Cañar" },
  { value: "EC-C", label: "Carchi" },
  { value: "EC-H", label: "Chimborazo" },
  { value: "EC-X", label: "Cotopaxi" },
  { value: "EC-O", label: "El Oro" },
  { value: "EC-E", label: "Esmeraldas" },
  { value: "EC-W", label: "Galapagos" },
  { value: "EC-G", label: "Guayas" },
  { value: "EC-I", label: "Imbabura" },
  { value: "EC-L", label: "Loja" },
  { value: "EC-R", label: "Los Rios" },
  { value: "EC-M", label: "Manabi" },
  { value: "EC-S", label: "Morona Santiago" },
  { value: "EC-N", label: "Napo" },
  { value: "EC-D", label: "Orellana" },
  { value: "EC-Y", label: "Pastaza" },
  { value: "EC-P", label: "Pichincha" },
  { value: "EC-SE", label: "Santa Elena" },
  { value: "EC-SD", label: "Santo Domingo de los Tsachilas" },
  { value: "EC-U", label: "Sucumbios" },
  { value: "EC-T", label: "Tungurahua" },
  { value: "EC-Z", label: "Zamora Chinchipe" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartToken } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<{ id: string; title: string; description: string }[]>([]);
  const [loadingGateways, setLoadingGateways] = useState(true);

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
        const res = await fetch("/api/woocommerce/payment-methods");
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

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 pt-16">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
        <h1 className="text-2xl font-bold">No hay productos en tu carrito</h1>
        <Link href="/#planes">
          <Button>Ver planes</Button>
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

      const res = await fetch("/api/woocommerce/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checkoutData: checkoutPayload,
          cartToken,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Error al procesar el pago");
      }

      const result = await res.json();

      if (data.payment_method === "bacs") {
        toast.success(
          "Pedido creado. Realiza la transferencia y sube tu comprobante."
        );
        router.push(`/mis-pedidos/${result.order_id}`);
      } else {
        toast.success("Pedido creado exitosamente");
        router.push(`/gracias?order_id=${result.order_id}`);
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
    <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Checkout</h1>

      <div className="mt-12 grid gap-12 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">
                  Datos de facturacion
                </h2>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombres</FormLabel>
                        <FormControl>
                          <Input placeholder="Juan" {...field} />
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
                          <Input placeholder="Perez" {...field} />
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
                        <FormLabel>Correo electronico</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="correo@ejemplo.com"
                            {...field}
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
                        <FormLabel>Telefono</FormLabel>
                        <FormControl>
                          <Input placeholder="+593 99 999 9999" {...field} />
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
                      <FormLabel>Direccion</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Calle y numero"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 sm:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ciudad</FormLabel>
                        <FormControl>
                          <Input placeholder="Machala" {...field} />
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
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
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
                        <FormLabel>Codigo Postal</FormLabel>
                        <FormControl>
                          <Input placeholder="070205" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-6">
                <h2 className="text-xl font-semibold">
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
                            <Input placeholder="13 digitos" maxLength={13} {...field} />
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
                          <FormLabel>Cedula</FormLabel>
                          <FormControl>
                            <Input placeholder="10 digitos" maxLength={10} {...field} />
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
                          <Input placeholder="usuario123" {...field} />
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
                          <Input type="password" placeholder="Min 6 caracteres" {...field} />
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
                        <FormLabel>Genero</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
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

              <Separator />

              <div className="space-y-6">
                <h2 className="text-xl font-semibold font-heading">Metodo de pago</h2>

                <div className="space-y-3">
                  {loadingGateways ? (
                    <div className="space-y-3">
                      <div className="h-20 w-full animate-pulse rounded-lg bg-muted" />
                      <div className="h-20 w-full animate-pulse rounded-lg bg-muted" />
                    </div>
                  ) : paymentMethods.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No hay metodos de pago disponibles.</p>
                  ) : (
                    paymentMethods.map((method) => {
                      const Icon = method.id === "bacs" ? Building2 : CreditCard;
                      const isSelected = paymentMethod === method.id;
                      return (
                        <label
                          key={method.id}
                          className={cn(
                            "flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-all duration-300",
                            isSelected
                              ? "border-primary bg-primary/5 shadow-[0_4px_20px_rgba(220,76,30,0.15)]"
                              : "border-border bg-card/40 hover:bg-muted/30"
                          )}
                        >
                          <input
                            type="radio"
                            {...form.register("payment_method")}
                            value={method.id}
                            className="h-4 w-4 accent-primary"
                          />
                          <div className="rounded-lg bg-background p-2 text-primary">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-bold text-foreground">{method.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {method.description || (method.id === "bacs"
                                ? "Banco Pichincha - Sube tu comprobante de pago"
                                : "Paga con tarjeta de credito o debito")}
                            </p>
                          </div>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>

              <FormField
                control={form.control}
                name="accept_terms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start gap-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-normal text-muted-foreground">
                        Acepto los{" "}
                        <a
                          href="/terminos"
                          className="text-primary hover:underline"
                        >
                          terminos y condiciones
                        </a>{" "}
                        y la{" "}
                        <a
                          href="/privacidad"
                          className="text-primary hover:underline"
                        >
                          politica de privacidad
                        </a>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              {paymentMethod === "bacs" && (
                <div className="rounded-lg border border-dashed p-6">
                  <div className="flex items-center gap-3">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Despues de realizar la transferencia, podras subir tu
                      comprobante de pago desde la pagina de confirmacion.
                    </p>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading
                  ? "Procesando..."
                  : `Pagar ${formatPrice(
                      cart.totals.total_price,
                      cart.totals.currency_prefix
                    )}`}
              </Button>
            </form>
          </Form>
        </div>

        <div className="lg:col-span-2">
          <div className="sticky top-24 rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 font-semibold">Resumen del pedido</h3>
            <div className="space-y-3">
              {cart.items.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="flex-1">
                    {item.name}{" "}
                    <span className="text-muted-foreground">
                      x{item.quantity}
                    </span>
                  </span>
                  <span className="font-medium">
                    {formatPrice(item.totals.line_total)}
                  </span>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="flex items-center justify-between">
              <span className="font-semibold">Total</span>
              <span className="text-xl font-bold">
                {formatPrice(
                  cart.totals.total_price,
                  cart.totals.currency_prefix
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
