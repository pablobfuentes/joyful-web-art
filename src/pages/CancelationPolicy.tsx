import Navbar from "@/components/Navbar";
import { APP_REGISTRY } from "@/config/app-registry";

export default function CancelationPolicy() {
  const contactEmail = APP_REGISTRY.terms?.contactEmail ?? "contacto@kumibox.mx";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-16 px-4">
        <div className="max-w-3xl mx-auto prose prose-neutral dark:prose-invert">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Política de Cancelación
          </h1>
          <p className="text-muted-foreground font-medium mb-1">KumiBox</p>
          <p className="text-muted-foreground mb-6">
            Última actualización publicada en esta página.
          </p>

          <p className="text-foreground/90 mb-4">
            Si deseas cancelar tu suscripción o tienes dudas sobre este documento, puedes escribirnos a{" "}
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
              1. Cancelación de suscripción
            </h2>
            <p className="text-foreground/90">
              Los usuarios pueden cancelar su suscripción en cualquier momento a través de los siguientes medios:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/90">
              <li>Su cuenta dentro del sitio web de KumiBox (método preferente).</li>
              <li>
                Solicitud por correo electrónico a{" "}
                <a
                  href="mailto:contacto@kumibox.mx"
                  className="text-primary underline hover:no-underline"
                >
                  contacto@kumibox.mx
                </a>.
              </li>
            </ul>
            <p className="text-foreground/90">
              La cancelación se procesa de forma inmediata en el sistema.
            </p>
          </section>

          <section className="space-y-6 mt-12">
            <h2 className="font-display text-xl font-semibold text-foreground scroll-mt-28">
              2. Efecto de la cancelación
            </h2>
            <p className="text-foreground/90">
              Al cancelar su suscripción:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/90">
              <li>El acceso al servicio permanece activo hasta el siguiente ciclo de cobro aplicable.</li>
              <li>
                No se generarán cargos futuros después de la cancelación, siempre que esta se realice
                antes de la fecha de corte correspondiente.
              </li>
              <li>
                Si la cancelación se realiza después de la fecha de corte, el siguiente envío ya programado
                será procesado y enviado con normalidad.
              </li>
            </ul>
          </section>

          <section className="space-y-6 mt-12">
            <h2 className="font-display text-xl font-semibold text-foreground scroll-mt-28">
              3. Fechas de corte y cargos
            </h2>
            <p className="text-foreground/90">
              KumiBox opera con un sistema de suscripción automatizado a través de Stripe. El usuario reconoce que:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/90">
              <li>Los cargos se realizan automáticamente cada 2 meses, en la fecha correspondiente a su suscripción.</li>
              <li>
                Existen fechas operativas de corte (día 15 y fin de mes), pero el cargo depende de la fecha
                individual de suscripción del usuario.
              </li>
              <li>
                Para evitar el siguiente cargo, el usuario deberá cancelar su suscripción antes de su próxima
                fecha de cobro programada.
              </li>
              <li>Una vez realizado el cargo, este no podrá ser detenido.</li>
            </ul>
          </section>

          <section className="space-y-6 mt-12">
            <h2 className="font-display text-xl font-semibold text-foreground scroll-mt-28">
              4. Política de no reembolsos
            </h2>
            <p className="text-foreground/90">
              KumiBox no ofrece reembolsos en los siguientes casos:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/90">
              <li>Cancelaciones realizadas después de la fecha de cobro.</li>
              <li>Cargos procesados correctamente conforme al ciclo de suscripción.</li>
              <li>Desconocimiento del modelo de suscripción por parte del usuario.</li>
            </ul>
            <p className="text-foreground/90">
              Toda cancelación aplicará únicamente para ciclos futuros.
            </p>
          </section>

          <section className="space-y-6 mt-12">
            <h2 className="font-display text-xl font-semibold text-foreground scroll-mt-28">
              5. Fallos de pago
            </h2>
            <p className="text-foreground/90">
              En caso de que un pago no pueda ser procesado:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/90">
              <li>Se realizará un segundo intento automático de cobro.</li>
              <li>El usuario será notificado del fallo.</li>
              <li>
                Si el pago no se completa después del segundo intento, la suscripción será cancelada
                automáticamente y el usuario deberá suscribirse nuevamente para reactivar el servicio.
              </li>
            </ul>
          </section>

          <section className="space-y-6 mt-12">
            <h2 className="font-display text-xl font-semibold text-foreground scroll-mt-28">
              6. Pausas de suscripción
            </h2>
            <p className="text-foreground/90">
              KumiBox permite a los usuarios pausar su suscripción desde su cuenta. Al pausar:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/90">
              <li>No se generarán cargos durante el periodo de pausa.</li>
              <li>No se enviarán cajas durante ese periodo.</li>
              <li>El servicio podrá reanudarse en cualquier momento.</li>
            </ul>
          </section>

          <section className="space-y-6 mt-12">
            <h2 className="font-display text-xl font-semibold text-foreground scroll-mt-28">
              7. Canal oficial de cancelación
            </h2>
            <p className="text-foreground/90">
              El único canal válido para cancelar una suscripción es:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/90">
              <li>A través de la cuenta del usuario en el sitio web.</li>
              <li>
                Mediante solicitud directa al correo oficial de soporte{" "}
                <a
                  href="mailto:contacto@kumibox.mx"
                  className="text-primary underline hover:no-underline"
                >
                  contacto@kumibox.mx
                </a>.
              </li>
            </ul>
            <p className="text-foreground/90">
              KumiBox no se hace responsable por solicitudes de cancelación realizadas a través de redes
              sociales, mensajes informales u otros canales no oficiales.
            </p>
          </section>

          <section className="space-y-6 mt-12">
            <h2 className="font-display text-xl font-semibold text-foreground scroll-mt-28">
              8. Aceptación del usuario
            </h2>
            <p className="text-foreground/90">
              Al suscribirse, el usuario reconoce y acepta que:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/90">
              <li>Está contratando un servicio de suscripción recurrente automática.</li>
              <li>Es su responsabilidad gestionar su cancelación antes de la fecha de cobro.</li>
              <li>No habrá reembolsos una vez procesado un cargo.</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}

