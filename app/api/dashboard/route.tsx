import { appConfig } from "@/lib/appConfig";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(`${appConfig.api.url}/devices`);

    // 1. Controlla se la risposta è valida (status 200-299)
    if (!response.ok) {
      return NextResponse.json(
        { error: `Errore API: ${response.statusText}` },
        { status: response.status },
      );
    }

    // 2. Estrai i dati JSON dalla risposta
    const data = await response.json();

    // 3. Restituisci i dati estratti
    return NextResponse.json(data);
  } catch (error) {
    // Gestisce errori di rete (es. server spento)
    console.error("Errore durante la fetch:", error);
    return NextResponse.json(
      { error: "Impossibile connettersi al server" },
      { status: 500 },
    );
  }
}
