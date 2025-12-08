import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { flightOffer } = body;

        if (!flightOffer) {
            return NextResponse.json(
                { success: false, message: "Flight offer is required" },
                { status: 400 }
            );
        }

        const response = await fetch(`${BACKEND_URL}/flights/price`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ flightOffer }),
        });

        const data = await response.json();

        if (response.ok) {
            return NextResponse.json({ success: true, data: data.data });
        } else {
            return NextResponse.json(
                { success: false, message: data.message || "Failed to confirm flight price" },
                { status: response.status }
            );
        }
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "An error occurred while confirming the price." },
            { status: 500 }
        );
    }
}
