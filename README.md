# iot-nonna-frontend

Frontend del sistema IoT Nonna — dashboard di monitoraggio per dispositivi IoT domestici. Costruito con Next.js 16, Tailwind CSS e shadcn/ui, consuma esclusivamente le API REST esposte da `iot-nonna-core`.

---

## Stack tecnico

| Tecnologia | Ruolo |
|---|---|
| Next.js 16 (App Router) | Framework — routing, rendering, Server Actions |
| TypeScript | Tipizzazione statica |
| Tailwind CSS | Stile utility-first |
| shadcn/ui | Componenti UI (Card, Dialog, Chart, ...) |
| Zod | Validazione degli schema API |
| Recharts | Grafici letture sensori |
| next-themes | Gestione tema chiaro/scuro |

---

## Architettura del sistema completo

```
[Sensori fisici]
      │ MQTT
      ▼
[iot-nonna-ingest]  ──── scrive dati grezzi ────▶  [PostgreSQL]
                                                         │
[iot-nonna-core]    ──── legge e espone API REST ────────┘
      │
      │ HTTP
      ▼
[iot-nonna-frontend]  ──── consuma solo API REST
```

Il frontend non accede mai direttamente al database. Tutta la logica di dominio è in `iot-nonna-core`.

---

## Struttura del progetto

```
app/
  layout.tsx                  # Root layout — ThemeProvider, font
  (app)/
    layout.tsx                # Layout con header — tutte le pagine autenticate
    dashboard/                # Overview dispositivi raggruppati per stanza
    devices/
      page.tsx                # Lista device con letture in tempo reale
      [id]/
        page.tsx              # Dettaglio device — letture, sensori, grafico giornaliero
        history/
          page.tsx            # Storico letture — grafico per ogni giorno del range
        actions.ts            # Server Actions: update, delete device, sensori
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
    Header.tsx                # Header desktop con navigazione
    NavLink.tsx               # Link con stato attivo (use client)
    AdminMenu.tsx             # Dropdown admin (use client)
    MobileMenu.tsx            # Sheet navigazione mobile (use client)
    ThemeToggle.tsx           # Toggle tema chiaro/scuro (use client)
  dashboard/
    RoomCard.tsx              # Card stanza con device annidati
    DeviceCard.tsx            # Card device con badge stato e letture
  devices/
    DhtChart.tsx              # Grafico temperatura/umidità (use client)
    EditDeviceForm.tsx        # Form modifica device (use client)
    CreateDeviceForm.tsx      # Form creazione device (use client)
    CreateDeviceDialog.tsx    # Dialog wrapper per creazione (use client)
    AddSensorToDeviceForm.tsx # Form associazione sensore (use client)
    HistoryRangePicker.tsx    # Selettore range date storico (use client)
  rooms/
    RoomCardSimple.tsx
    CreateRoomForm.tsx
    CreateRoomDialog.tsx
    EditRoomForm.tsx
  device_type/
    DeviceTypeCard.tsx
    CreateDeviceTypeForm.tsx
    CreateDeviceTypeDialog.tsx
    EditDeviceTypeForm.tsx
  sensor_type/
    SensorTypeCard.tsx
  ui_personal/
    DeleteButton.tsx          # Bottone elimina con AlertDialog conferma
    CollapsibleForm.tsx       # Wrapper collassabile per form di modifica
    AutoRefresh.tsx           # Refresh automatico pagina (use client)

lib/
  api/
    api.ts                    # Wrapper fetch con validazione Zod
  appConfig.ts                # Configurazione URL API

schemas/                      # Schema Zod per ogni entità API
  device.schema.ts
  device_type.schema.ts
  room.schema.ts
  sensor_type.schema.ts
  sensors_devices.schema.ts
  readings.schema.ts

services/                     # Funzioni di accesso API per entità
  device.ts
  device_type.ts
  room.ts
  sensor_type.ts
  sensors.ts
  readings.ts

types/
  forms.ts                    # Tipo FormState condiviso tra le actions
  dashboard.ts                # Tipo DeviceWithReading per la dashboard
```

---

## Concetti chiave implementati

### Server vs Client Components

La distinzione fondamentale di Next.js App Router. I Server Components (default) girano sul server, accedono direttamente ai service e non inviano JavaScript al browser. I Client Components (`"use client"`) girano nel browser e gestiscono interattività.

Regola applicata: tutto quello che mostra dati è Server Component. Solo i componenti con `onClick`, `useState`, hook o librerie browser-only sono Client Components.

### Server Actions

Le mutazioni (create, update, delete) usano Server Actions — funzioni `"use server"` chiamate dal browser ma eseguite sul server. Il pattern è:

1. La action riceve `FormData` o argomenti espliciti
2. Valida con Zod
3. Chiama il service
4. Chiama `revalidatePath` per aggiornare i dati o `redirect` per navigare

### Fetch parallelo

Ogni pagina che ha bisogno di più dati usa `Promise.all` per lanciare tutte le chiamate in parallelo invece che in sequenza:

