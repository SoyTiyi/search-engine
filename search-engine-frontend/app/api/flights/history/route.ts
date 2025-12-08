import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";

export async function GET() {
    try {
        const response = await fetch(`${BACKEND_URL}/flights/history`);
        const data = await response.json();

        if (response.ok) {
            return NextResponse.json(data);
        } else {
            return NextResponse.json(
                { message: data.message || "Failed to fetch search history" },
                { status: response.status }
            );
        }
    } catch (error) {
        return NextResponse.json(
            { message: "An error occurred while fetching search history." },
            { status: 500 }
        );
    }
}
