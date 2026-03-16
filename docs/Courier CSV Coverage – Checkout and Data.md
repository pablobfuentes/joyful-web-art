# Courier CSV Coverage – Checkout & Data Plan

## P1 – Clarify courier requirements from CSV

- [x] **P1.1 – List courier CSV columns**
  - In this doc, add a table under `## Courier CSV Columns` with:
    - `courier_column_name`
    - `description` (what the courier expects)
    - `required_by_courier` (Yes/No/Depends)
- [x] **P1.2 – Classify columns by responsibility**
  - Add a column `responsibility` to the same table with values:
    - `customer_at_checkout`
    - `merchant_internal`
    - `derived/system`
- [x] **P1.3 – Note format/constraints**
  - Add a column `constraints` (e.g., min/max length, numeric, country-specific rules).

---

## P2 – Map courier columns to current data model

- [x] **P2.1 – Map courier columns → existing fields**
  - Create `## Field Mapping` with a table:
    - `courier_column`
    - `source_entity` (e.g., `profile`, `checkout_form`, `orders.shipping_address`, `user_subscriptions`, etc.)
    - `source_field_name`
    - `status` (`exists`, `missing`, `partial`)
- [x] **P2.2 – Identify missing fields**
  - In the same table, mark `status = missing` or `partial` and summarize them in a bullet list below the table as **“Missing/Partial Fields”**.

---

## P3 – Identify gaps and validation requirements

- [x] **P3.1 – Decide required vs optional at checkout**
  - Add `## Checkout Validation Rules` with a table:
    - `courier_column`
    - `required_at_checkout` (Yes/No)
    - `error_condition` (e.g., "blank", "invalid format")
    - `user_error_message` (exact copy to show in UI)
- [x] **P3.2 – Document per-field validation logic**
  - Under the table, add bullets for any special rules, e.g.:
    - "`codigo_postal_destinatario`: must be 5 digits for MX shipments; show error if not."
  - **Question for you**: For fields that are *not* strictly required by the courier (e.g. `numero_int_destinatario` / internal reference), do you prefer:
    -(This option) making them optional at checkout and leaving the column blank, or
    - making them required in our flow to reduce manual fixing later?

---

## P4 – Data & UI changes (design only)

- [x] **P4.1 – Data model changes**
  - Add `## Data Model Changes` with subsections:
    - `### Profile / User`
    - `### Checkout / Order / Shipping`
  - For each subsection, list:
    - `entity/table`
    - `new_fields` (name, type, nullable, default)
    - `reason` (which courier columns they support)
  - Decision: treat addresses Amazon-style — each user can have **multiple addresses**, can set a **default** address, and can pick any address per checkout; the **selected** address at checkout time is copied into the order/shipping snapshot.
- [x] **P4.2 – Checkout form changes**
  - Under `## Checkout UI Changes`, list for each new/updated field:
    - `label_text`
    - `input_type` (text, select, etc.)
    - `help_text` (if any)
    - `validation_behavior` (ties back to P3 table)
- [x] **P4.3 – Separate merchant-only fields**
  - In `## Merchant-Only Fields`, enumerate:
    - `courier_column`
    - `how_set` (config default, admin UI, per-product, etc.)
    - Confirm: **“Not visible to customer at checkout.”**
  - Decision: most shipments will share **global defaults** (dimensions, units, base contents), but:
    - Some rows will need **different contents**.
    - Weight and declared value will vary **per shipment**.
    The design must allow global defaults *and* per-shipment overrides for peso/valor_declarado and, when needed, contents.

---

## P5 – Export pipeline alignment

- [x] **P5.1 – Decide export mechanism**
  - Add `## Export Design` describing whether you will:
    - Extend `admin_export_customers`, or
    - Create a new view, e.g. `admin_export_courier_et_batch`.
  - (To be implemented as a **separate courier-specific view**, e.g. `admin_export_courier_et_batch`, so it can focus solely on the courier format and shipment-level data.)
- [x] **P5.2 – Define export view schema**
  - Add a table:
    - `courier_column`
    - `db_column` (in the view)
    - `source_path` (e.g., `orders.shipping_address.colonia`, config table, constant)
    - `null_behavior` (blank vs default)
