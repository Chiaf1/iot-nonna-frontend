import { config } from "@/lib/config"
import { NextResponse } from "next/server"

export async function GET() {
    const devices = await fetch(`${config.api.url}/devices`)

    return NextResponse.json(devices)
}