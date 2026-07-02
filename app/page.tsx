import { HeroSection } from "@/components/sections/HeroSection";
import { StatsBar } from "@/components/sections/StatsBar";
import { SrilntegrationSection } from "@/components/sections/SrilntegrationSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { SecurityCloudSection } from "@/components/sections/SecurityCloudSection";
import { BenefitsSection } from "@/components/sections/BenefitsSection";
import { PlansSection } from "@/components/sections/PlansSection";
import { CTASection } from "@/components/sections/CTASection";
import { FAQSection } from "@/components/sections/FAQSection";
import { ContactSection } from "@/components/sections/ContactSection";

const faqData = [
  {
    question: "¿Qué es EXA Sistema Contable?",
    answer:
      "EXA es un sistema contable y financiero integral para empresas ecuatorianas. Ofrece facturación electrónica SRI, control de inventario, compras y ventas, reportes financieros y más. Es una plataforma cloud accesible 24/7 desde cualquier dispositivo. Más de 500 empresas en Ecuador lo utilizan.",
  },
  {
    question: "¿Cómo funciona la facturación electrónica con SRI?",
    answer:
      "EXA está integrado directamente con el SRI. El proceso es automático: generas el comprobante, EXA lo firma electrónicamente y lo envía al SRI, obteniendo la autorización en segundos. Soporta facturas, retenciones, notas de crédito, notas de débito y guías de remisión.",
  },
  {
    question: "¿Qué planes tienen disponibles?",
    answer:
      "Ofrecemos planes mensuales y anuales: Sistema Contable (Básico, Ejecutivo, Corporativo), Planes Contador, Facturación Electrónica independiente y Compra Total. Todos incluyen soporte técnico local y actualizaciones SRI automáticas.",
  },
  {
    question: "¿Ofrecen prueba gratuita?",
    answer:
      "Sí, ofrecemos 15 días de prueba gratuita sin tarjeta de crédito. Durante la prueba tienes acceso completo al sistema y soporte técnico. Al finalizar, puedes elegir el plan que mejor se adapte a tu negocio.",
  },
  {
    question: "¿Cómo migro mis datos a EXA?",
    answer:
      "Nuestro equipo de soporte te guía en todo el proceso. Importamos datos desde Excel, CSV o tu sistema anterior. Además te capacitamos para que uses EXA desde el primer día sin complicaciones.",
  },
  {
    question: "¿Es seguro almacenar mis datos en la nube?",
    answer:
      "Totalmente. EXA usa servidores con encriptación SSL de grado bancario, respaldos automáticos diarios, autenticación de dos factores y cumple con estándares ISO 27001. Tus datos financieros están protegidos y solo tu personal autorizado puede acceder.",
  },
  {
    question: "¿Qué requisitos técnicos necesito?",
    answer:
      "Solo un dispositivo con internet y un navegador actualizado (Chrome, Firefox, Edge o Safari). No necesitas instalar software ni mantener servidores. EXA funciona 100% en la nube.",
  },
  {
    question: "¿Ofrecen soporte técnico?",
    answer:
      "Sí, todos los planes incluyen soporte técnico local en Ecuador. Disponible en horario comercial vía teléfono, email y WhatsApp. Respuesta en menos de 2 horas.",
  },
  {
    question: "¿Puedo acceder desde cualquier dispositivo?",
    answer:
      "Sí, EXA es 100% web responsive. Accede desde computador, tablet o smartphone. Gestiona tu negocio desde la oficina, casa o mientras viajas sin perder funcionalidad.",
  },
  {
    question: "¿EXA se actualiza con los cambios del SRI?",
    answer:
      "Sí, EXA se actualiza automáticamente cuando el SRI modifica formatos, plazos o normativas. Nosotros nos encargamos de que siempre cumplas con la legislación fiscal ecuatoriana vigente.",
  },
];

export default function Home() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqData.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <HeroSection />
      <StatsBar />
      <SrilntegrationSection />
      <FeaturesSection />
      <HowItWorksSection />
      <SecurityCloudSection />
      <PlansSection />
      <BenefitsSection />
      <FAQSection />
      <CTASection />
      <ContactSection />
    </>
  );
}