- [x] **P5.3 – Define export file format**
  - Under `## Export File Format`:
    - `filename_pattern`: e.g. `et_batch_multiguia_YYYY-MM-DD_HH-mm.csv`
    - `column_order`: ordered list matching `ET_BatchFile_Multiguia.csv`
    - `delimiter`, `encoding` (e.g. comma, UTF-8 with BOM)
    - Example: add a **sample header line** and **one example data line** (redacted).

---

## P6 – Testing & error scenarios (design)

- [x] **P6.1 – Checkout validation tests**
  - Add `## Test Plan – Checkout` with a table:
    - `test_id`
    - `scenario` (e.g., “missing colonia_destinatario”)
    - `steps`
    - `expected_result` (validation error message)
- [x] **P6.2 – Export correctness tests**
  - Add `## Test Plan – Export`:
    - Cases:
      - Valid order → 1 complete row in courier CSV.
      - Optional fields missing → columns present but blank.
      - Merchant-only columns populated correctly.
- [x] **P6.3 – Edge cases**
  - Bullet list under `## Edge Cases` (international addresses, reused saved address, etc.)

---

## P7 – Implementation roadmap (no code yet)

- [x] **P7.1 – Backend & DB**
  - Under `## Implementation Roadmap`, section `### Backend & Database`:
    - Ordered list of tasks: migrations, model updates, view creation.
- [x] **P7.2 – Frontend/Checkout**
  - Section `### Frontend – Checkout`:
    - Ordered list: add inputs, wire validation, UX copy updates.
- [x] **P7.3 – Export button/workflow**
  - Section `### Admin – Courier Export`:
    - Steps to expose new courier CSV export in admin (if needed).
- [x] **P7.4 – Logs & compliance**
  - Section `### Logging & Compliance`:
    - Bullet points reminding to:
      - Update `workflow/ChangeLog.md`
      - Update `docs/CHANGELOG_AI.md`
      - Add entry to `docs/VMP_COMPLIANCE_AUDIT.md`
      - Add to `FAILURE_LOG.md` if any failures occur during implementation/testing.

---

## Courier CSV Columns

> Filled based on `ET_BatchFile_Multiguia.csv` and current assumptions.

| courier_column_name      | description                                                | required_by_courier | responsibility        | constraints                                                                                  |
|--------------------------|------------------------------------------------------------|---------------------|-----------------------|----------------------------------------------------------------------------------------------|
| nombre_destinatario      | Recipient full name                                       | Yes                 | customer_at_checkout  | Non-empty string; length 2–100                                                              |
| compania_destinatario    | Recipient company name (if applicable)                    | Depends             | customer_at_checkout  | Optional; 0–100 chars                                                                        |
| email_destinatario       | Recipient contact email                                   | Yes                 | customer_at_checkout  | Valid email format                                                                          |
| telefono_destinatario    | Recipient phone number                                    | Yes                 | customer_at_checkout  | MX phone; digits, may include country/area code                                             |
| calle_destinatario       | Street name                                               | Yes                 | customer_at_checkout  | Non-empty; MX address format                                                                 |
| numero_ext_destinatario  | External (street) number                                  | Yes                 | customer_at_checkout  | Non-empty; may be alphanumeric                                                              |
| numero_int_destinatario  | Internal/apartment number                                 | No                  | customer_at_checkout  | Optional; may be blank                                                                      |
| colonia_destinatario     | Neighborhood/colonia                                      | Yes                 | customer_at_checkout  | Non-empty; MX-specific field                                                                |
| municipio_destinatario   | Municipality / city                                       | Yes                 | customer_at_checkout  | Non-empty; MX municipality                                                                  |
| codigo_postal_destinatario | Postal code                                             | Yes                 | customer_at_checkout  | MX CP; 5-digit numeric                                                                      |
| estado_destinatario      | State                                                     | Yes                 | customer_at_checkout  | Must be one of MX states (drop-down)                                                       |
| pais_destinatario        | Country                                                   | Yes                 | derived/system        | Constant `MX`; international addresses not allowed                                         |
| referencia_ubicacion     | Extra location reference (how to find the address)        | No                  | customer_at_checkout  | Optional; free text, max ~255 chars                                                         |
| guardar_direccion_destino| Whether to save this destination address for later use    | No                  | derived/system        | Boolean derived from “save this address” toggle                                             |
| contenido_paquete        | Description of package contents                           | Yes                 | merchant_internal     | Free text; typically constant per product/box type, but may vary for a few rows             |
| unidad_longitud          | Length unit                                               | Yes                 | merchant_internal     | Likely constant `cm`; global default with possible override                                |
| unidad_peso              | Weight unit                                               | Yes                 | merchant_internal     | Likely constant `kg`; global default with possible override                                |
| ancho_paquete            | Package width                                             | Yes                 | merchant_internal     | Numeric; usually same box dimensions for most shipments                                     |
| alto_paquete             | Package height                                            | Yes                 | merchant_internal     | Numeric; usually same box dimensions for most shipments                                     |
| largo_paquete            | Package length                                            | Yes                 | merchant_internal     | Numeric; usually same box dimensions for most shipments                                     |
| cantidad                 | Number of packages in this row                            | Yes                 | derived/system        | Integer ≥ 1; default 1 per order/box                                                        |
| peso                     | Package weight                                            | Yes                 | merchant_internal     | Numeric; **varies per shipment**; must be configurable per shipment                         |
| valor_declarado          | Declared value for the shipment                           | Yes                 | merchant_internal     | Numeric; **varies per shipment**; should reflect order value or configured declared value   |
| solicitar_aseguranza     | Whether insurance is requested                            | Depends             | merchant_internal     | Boolean; may be derived from `valor_declarado` and risk rules, but overrideable per shipment|

