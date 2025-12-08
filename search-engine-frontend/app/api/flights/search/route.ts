import { FlightSearchRequest } from "@/app/lib/type";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { origin, destination, departureDate } = body as FlightSearchRequest;

        const url = new URL(`${BACKEND_URL}/flights/search`);
        url.searchParams.append("origin", origin);
        url.searchParams.append("destination", destination);
        url.searchParams.append("departureDate", departureDate);

        const response = await fetch(url.toString());
        const data = await response.json();

        if (response.ok) {
            const offersWithOriginal = data.data.map((offer: Record<string, unknown>) => ({
                ...offer,
                originalOffer: offer.originalOffer || offer
            }));
            return NextResponse.json({ success: true, data: offersWithOriginal });
        } else {
            return NextResponse.json(
                { success: false, message: data.message || "Failed to fetch flight offers" },
                { status: response.status }
            );
        }
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "An error occurred while searching for flights." },
            { status: 500 }
        );
    }
}