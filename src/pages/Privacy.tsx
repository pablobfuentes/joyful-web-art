import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { APP_REGISTRY } from "@/config/app-registry";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-16 px-4">
        <div className="max-w-3xl mx-auto prose prose-neutral dark:prose-invert">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Aviso de Privacidad
          </h1>
          <p className="text-muted-foreground mb-10">
            Última actualización publicada en esta página. Le recomendamos leer este aviso con periodicidad.
          </p>

          <section className="space-y-6">
            <h2 className="font-display text-xl font-semibold text-foreground scroll-mt-28">
              1. Datos personales que recopilamos
            </h2>
            <p className="text-foreground/90">
              Podemos recopilar los siguientes datos personales cuando usted utiliza nuestro sitio web o realiza una compra:
            </p>

            <h3 className="font-display text-lg font-medium text-foreground mt-6">
              Datos de identificación
            </h3>
            <ul className="list-disc pl-6 space-y-1 text-foreground/90">
              <li>Nombre completo</li>
              <li>Dirección de envío</li>
              <li>Teléfono de contacto</li>
              <li>Correo electrónico</li>
            </ul>

            <h3 className="font-display text-lg font-medium text-foreground mt-6">
              Datos de facturación (cuando aplica)
            </h3>
            <ul className="list-disc pl-6 space-y-1 text-foreground/90">
              <li>RFC</li>
              <li>Dirección fiscal</li>
            </ul>

            <h3 className="font-display text-lg font-medium text-foreground mt-6">
              Datos de pago
            </h3>
            <p className="text-foreground/90">
              Los pagos son procesados a través de plataformas de pago seguras (por ejemplo, Stripe u otros procesadores). Nosotros no almacenamos directamente los datos completos de tarjetas bancarias.
            </p>

            <h3 className="font-display text-lg font-medium text-foreground mt-6">
              Datos de navegación
            </h3>
            <p className="text-foreground/90">
              Cuando navega en nuestro sitio web, podemos recopilar automáticamente cierta información como:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/90">
              <li>Dirección IP</li>
              <li>Tipo de navegador</li>
              <li>Sistema operativo</li>
              <li>Páginas visitadas</li>
              <li>Tiempo de navegación</li>
            </ul>
            <p className="text-foreground/90">
              Estos datos se obtienen mediante cookies y herramientas de analítica.
            </p>
          </section>

          <section className="space-y-6 mt-12">
            <h2 className="font-display text-xl font-semibold text-foreground scroll-mt-28">
              2. Finalidad del tratamiento de datos
            </h2>
            <p className="text-foreground/90">
              Sus datos personales serán utilizados para las siguientes finalidades:
            </p>

            <h3 className="font-display text-lg font-medium text-foreground mt-6">
              Finalidades primarias
            </h3>
            <ul className="list-disc pl-6 space-y-1 text-foreground/90">
              <li>Procesar pedidos y suscripciones</li>
              <li>Gestionar pagos y envíos</li>
              <li>Proporcionar soporte al cliente</li>
              <li>Informarle sobre el estado de su pedido</li>
              <li>Cumplir con obligaciones legales y fiscales</li>
            </ul>

            <h3 className="font-display text-lg font-medium text-foreground mt-6">
              Finalidades secundarias
            </h3>
            <ul className="list-disc pl-6 space-y-1 text-foreground/90">
              <li>Envío de promociones, novedades o contenido relacionado con nuestros productos</li>
              <li>Mejora de la experiencia de usuario en el sitio web</li>
              <li>Análisis estadístico de uso del sitio</li>
            </ul>
            <p className="text-foreground/90">
              Usted puede solicitar en cualquier momento que sus datos no sean utilizados para fines secundarios.
            </p>
          </section>

          <section className="space-y-6 mt-12">
            <h2 className="font-display text-xl font-semibold text-foreground scroll-mt-28">
              3. Uso de cookies y tecnologías de rastreo
            </h2>
            <p className="text-foreground/90">
              Nuestro sitio puede utilizar cookies, píxeles y tecnologías similares para mejorar la experiencia de navegación y analizar el uso del sitio.
            </p>
            <p className="text-foreground/90">
              Estas herramientas nos permiten:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/90">
              <li>Recordar preferencias del usuario</li>
              <li>Analizar tráfico del sitio web</li>
              <li>Mejorar la funcionalidad del servicio</li>
            </ul>
            <p className="text-foreground/90">
              Usted puede deshabilitar las cookies desde la configuración de su navegador.
            </p>
          </section>

          <section className="space-y-6 mt-12">
            <h2 className="font-display text-xl font-semibold text-foreground scroll-mt-28">
              4. Transferencia de datos personales
            </h2>
            <p className="text-foreground/90">
              Sus datos personales podrán ser compartidos únicamente cuando sea necesario con terceros que nos ayudan a operar el servicio, tales como:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/90">
              <li>Proveedores de servicios de pago</li>
              <li>Empresas de mensajería y logística</li>
              <li>Proveedores de servicios tecnológicos o analíticos</li>
            </ul>
            <p className="text-foreground/90">
              Estos terceros únicamente tendrán acceso a la información necesaria para cumplir con sus funciones y deberán cumplir con medidas de seguridad y confidencialidad.
            </p>
            <p className="text-foreground/90 font-medium">
              No vendemos ni comercializamos sus datos personales.
            </p>
          </section>

          <section className="space-y-6 mt-12">
            <h2 className="font-display text-xl font-semibold text-foreground scroll-mt-28">
              5. Derechos ARCO
            </h2>
            <p className="text-foreground/90">
              Usted tiene derecho a:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/90">
              <li>Acceder a sus datos personales</li>
              <li>Rectificarlos si son incorrectos o incompletos</li>
              <li>Cancelarlos cuando considere que no son necesarios</li>
              <li>Oponerse al tratamiento de los mismos</li>
            </ul>
            <p className="text-foreground/90">
              Estos derechos son conocidos como Derechos ARCO.
            </p>
            <p className="text-foreground/90">
              Para ejercer cualquiera de estos derechos, puede enviar una solicitud a:
            </p>
            <p className="text-foreground/90">
              Correo electrónico:{" "}
              <a href={`mailto:${APP_REGISTRY.privacy.contactEmail}`} className="text-primary underline hover:no-underline">
                {APP_REGISTRY.privacy.contactEmail}
              </a>
            </p>
            <p className="text-foreground/90">
              La solicitud deberá incluir:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/90">
              <li>Nombre del titular</li>
              <li>Descripción del derecho que desea ejercer</li>
              <li>Información que permita identificar sus datos en nuestro sistema</li>
            </ul>
          </section>

          <section className="space-y-6 mt-12">
            <h2 className="font-display text-xl font-semibold text-foreground scroll-mt-28">
              6. Medidas de seguridad
            </h2>
            <p className="text-foreground/90">
              Implementamos medidas de seguridad administrativas, técnicas y físicas para proteger su información personal contra:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/90">
              <li>Acceso no autorizado</li>
              <li>Uso indebido</li>
              <li>Alteración o divulgación</li>
            </ul>
          </section>

          <section className="space-y-6 mt-12">
            <h2 className="font-display text-xl font-semibold text-foreground scroll-mt-28">
              7. Cambios al Aviso de Privacidad
            </h2>
            <p className="text-foreground/90">
              Nos reservamos el derecho de modificar este Aviso de Privacidad en cualquier momento para reflejar cambios legales o mejoras en nuestros servicios.
            </p>
            <p className="text-foreground/90">
              Cualquier actualización será publicada en esta misma página.
            </p>
          </section>

          <p className="mt-12 pt-6 border-t border-border">
            <Link to="/" className="text-primary hover:underline">
              ← Volver al inicio
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
