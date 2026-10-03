# iot-nonna-frontend

> Part of the **iot-nonna** project. For the whole system and the Docker Compose deployment, see [iot-nonna-containers](https://github.com/Chiaf1/iot-nonna-containers).

Frontend of the Nonna IoT system: a monitoring dashboard for home IoT devices. Built with Next.js 16, Tailwind CSS and shadcn/ui, it consumes only the REST APIs exposed by `iot-nonna-core`.

---

## Tech stack

| Technology              | Role                                          |
| ----------------------- | --------------------------------------------- |
| Next.js 16 (App Router) | Framework: routing, rendering, Server Actions |
| TypeScript              | Static typing                                 |
| Tailwind CSS            | Utility-first styling                         |
| shadcn/ui               | UI components (Card, Dialog, Chart, ...)      |
| Zod                     | API schema validation                         |
| Recharts                | Sensor reading charts                         |
| next-themes             | Light/dark theme handling                     |

---

## Architecture of the whole system

```
[Physical sensors]
      │ MQTT
      ▼
[iot-nonna-ingest]  ──── writes raw data ────▶  [PostgreSQL]
                                                      │
[iot-nonna-core]    ──── reads and exposes REST API ──┘
      │
      │ HTTP
      ▼
[iot-nonna-frontend]  ──── consumes only the REST API
```

The frontend never accesses the database directly. All the domain logic lives in `iot-nonna-core`.

---

## Project structure

```
app/
  layout.tsx                  # Root layout: ThemeProvider, font
  (app)/
    layout.tsx                # Layout with header: all the app pages (no authentication)
    dashboard/                # Overview of devices grouped by room
    devices/
      page.tsx                # Device list with live readings
      [id]/
        page.tsx              # Device detail: readings, sensors, daily chart
        history/
          page.tsx            # Reading history: one chart for each day in the range
        actions.ts            # Server Actions: update, delete device, sensors
      actions.ts              # Server Actions: create device
    rooms/
      page.tsx
      [id]/
        page.tsx
        actions.ts
    admin/
      device-types/
        page.tsx
        [id]/
          page.tsx
          actions.ts
        actions.ts
      sensor-types/
        page.tsx
        [id]/
          page.tsx
          actions.ts

components/
  layout/
    Header.tsx                # Desktop header with navigation
    NavLink.tsx               # Link with active state (use client)
    AdminMenu.tsx             # Admin dropdown (use client)
    MobileMenu.tsx            # Mobile navigation sheet (use client)
    ThemeToggle.tsx           # Light/dark theme toggle (use client)
  dashboard/
    RoomCard.tsx              # Room card with nested devices
    DeviceCard.tsx            # Device card with status badge and readings
  devices/
    DhtChart.tsx              # Temperature/humidity chart (use client)
    EditDeviceForm.tsx        # Edit device form (use client)
    CreateDeviceForm.tsx      # Create device form (use client)
    CreateDeviceDialog.tsx    # Dialog wrapper for creation (use client)
    AddSensorToDeviceForm.tsx # Sensor association form (use client)
    HistoryRangePicker.tsx    # History date range picker (use client)
  rooms/
    RoomCardSimple.tsx
    CreateRoomForm.tsx
    CreateRoomDialog.tsx
    EditRoomForm.tsx
  device_type/
    DeviceTypeCard.tsx
    CreateDeviceTypeForm.tsx
    CreateDevicetypeDialog.tsx
    EditDeviceTypeForm.tsx
  sensor_type/
    SensorTypeCard.tsx
  ui_personal/
    DeleteButton.tsx          # Delete button with AlertDialog confirmation
    CollapsibleForm.tsx       # Collapsible wrapper for edit forms
    AutoRefresh.tsx           # Automatic page refresh (use client)

lib/
  api/
    api.ts                    # Fetch wrapper with Zod validation
  appConfig.ts                # API URL configuration

schemas/                      # Zod schema for each API entity
  device.schema.ts
  device_type.schema.ts
  room.schema.ts
  sensor_type.schema.ts
  sensors_devices.schema.ts
  readings.schema.ts

services/                     # API access functions for each entity
  device.ts
  device_type.ts
  room.ts
  sensor_type.ts
  sensors.ts
  readings.ts

types/
  forms.ts                    # FormState type shared between the actions
  dashboard.ts                # DeviceWithReading type for the dashboard
```

---

## Key concepts implemented

### Server vs Client Components

The basic distinction of the Next.js App Router. Server Components (the default) run on the server, access the services directly and send no JavaScript to the browser. Client Components (`"use client"`) run in the browser and handle interactivity.

Rule applied: pages and layouts are Server Components, and pages fetch data through the services. Cards such as `DeviceCard` and `RoomCard` render that data on the server. Client Components handle forms, dialogs, navigation, auto-refresh and charts, and can also display data passed from the server: `DhtChart` renders readings, while `CreateDeviceForm` renders device type and room options. `DevicesPageClient` coordinates the creation dialog and auto-refresh using the device types and rooms fetched by the page; the device list itself is rendered by the Server Component page.

### Server Actions

Mutations (create, update, delete) use Server Actions: `"use server"` functions that are called from the browser but run on the server. The pattern is:

1. The action receives `FormData` or explicit arguments
2. It validates with Zod
3. It calls the service
4. It calls `revalidatePath` to refresh the data or `redirect` to navigate

### Parallel fetching

Every page that needs more than one piece of data uses `Promise.all` to start all the calls in parallel instead of one after the other:

```ts
const [device, sensors, rooms] = await Promise.all([
  getDevice(id),
  getDeviceSensors(id),
  getRooms(),
]);
```

### Validation with Zod

Every API response is validated with the matching Zod schema. If the response does not match the schema, the page shows an error instead of displaying corrupted data.

### Auto-refresh

Pages with live data (dashboard, device detail) include the `AutoRefresh` component, which calls `router.refresh()` periodically. This reloads the Server Components without navigating.

---

## Available routes

| Route                      | Description                                   |
| -------------------------- | --------------------------------------------- |
| `/dashboard`               | Overview with a card for each room and device |
| `/devices`                 | Lists all devices with readings               |
| `/devices/[id]`            | Device detail, daily chart, sensor management |
| `/devices/[id]/history`    | Reading history with a range selector         |
| `/rooms`                   | Room list                                     |
| `/rooms/[id]`              | Room detail                                   |
| `/admin/device-types`      | List and creation of device types             |
| `/admin/device-types/[id]` | Device type detail and editing                |
| `/admin/sensor-types`      | Sensor type list                              |
| `/admin/sensor-types/[id]` | Sensor type detail and column schema          |

---

## Configuration

Copy `.env.example` to `.env.local` and set the backend URL:

```env
API_URL=http://localhost:3030
```

The variable is read on the server by `lib/appConfig.ts`; if it is not set, the default is `http://localhost:3030`.

For a deployment on a Raspberry Pi with the whole stack running locally, the URL points to the internal network address (in the compose file of the full project: `API_URL=http://core:3030`).

> **Note:** the frontend has no authentication: all pages, including the write and admin ones, are accessible to anyone who can reach the application. It is meant for use on a trusted local network.

---

## Running in development

```bash
npm install
npm run dev
```

The frontend expects `iot-nonna-core` to be running at the configured URL.

### docker-compose.yaml (local development only)

The `docker-compose.yaml` in this repo is meant for local development only: it refers to files that are not in this repo (for example `configs/postgres/.env` and `configs/core/config.yaml`) and uses an `iot-nonna-frontend:1` image built locally. For the full deployment, use [iot-nonna-containers](https://github.com/Chiaf1/iot-nonna-containers).

---

## Future work

### Authentication

At the moment all read and write operations are accessible without authentication. The plan is:

- Reading data: public, no login required
- Write operations (create, update, delete): protected by login

The recommended implementation is **NextAuth.js** (now Auth.js), which integrates natively with the Next.js App Router. The planned flow:

1. Add an authentication provider (credentials with a single user, or OAuth)
2. Protect the Server Actions with a session check before running the mutation
3. Hide the edit/delete buttons in the UI for unauthenticated users
4. Add a separate `(auth)/` layout for the login page

```ts
// Pattern to apply in the Server Actions
import { auth } from "@/lib/auth";

export async function deleteDeviceAction(id: string) {
  const session = await auth();
  if (!session) throw new Error("Not autorized");
  // ...
}
```

### Create and edit forms for sensor-type

`SensorType` has a complex structure: `column_schema` is an object with a variable number of keys, each with `column` and `type`. This needs a dynamic form where the user can add and remove fields.

The planned implementation:

- `useState` to hold an array of rows `{ key: string, column: string, type: string }`
- An "add field" button that appends an empty row to the array
- A "remove" button for each row
- On submit, build the `column_schema` JSON from the array and send it to the action

The main difficulty is that this form cannot easily use `FormData` for nested structures. It will need to serialize the data manually and pass it as a hidden JSON field, or use `useActionState` with an action that receives an object instead of `FormData`.

The `/admin/sensor-types/[id]` page already shows the `column_schema` read-only. For now, sensor types are managed directly through the API or the Swagger UI of `iot-nonna-core`.

### Room heating management (iot-nonna-control)

The system plans a future `iot-nonna-control` module for automatic heating management. On the frontend this would mean:

- **Room dashboard** (`/rooms/[id]`) extended with: settable target temperature, boiler state (on/off), weekly schedule
- **Heating widget** on the main dashboard: current vs target temperature for each room
- **Comparison charts**: measured vs target temperature over time, to evaluate how efficient the system is
- **Schedule page**: a weekly interface to set the on/off times for each room

The frontend will consume the new REST APIs exposed by `iot-nonna-control` with the same pattern already in use: service, Zod schema, Server Components for reading, Server Actions for writing.

### Other possible additions

- **Notifications**: alert when a device goes offline or a reading goes over a threshold
- **Data export**: CSV download of the readings in a selected range
- **Device comparison**: a chart that overlays the readings of several devices on the same time axis
- **Room map**: a graphical layout of the house with rooms and devices placed visually
