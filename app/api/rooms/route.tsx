import { NextResponse } from "next/server";
import { getRooms } from "@/services/room";

export async function GET() {
  try {
    const response = await getRooms();
    return NextResponse.json(response);
  } catch (error) {
    // Gestisce errori di rete (es. server spento)
    console.error("Errore durante la fetch:", error);
    return NextResponse.json(
      { error: "Impossibile connettersi al server" },
      { status: 500 },
    );
  }
}
