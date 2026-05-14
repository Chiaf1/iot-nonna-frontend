import { NextResponse } from "next/server";
import { getDevice } from "@/services/device";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "ID mancante" }, { status: 400 });
    }
    const response = await getDevice(id);

    if (!response) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 });
    }
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