---

## Field Mapping

> High-level mapping of courier columns to our domain data (profile, addresses, orders). Exact table/column names will be refined during implementation.

| courier_column           | source_entity                | source_field_name (conceptual)        | status   |
|--------------------------|------------------------------|----------------------------------------|----------|
| nombre_destinatario      | user_address (checkout)      | `full_name`                            | missing/partial (depends on current schema) |
| compania_destinatario    | user_address (checkout)      | `company`                              | missing/partial |
| email_destinatario       | user / checkout              | `email`                                | exists (user email), may need explicit copy to shipping contact |
| telefono_destinatario    | user_address (checkout)      | `phone`                                | missing/partial |
| calle_destinatario       | user_address (checkout)      | `street`                               | missing/partial |
| numero_ext_destinatario  | user_address (checkout)      | `street_number_ext`                    | missing/partial |
| numero_int_destinatario  | user_address (checkout)      | `street_number_int`                    | missing/partial |
| colonia_destinatario     | user_address (checkout)      | `colonia`                              | missing/partial |
| municipio_destinatario   | user_address (checkout)      | `municipio` / `city`                   | missing/partial |
| codigo_postal_destinatario | user_address (checkout)    | `postal_code`                          | missing/partial |
| estado_destinatario      | user_address (checkout)      | `state`                                | missing/partial |
| pais_destinatario        | derived                       | constant `MX`                          | missing (needs system default) |
| referencia_ubicacion     | user_address (checkout)      | `address_reference`                    | missing/partial |
| guardar_direccion_destino| derived from checkout choice | `save_address` flag                    | missing   |
| contenido_paquete        | merchant config/order item   | `package_contents`                     | missing   |
| unidad_longitud          | merchant config              | `length_unit`                          | missing   |
| unidad_peso              | merchant config              | `weight_unit`                          | missing   |
| ancho_paquete            | merchant config              | `box_width`                            | missing   |
| alto_paquete             | merchant config              | `box_height`                           | missing   |
| largo_paquete            | merchant config              | `box_length`                           | missing   |
| cantidad                 | order / shipment             | `package_count`                        | missing   |
| peso                     | order / shipment             | `total_weight` or per-box weight       | missing   |
| valor_declarado          | order / shipment             | `declared_value`                       | missing   |
| solicitar_aseguranza     | shipment options             | `request_insurance`                    | missing   |

**Missing/Partial Fields (customer-side, must be enforced at checkout):**

- `nombre_destinatario`
- `compania_destinatario` (optional but supported)
- `telefono_destinatario`
- `calle_destinatario`
- `numero_ext_destinatario`
- `numero_int_destinatario` (optional)
- `colonia_destinatario`
- `municipio_destinatario`
- `codigo_postal_destinatario`
- `estado_destinatario`
- `referencia_ubicacion` (optional but recommended)

These must be either added to the checkout flow (with validation) or confirmed as already present and wired into a reusable **user addresses** model that supports multiple saved addresses per user and a default selection.

---

