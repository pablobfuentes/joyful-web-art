import Navbar from "@/components/Navbar";
import { APP_REGISTRY } from "@/config/app-registry";

export default function ShippingPolicy() {
  const contactEmail = APP_REGISTRY.terms?.contactEmail ?? "contacto@kumibox.mx";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-16 px-4">
        <div className="max-w-3xl mx-auto prose prose-neutral dark:prose-invert">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Política de Envíos
          </h1>
          <p className="text-muted-foreground font-medium mb-1">KumiBox</p>
          <p className="text-muted-foreground mb-6">
            Última actualización publicada en esta página.
          </p>

          <p className="text-foreground/90 mb-4">
            Si tienes dudas sobre el contenido de esta política, puedes escribirnos a{" "}
            <a
              href={`mailto:${contactEmail}`}
              className="text-primary underline hover:no-underline"
            >
              {contactEmail}
            </a>
            .
          </p>

          <section className="space-y-6">
            <h2 className="font-display text-xl font-semibold text-foreground scroll-mt-28">
              1. Cobertura de envíos
            </h2>
            <p className="text-foreground/90">
              KumiBox realiza envíos únicamente dentro de la República Mexicana.
            </p>
            <p className="text-foreground/90">
              El costo de envío está incluido en el precio de la suscripción.
            </p>
          </section>

          <section className="space-y-6 mt-12">
            <h2 className="font-display text-xl font-semibold text-foreground scroll-mt-28">
              2. Procesamiento y calendario de envíos
            </h2>
            <p className="text-foreground/90">
              KumiBox opera bajo un modelo de envíos por lotes. El usuario reconoce que:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/90">
              <li>Los pedidos no se envían inmediatamente después de la compra.</li>
              <li>Los envíos se realizan conforme a un calendario bimestral previamente establecido.</li>
              <li>
                Si el usuario se suscribe durante la primera quincena del mes, recibirá su caja durante la primera
                quincena correspondiente del ciclo bimestral.
              </li>
              <li>
                Todos los pedidos dentro de un mismo periodo se procesan y envían de manera conjunta.
              </li>
            </ul>
          </section>

          <section className="space-y-6 mt-12">
            <h2 className="font-display text-xl font-semibold text-foreground scroll-mt-28">
              3. Tiempos de entrega
            </h2>
            <p className="text-foreground/90">
              Una vez enviado el paquete:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/90">
              <li>El tiempo estimado de entrega es de 5 a 8 días hábiles.</li>
              <li>
                Este tiempo es estimado y no garantizado, ya que depende de factores externos.
              </li>
              <li>El usuario recibirá una guía de rastreo para dar seguimiento a su envío.</li>
            </ul>
          </section>

          <section className="space-y-6 mt-12">
            <h2 className="font-display text-xl font-semibold text-foreground scroll-mt-28">
              4. Paquetería y logística
            </h2>
            <p className="text-foreground/90">
              KumiBox trabaja con servicios logísticos que pueden utilizar distintas paqueterías según
              disponibilidad y destino. La selección de la paquetería es responsabilidad de KumiBox.
            </p>
          </section>

          <section className="space-y-6 mt-12">
            <h2 className="font-display text-xl font-semibold text-foreground scroll-mt-28">
              5. Retrasos en la entrega
            </h2>
            <p className="text-foreground/90">
              KumiBox ofrece soporte para el seguimiento de envíos; sin embargo:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/90">
              <li>
                La responsabilidad del traslado y entrega recae en la empresa de mensajería.
              </li>
              <li>Pueden presentarse retrasos por causas externas, incluyendo pero no limitado a:</li>
            </ul>
            <ul className="list-disc pl-10 space-y-1 text-foreground/90">
              <li>Condiciones climáticas.</li>
              <li>Alta demanda logística.</li>
              <li>Problemas operativos de la paquetería.</li>
              <li>Zonas de difícil acceso.</li>
            </ul>
            <p className="text-foreground/90">
              En estos casos, KumiBox no garantiza tiempos exactos de entrega.
            </p>
          </section>

          <section className="space-y-6 mt-12">
            <h2 className="font-display text-xl font-semibold text-foreground scroll-mt-28">
              6. Dirección de envío
            </h2>
            <p className="text-foreground/90">
              El cliente es responsable de proporcionar:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/90">
              <li>Dirección completa y correcta.</li>
              <li>Datos de contacto actualizados.</li>
            </ul>
            <p className="text-foreground/90">
              En caso de errores en la dirección, el cliente deberá contactar a KumiBox y a la paquetería con la
              guía proporcionada. KumiBox no se hace responsable por retrasos o problemas derivados de
              información incorrecta.
            </p>
          </section>

          <section className="space-y-6 mt-12">
            <h2 className="font-display text-xl font-semibold text-foreground scroll-mt-28">
              7. Entregas fallidas
            </h2>
            <p className="text-foreground/90">
              Si el paquete no puede ser entregado debido a:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/90">
              <li>Ausencia del cliente.</li>
              <li>Falta de recolección.</li>
              <li>Dirección incorrecta.</li>
            </ul>
            <p className="text-foreground/90">
              y el paquete es devuelto a KumiBox:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/90">
              <li>El cliente podrá solicitar un nuevo envío.</li>
              <li>El costo del nuevo envío deberá ser cubierto por el cliente.</li>
            </ul>
          </section>

          <section className="space-y-6 mt-12">
            <h2 className="font-display text-xl font-semibold text-foreground scroll-mt-28">
              8. Paquetes perdidos
            </h2>
            <p className="text-foreground/90">
              En caso de posible pérdida del paquete:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/90">
              <li>Se iniciará una investigación con la empresa de mensajería.</li>
              <li>La paquetería determinará si el paquete se considera oficialmente perdido.</li>
              <li>
                Una vez confirmado como perdido, KumiBox enviará un reemplazo sin costo adicional para el cliente.
              </li>
            </ul>
          </section>

          <section className="space-y-6 mt-12">
            <h2 className="font-display text-xl font-semibold text-foreground scroll-mt-28">
              9. Productos dañados durante el envío
            </h2>
            <p className="text-foreground/90">
              Si el cliente recibe un producto dañado:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/90">
              <li>Deberá reportarlo dentro de las primeras 48 horas posteriores a la recepción.</li>
              <li>Deberá proporcionar evidencia fotográfica del daño.</li>
            </ul>
            <p className="text-foreground/90">
              El caso será evaluado conforme a la Política de Devoluciones y Reembolsos.
            </p>
          </section>

          <section className="space-y-6 mt-12">
            <h2 className="font-display text-xl font-semibold text-foreground scroll-mt-28">
              10. Zonas remotas
            </h2>
            <p className="text-foreground/90">
              KumiBox realiza envíos a todo México; sin embargo, en zonas rurales o de difícil acceso, los tiempos
              de entrega pueden ser mayores a los estimados.
            </p>
          </section>

          <section className="space-y-6 mt-12">
            <h2 className="font-display text-xl font-semibold text-foreground scroll-mt-28">
              11. Aceptación del usuario
            </h2>
            <p className="text-foreground/90">
              Al realizar una compra o suscripción, el usuario acepta que:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/90">
              <li>Los envíos se realizan bajo un esquema de calendario y no de despacho inmediato.</li>
              <li>Los tiempos de entrega son estimados.</li>
              <li>La logística de entrega depende de terceros.</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}