```ts
const [device, sensors, rooms] = await Promise.all([
  getDevice(id),
  getDeviceSensors(id),
  getRooms(),
]);
```

### Validazione con Zod

Ogni risposta API viene validata con lo schema Zod corrispondente. Se la risposta non corrisponde allo schema, la pagina va in errore invece di mostrare dati corrotti.

### Auto-refresh

Le pagine con dati in tempo reale (dashboard, device detail) includono il componente `AutoRefresh` che chiama `router.refresh()` periodicamente — ricarica i Server Components senza navigare.

---

## Route disponibili

| Route | Descrizione |
|---|---|
| `/dashboard` | Overview con card per stanza e device |
| `/devices` | Lista tutti i device con letture |
| `/devices/[id]` | Dettaglio device, grafico giornaliero, gestione sensori |
| `/devices/[id]/history` | Storico letture con range selector |
| `/rooms` | Lista stanze |
| `/rooms/[id]` | Dettaglio stanza |
| `/admin/device-types` | Lista e creazione device type |
| `/admin/device-types/[id]` | Dettaglio e modifica device type |
| `/admin/sensor-types` | Lista sensor type |
| `/admin/sensor-types/[id]` | Dettaglio sensor type e column schema |

---

## Configurazione

Copia `.env.example` in `.env.local` e imposta l'URL del backend:

```env
NEXT_PUBLIC_API_URL=http://localhost:3030
```

Per il deploy su Raspberry Pi con tutto lo stack in locale, l'URL punta all'indirizzo interno della rete.

---

## Avvio in sviluppo

```bash
npm install
npm run dev
```

Il frontend si aspetta `iot-nonna-core` in esecuzione sull'URL configurato.

---

## Implementazioni future

### Autenticazione

Al momento tutte le operazioni di lettura e scrittura sono accessibili senza autenticazione. Il piano prevede:

- Lettura dati: pubblica, nessun login richiesto
- Operazioni di scrittura (create, update, delete): protette da login

L'implementazione consigliata è **NextAuth.js** (ora Auth.js), che si integra nativamente con Next.js App Router. Il flusso previsto:

1. Aggiungere un provider di autenticazione (credentials con utente singolo, o OAuth)
2. Proteggere le Server Actions con un check della sessione prima di eseguire la mutazione
3. Nascondere i bottoni di modifica/eliminazione nell'UI per gli utenti non autenticati
4. Aggiungere un layout `(auth)/` separato per la pagina di login

```ts
// Pattern da applicare nelle Server Actions
import { auth } from "@/lib/auth";

export async function deleteDeviceAction(id: string) {
  const session = await auth();
  if (!session) throw new Error("Non autorizzato");
  // ...
}
```

### Form creazione e modifica sensor-type

Il `SensorType` ha una struttura complessa — `column_schema` è un oggetto con un numero variabile di chiavi, ognuna con `column` e `type`. Questo richiede un form dinamico dove l'utente può aggiungere e rimuovere campi.

L'implementazione prevede:

- `useState` per tenere un array di righe `{ key: string, column: string, type: string }`
- Un bottone "aggiungi campo" che appende una riga vuota all'array
- Un bottone "rimuovi" per ogni riga
- Al submit, costruire il JSON `column_schema` dall'array e inviarlo alla action

La difficoltà principale è che questo form non può usare `FormData` in modo semplice per strutture annidate — richiederà di serializzare manualmente i dati e passarli come campo hidden JSON, oppure usare `useActionState` con una action che riceve un oggetto invece di `FormData`.

La pagina `/admin/sensor-types/[id]` mostra già il `column_schema` in sola lettura — per ora i sensor type si gestiscono direttamente via API o Swagger UI di `iot-nonna-core`.

### Gestione riscaldamento nelle stanze (iot-nonna-control)

Il sistema prevede in futuro un modulo `iot-nonna-control` per la gestione automatica del riscaldamento. Lato frontend questo si tradurrebbe in:

- **Dashboard stanza** (`/rooms/[id]`) arricchita con: temperatura target impostabile, stato caldaia (on/off), programma orario settimanale
- **Widget riscaldamento** nella dashboard principale — temperatura attuale vs target per ogni stanza
- **Grafici comparativi** — temperatura misurata vs temperatura target nel tempo, per valutare l'efficienza del sistema
- **Pagina programma** — interfaccia settimanale per configurare gli orari di accensione per ogni stanza

Il frontend consumerà le nuove API REST esposte da `iot-nonna-control` con lo stesso pattern già in uso — service, schema Zod, Server Components per la lettura, Server Actions per la scrittura.

### Altre possibili aggiunte

- **Notifiche** — alert quando un device va offline o una lettura supera una soglia
- **Export dati** — download CSV delle letture in un range selezionato
- **Confronto device** — grafico che sovrappone le letture di più device sulla stessa scala temporale
- **Mappa stanze** — layout grafico della casa con le stanze e i device posizionati visivamente