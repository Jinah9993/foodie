import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: Request, context: { params: { id: string } }) {
  try {
    const resolvedParams = await context.params; 
    const { id } = resolvedParams; 

    const client = await pool.connect();
    const cafeResult = await client.query("SELECT * FROM Cafes WHERE id = $1", [id]);
    client.release();

    if (cafeResult.rowCount === 0) {
      return NextResponse.json({ success: false, error: "Cafe not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, cafe: cafeResult.rows[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

