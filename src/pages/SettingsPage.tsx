import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";
import { useRegistryContent } from "@/contexts/RegistryContentContext";
import { useUserAddresses } from "@/hooks/useUserAddresses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  const { getSectionContent } = useRegistryContent();
  const data = getSectionContent("settings");
  const { addresses, defaultAddress, addAddress, adding, setDefault, settingDefault, deleteAddress, deleting } =
    useUserAddresses();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const from = searchParams.get("from");
  const plan = searchParams.get("plan") || "monthly";

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    street: "",
    street_number_ext: "",
    street_number_int: "",
    colonia: "",
    municipio: "",
    postal_code: "",
    state: "",
    address_reference: "",
    is_default: true,
  });

  const canSave =
    form.full_name &&
    form.email &&
    form.phone &&
    form.street &&
    form.street_number_ext &&
    form.colonia &&
    form.municipio &&
    form.postal_code &&
    form.state;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleAddAddress(e: React.FormEvent) {
    e.preventDefault();
    if (!canSave) return;
    await addAddress(form);
    setForm({
      full_name: "",
      email: "",
      phone: "",
      street: "",
      street_number_ext: "",
      street_number_int: "",
      colonia: "",
      municipio: "",
      postal_code: "",
      state: "",
      address_reference: "",
      is_default: false,
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2">
            <Link
              to="/dashboard"
              aria-label="Volver al panel"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ←
            </Link>
            <h1 className="font-display text-2xl font-bold text-foreground">
              {data.title}
            </h1>
          </div>
          <p className="mt-2 text-muted-foreground">{data.subtitle}</p>

          <div className="mt-6 rounded-lg border border-input bg-card p-4 space-y-4">
            <p className="text-sm text-muted-foreground">{data.body}</p>

            {from === "checkout" && (
              <div className="rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-sm flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <span>
                  Estás editando tu dirección de envío para completar tu compra.
                </span>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/checkout?plan=${encodeURIComponent(plan)}`)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => navigate(`/checkout?plan=${encodeURIComponent(plan)}`)}
                  >
                    Aceptar
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <h2 className="font-display text-lg font-semibold">Direcciones de envío</h2>
              {addresses.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Aún no has guardado ninguna dirección. Agrega una para tus envíos.
                </p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {addresses.map((addr) => (
                    <li
                      key={addr.id}
                      className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border rounded-md px-3 py-2"
                    >
                      <div>
                        <p className="font-medium">
                          {addr.full_name} {addr.is_default && <span className="text-xs text-primary">(Predeterminada)</span>}
                        </p>
                        <p className="text-muted-foreground">
                          {[addr.street, addr.street_number_ext, addr.street_number_int, addr.colonia, addr.municipio, addr.state, addr.postal_code]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {addr.phone} · {addr.email ?? ""}
                        </p>
                        {addr.address_reference && (
                          <p className="text-muted-foreground text-xs">Referencia: {addr.address_reference}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {!addr.is_default && (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={settingDefault}
                            onClick={() => setDefault(addr.id)}
                          >
                            Hacer predeterminada
                          </Button>
                        )}
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          disabled={deleting}
                          onClick={() => deleteAddress(addr.id)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-4 border-t border-border pt-4">
              <h3 className="font-display text-base font-semibold mb-2">
                Agregar nueva dirección
              </h3>
              <form onSubmit={handleAddAddress} className="space-y-3">
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="full_name">Nombre completo</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      value={form.full_name}
                      onChange={handleChange}
                      autoComplete="name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      autoComplete="email"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      autoComplete="tel"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="street">Calle</Label>
                  <Input
                    id="street"
                    name="street"
                    value={form.street}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid md:grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor="street_number_ext">Número exterior</Label>
                    <Input
                      id="street_number_ext"
                      name="street_number_ext"
                      value={form.street_number_ext}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="street_number_int">Número interior (opcional)</Label>
                    <Input
                      id="street_number_int"
                      name="street_number_int"
                      value={form.street_number_int}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="postal_code">Código postal</Label>
                    <Input
                      id="postal_code"
                      name="postal_code"
                      value={form.postal_code}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="colonia">Colonia</Label>
                    <Input
                      id="colonia"
                      name="colonia"
                      value={form.colonia}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="municipio">Municipio / Ciudad</Label>
                    <Input
                      id="municipio"
                      name="municipio"
                      value={form.municipio}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address_reference">Referencia para la ubicación (opcional)</Label>
                  <Input
                    id="address_reference"
                    name="address_reference"
                    value={form.address_reference}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="is_default"
                    name="is_default"
                    type="checkbox"
                    checked={form.is_default}
                    onChange={handleChange}
                  />
                  <Label htmlFor="is_default">Usar como dirección predeterminada</Label>
                </div>
                <Button type="submit" disabled={!canSave || adding}>
                  {adding ? "Guardando…" : "Guardar dirección"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


