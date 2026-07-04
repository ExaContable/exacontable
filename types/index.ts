export interface WooCommerceProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  type: "simple" | "variable" | "grouped" | "external";
  status: string;
  description: string;
  short_description: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  prices: {
    price: string;
    regular_price: string;
    sale_price: string;
    currency_code: string;
    currency_symbol: string;
    currency_minor_unit: number;
  };
  price_html: string;
  categories: {
    id: number;
    name: string;
    slug: string;
  }[];
  images: {
    id: number;
    src: string;
    alt: string;
  }[];
  attributes: {
    id: number;
    name: string;
    options: string[];
  }[];
  meta_data: {
    id: number;
    key: string;
    value: string;
  }[];
  related_ids: number[];
  upsell_ids: number[];
  cross_sell_ids: number[];
}

export interface StoreProduct {
  id: string | number;
  name: string;
  slug: string;
  type: string;
  description: string;
  prices: {
    price: string;
    regular_price: string;
    sale_price: string;
    currency_code: string;
    currency_symbol: string;
    currency_minor_unit: number;
    currency_decimal_separator: string;
    currency_thousand_separator: string;
    currency_prefix: string;
    currency_suffix: string;
  };
  price_html: string;
  images: { src: string; alt: string }[];
  categories: { id: string | number; name: string; slug: string }[];
  add_to_cart: {
    text: string;
    url: string;
    minimum: number;
    maximum: number;
  };
  is_purchasable: boolean;
  is_in_stock: boolean;
}

export interface CartItem {
  key: string;
  id: string | number;
  quantity: number;
  name: string;
  prices: {
    price: string;
    regular_price: string;
    sale_price: string;
    currency_code: string;
    currency_symbol: string;
    currency_minor_unit: number;
    currency_decimal_separator: string;
    currency_thousand_separator: string;
    currency_prefix: string;
    currency_suffix: string;
    raw_prices: Record<string, string>;
  };
  totals: {
    line_total: string;
    line_subtotal: string;
  };
  images: { src: string; alt: string }[];
  catalog_visibility: string;
  extensions: Record<string, unknown>;
}

export interface Cart {
  items: CartItem[];
  coupons: unknown[];
  totals: {
    total_price: string;
    total_tax: string;
    currency_code: string;
    currency_symbol: string;
    currency_minor_unit: number;
    currency_prefix: string;
    currency_suffix: string;
  };
  items_count: number;
  needs_payment: boolean;
  needs_shipping: boolean;
  payment_methods: string[];
}

export interface CheckoutData {
  billing: {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    email: string;
    phone: string;
  };
  payment_method: string;
  payment_data?: Record<string, unknown>;
  meta_data?: {
    key: string;
    value: string;
  }[];
}

export type PlanCategory = "plan-sistema-contable" | "plan-contador" | "facturacion-electronica" | "servicios" | "extra";

export type BillingPeriod = "mensual" | "anual" | "compra-total";

export interface CheckoutFormValues {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  ruc?: string;
  cedula?: string;
  usuario: string;
  clave: string;
  genero: string;
  payment_method: string;
  receipt_file?: File | null;
  accept_terms: boolean;
}

export type PlanMeta = {
  tipoDocumento: "ruc" | "cedula" | "ambos";
  requiereUsuario: boolean;
  requiereClave: boolean;
  requiereGenero: boolean;
  requiereDireccion: boolean;
};