## Checkout Validation Rules

> Validation should run at checkout submission time; if any required field is missing/invalid, show the specified error and block the order.

| courier_column           | required_at_checkout | error_condition         | user_error_message                                                     |
|--------------------------|----------------------|-------------------------|-------------------------------------------------------------------------|
| nombre_destinatario      | Yes                  | blank                   | "Por favor ingresa el nombre completo del destinatario."               |
| compania_destinatario    | No                   | —                       | —                                                                       |
| email_destinatario       | Yes                  | blank / invalid format  | "Por favor ingresa un correo electrónico válido para el destinatario." |
| telefono_destinatario    | Yes                  | blank / invalid format  | "Por favor ingresa un número de teléfono válido para el destinatario." |
| calle_destinatario       | Yes                  | blank                   | "Por favor ingresa la calle del domicilio de entrega."                 |
| numero_ext_destinatario  | Yes                  | blank                   | "Por favor ingresa el número exterior del domicilio de entrega."       |
| numero_int_destinatario  | No                   | —                       | —                                                                       |
| colonia_destinatario     | Yes                  | blank                   | "Por favor ingresa la colonia del domicilio de entrega."               |
| municipio_destinatario   | Yes                  | blank                   | "Por favor ingresa el municipio/ciudad del domicilio de entrega."      |
| codigo_postal_destinatario | Yes                | blank / not 5 digits    | "Por favor ingresa un código postal válido de 5 dígitos en México."    |
| estado_destinatario      | Yes                  | blank / not in MX list  | "Por favor selecciona el estado del domicilio de entrega."             |
| pais_destinatario        | No (system = MX)     | —                       | — (enforced by system, not user)                                       |
| referencia_ubicacion     | No                   | —                       | — (optional hint field)                                                |
| guardar_direccion_destino| No                   | —                       | — (boolean toggle only)                                                |

Special rules:

- `codigo_postal_destinatario`: must be exactly 5 numeric digits; only Mexican addresses are allowed.
- The country is implicitly fixed to Mexico (`MX`); if a user tries to enter a foreign address, the UI must block or clearly disallow it.
- Users can maintain **multiple saved addresses** and select one at checkout (Amazon-style), but the **selected** address at the moment of checkout must satisfy all required-field rules above; otherwise, show errors and prevent order completion.

---

## Data Model Changes

### Profile / User

Goal: allow each user to manage **multiple saved addresses** with a default flag, and reuse them at checkout.

Proposed conceptual schema (exact naming/types to be chosen during implementation):

- `user_addresses` table
  - `id` (PK)
  - `user_id` (FK → users/profiles)
  - `full_name`
  - `company` (nullable)
  - `email` (nullable, default to user email if null)
  - `phone`
  - `street` (calle_destinatario)
  - `street_number_ext` (numero_ext_destinatario)
  - `street_number_int` (numero_int_destinatario, nullable)
  - `colonia`
  - `municipio`
  - `postal_code`
  - `state` (enumeration of MX states)
  - `country` (constant `MX`)
  - `address_reference` (referencia_ubicacion, nullable)
  - `is_default` (boolean; at most one true per user)
  - `created_at`, `updated_at`

### Checkout / Order / Shipping

At checkout time, we should **snapshot** the selected address into the order, so later changes to saved addresses don’t affect past shipments.

- `orders` (or `shipments`-related table) should include:
  - `shipping_address_id` (FK → `user_addresses.id`, nullable but recommended)
  - A **denormalized snapshot** of address fields for the order, e.g.:
    - `ship_full_name`
    - `ship_company`
    - `ship_email`
    - `ship_phone`
    - `ship_street`
    - `ship_street_number_ext`
    - `ship_street_number_int`
    - `ship_colonia`
    - `ship_municipio`
    - `ship_postal_code`
    - `ship_state`
    - `ship_country` (MX)
    - `ship_address_reference`

- Shipment / courier-specific data (per order or per box):
  - `shipments` table (conceptual):
    - `id` (PK)
    - `order_id` (FK → orders)
    - `package_count` (cantidad, default 1)
    - `package_width` (ancho_paquete)
    - `package_height` (alto_paquete)
    - `package_length` (largo_paquete)
    - `length_unit` (unidad_longitud, default `cm`)
    - `weight` (peso, per shipment)
    - `weight_unit` (unidad_peso, default `kg`)
    - `declared_value` (valor_declarado, per shipment)
    - `request_insurance` (solicitar_aseguranza, boolean)
    - `package_contents` (contenido_paquete)
    - `created_at`

