import { Device } from "@/schemas/device.schema";
import { DhtReadings, StatusReadings } from "@/schemas/readings.schema";
// Siccoem voglio mostrare le ultime letture di temperatura devo creare una struttura
// che assci il device con l'ultimo valore letto
export type DeviceWithReading = {
  device: Device;
  latestDht: DhtReadings | null;
  latestStatus: StatusReadings | null;
};
