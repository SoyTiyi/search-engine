import { LocationRequest } from "@/app/lib/type";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { keyword } = body as LocationRequest;

    const url = new URL(`${BACKEND_URL}/flights/locations`);
    url.searchParams.append("keyword", keyword);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (response.ok) {
      return NextResponse.json({ success: true, data: data.data });
    } else {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to fetch locations" },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Error parsing request URL:", error);
    return NextResponse.json(
      { success: false, message: "Invalid request" },
      { status: 400 }
    );
  }
}