Global configuration (can be a settings table or environment/config file):

- `global_courier_settings` (conceptual):
  - `default_length_unit` (`cm`)
  - `default_weight_unit` (`kg`)
  - `default_box_width`, `default_box_height`, `default_box_length`
  - `default_package_contents` (base description)
  - Optional rules for when to require insurance based on `declared_value`.

---

## Checkout UI Changes

Key behaviors:

- User can:
  - Choose an existing saved address (radio/group list with “default” pre-selected).
  - Add a new address and mark it as default (optional).
  - Decide whether to **save** a newly entered address for future use (controls `guardar_direccion_destino`).

For a **new or edited address form**, the following fields must be present and validated:

- `Nombre completo` → `nombre_destinatario` (required, text input)
- `Compañía (opcional)` → `compania_destinatario` (optional, text input)
- `Correo electrónico` → `email_destinatario` (required, email input)
- `Teléfono` → `telefono_destinatario` (required, tel input, MX pattern)
- `Calle` → `calle_destinatario` (required, text)
- `Número exterior` → `numero_ext_destinatario` (required, text)
- `Número interior (opcional)` → `numero_int_destinatario` (optional, text)
- `Colonia` → `colonia_destinatario` (required, text)
- `Municipio / Ciudad` → `municipio_destinatario` (required, text)
- `Código postal` → `codigo_postal_destinatario` (required, text; 5-digit MX)
- `Estado` → `estado_destinatario` (required, select dropdown of MX states)
- `Referencias para la ubicación (opcional)` → `referencia_ubicacion` (optional textarea)
- `Guardar esta dirección para futuros pedidos` → `guardar_direccion_destino` (checkbox)

Validation behavior:

- On submit:
  - If any required field is blank/invalid, show inline errors using the messages defined in **Checkout Validation Rules** and block submission.
  - Ensure country remains MX; no path to enter a non-MX country.
- When existing address is selected:
  - Validate snapshot of that address before final order submission (in case data got corrupted); if invalid, prompt user to edit or select a different address.

---

## Merchant-Only Fields

These fields are **not** shown to the customer at checkout and are controlled by internal logic or admin UI:

| courier_column      | how_set                                                                                  |
|---------------------|------------------------------------------------------------------------------------------|
| contenido_paquete   | Defaults from `global_courier_settings.default_package_contents`; can be overridden per shipment (e.g., based on order contents). |
| unidad_longitud     | Global default from `global_courier_settings.default_length_unit` (e.g., `cm`).         |
| unidad_peso         | Global default from `global_courier_settings.default_weight_unit` (e.g., `kg`).         |
| ancho_paquete       | Global default from `global_courier_settings.default_box_width`; rarely overridden.     |
| alto_paquete        | Global default from `global_courier_settings.default_box_height`; rarely overridden.    |
| largo_paquete       | Global default from `global_courier_settings.default_box_length`; rarely overridden.    |
| cantidad            | Derived from `shipments.package_count` (default 1); can support multiple boxes if needed.|
| peso                | **Per shipment** field on `shipments.weight`; must be set based on order contents or manual input. |
| valor_declarado     | **Per shipment** field on `shipments.declared_value`; typically derived from order total or a capped value, but adjustable. |
| solicitar_aseguranza| Boolean on `shipments.request_insurance`; default based on rules (e.g., when `valor_declarado` exceeds threshold), with admin override. |

Admin tooling (future work):

- Simple internal UI where operations can:
  - Review shipments for a given day/batch.
  - Adjust `peso`, `valor_declarado`, `contenido_paquete`, and `solicitar_aseguranza` before exporting the CSV.

---

## Export Design

We will introduce a **courier-specific view** for batch files, separate from `admin_export_customers`.

Concept:

- View name (example): `admin_export_courier_et_batch`
- One row per **shipment** (order box), not per user.
- Columns (in exact order required by `ET_BatchFile_Multiguia.csv`):
  - `nombre_destinatario`
  - `compania_destinatario`
  - `email_destinatario`
  - `telefono_destinatario`
  - `calle_destinatario`
  - `numero_ext_destinatario`
  - `numero_int_destinatario`
  - `colonia_destinatario`
  - `municipio_destinatario`
  - `codigo_postal_destinatario`
  - `estado_destinatario`
  - `pais_destinatario`
  - `referencia_ubicacion`
  - `guardar_direccion_destino`
  - `contenido_paquete`
  - `unidad_longitud`
  - `unidad_peso`
  - `ancho_paquete`
  - `alto_paquete`
  - `largo_paquete`
  - `cantidad`
  - `peso`
  - `valor_declarado`
  - `solicitar_aseguranza`

Each column will be populated from:

- The **order’s shipping address snapshot** (recipient/address fields).
- The **shipments** table (dimensions, counts, weight, declared value, insurance flag).
- The **global_courier_settings** (defaults for units and dimensions, when not overridden).

File format:

- Filename pattern: `et_batch_multiguia_YYYY-MM-DD_HH-mm.csv`
- Encoding: UTF-8 with BOM.
- Delimiter: comma.
- Header: exactly the header row from `ET_BatchFile_Multiguia.csv`.

---

## Test Plan – Checkout

Example test cases (to be implemented with your chosen test stack, e.g. Vitest/Playwright):

1. **Missing required field blocks checkout**
   - Scenario: new address; leave `calle_destinatario` blank.
   - Expected: validation error message appears and order is not created.

2. **Invalid postal code blocked**
   - Scenario: CP = `1234` (4 digits).
   - Expected: error "Por favor ingresa un código postal válido de 5 dígitos en México."

3. **Existing saved address selection**
   - Scenario: user has two saved addresses; selects non-default.
   - Expected: selected address is used; validation passes if all required fields are present.

4. **International address prevented**
   - Scenario: attempt to set non-MX country or CP/state combination implying foreign address.
   - Expected: UI prevents selection and shows appropriate guidance (or simply doesn’t allow).

---

## Test Plan – Export

Key cases:

1. **Happy path shipment**
   - Order with valid address and default shipment settings.
   - Export includes 1 row with all required columns filled; file opens correctly in Excel/Sheets.

2. **Optional fields blank**
   - Address without `numero_int_destinatario` or `referencia_ubicacion`.
   - Export shows empty cells for these columns; other fields unaffected.

3. **Per-shipment overrides**
   - Shipment where `peso`, `valor_declarado`, and `contenido_paquete` are overridden.
   - Export reflects override values, not global defaults.

4. **Multiple shipments for one order**
   - Order split into 2 shipments.
   - Export shows 2 rows with identical address but different `cantidad` / `peso` / `valor_declarado` as configured.

---

## Edge Cases

- User has no saved addresses:
  - Must be forced to create one during checkout; then can choose to save or not.
- User changes default address:
  - Future checkouts pre-select the new default; past orders remain unchanged via snapshots.
- Address edited between order creation and export:
  - Export must use the **snapshotted** order/shipping address, not the current saved address values.
- Very long `referencia_ubicacion`:
  - Should be truncated or validated to stay within courier limits.

---

## Implementation Roadmap

### Backend & Database

1. Add `user_addresses` table and related indices/constraints.
2. Extend `orders` (and/or introduce a `shipments` table) with shipping snapshot and shipment fields.
3. Add configuration mechanism for global courier settings.
4. Create `admin_export_courier_et_batch` view with RLS-consistent access (admin-only).

### Frontend – Checkout

1. Implement address management UI (list, add, edit, delete, set default).
2. Implement address selection at checkout, including “add new address” flow.
3. Wire in validation rules for required courier fields, with clear error messages.
4. Ensure the selected address and `guardar_direccion_destino` behavior are persisted correctly.

### Admin – Courier Export

1. Add an admin-only export button for courier CSV (separate from customer analytics exports).
2. Hook the button to a backend route/view that streams data from `admin_export_courier_et_batch`.
3. Verify file naming, header row, encoding, and column order.

### Logging & Compliance

- When implementing:
  - Update `workflow/ChangeLog.md` with the new courier export and checkout validation behavior.
  - Update `docs/CHANGELOG_AI.md` with a brief summary.
  - Add an entry to `docs/VMP_COMPLIANCE_AUDIT.md` covering:
    - Fields enforced at checkout.
    - Tests run and their locations.
  - If any failures occur during dev/testing, record them in `FAILURE_LOG.md` with root cause and resolution.