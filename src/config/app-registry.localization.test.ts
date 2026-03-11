import { describe, expect, it } from "vitest";
import { APP_REGISTRY } from "./app-registry";

describe("APP_REGISTRY Spanish localization", () => {
  it("keeps past editions copy and months in Spanish", () => {
    expect(APP_REGISTRY.pastEditions.subtitle).toBe("Ediciones pasadas");
    expect(APP_REGISTRY.pastEditions.fallbackImage).toContain("Edici");

    expect(APP_REGISTRY.pastEditions.editions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          month: "Enero 2024",
          category: "Hidratacion",
        }),
        expect.objectContaining({
          month: "Febrero 2024",
          category: "Luminosidad",
        }),
      ]),
    );
  });

  it("stores auth and dashboard copy in Spanish", () => {
    expect(APP_REGISTRY.status.loading).toBe("Cargando...");
    expect(APP_REGISTRY.login.title).toBe("Bienvenida de nuevo");
    expect(APP_REGISTRY.login.submitButton).toBe("Iniciar sesion");
    expect(APP_REGISTRY.login.submitLoading).toBe("Iniciando sesion...");
    expect(APP_REGISTRY.login.emailPlaceholder).toBe("tu@correo.com");
    expect(APP_REGISTRY.register.title).toBe("Crear cuenta");
    expect(APP_REGISTRY.register.emailPlaceholder).toBe("tu@correo.com");
    expect(APP_REGISTRY.forgotPassword.title).toBe("Restablecer contrasena");
    expect(APP_REGISTRY.forgotPassword.emailPlaceholder).toBe("tu@correo.com");
    expect(APP_REGISTRY.resetPassword.title).toBe("Definir nueva contrasena");

    expect(APP_REGISTRY.dashboard.quickActionsTitle).toBe("Acciones rapidas");
    expect(APP_REGISTRY.dashboard.orderHistoryTitle).toBe("Historial de pedidos");
    expect(APP_REGISTRY.dashboard.settingsTitle).toBe("Configuracion");
    expect(APP_REGISTRY.dashboard.notificationsTitle).toBe("Notificaciones");
    expect(APP_REGISTRY.dashboard.logOut).toBe("Cerrar sesion");
    expect(APP_REGISTRY.dashboard.backToHome).toBe("Volver al inicio");
  });

  it("stores dashboard destination pages in Spanish", () => {
    expect(APP_REGISTRY.orderHistory.title).toBe("Historial de pedidos");
    expect(APP_REGISTRY.subscriptionManagement.title).toBe("Suscripcion");
    expect(APP_REGISTRY.settings.title).toBe("Configuracion");
    expect(APP_REGISTRY.notifications.title).toBe("Notificaciones");
    expect(APP_REGISTRY.account.title).toBe("Cuenta");
    expect(APP_REGISTRY.account.backToDashboard).toBe("Volver al panel");
  });
});
