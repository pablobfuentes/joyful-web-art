import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { APP_REGISTRY } from "@/config/app-registry";

export default function Terms() {
  const contactEmail = APP_REGISTRY.terms?.contactEmail ?? "soporte@kumibox.com";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-16 px-4">
        <div className="max-w-3xl mx-auto prose prose-neutral dark:prose-invert">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Términos y Condiciones de Uso
          </h1>
          <p className="text-muted-foreground font-medium mb-1">KumiBox</p>
          <p className="text-muted-foreground mb-10">
            Última actualización publicada en esta página.
          </p>
          <p className="text-foreground/90 mb-4">
            Bienvenido a KumiBox. Al acceder o utilizar nuestro sitio web y realizar compras o suscribirse a nuestros servicios, usted acepta cumplir con los presentes Términos y Condiciones.
          </p>
          <p className="text-foreground/90 mb-10">
            Si no está de acuerdo con estos términos, le recomendamos no utilizar este sitio ni realizar compras en él.
          </p>

          <section className="space-y-6">
            <h2 className="font-display text-xl font-semibold text-foreground scroll-mt-28">
              1. Identidad del responsable
            </h2>
            <p className="text-foreground/90">
              El presente sitio web es operado por:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/90">
              <li><strong>KumiBox México S.A. de C.V.</strong></li>
              <li>Nombre comercial: KumiBox</li>
              <li>Domicilio: Ciudad de México, México</li>
              <li>Correo de contacto: <a href={`mailto:${contactEmail}`} className="text-primary underline hover:no-underline">{contactEmail}</a></li>
            </ul>
            <p className="text-foreground/90">
              KumiBox ofrece servicios de suscripción y venta de productos de cuidado de la piel.
            </p>
          </section>

          <section className="space-y-6 mt-12">
            <h2 className="font-display text-xl font-semibold text-foreground scroll-mt-28">
              2. Elegibilidad para el uso del sitio
            </h2>
            <p className="text-foreground/90">
              Para utilizar el sitio web y realizar compras, el usuario debe:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/90">
              <li>Tener al menos 18 años de edad</li>
              <li>Proporcionar información veraz y actualizada</li>
              <li>Utilizar el sitio conforme a la ley y a estos Términos y Condiciones</li>
            </ul>
            <p className="text-foreground/90">
              KumiBox se reserva el derecho de suspender cuentas que presenten uso indebido del servicio.
            </p>
          </section>

          <section className="space-y-6 mt-12">
            <h2 className="font-display text-xl font-semibold text-foreground scroll-mt-28">
              3. Servicio de suscripción
            </h2>
            <p className="text-foreground/90">
              KumiBox ofrece una suscripción bimestral de productos de skincare.
            </p>
            <h3 className="font-display text-lg font-medium text-foreground mt-6">
              Al suscribirse, el cliente acepta que:
            </h3>
            <ul className="list-disc pl-6 space-y-1 text-foreground/90">
              <li>La suscripción se renueva automáticamente hasta que sea cancelada.</li>
              <li>Los envíos se realizan cada dos meses según el calendario de envíos establecido por KumiBox.</li>
              <li>Existe una fecha de corte el día 15 del mes correspondiente al envío.</li>
              <li>Para evitar el envío de la siguiente caja, el cliente deberá cancelar su suscripción antes del día 14 del mes correspondiente al envío.</li>
              <li>Si la cancelación se realiza después de la fecha de corte, la caja programada para ese periodo será procesada y enviada.</li>
              <li>No existe permanencia mínima y el usuario puede cancelar su suscripción en cualquier momento conforme a estas condiciones.</li>
            </ul>
          </section>

          <section className="space-y-6 mt-12">
            <h2 className="font-display text-xl font-semibold text-foreground scroll-mt-28">
              4. Contenido de las cajas
            </h2>
            <p className="text-foreground/90">
              El contenido de cada caja KumiBox puede variar.
            </p>
            <h3 className="font-display text-lg font-medium text-foreground mt-6">
              El cliente reconoce que:
            </h3>
            <ul className="list-disc pl-6 space-y-1 text-foreground/90">
              <li>Los productos incluidos pueden cambiar en cada edición.</li>
              <li>Los productos pueden ser tamaño completo, tamaño de viaje o muestras.</li>
              <li>KumiBox se reserva el derecho de sustituir productos por otros equivalentes en caso de disponibilidad limitada.</li>
              <li>Las imágenes presentadas en el sitio o material promocional pueden ser ilustrativas.</li>
            </ul>
          </section>

          <section className="space-y-6 mt-12">
            <h2 className="font-display text-xl font-semibold text-foreground scroll-mt-28">
              5. Pagos
            </h2>
            <p className="text-foreground/90">
              Los pagos se procesan mediante Stripe, un proveedor de servicios de pago seguro.
            </p>
            <h3 className="font-display text-lg font-medium text-foreground mt-6">
              Actualmente KumiBox acepta:
            </h3>
            <ul className="list-disc pl-6 space-y-1 text-foreground/90">
              <li>Tarjetas bancarias</li>
            </ul>
            <p className="text-foreground/90">
              KumiBox no almacena directamente la información completa de las tarjetas.
            </p>
            <p className="text-foreground/90">
              Al realizar una compra o suscripción, el cliente autoriza los cargos correspondientes conforme al plan seleccionado.
            </p>
          </section>

          <section className="space-y-6 mt-12">
            <h2 className="font-display text-xl font-semibold text-foreground scroll-mt-28">
              6. Envíos
            </h2>
            <p className="text-foreground/90">
              Actualmente KumiBox realiza envíos únicamente dentro de México.
            </p>
            <h3 className="font-display text-lg font-medium text-foreground mt-6">
              Condiciones de envío:
            </h3>
            <ul className="list-disc pl-6 space-y-1 text-foreground/90">
              <li>El costo de envío está incluido en el precio de la suscripción.</li>
              <li>El tiempo estimado de entrega es de 5 a 8 días hábiles después del envío.</li>
              <li>Una vez enviado el paquete, el cliente recibirá una guía de rastreo.</li>
            </ul>
            <h3 className="font-display text-lg font-medium text-foreground mt-6">
              Si el cliente proporciona una dirección incorrecta, deberá:
            </h3>
            <ul className="list-disc pl-6 space-y-1 text-foreground/90">
              <li>Contactar a KumiBox vía correo electrónico</li>
              <li>Comunicarse con la empresa de mensajería utilizando la guía proporcionada</li>
            </ul>
            <p className="text-foreground/90">
              Si el paquete es devuelto a KumiBox debido a errores en la dirección o imposibilidad de entrega, el cliente podrá solicitar un nuevo envío cubriendo los costos de envío correspondientes.
            </p>
          </section>

          <section className="space-y-6 mt-12">
            <h2 className="font-display text-xl font-semibold text-foreground scroll-mt-28">
              7. Devoluciones y productos dañados
            </h2>
            <p className="text-foreground/90">
              KumiBox acepta reportes por productos dañados bajo las siguientes condiciones:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/90">
              <li>El cliente debe reportar el problema dentro de las primeras 48 horas después de recibir el paquete.</li>
              <li>El reporte debe realizarse al correo <a href={`mailto:${contactEmail}`} className="text-primary underline hover:no-underline">{contactEmail}</a>.</li>
            </ul>
            <h3 className="font-display text-lg font-medium text-foreground mt-6">
              En caso de daño confirmado:
            </h3>
            <ul className="list-disc pl-6 space-y-1 text-foreground/90">
              <li>Se iniciará una investigación del incidente</li>
              <li>El cliente deberá devolver el producto dañado</li>
              <li>Se enviará un producto de reemplazo</li>
            </ul>
            <p className="text-foreground/90">
              KumiBox no acepta devoluciones por preferencias personales, incluyendo casos en los que el cliente no esté satisfecho con el producto recibido.
            </p>
          </section>

          <section className="space-y-6 mt-12">
            <h2 className="font-display text-xl font-semibold text-foreground scroll-mt-28">
              8. Regalos y promociones
            </h2>
            <p className="text-foreground/90">
              En ciertas ocasiones KumiBox puede incluir regalos promocionales dentro de las cajas.
            </p>
            <h3 className="font-display text-lg font-medium text-foreground mt-6">
              Estos artículos promocionales:
            </h3>
            <ul className="list-disc pl-6 space-y-1 text-foreground/90">
              <li>No tienen valor comercial</li>
              <li>No son elegibles para devolución o reemplazo</li>
              <li>Pueden variar según disponibilidad</li>
            </ul>
          </section>

          <section className="space-y-6 mt-12">
            <h2 className="font-display text-xl font-semibold text-foreground scroll-mt-28">
              9. Cuentas de usuario
            </h2>
            <p className="text-foreground/90">
              Los usuarios pueden crear cuentas en el sitio para gestionar sus suscripciones y pedidos.
            </p>
            <h3 className="font-display text-lg font-medium text-foreground mt-6">
              El usuario es responsable de:
            </h3>
            <ul className="list-disc pl-6 space-y-1 text-foreground/90">
              <li>Mantener la confidencialidad de sus credenciales</li>
              <li>Proteger el acceso a su cuenta</li>
            </ul>
            <p className="text-foreground/90">
              KumiBox no se hace responsable por accesos no autorizados derivados del uso indebido de las credenciales del usuario.
            </p>
          </section>

          <section className="space-y-6 mt-12">
            <h2 className="font-display text-xl font-semibold text-foreground scroll-mt-28">
              10. Propiedad intelectual
            </h2>
            <p className="text-foreground/90">
              Todo el contenido del sitio web, incluyendo:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/90">
              <li>Logotipos</li>
              <li>Diseño</li>
              <li>Imágenes</li>
              <li>Textos</li>
              <li>Material gráfico</li>
            </ul>
            <p className="text-foreground/90">
              es propiedad de KumiBox México S.A. de C.V. y está protegido por las leyes de propiedad intelectual aplicables.
            </p>
            <p className="text-foreground/90">
              Queda prohibida su reproducción, distribución o uso sin autorización previa por escrito.
            </p>
          </section>

          <section className="space-y-6 mt-12">
            <h2 className="font-display text-xl font-semibold text-foreground scroll-mt-28">
              11. Opiniones y testimonios de clientes
            </h2>
            <p className="text-foreground/90">
              KumiBox puede solicitar a los clientes compartir reseñas o testimonios sobre los productos o el servicio.
            </p>
            <p className="text-foreground/90">
              Al compartir este contenido con KumiBox, el usuario autoriza su uso para fines promocionales en el sitio web y materiales de comunicación de la marca.
            </p>
          </section>

          <section className="space-y-6 mt-12">
            <h2 className="font-display text-xl font-semibold text-foreground scroll-mt-28">
              12. Limitación de responsabilidad
            </h2>
            <p className="text-foreground/90">
              Los productos incluidos en KumiBox son cosméticos y deben utilizarse conforme a las instrucciones del fabricante.
            </p>
            <p className="text-foreground/90">
              KumiBox no será responsable por:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/90">
              <li>Reacciones alérgicas derivadas del uso de los productos</li>
              <li>Uso incorrecto de los productos</li>
              <li>Condiciones médicas preexistentes</li>
            </ul>
            <p className="text-foreground/90">
              Se recomienda a los clientes revisar los ingredientes de cada producto antes de su uso.
            </p>
          </section>

          <section className="space-y-6 mt-12">
            <h2 className="font-display text-xl font-semibold text-foreground scroll-mt-28">
              13. Modificaciones al servicio
            </h2>
            <p className="text-foreground/90">
              KumiBox se reserva el derecho de:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/90">
              <li>Modificar el contenido de las cajas</li>
              <li>Ajustar precios</li>
              <li>Actualizar los presentes Términos y Condiciones</li>
            </ul>
            <p className="text-foreground/90">
              Cualquier cambio será publicado en este sitio web.
            </p>
          </section>

          <section className="space-y-6 mt-12">
            <h2 className="font-display text-xl font-semibold text-foreground scroll-mt-28">
              14. Legislación aplicable
            </h2>
            <p className="text-foreground/90">
              Los presentes Términos y Condiciones se rigen por las leyes aplicables en México.
            </p>
            <p className="text-foreground/90">
              Cualquier controversia derivada del uso del sitio o del servicio será sometida a la jurisdicción de los tribunales competentes en Ciudad de México.
            </p>
          </section>

          <section className="space-y-6 mt-12">
            <h2 className="font-display text-xl font-semibold text-foreground scroll-mt-28">
              15. Contacto
            </h2>
            <p className="text-foreground/90">
              Para cualquier duda o aclaración sobre estos Términos y Condiciones puede contactarnos en:
            </p>
            <p className="text-foreground/90">
              <a href={`mailto:${contactEmail}`} className="text-primary underline hover:no-underline font-medium">
                {contactEmail}
              </a>
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
