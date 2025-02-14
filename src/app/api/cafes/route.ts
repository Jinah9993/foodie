import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM Cafes");
    client.release();

    return NextResponse.json({ success: true, cafes: result.rows });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, location, rating } = body;

    const client = await pool.connect();
    await client.query(
      "INSERT INTO Cafes (name, location, rating) VALUES ($1, $2, $3)",
      [name, location, rating]
    );
    client.release();

    return NextResponse.json({ success: true, message: "Cafe added successfully!" });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message });
  }
}
